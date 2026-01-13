import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { Link, Sparkles, Wand2 } from "lucide-react";

export default function AiImportCard() {
    return (
        <div className="relative overflow-hidden rounded-2xl p-6 mb-8 border border-primary/20">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-secondary/50 to-primary/5" />

            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary rounded-full blur-2xl" />

            {/* Content */}
            <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-[#c9532d] shadow-lg shadow-primary/25">
                    <Wand2 className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                            Import with AI
                        </h3>
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/15 text-primary rounded-full">
                            Magic
                        </span>
                    </div>
                    <p className="text-muted text-sm mb-4">
                        Paste any recipe URL and our AI will extract all the details for you.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                            <Input
                                placeholder="https://example.com/recipe..."
                                className="pl-10 h-11 bg-card/80 backdrop-blur-sm"
                            />
                        </div>
                        <Button variant="primary" size="md">
                            <Sparkles className="h-4 w-4" />
                            Import Recipe
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
