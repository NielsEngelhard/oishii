// app/api/upload-url/route.ts (or your preferred location)
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/lib/s3/s3-client";
import { generateUuid } from "@/lib/util/uuid-util";

export async function POST(request: Request) {
    const { contentType } = await request.json();
    
    // Validate content type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]; // TODO: put somewhere else as config
    if (!allowedTypes.includes(contentType)) {
        return Response.json({ error: "Invalid file type" }, { status: 400 });
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