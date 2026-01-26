import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/lib/infrastructure/file-upload/s3/s3-client";
import { generateUuid } from "@/lib/util/uuid-util";
import { isAllowedType } from "@/lib/infrastructure/file-upload/file-upload-constants";

const MOCK_IMAGE_UPLOADS = process.env.MOCK_IMAGE_UPLOADS === "true";
const PLACEHOLDER_IMAGE_URL = "/placeholder/recipe-placeholder.png";

export async function POST(request: Request) {
    const { contentType } = await request.json();

    // Validate content type
    if (!isAllowedType(contentType)) {
        return Response.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Mock upload: return placeholder URL without generating presigned S3 URL
    if (MOCK_IMAGE_UPLOADS) {
        return Response.json({
            uploadUrl: null,
            imageUrl: PLACEHOLDER_IMAGE_URL,
            mocked: true
        });
    }

    const extension = contentType.split("/")[1];
    const key = `recipes/${generateUuid()}.${extension}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return Response.json({ uploadUrl, imageUrl });
}