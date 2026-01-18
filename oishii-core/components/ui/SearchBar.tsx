"use client"

import { Search } from "lucide-react";
import Input from "../form/Input";

interface Props {

}

export default function SearchBar({  }: Props) {
    return (
        <div className="flex flex-col">
            <Input
                Icon={Search}
                placeholder="Search..."
            ></Input>
            <span className="text-muted text-sm mt-3">Showing 4 of 4 recipes</span>
        </div>
    )
}