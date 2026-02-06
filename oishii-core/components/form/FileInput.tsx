"use client"

import clsx from "clsx";
import { Upload, X, Loader2, Sparkles, Crown } from "lucide-react";
import Image from "next/image";
import { forwardRef, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import Label from "./Label";

interface Props {
    label?: string;
    error?: string;
    value?: string;
    onChange?: (url: string | undefined) => void;
    accept?: string;
    maxSizeMB?: number;
    showEnhanceOption?: boolean;
    canEnhance?: boolean; // true for premium and admin users
    onEnhance?: (enhancedUrl: string) => void;
}

// TODO: optimize - what if you upload an image for create recipe and then never save the recipe?!
const FileInput = forwardRef<HTMLInputElement, Props>(
    ({ label, error, value, onChange, accept = "image/png,image/jpeg,image/webp", maxSizeMB = 10, showEnhanceOption = false, canEnhance = false, onEnhance }, ref) => {
        const t = useTranslations("recipe");
        const [isDragging, setIsDragging] = useState(false);
        const [isUploading, setIsUploading] = useState(false);
        const [isEnhancing, setIsEnhancing] = useState(false);
        const [uploadError, setUploadError] = useState<string | null>(null);
        const [enhanceError, setEnhanceError] = useState<string | null>(null);

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
            setEnhanceError(null);
        }, [onChange]);

        const handleEnhance = useCallback(async () => {
            if (!value || !canEnhance || isEnhancing) return;

            setIsEnhancing(true);
            setEnhanceError(null);

            try {
                const response = await fetch("/api/image/enhance", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageUrl: value }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || t("enhanceError"));
                }

                // Update with enhanced image URL
                onChange?.(result.url);
                onEnhance?.(result.url);
            } catch (err) {
                setEnhanceError(err instanceof Error ? err.message : t("enhanceError"));
            } finally {
                setIsEnhancing(false);
            }
        }, [value, canEnhance, isEnhancing, onChange, onEnhance, t]);

        const displayError = uploadError || enhanceError || error;

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
                            {isEnhancing && (
                                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 size={32} className="animate-spin text-primary" />
                                        <span className="text-sm font-medium">{t("enhancing")}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={isEnhancing}
                            className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full transition-colors disabled:opacity-50"
                        >
                            <X size={18} className="text-foreground" />
                        </button>
                        {showEnhanceOption && (
                            <div className="absolute bottom-2 left-2 right-2">
                                {canEnhance ? (
                                    <button
                                        type="button"
                                        onClick={handleEnhance}
                                        disabled={isEnhancing}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                                    >
                                        <Sparkles size={16} />
                                        {isEnhancing ? t("enhancing") : t("enhancePhoto")}
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 px-3 py-2 bg-background/90 border border-border text-muted text-sm rounded-lg">
                                        <Crown size={16} className="text-amber-500" />
                                        <span>{t("enhancePhotoPremium")}</span>
                                    </div>
                                )}
                            </div>
                        )}
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
