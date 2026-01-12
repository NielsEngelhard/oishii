import { BookCheck, BookOpen, ChefHat, Handshake, Key, LogIn, Search, Users } from "lucide-react";
import Button from "../Button";

export default function Header() {
    return (
        <header className="w-full flex justify-between flex-row h-16 px-2 lg:px-4 border-b border-border">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="bg-primary text-background rounded-xl p-2">
                    <ChefHat size={20} />
                </div>
                <span className="font-bold text-xl tracking-wider" style={{ fontFamily: "var(--font-special)" }}>Oishii</span>
            </div>

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
            <div className="flex items-center">
                <div className="flex gap-2 items-centers">
                    <Button
                        variant="skeleton"
                        text="Sign In"
                        Icon={LogIn}
                    />
                    <Button
                        variant="primary"
                        text="Sign Up!"
                        Icon={BookCheck}
                    />                    
                </div>
            </div>
            
        </header>
    )
}