import Tag from "./Tag";

interface Props {
    tags: string[];
}

export default function Tags({ tags }: Props) {
    return (
<div className="flex gap-2 overflow-x-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
    {tags.map(tag => (
        <Tag
            key={tag}
            text={tag}
            variant="accent"
        />
    ))}
</div>

    )
}