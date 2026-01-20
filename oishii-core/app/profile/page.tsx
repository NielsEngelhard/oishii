"use client"

import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContex";
import { Construction, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, clearUser } = useAuth();
    const router = useRouter();
    const t = useTranslations("profile");
    const tAuth = useTranslations("auth");

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        clearUser();
        router.push("/login");
        router.refresh();
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-card border border-border rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-primary">
                                    {user?.username.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">{user?.username}</h1>
                            <p className="text-muted">{t("member")}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl mb-6">
                        <Construction className="w-5 h-5 text-primary" />
                        <p className="text-sm text-muted">
                            {t("settingsComingSoon")}
                        </p>
                    </div>

                    <Button
                        variant="skeleton"
                        text={tAuth("signOut")}
                        Icon={LogOut}
                        onClick={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
}
