import RecipeCard from "./RecipeCard";

interface Props {

}

export default function RecipeGrid({  }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
            <RecipeCard></RecipeCard>
            <RecipeCard></RecipeCard>
            <RecipeCard></RecipeCard>
        </div>
    )
}