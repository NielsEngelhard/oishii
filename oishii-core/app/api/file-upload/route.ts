import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/lib/infrastructure/file-upload/s3/s3-client";
import { generateUuid } from "@/lib/util/uuid-util";
import { isAllowedType } from "@/lib/infrastructure/file-upload/file-upload-constants";

export async function POST(request: Request) {
    const { contentType } = await request.json();
    
    // Validate content type
    if (!isAllowedType(contentType)) {
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