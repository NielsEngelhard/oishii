"use client"

import clsx from "clsx";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { forwardRef, useCallback, useState } from "react";
import Label from "./Label";

interface Props {
    label?: string;
    error?: string;
    value?: string;
    onChange?: (url: string | undefined) => void;
    accept?: string;
    maxSizeMB?: number;
}

// TODO: optimize - what if you upload an image for create recipe and then never save the recipe?!
const FileInput = forwardRef<HTMLInputElement, Props>(
    ({ label, error, value, onChange, accept = "image/png,image/jpeg,image/webp", maxSizeMB = 10 }, ref) => {
        const [isDragging, setIsDragging] = useState(false);
        const [isUploading, setIsUploading] = useState(false);
        const [uploadError, setUploadError] = useState<string | null>(null);

        const handleFile = useCallback(async (file: File) => {
            // Validate file type
            const validTypes = accept.split(",").map(t => t.trim());
            if (!validTypes.includes(file.type)) {
                setUploadError(`Invalid file type. Accepted: ${accept}`);
                return;
            }

            // Validate file size
            const maxBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxBytes) {
                setUploadError(`File too large. Maximum size: ${maxSizeMB}MB`);
                return;
            }

            setUploadError(null);
            setIsUploading(true);

            try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "Upload failed");
                }

                onChange?.(result.url);
            } catch (err) {
                setUploadError(err instanceof Error ? err.message : "Upload failed");
            } finally {
                setIsUploading(false);
            }
        }, [accept, maxSizeMB, onChange]);

        const handleDrop = useCallback((e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file) {
                handleFile(file);
            }
        }, [handleFile]);

        const handleDragOver = useCallback((e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(true);
        }, []);

        const handleDragLeave = useCallback((e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
        }, []);

        const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                handleFile(file);
            }
        }, [handleFile]);

        const handleRemove = useCallback(() => {
            onChange?.(undefined);
        }, [onChange]);

        const displayError = uploadError || error;

        return (
            <div className="flex flex-col gap-1">
                {label && <Label text={label} />}

                {value ? (
                    // Preview mode
                    <div className="relative rounded-xl overflow-hidden border border-border">
                        <div className="relative aspect-video w-full">
                            <Image
                                src={value}
                                alt="Upload preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full transition-colors"
                        >
                            <X size={18} className="text-foreground" />
                        </button>
                    </div>
                ) : (
                    // Upload mode
                    <label
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={clsx(
                            "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                            isDragging
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50",
                            displayError && "border-error",
                            isUploading && "pointer-events-none opacity-70"
                        )}
                    >
                        <input
                            ref={ref}
                            type="file"
                            accept={accept}
                            onChange={handleInputChange}
                            className="sr-only"
                            disabled={isUploading}
                        />
                        <div className="text-muted flex flex-col items-center text-center">
                            {isUploading ? (
                                <>
                                    <Loader2 size={40} className="mb-4 animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={40} className="mb-4" />
                                    <span className="font-medium text-foreground">
                                        Click to upload or drag and drop
                                    </span>
                                    <span className="text-sm mt-1">
                                        PNG, JPG, WebP up to {maxSizeMB}MB
                                    </span>
                                </>
                            )}
                        </div>
                    </label>
                )}

                {displayError && <p className="text-sm text-error">{displayError}</p>}
            </div>
        );
    }
);

FileInput.displayName = "FileInput";
export default FileInput;
