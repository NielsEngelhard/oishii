interface Props {

}

export default function IngredientListDisplay({  }: Props) {
    
    var mockedIngredients = [
        {
            text: "Ramen noodles",
            unit: "g",
            measure: "200",
            isSpice: false
        },
        {
            text: "Ramen noodles2",
            unit: "g",
            measure: "2220",
            isSpice: false
        },
        {
            text: "pepper",
            unit: "piece",
            measure: "1",
            isSpice: true
        },                     
    ]
    
    return (
        <div className="flex flex-col">
            <div className="flex gap-2 mb-2 items-center">
                <div className="bg-accent w-10 h-10 flex items-center justify-center text-lg font-medium rounded-xl">{mockedIngredients.length}</div>
                <h2>Ingredients</h2>
            </div>

            {/* // TODO: Add indicator for spice and always show the spices at the bottom. Maybe a pepper in the up right corner of the row  */}

            <div className="flex flex-col gap-2">
                {mockedIngredients.map(ingredient => (
                    <div key={ingredient.text} className="flex justify-between bg-background-secondary p-2 sm:p-3 rounded-lg text-lg">
                        <span>{ingredient.text}</span>
                        <span className="text-muted">{ingredient.measure} {ingredient.unit}</span>
                    </div>
                ))}
            </div>            
        </div>
    )
}