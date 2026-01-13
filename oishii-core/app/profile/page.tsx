"use client"

import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContex";
import { Construction, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, clearUser } = useAuth();
    const router = useRouter();

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
                            <p className="text-muted">Member</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl mb-6">
                        <Construction className="w-5 h-5 text-primary" />
                        <p className="text-sm text-muted">
                            Profile settings and customization coming soon!
                        </p>
                    </div>

                    <Button
                        variant="skeleton"
                        text="Sign Out"
                        Icon={LogOut}
                        onClick={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
}
