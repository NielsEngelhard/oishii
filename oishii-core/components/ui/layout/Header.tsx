"use client"

import { BookCheck, BookOpen, ChevronDown, Handshake, LogIn, Plus, Search, User, X } from "lucide-react";
import Button from "../Button";
import Link from "next/link";
import { CREATE_RECIPE_ROUTE, EXPLORE_ROUTE, FRIENDS_ROUTE, HOME_LANDING_PAGE_ROUTE, LOGIN_ROUTE, MY_RECIPES_ROUTE, PROFILE_ROUTE, SIGNUP_ROUTE } from "@/app/routes";
import Logo from "./logo";
import { useAuth } from "@/contexts/AuthContex";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function Header() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const t = useTranslations("header");
    const tAuth = useTranslations("auth");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);    

    // Close menu on route change or escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileMenuOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    const closeMenu = () => setMobileMenuOpen(false);

    const navLinks = [
        { href: MY_RECIPES_ROUTE, label: t("myRecipes"), Icon: BookOpen },
        { href: EXPLORE_ROUTE, label: t("explore"), Icon: Search },
        { href: FRIENDS_ROUTE, label: t("friends"), Icon: Handshake },
    ];

    const onLogoClick = () => {
        if (!user) {
            router.push(HOME_LANDING_PAGE_ROUTE);
        } else {
            router.push(MY_RECIPES_ROUTE);
        }
    }

    return (
        <>
            <header className="w-full h-16 border-b border-border justify-center flex sticky top-0 z-50 bg-background">
                <div className="w-full h-full flex justify-between items-center container px-4">
                    {/* Logo */}
                    <button className="cursor-pointer transition-transform duration-300 hover:scale-110" onClick={onLogoClick}>
                        <Logo />
                    </button>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center gap-2 lg:gap-4">
                        {navLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href}>
                                    <Button text={link.label} Icon={link.Icon} variant="transparent" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Actions/Profile */}
                    <div className="hidden md:flex items-center">
                        {isLoading ? (
                            <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
                        ) : user ? (
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
                                    <span className="text-sm font-medium max-w-24 truncate">
                                        {user.username}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-muted" />
                                </Link>
                            </div>
                        ) : (
                            <div className="flex gap-2 items-center">
                                <Link href={LOGIN_ROUTE}>
                                    <Button variant="skeleton" text={tAuth("signIn")} Icon={LogIn} />
                                </Link>
                                <Link href={SIGNUP_ROUTE}>
                                    <Button variant="primary" text={tAuth("signUp")} Icon={BookCheck} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: Profile/Auth + Hamburger */}
                    <div className="flex md:hidden items-center gap-2">
                        {!isLoading && user && (
                            <Link
                                href={CREATE_RECIPE_ROUTE}
                                className="p-2 rounded-xl hover:bg-secondary/60 transition-colors"
                            >
                                <Plus className="w-5 h-5 text-muted" />
                            </Link>
                        )}

                        {/* Hamburger Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl hover:bg-secondary/60 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-5 relative flex flex-col justify-between">
                                <span className={clsx(
                                    "w-full h-0.5 bg-foreground rounded-full transition-all duration-300 origin-center",
                                    mobileMenuOpen && "rotate-45 translate-y-[9px]"
                                )} />
                                <span className={clsx(
                                    "w-full h-0.5 bg-foreground rounded-full transition-all duration-300",
                                    mobileMenuOpen && "opacity-0 scale-0"
                                )} />
                                <span className={clsx(
                                    "w-full h-0.5 bg-foreground rounded-full transition-all duration-300 origin-center",
                                    mobileMenuOpen && "-rotate-45 -translate-y-[9px]"
                                )} />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
                    mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={closeMenu}
            />

            {/* Mobile Menu Panel */}
            <div
                className={clsx(
                    "fixed top-0 right-0 h-full w-72 bg-background z-50 md:hidden transition-transform duration-300 ease-out shadow-2xl",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <span className="font-semibold text-lg">Menu</span>
                        <button
                            onClick={closeMenu}
                            className="p-2 rounded-xl hover:bg-secondary/60 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* User Section */}
                    {!isLoading && user && (
                        <Link
                            href={PROFILE_ROUTE}
                            onClick={closeMenu}
                            className="flex items-center gap-3 p-4 border-b border-border hover:bg-secondary/20 transition-colors"
                        >
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.username}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-lg font-semibold text-primary">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium">{user.username}</span>
                                <span className="text-sm text-muted">View profile</span>
                            </div>
                        </Link>
                    )}

                    {/* Navigation Links */}
                    <nav className="flex-1 py-2">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-all duration-200",
                                    "transform transition-transform",
                                    mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                                )}
                                style={{ transitionDelay: mobileMenuOpen ? `${(index + 1) * 50}ms` : "0ms" }}
                            >
                                <link.Icon className="w-5 h-5 text-muted" />
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}

                        {user && (
                            <Link
                                href={CREATE_RECIPE_ROUTE}
                                onClick={closeMenu}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-all duration-200",
                                    "transform",
                                    mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                                )}
                                style={{ transitionDelay: mobileMenuOpen ? `${(navLinks.length + 1) * 50}ms` : "0ms" }}
                            >
                                <Plus className="w-5 h-5 text-muted" />
                                <span className="font-medium">{t("createRecipe")}</span>
                            </Link>
                        )}
                    </nav>

                    {/* Auth Buttons (when not logged in) */}
                    {!isLoading && !user && (
                        <div className="p-4 border-t border-border space-y-2">
                            <Link href={LOGIN_ROUTE} onClick={closeMenu} className="block">
                                <Button variant="skeleton" text={tAuth("signIn")} Icon={LogIn} className="w-full justify-center" />
                            </Link>
                            <Link href={SIGNUP_ROUTE} onClick={closeMenu} className="block">
                                <Button variant="primary" text={tAuth("signUp")} Icon={BookCheck} className="w-full justify-center" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}