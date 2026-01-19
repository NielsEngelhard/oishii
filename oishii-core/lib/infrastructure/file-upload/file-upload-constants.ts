import { bytesToDisplayString } from "@/lib/util/size-utils";

export const ALLOWED_IMAGE_FILE_TYPES: string[] = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_SIZE_IN_BYTES = 10 * 1024 * 1024; // 10MB

// Util functions
export const isAllowedType = (type: string): boolean => {
    return ALLOWED_IMAGE_FILE_TYPES.includes(type);
}

export const isAllowedFileSize = (sizeInBytes: number): boolean => {
    return sizeInBytes <= MAX_FILE_SIZE_IN_BYTES;
}

export function maxFileSizeAsDisplayString(): string {
    return bytesToDisplayString(MAX_FILE_SIZE_IN_BYTES);
}