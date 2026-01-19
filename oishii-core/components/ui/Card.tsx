interface Props {
    children: React.ReactNode;
}

export default function Card({ children }: Props) {
    return (
        <div className="bg-card shadow-xs rounded-xl p-2 md:p-4 w-full">
            {children}
        </div>
    )
}