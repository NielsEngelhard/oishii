import Avatar from "@/components/ui/Avatar";
import Divider from "@/components/ui/Divider";
import MetaDataField from "@/components/ui/MetaDataField";
import Tag from "@/components/ui/Tag";
import Tags from "@/components/ui/Tags";
import { Clock, Medal, Users } from "lucide-react";
import Image from "next/image";

interface Props {

}

export default function RecipeCard({  }: Props) {
    return (
        <div className="flex flex-col rounded-2xl overflow-hidden shadow-lg">
            {/* Image */}
            <div className="relative w-full h-50">
                <Image
                    src="/img/recipe-placeholder.jpg"
                    alt="recipename"
                    fill
                    className="object-cover"
                />
                
                <div className="absolute top-2 right-2 z-20">
                    <Tag text="Mediun" variant="secondary" />
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                {/* Recipe info */}
                <div className="flex flex-col space-y-2">
                    {/* Tags */}
                    <Tags tags={["Japanese", "Ramen"]} />
                    <div>
                        <span className="text-xl">Miso Ramen</span>
                        <div className="flex gap-4">
                            <MetaDataField text="75 min" Icon={Clock} />
                            <MetaDataField text="8" Icon={Users} />
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Metadata */}
                <div className="flex flex-row justify-between">
                    {/* By user */}
                    <div className="flex items-center gap-1 text-muted font-medium">
                        <Avatar />
                        <span>Niels</span>
                    </div>

                    {/* Statistics */}
                    <div className="flex flex-row">
                        <MetaDataField text="2" Icon={Medal} />
                    </div>
                </div>                
            </div>
        </div>
    )
}