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
        </div>
    )
}