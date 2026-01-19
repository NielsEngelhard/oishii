import IngredientListDisplay from "@/components/specific/ingredient/IngredientListDisplay";
import InstructionListDisplay from "@/components/specific/instruction/InstructionListDisplay";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import Statistic from "@/components/ui/Statistic";
import Tags from "@/components/ui/Tags";
import { Clock, Gauge, Medal, Users, Wheat } from "lucide-react";
import Image from "next/image";

export default function RecipeDetailsPage() {
    return (
        <div className="relative w-full">
            {/* Hero Image */}
            <div className="relative w-full h-64 sm:h-80 md:h-96">
                <Image
                    src={"/placeholder/recipe-placeholder.png"}
                    alt={"recipe title"}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative px-2 sm:px-6 container -mt-16">
            <Card>
                <div className="flex flex-col w-full p-2 sm:p-4 space-y-3">
                    {/* Tags */}
                    <Tags tags={["example"]} />

                    {/* General text */}
                    <div className="flex flex-col">
                        <h1>Miso Ramen</h1>
                        <p className="text-muted text-lg font-medium">Rich and creamy miso-based ramen with tender chashu pork, soft-boiled egg, and fresh vegetables. A warming bowl of comfort.</p>                
                    </div>

                    {/* General numbers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 bg-background-secondary rounded-xl py-4">
                        <Statistic
                            Icon={Clock}
                            label="Total Time"
                            value="75 min"
                            variant="primary"
                        />

                        <Statistic
                            Icon={Wheat}
                            label="Ingredients"
                            value="10"
                            variant="secondary"
                        />

                        <Statistic
                            Icon={Users}
                            label="Servings"
                            value="2"
                            variant="default"
                        />

                        <Statistic
                            Icon={Gauge}
                            label="Difficulty"
                            value="Medium"
                            variant="accent"
                        />                                                                                    
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex flex-row justify-between">
                        {/* By user */}
                        <div className="flex items-center gap-1 text-muted font-medium">
                            <Avatar />
                            <span>Author Name</span>
                        </div>
                        
                        {/* Points */}
                        <div className="flex items-center gap-1 text-muted">
                            <Medal size={16} />
                            <span>0</span>
                        </div>
                    </div>

                    <Divider />

                    {/* Ingredients */}
                    <IngredientListDisplay />

                    {/* Instructions */}
                    <InstructionListDisplay />
                </div>
            </Card>
            </div>
        </div>
    )
}