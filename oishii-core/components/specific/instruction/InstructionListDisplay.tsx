interface Props {

}

export default function InstructionListDisplay({  }: Props) {
    
    var mockedInstructions = [
        {
            index: 1,
            text: "Step 1"
        },
        {
            index: 2,
            text: "Step 1"
        },
        {
            index: 3,
            text: "Step 1 asdasd asd asd asda sda sdasd asd asd asd asdas dasd asda sdasd asd asda sdasd asd asd"
        }                
    ]
    
    return (
        <div className="flex flex-col">
            <div className="flex gap-2 mb-2 items-center">
                <div className="bg-primary/75 w-10 h-10 flex items-center justify-center text-lg font-medium rounded-xl text-background">{mockedInstructions.length}</div>
                <h2 className="">Instructions</h2>
            </div>

            <div className="flex flex-col gap-2">
                {mockedInstructions.map(instruction => (
                    <div key={instruction.index} className="flex bg-background-secondary p-2 sm:p-3 rounded-lg text-lg gap-2 sm:gap-4">
                        <span className="w-8 h-8 items-center justify-center flex bg-primary/10 rounded-full text-primary">{instruction.index}</span>
                        <span>{instruction.text}</span>
                    </div>
                ))}
            </div>            
        </div>
    )
}