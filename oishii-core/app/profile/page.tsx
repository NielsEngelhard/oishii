"use client"

import Input from "@/components/form/Input";
import LanguageSelectInput from "@/components/form/LanguageSelectInput";
import TextArea from "@/components/form/TextArea";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import NarrowPageWrapper from "@/components/ui/layout/NarrowPageWrapper";
import PlanBadge from "@/components/ui/PlanBadge";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_CHEAT_SHEET } from "@/db/schemas/users";
import { Locale } from "@/i18n/config";
import { IUserDetails } from "@/models/user-models";
import { Check, Globe, Key, LogOut, RotateCcw, StickyNote, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ProfilePage() {
    const { updateLanguage, setUser, clearUser, user } = useAuth();
    const router = useRouter();
    const t = useTranslations("profile");
    const tAuth = useTranslations("auth");
    const tCheatSheet = useTranslations("cheatSheet");

    // About Me state
    const [aboutMe, setAboutMe] = useState("");
    const [aboutMeLoading, setAboutMeLoading] = useState(false);
    const [aboutMeSuccess, setAboutMeSuccess] = useState(false);
    const [aboutMeError, setAboutMeError] = useState<string | null>(null);

    // Cheat Sheet state
    const [cheatSheet, setCheatSheet] = useState("");
    const [cheatSheetLoading, setCheatSheetLoading] = useState(false);
    const [cheatSheetSuccess, setCheatSheetSuccess] = useState(false);
    const [cheatSheetError, setCheatSheetError] = useState<string | null>(null);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);

    // Language state
    const [selectedLanguage, setSelectedLanguage] = useState<Locale>(userDetails?.language as Locale || "en");
    const [languageLoading, setLanguageLoading] = useState(false);

    const fetchUser = useCallback(async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/users/${user?.id}`);
            if (!response.ok) {
                return;
            }

            const data = await response.json();
            setUserDetails(data);
            setAboutMe(data.aboutMe || "");
            setSelectedLanguage(data.language as Locale);
        } catch {}
        
    }, [user]);

    const fetchCheatSheet = useCallback(async () => {
        try {
            const response = await fetch("/api/user/cheat-sheet");
            if (response.ok) {
                const data = await response.json();
                setCheatSheet(data.cheatSheet || DEFAULT_CHEAT_SHEET);
            }
        } catch {
            setCheatSheet(DEFAULT_CHEAT_SHEET);
        }
    }, []);

    useEffect(() => {
        fetchUser();
        fetchCheatSheet();
    }, [fetchUser, fetchCheatSheet]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        clearUser();
        router.push("/login");
        router.refresh();
    };

    const handleUpdateAboutMe = async () => {
        setAboutMeLoading(true);
        setAboutMeError(null);
        setAboutMeSuccess(false);

        try {
            const response = await fetch("/api/user/about-me", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ aboutMe }),
            });

            if (response.ok) {
                setAboutMeSuccess(true);
                if (user) {
                    setUser({ ...user,  });
                }
                setTimeout(() => setAboutMeSuccess(false), 3000);
            } else {
                setAboutMeError(t("updateError"));
            }
        } catch {
            setAboutMeError(t("updateError"));
        } finally {
            setAboutMeLoading(false);
        }
    };

    const handleUpdateCheatSheet = async () => {
        setCheatSheetLoading(true);
        setCheatSheetError(null);
        setCheatSheetSuccess(false);

        try {
            const response = await fetch("/api/user/cheat-sheet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cheatSheet }),
            });

            if (response.ok) {
                setCheatSheetSuccess(true);
                setTimeout(() => setCheatSheetSuccess(false), 3000);
            } else {
                setCheatSheetError(t("updateError"));
            }
        } catch {
            setCheatSheetError(t("updateError"));
        } finally {
            setCheatSheetLoading(false);
        }
    };

    const handleResetCheatSheet = () => {
        setCheatSheet(DEFAULT_CHEAT_SHEET);
    };

    const handleUpdatePassword = async () => {
        setPasswordError(null);
        setPasswordSuccess(false);

        if (!currentPassword) {
            setPasswordError(t("currentPasswordRequired"));
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError(t("passwordTooShort"));
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(t("passwordMismatch"));
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await fetch("/api/user/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setPasswordSuccess(true);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setTimeout(() => setPasswordSuccess(false), 3000);
            } else {
                if (data.error === "incorrectPassword") {
                    setPasswordError(t("incorrectPassword"));
                } else if (data.error === "passwordTooShort") {
                    setPasswordError(t("passwordTooShort"));
                } else {
                    setPasswordError(t("updateError"));
                }
            }
        } catch {
            setPasswordError(t("updateError"));
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleUpdateLanguage = async () => {
        setLanguageLoading(true);
        await updateLanguage(selectedLanguage);
        setLanguageLoading(false);
    };

    if (!user) {
        return null;
    }

    return (
        <NarrowPageWrapper maxWidth="md">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <Card>
                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                        <Avatar
                            size="xl"
                            src={user.avatar || "/placeholder/user-placeholder.png"}
                        />

                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{user.username}</h1>
                                <PlanBadge plan={user.plan} size="md" />
                            </div>
                            <p className="text-muted">{t("member")}</p>
                        </div>
                    </div>
                </Card>

                {/* About Me */}
                <Card>
                    <div className="flex items-center gap-2 mb-2">
                        <User size={18} className="text-primary" />
                        <h2 className="text-lg font-semibold">{t("aboutMe")}</h2>
                    </div>
                    <p className="text-sm text-muted mb-4">{t("aboutMeDescription")}</p>

                    <div className="space-y-4">
                        <TextArea
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                            placeholder={t("aboutMePlaceholder")}
                            maxLength={500}
                        />

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted">{aboutMe.length}/500</span>
                            <div className="flex items-center gap-2">
                                {aboutMeSuccess && (
                                    <span className="text-sm text-green-500 flex items-center gap-1">
                                        <Check size={14} />
                                        {t("updateSuccess")}
                                    </span>
                                )}
                                {aboutMeError && (
                                    <span className="text-sm text-error">{aboutMeError}</span>
                                )}
                                <Button
                                    text={aboutMeLoading ? t("updating") : t("update")}
                                    size="sm"
                                    onClick={handleUpdateAboutMe}
                                    disabled={aboutMeLoading}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Cheat Sheet */}
                <Card className="border-2">
                    <div className="flex items-center gap-2 mb-2">
                        <StickyNote size={18} className="" />
                        <h2 className="text-lg font-semibold">{tCheatSheet("title")}</h2>
                    </div>
                    <p className="text-sm text-muted mb-4">{tCheatSheet("description")}</p>

                    <div className="space-y-4">
                        <TextArea
                            value={cheatSheet}
                            onChange={(e) => setCheatSheet(e.target.value)}
                            placeholder={tCheatSheet("placeholder")}
                            maxLength={2000}
                            rows={6}
                            className="bg-white dark:bg-background font-mono text-sm"
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted">{cheatSheet.length}/2000</span>
                                <button
                                    onClick={handleResetCheatSheet}
                                    className="text-xs text-muted hover:text-foreground flex items-center gap-1 transition-colors"
                                    title={tCheatSheet("resetToDefault")}
                                >
                                    <RotateCcw size={12} />
                                    {tCheatSheet("resetToDefault")}
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                {cheatSheetSuccess && (
                                    <span className="text-sm text-green-500 flex items-center gap-1">
                                        <Check size={14} />
                                        {t("updateSuccess")}
                                    </span>
                                )}
                                {cheatSheetError && (
                                    <span className="text-sm text-error">{cheatSheetError}</span>
                                )}
                                <Button
                                    text={cheatSheetLoading ? t("updating") : t("update")}
                                    size="sm"
                                    onClick={handleUpdateCheatSheet}
                                    disabled={cheatSheetLoading}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Change Password */}
                <Card>
                    <div className="flex items-center gap-2 mb-2">
                        <Key size={18} className="text-primary" />
                        <h2 className="text-lg font-semibold">{t("changePassword")}</h2>
                    </div>
                    <p className="text-sm text-muted mb-4">{t("changePasswordDescription")}</p>

                    <div className="space-y-4">
                        <Input
                            type="password"
                            label={t("currentPassword")}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />

                        <Input
                            type="password"
                            label={t("newPassword")}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <Input
                            type="password"
                            label={t("confirmPassword")}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className="flex items-center justify-end gap-2">
                            {passwordSuccess && (
                                <span className="text-sm text-green-500 flex items-center gap-1">
                                    <Check size={14} />
                                    {t("updateSuccess")}
                                </span>
                            )}
                            {passwordError && (
                                <span className="text-sm text-error">{passwordError}</span>
                            )}
                            <Button
                                text={passwordLoading ? t("updating") : t("update")}
                                size="sm"
                                onClick={handleUpdatePassword}
                                disabled={passwordLoading}
                            />
                        </div>
                    </div>
                </Card>

                {/* Language */}
                <Card>
                    <div className="flex items-center gap-2 mb-2">
                        <Globe size={18} className="text-primary" />
                        <h2 className="text-lg font-semibold">{t("languageSettings")}</h2>
                    </div>
                    <p className="text-sm text-muted mb-4">{t("languageDescription")}</p>

                    <div className="space-y-4">
                        <LanguageSelectInput
                            value={selectedLanguage}
                            onChange={(value) => setSelectedLanguage(value)}
                        />

                        <div className="flex justify-end">
                            <Button
                                text={languageLoading ? t("updating") : t("update")}
                                size="sm"
                                onClick={handleUpdateLanguage}
                                disabled={languageLoading || selectedLanguage === user.language}
                            />
                        </div>
                    </div>
                </Card>

                {/* Sign Out */}
                <Card>
                    <div className="flex items-center gap-2 mb-2">
                        <LogOut size={18} className="text-error" />
                        <h2 className="text-lg font-semibold">{t("logout")}</h2>
                    </div>
                    <p className="text-sm text-muted mb-4">{t("signOutDescription")}</p>

                    <Button
                        variant="skeleton"
                        text={tAuth("signOut")}
                        Icon={LogOut}
                        onClick={handleLogout}
                    />
                </Card>
            </div>
        </NarrowPageWrapper>
    );
}
