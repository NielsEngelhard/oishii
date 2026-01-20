"use client"

import { Search } from "lucide-react";
import Input from "../form/Input";
import { useTranslations } from "next-intl";

interface Props {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
    const tCommon = useTranslations("common");

    return (
        <div className="flex flex-col">
            <Input
                Icon={Search}
                placeholder={placeholder || tCommon("search")}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    )
}
