"use client"

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import LanguageFlag from "@/components/ui/LanguageFlag";
import NarrowPageWrapper from "@/components/ui/layout/NarrowPageWrapper";
import { Locale } from "@/i18n/config";
import { IUserDetails } from "@/models/user-models";
import { Calendar, ChefHat, Globe, Loader2, UserMinus, UserPlus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.userid as string;
    const t = useTranslations("userProfile");
    const tLanguages = useTranslations("languages");

    const [user, setUser] = useState<IUserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFriendLoading, setIsFriendLoading] = useState(false);

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/users/${userId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError(t("userNotFound"));
                } else {
                    setError("Failed to load user");
                }
                return;
            }

            const data = await response.json();
            setUser(data);
        } catch {
            setError("Failed to load user");
        } finally {
            setIsLoading(false);
        }
    }, [userId, t]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleAddFriend = async () => {
        if (!user) return;
        setIsFriendLoading(true);

        try {
            const response = await fetch("/api/friends/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ friendId: user.id }),
            });

            if (response.ok) {
                setUser(prev => prev ? { ...prev, isFriend: true, totalFriends: prev.totalFriends + 1 } : null);
            }
        } finally {
            setIsFriendLoading(false);
        }
    };

    const handleRemoveFriend = async () => {
        if (!user) return;
        setIsFriendLoading(true);

        try {
            const response = await fetch("/api/friends/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ friendId: user.id }),
            });

            if (response.ok) {
                setUser(prev => prev ? { ...prev, isFriend: false, totalFriends: prev.totalFriends - 1 } : null);
            }
        } finally {
            setIsFriendLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <NarrowPageWrapper>
                <Card className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-muted" />
                        <span className="text-muted">{t("loading")}</span>
                    </div>
                </Card>
            </NarrowPageWrapper>
        );
    }

    if (error || !user) {
        return (
            <NarrowPageWrapper>
                <Card className="flex items-center justify-center py-12">
                    <span className="text-muted">{error || t("userNotFound")}</span>
                </Card>
            </NarrowPageWrapper>
        );
    }

    return (
        <NarrowPageWrapper>
            <Card className="space-y-6">
                {/* User Info Section */}
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                    <Avatar
                        size="xl"
                        src="/placeholder/user-placeholder.png"
                    />

                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1 gap-2">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        {user.aboutMe && (
                            <p className="text-muted">{user.aboutMe}</p>
                        )}

                        {!user.isCurrentUser && (
                            <div className="mt-2">
                                {isFriendLoading ? (
                                    <Button
                                        Icon={Loader2}
                                        text=""
                                        size="sm"
                                        disabled
                                        className="animate-spin"
                                    />
                                ) : user.isFriend ? (
                                    <Button
                                        Icon={UserMinus}
                                        text={t("removeFriend")}
                                        size="sm"
                                        variant="skeleton"
                                        onClick={handleRemoveFriend}
                                    />
                                ) : (
                                    <Button
                                        Icon={UserPlus}
                                        text={t("addFriend")}
                                        size="sm"
                                        onClick={handleAddFriend}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <Divider />

                {/* Stats Section */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-4 bg-background-secondary rounded-xl">
                        <ChefHat className="w-5 h-5 text-primary mb-1" />
                        <span className="text-2xl font-bold">{user.totalRecipes}</span>
                        <span className="text-xs text-muted">{t("recipesCreated")}</span>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-background-secondary rounded-xl">
                        <Users className="w-5 h-5 text-secondary mb-1" />
                        <span className="text-2xl font-bold">{user.totalFriends}</span>
                        <span className="text-xs text-muted">{t("friends")}</span>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-background-secondary rounded-xl">
                        <Calendar className="w-5 h-5 text-accent mb-1" />
                        <span className="text-sm font-bold">{formatDate(user.createdAt)}</span>
                        <span className="text-xs text-muted">{t("joined")}</span>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-background-secondary rounded-xl">
                        <Globe className="w-5 h-5 text-muted mb-1" />
                        <div className="flex items-center gap-1.5">
                            <LanguageFlag locale={user.language as Locale} size="md" />
                            <span className="text-sm font-bold">{tLanguages(user.language as "en" | "nl")}</span>
                        </div>
                        <span className="text-xs text-muted">{t("language")}</span>
                    </div>
                </div>
            </Card>
        </NarrowPageWrapper>
    )
}