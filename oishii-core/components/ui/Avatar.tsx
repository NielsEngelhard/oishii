import clsx from "clsx";
import Image from "next/image";

interface Props {
    src?: string;
    size?: "sm" | "md" | "lg";
}

export default function Avatar({ src = "/placeholder/user-placeholder.png", size = "md" }: Props) {
  const sizeVariants = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

    return (
        <div className={clsx("relative rounded-full overflow-hidden", sizeVariants[size])}>
            <Image
                src={src}
                alt="user"
                fill
                className="object-cover"
            />
        </div>
    )
}