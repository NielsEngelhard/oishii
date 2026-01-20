"use client"

import { BookCheck, BookOpen, ChevronDown, Handshake, LogIn, Plus, Search, Users } from "lucide-react";
import Button from "../Button";
import Link from "next/link";
import { CREATE_RECIPE_ROUTE, LOGIN_ROUTE, MY_RECIPES_ROUTE, PROFILE_ROUTE, SIGNUP_ROUTE } from "@/app/routes";
import Logo from "./logo";
import { useAuth } from "@/contexts/AuthContex";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Header() {
    const { user, isLoading } = useAuth();
    const t = useTranslations("header");
    const tAuth = useTranslations("auth");

    return (
        <header className="w-full h-16 border-b border-border justify-center flex sticky top-0 z-50 bg-background">
            <div className="w-full h-full flex justify-between container">
                {/* Logo */}
                <Logo />

                {/* Routes */}
                <ul className="flex items-center gap-2 lg:gap-4">
                    <li>
                        <Link href={MY_RECIPES_ROUTE}>
                            <Button text={t("myRecipes")} Icon={BookOpen} variant="transparent" />
                        </Link>
                    </li>
                    <li>
                        <Button text={t("explore")} Icon={Search} variant="transparent" />
                    </li>
                    <li>
                        <Button text={t("friends")} Icon={Handshake} variant="transparent" />
                    </li>
                    <li>
                        <Button text={t("groups")} Icon={Users} variant="transparent" />
                    </li>
                </ul>

                {/* Actions/Profile */}
                {isLoading ? (
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
                    </div>
                ) : (
                    user ? (
                        <div className="flex items-center gap-1">
                            <Link
                                href={CREATE_RECIPE_ROUTE}
                                className="p-2 rounded-xl hover:bg-secondary/60 transition-colors"
                                title={t("createRecipe")}
                            >
                                <Plus className="w-5 h-5 text-muted hover:text-primary transition-colors" />
                            </Link>
                            <Link
                                href={PROFILE_ROUTE}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-secondary/20 transition-colors"
                            >
                            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.username}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold text-primary">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium max-w-24 truncate hidden sm:block">
                                {user.username}
                            </span>
                            <ChevronDown className="w-4 h-4 text-muted hidden sm:block" />
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <div className="flex gap-2 items-center">
                                <Link href={LOGIN_ROUTE}>
                                    <Button
                                        variant="skeleton"
                                        text={tAuth("signIn")}
                                        Icon={LogIn}
                                    />
                                </Link>
                                <Link href={SIGNUP_ROUTE}>
                                    <Button
                                        variant="primary"
                                        text={tAuth("signUp")}
                                        Icon={BookCheck}
                                    />
                                </Link>
                            </div>
                        </div>
                    )
                )}
            </div>
        </header>
    )
}