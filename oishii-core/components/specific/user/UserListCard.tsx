"use client"

import { USER_PROFILE_ROUTE } from "@/app/routes";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LanguageFlag from "@/components/ui/LanguageFlag";
import { Locale } from "@/i18n/config";
import { IUserTeaser } from "@/models/user-models";
import { Plus, UserMinus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
    user: IUserTeaser;
    isFriend: boolean;
    onFriendStatusChange?: () => void;
}

export default function UserListCard({ user, isFriend, onFriendStatusChange }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentIsFriend, setCurrentIsFriend] = useState(isFriend);

    const handleAddFriend = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);

        try {
            const response = await fetch("/api/friends/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ friendId: user.id }),
            });

            if (response.ok) {
                setCurrentIsFriend(true);
                onFriendStatusChange?.();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFriend = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);

        try {
            const response = await fetch("/api/friends/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ friendId: user.id }),
            });

            if (response.ok) {
                setCurrentIsFriend(false);
                onFriendStatusChange?.();
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link href={USER_PROFILE_ROUTE(String(user.id))} target="_blank">
            <Card className="w-full flex flex-row justify-between">
                <div className="flex flex-row justify-center items-center gap-2">
                    <Avatar
                        size="lg"
                        src="/placeholder/user-placeholder.png"
                    />

                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold">{user.name}</span>
                            <LanguageFlag locale={user.language as Locale} size="sm" />
                        </div>
                        {user.aboutMe && (
                            <span className="text-muted line-clamp-1">{user.aboutMe}</span>
                        )}
                        <span className="text-muted text-xs">{user.totalRecipes} recipes</span>
                    </div>
                </div>

                <div className="flex items-center">
                    {isLoading ? (
                        <Button
                            Icon={Loader2}
                            text=""
                            variant="skeleton"
                            disabled
                            className="animate-spin"
                        />
                    ) : currentIsFriend ? (
                        <Button
                            Icon={UserMinus}
                            text="Remove"
                            variant="skeleton"
                            onClick={handleRemoveFriend}
                        />
                    ) : (
                        <Button
                            Icon={Plus}
                            text="Add"
                            onClick={handleAddFriend}
                        />
                    )}
                </div>
            </Card>
        </Link>
    )
}