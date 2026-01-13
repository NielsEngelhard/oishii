import { ChefHat } from "lucide-react";

export default function Logo() {
    return (
        <div className="flex items-center gap-2">
            <div className="bg-primary text-background rounded-xl p-2">
                <ChefHat size={20} />
            </div>
            <span className="text-xl tracking-wider" style={{ fontFamily: "var(--font-special)" }}>Oishii</span>
        </div>
    )
}