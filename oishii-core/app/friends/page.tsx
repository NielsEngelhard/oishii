"use client"

import MyFriendsSection from "@/components/specific/friends/MyFriendsSection";
import SearchFriendsSection from "@/components/specific/friends/SearchFriendsSection";
import NarrowPageWrapper from "@/components/ui/layout/NarrowPageWrapper";
import SectionToggle from "@/components/ui/SectionToggle";
import { UserPlus, Users } from "lucide-react";
import { useState } from "react";

type friendsSection = "my" | "search";

export default function FriendsPage() {
    const [currentSection, setCurrentSection] = useState<friendsSection>("my");

    return (
        <NarrowPageWrapper>
            <div className="flex flex-col w-full items-center">
                <h1>Friends</h1>
                <p className="text-muted">Connect with fellow food lovers and share recipes together.</p>
            </div>

            {/* Toggle Search and MyFriends */}
            <SectionToggle
                onSectionChange={(x) => setCurrentSection(x as friendsSection)}
                activeSectionKey="my"
                sections={[
                    { key: "my", label: "My Friends", Icon: Users },
                    { key: "search", label: "Find Friends", Icon: UserPlus }
                ]}
            />

            {/* Section to show */}
            {currentSection == "my" && (
                <MyFriendsSection />
            )}

            {currentSection == "search" && (
                <SearchFriendsSection />
            )}
        </NarrowPageWrapper>
    )
}