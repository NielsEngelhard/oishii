import { Upload } from "lucide-react";

interface Props {
    label?: string;
}

export default function FileInput({ label }: Props) {
    return (
        <div className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <div className="text-muted flex flex-col items-center text-center">
                <Upload size={40} className="mb-4" />
                <span>Click to upload or drag and drop</span>
                <span>PNG, JPG up to 10MB</span>
            </div>
        </div>
    )
}