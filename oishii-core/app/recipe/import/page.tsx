"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link2, FileText, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/ui/layout/PageHeader";
import ImportMethodCard from "@/components/specific/import/ImportMethodCard";
import UrlImportView from "@/components/specific/import/UrlImportView";
import TextImportView from "@/components/specific/import/TextImportView";
import { CREATE_RECIPE_ROUTE } from "@/app/routes";

type ImportMethod = "selection" | "url" | "text";

// Extendable array of import methods
const IMPORT_METHODS = [
    {
        id: "url" as const,
        icon: Link2,
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        id: "text" as const,
        icon: FileText,
        gradient: "from-purple-500 to-pink-500",
    },
];

export default function AiImportPage() {
    const t = useTranslations("aiImport");
    const router = useRouter();
    const [activeMethod, setActiveMethod] = useState<ImportMethod>("selection");

    const handleBack = () => {
        if (activeMethod === "selection") {
            router.push(CREATE_RECIPE_ROUTE);
        } else {
            setActiveMethod("selection");
        }
    };

    const renderContent = () => {
        switch (activeMethod) {
            case "url":
                return <UrlImportView onBack={() => setActiveMethod("selection")} />;
            case "text":
                return <TextImportView onBack={() => setActiveMethod("selection")} />;
            default:
                return (
                    <div className="space-y-4">
                        {IMPORT_METHODS.map((method) => (
                            <ImportMethodCard
                                key={method.id}
                                icon={method.icon}
                                title={t(`${method.id}Import.title`)}
                                description={t(`${method.id}Import.description`)}
                                gradient={method.gradient}
                                onClick={() => setActiveMethod(method.id)}
                            />
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col mx-auto px-4 py-4 space-y-6 max-w-sm w-full">
            {/* Back to create recipe */}
            {activeMethod === "selection" && (
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-muted hover:text-foreground transition-colors self-start"
                >
                    <ArrowLeft size={18} />
                    <span>{t("back")}</span>
                </button>
            )}

            {/* Header - only show on selection view */}
            {activeMethod === "selection" && (
                <PageHeader
                    title={t("title")}
                    description={t("description")}
                />
            )}

            {renderContent()}
        </div>
    );
}
