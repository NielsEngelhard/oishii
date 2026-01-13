import Input from "@/components/form/Input";
import AiImportCard from "@/components/specific/recipe/AiImportCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Sparkles } from "lucide-react";

export default function CreateRecipePage() {
    return (
        <div className="flex flex-col container py-4 lg:py-6 space-y-6">
            
            <div className="">
                <h1 className="text-2xl font-bold">Create Recipe</h1>
                <p className="text-muted">Share your culinary creation with the world</p>
            </div>

            <AiImportCard />

            <Card>
                <h2>Basic information</h2>

                <div>
                    LOOOL
                </div>
            </Card>

            <Card>
                <h2>Ingredients</h2>

                <div>
                    LOOOL
                </div>
            </Card>

            <Card>
                <h2>Instructions</h2>

                <div>
                    LOOOL
                </div>
            </Card>                        
        </div>
    )
}