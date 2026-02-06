import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "@/lib/infrastructure/file-upload/s3/s3-client";
import { generateUuid } from "@/lib/util/uuid-util";

export interface EnhanceImageResult {
  success: true;
  url: string;
}

export interface EnhanceImageError {
  success: false;
  error: string;
}

export type EnhanceImageResponse = EnhanceImageResult | EnhanceImageError;

/**
 * Enhances a recipe image using DALL-E image variations API
 * @param imageUrl - The URL of the original image (S3 URL)
 * @returns The URL of the enhanced image
 */
export async function enhanceRecipeImage(imageUrl: string): Promise<EnhanceImageResponse> {
  try {
    // Validate input
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return { success: false, error: "Invalid image URL" };
    }

    // Download the original image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return { success: false, error: "Could not download original image" };
    }

    const imageBlob = await imageResponse.blob();

    // Convert blob to base64 for OpenAI API
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    // Call DALL-E image edit API to enhance the image
    // We use the edit endpoint with a prompt to enhance/improve the food photo
    const openaiResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: await createFormData(imageBlob, "Enhance this food photo to look more professional, appetizing, and well-lit. Improve colors, lighting, and presentation while keeping the same dish."),
    });

    if (!openaiResponse.ok) {
      // Fall back to variations API if edit fails
      const variationResponse = await fetch('https://api.openai.com/v1/images/variations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: await createVariationFormData(imageBlob),
      });

      if (!variationResponse.ok) {
        const errorData = await variationResponse.json().catch(() => ({}));
        console.error("DALL-E API error:", errorData);
        return { success: false, error: "Failed to enhance image" };
      }

      const variationData = await variationResponse.json();
      const enhancedImageUrl = variationData.data?.[0]?.url;

      if (!enhancedImageUrl) {
        return { success: false, error: "No enhanced image returned" };
      }

      // Download the enhanced image and upload to S3
      return await uploadEnhancedImage(enhancedImageUrl);
    }

    const data = await openaiResponse.json();
    const enhancedImageUrl = data.data?.[0]?.url;

    if (!enhancedImageUrl) {
      return { success: false, error: "No enhanced image returned" };
    }

    // Download the enhanced image and upload to S3
    return await uploadEnhancedImage(enhancedImageUrl);

  } catch (error) {
    console.error("Image enhancement error:", error);

    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return { success: false, error: "Service is busy. Please try again in a moment." };
      }
    }

    return { success: false, error: "Failed to enhance image. Please try again." };
  }
}

/**
 * Creates FormData for DALL-E edit API
 */
async function createFormData(imageBlob: Blob, prompt: string): Promise<FormData> {
  const formData = new FormData();

  // Convert to PNG if needed (DALL-E requires PNG)
  const file = new File([imageBlob], 'image.png', { type: 'image/png' });
  formData.append('image', file);
  formData.append('prompt', prompt);
  formData.append('n', '1');
  formData.append('size', '1024x1024');
  formData.append('model', 'dall-e-2');

  return formData;
}

/**
 * Creates FormData for DALL-E variations API
 */
async function createVariationFormData(imageBlob: Blob): Promise<FormData> {
  const formData = new FormData();

  // Convert to PNG if needed (DALL-E requires PNG)
  const file = new File([imageBlob], 'image.png', { type: 'image/png' });
  formData.append('image', file);
  formData.append('n', '1');
  formData.append('size', '1024x1024');
  formData.append('model', 'dall-e-2');

  return formData;
}

/**
 * Downloads enhanced image from OpenAI and uploads to S3
 */
async function uploadEnhancedImage(enhancedImageUrl: string): Promise<EnhanceImageResponse> {
  try {
    // Download the enhanced image from OpenAI
    const enhancedResponse = await fetch(enhancedImageUrl);
    if (!enhancedResponse.ok) {
      return { success: false, error: "Could not download enhanced image" };
    }

    const enhancedBuffer = Buffer.from(await enhancedResponse.arrayBuffer());

    // Generate unique filename for enhanced image
    const filename = `recipes/enhanced-${generateUuid()}.png`;

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: enhancedBuffer,
        ContentType: 'image/png',
      })
    );

    // Construct the public URL
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    return { success: true, url };
  } catch (error) {
    console.error("Failed to upload enhanced image:", error);
    return { success: false, error: "Failed to save enhanced image" };
  }
}
