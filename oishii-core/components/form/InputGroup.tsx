interface Props {
    children: React.ReactNode;
}

export default function InputGroup({ children }: Props) {
    return (
        <div className="flex flex-col space-y-2 md:space-y-4 lg:space-y-6">
            {children}
        </div>
    )
}