import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "@/lib/infrastructure/file-upload/s3/s3-client";
import { NextResponse } from "next/server";
import { generateUuid } from "@/lib/util/uuid-util";
import { isAllowedFileSize, isAllowedType, maxFileSizeAsDisplayString } from "@/lib/infrastructure/file-upload/file-upload-constants";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!isAllowedType(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type.` },
                { status: 400 }
            );
        }

        // Validate file size
        if (!isAllowedFileSize(file.size)) {
            return NextResponse.json(
                { error: `File too large. Maximum size: ${maxFileSizeAsDisplayString()}` },
                { status: 400 }
            );
        }

        // Generate unique filename
        const extension = file.name.split(".").pop() || "jpg";
        const filename = `recipes/${generateUuid()}.${extension}`;

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to S3
        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: filename,
                Body: buffer,
                ContentType: file.type,
            })
        );

        // Construct the public URL
        const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

        return NextResponse.json({ url }, { status: 201 });
    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
