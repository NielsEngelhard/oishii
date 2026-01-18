interface Props {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: Props) {
    return (
        <div className="flex flex-col justify-between md:flex-row">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted">{description}</p>                
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}