"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link2, FileText, Camera, ArrowLeft, Sparkles, Info, AlertCircle } from "lucide-react";
import PageHeader from "@/components/ui/layout/PageHeader";
import SectionToggle from "@/components/ui/SectionToggle";
import Button from "@/components/ui/Button";
import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import FileInput from "@/components/form/FileInput";
import CookingLoader from "@/components/ui/CookingLoader";
import { CREATE_RECIPE_ROUTE } from "@/app/routes";

type ImportMethod = "url" | "text" | "photo";

const IMPORT_SECTIONS = [
    { key: "url", label: "URL", Icon: Link2 },
    { key: "text", label: "Text", Icon: FileText },
    { key: "photo", label: "Photo", Icon: Camera },
];

export default function AiImportPage() {
    const t = useTranslations("aiImport");
    const router = useRouter();
    const [activeMethod, setActiveMethod] = useState<ImportMethod>("url");

    // URL import state
    const [url, setUrl] = useState("");
    const [urlLoading, setUrlLoading] = useState(false);
    const [urlError, setUrlError] = useState<string | null>(null);

    // Text import state
    const [text, setText] = useState("");
    const [textLoading, setTextLoading] = useState(false);
    const [textError, setTextError] = useState<string | null>(null);

    // Photo import state
    const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const handleUrlImport = async () => {
        if (!url.trim()) return;

        setUrlLoading(true);
        setUrlError(null);

        try {
            const response = await fetch("/api/recipe/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                setUrlError(data.error || t("scrapeError"));
                setUrlLoading(false);
                return;
            }

            // Store the scraped recipe in sessionStorage for the create page to pick up
            sessionStorage.setItem("importedRecipe", JSON.stringify(data.recipe));

            // Redirect to create page
            router.push(CREATE_RECIPE_ROUTE);
        } catch {
            setUrlError(t("scrapeError"));
            setUrlLoading(false);
        }
    };

    const handleTextImport = async () => {
        if (!text.trim()) return;

        setTextLoading(true);
        setTextError(null);

        try {
            const response = await fetch("/api/recipe/parse-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                setTextError(data.error || t("scrapeError"));
                setTextLoading(false);
                return;
            }

            // Store the parsed recipe in sessionStorage for the create page to pick up
            sessionStorage.setItem("importedRecipe", JSON.stringify(data.recipe));

            // Redirect to create page
            router.push(CREATE_RECIPE_ROUTE);
        } catch {
            setTextError(t("scrapeError"));
            setTextLoading(false);
        }
    };

    const handlePhotoImport = async () => {
        if (!photoUrl) return;

        setPhotoLoading(true);
        setPhotoError(null);

        try {
            const response = await fetch("/api/recipe/parse-photo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl: photoUrl }),
            });

            const data = await response.json();

            if (!response.ok) {
                setPhotoError(data.error || t("photoImport.parseError"));
                setPhotoLoading(false);
                return;
            }

            // Store the parsed recipe in sessionStorage for the create page to pick up
            sessionStorage.setItem("importedRecipe", JSON.stringify(data.recipe));

            // Redirect to create page
            router.push(CREATE_RECIPE_ROUTE);
        } catch {
            setPhotoError(t("photoImport.parseError"));
            setPhotoLoading(false);
        }
    };

    const handleBack = () => {
        router.push(CREATE_RECIPE_ROUTE);
    };

    const renderUrlSection = () => {
        if (urlLoading) {
            return <CookingLoader size="lg" />;
        }

        return (
            <div className="space-y-4">
                {/* Error message */}
                {urlError && (
                    <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-error shrink-0" />
                        <p className="text-sm text-error">{urlError}</p>
                    </div>
                )}

                {/* URL Input */}
                <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" />
                    <Input
                        type="url"
                        placeholder={t("urlPlaceholder")}
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (urlError) setUrlError(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && url.trim()) {
                                handleUrlImport();
                            }
                        }}
                        className="pl-11"
                    />
                </div>

                <Button
                    text={t("importButton")}
                    Icon={Sparkles}
                    variant="primary"
                    size="lg"
                    onClick={handleUrlImport}
                    disabled={!url.trim()}
                    className="w-full"
                />

                {/* Helper text */}
                <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
                    <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted">
                        {t("helperUrl")}
                    </p>
                </div>
            </div>
        );
    };

    const renderTextSection = () => {
        if (textLoading) {
            return <CookingLoader size="lg" />;
        }

        return (
            <div className="space-y-4">
                {/* Error message */}
                {textError && (
                    <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-error shrink-0" />
                        <p className="text-sm text-error">{textError}</p>
                    </div>
                )}

                {/* Text Input */}
                <TextArea
                    placeholder={t("textPlaceholder")}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        if (textError) setTextError(null);
                    }}
                    className="min-h-[200px]"
                />

                <Button
                    text={t("importButton")}
                    Icon={Sparkles}
                    variant="primary"
                    size="lg"
                    onClick={handleTextImport}
                    disabled={!text.trim()}
                    className="w-full"
                />

                {/* Helper text */}
                <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
                    <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted">
                        {t("helperText")}
                    </p>
                </div>
            </div>
        );
    };

    const renderPhotoSection = () => {
        if (photoLoading) {
            return <CookingLoader size="lg" />;
        }

        return (
            <div className="space-y-4">
                {/* Error message */}
                {photoError && (
                    <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-error shrink-0" />
                        <p className="text-sm text-error">{photoError}</p>
                    </div>
                )}

                {/* Photo Upload */}
                <FileInput
                    label={t("photoImport.uploadPhoto")}
                    value={photoUrl}
                    onChange={(url) => {
                        setPhotoUrl(url);
                        if (photoError) setPhotoError(null);
                    }}
                    accept="image/png,image/jpeg,image/webp"
                    maxSizeMB={10}
                />

                <Button
                    text={t("importButton")}
                    Icon={Sparkles}
                    variant="primary"
                    size="lg"
                    onClick={handlePhotoImport}
                    disabled={!photoUrl}
                    className="w-full"
                />

                {/* Helper text */}
                <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
                    <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted">
                        {t("helperPhoto")}
                    </p>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeMethod) {
            case "url":
                return renderUrlSection();
            case "text":
                return renderTextSection();
            case "photo":
                return renderPhotoSection();
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col mx-auto px-4 py-4 space-y-6 max-w-sm w-full">
            {/* Back button */}
            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-muted hover:text-foreground transition-colors self-start"
            >
                <ArrowLeft size={18} />
                <span>{t("back")}</span>
            </button>

            {/* Header */}
            <PageHeader
                title={t("title")}
                description={t("description")}
            />

            {/* Section Toggle */}
            <SectionToggle
                sections={IMPORT_SECTIONS}
                activeSectionKey={activeMethod}
                onSectionChange={(key) => setActiveMethod(key as ImportMethod)}
            />

            {/* Content */}
            {renderContent()}
        </div>
    );
}
