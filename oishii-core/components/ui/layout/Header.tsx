"use client"

import { BookCheck, BookOpen, Handshake, LogIn, Search, Users } from "lucide-react";
import Button from "../Button";
import Link from "next/link";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/app/routes";
import Logo from "./logo";
import { useAuth } from "@/contexts/AuthContex";

export default function Header() {
    const { user, isLoading } = useAuth();

    return (
        <header className="w-full h-16 border-b border-border justify-center flex">
            <div className="w-full h-full flex justify-between container">
                {/* Logo */}
                <Logo />

                {/* Routes */}
                <ul className="flex items-center gap-2 lg:gap-4">
                    <li>
                        <Button text="My Recipes" Icon={BookOpen} variant="transparent" />
                    </li>
                    <li>
                        <Button text="Explore" Icon={Search} variant="transparent" />
                    </li>
                    <li>
                        <Button text="Friends" Icon={Handshake} variant="transparent" />
                    </li>
                    <li>
                        <Button text="Groups" Icon={Users} variant="transparent" />
                    </li>                                                
                </ul>

                {/* Actions/Profile */}
                {isLoading ? (
                    <div>loading</div>
                ) : (
                    user ? (
                        <div>logged in</div>
                    ) : (
                        <div className="flex items-center">
                                <div className="flex gap-2 items-centers">
                                    <Link href={LOGIN_ROUTE}>
                                        <Button
                                            variant="skeleton"
                                            text="Sign In"
                                            Icon={LogIn}
                                        />
                                    </Link>
                                    <Link href={SIGNUP_ROUTE}>
                                        <Button
                                            variant="primary"
                                            text="Sign Up!"
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