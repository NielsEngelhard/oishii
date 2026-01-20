"use client"

import MyFriendsSection from "@/components/specific/friends/MyFriendsSection";
import SearchFriendsSection from "@/components/specific/friends/SearchFriendsSection";
import { useState } from "react";

type friendsSection = "my" | "search";

export default function FriendsPage() {
    const [currentSection, setCurrentSection] = useState<friendsSection>("my");

    return (
        <div className="container w-full h-2 mt-10 flex flex-col items-center">
            <div className="flex flex-col w-full items-center">
                <h1>Friends</h1>
                <p className="text-muted">Connect with fellow food lovers and share recipes together.</p>
            </div>

            {/* Toggle Search and MyFriends */}
            <div>todo toggle</div>

            {/* Section to show */}
            {currentSection == "my" && (
                <MyFriendsSection />
            )}

            {currentSection == "search" && (
                <SearchFriendsSection />
            )}            
        </div>
    )
}