import Image from "next/image";

interface Props {
    src?: string;
}

export default function Avatar({ src = "/img/user-placeholder.jpg" }: Props) {
    return (
        <div className="relative h-8 w-8 rounded-full overflow-hidden">
            <Image
                src={src}
                alt="user"
                fill
                className="object-cover"
            />
        </div>
    )
}