"use client"

import SearchBar from "@/components/ui/SearchBar";
import { IUserTeaser } from "@/models/user-models";
import { useCallback, useEffect, useState } from "react";
import UserList from "./UserList";
import { Loader2 } from "lucide-react";

interface UserWithFriendStatus extends IUserTeaser {
    isFriend: boolean;
}

export default function SearchFriendsSection() {
    const [suggestions, setSuggestions] = useState<IUserTeaser[]>([]);
    const [searchResults, setSearchResults] = useState<UserWithFriendStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchSuggestions = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/friends/suggestions");
            if (response.ok) {
                const data = await response.json();
                setSuggestions(data.items);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const searchUsers = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.items);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuggestions();
    }, [fetchSuggestions]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search.trim()) {
                searchUsers(search);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, searchUsers]);

    const handleRefresh = () => {
        if (search.trim()) {
            searchUsers(search);
        } else {
            fetchSuggestions();
        }
    };

    const isShowingSuggestions = !search.trim();
    const usersToShow = isShowingSuggestions
        ? suggestions.map(u => ({ ...u, isFriend: false }))
        : searchResults;

    return (
        <div className="w-full flex flex-col space-y-3 md:space-y-6">
            <SearchBar
                placeholder="Search by name..."
                value={search}
                onChange={setSearch}
            />

            {isShowingSuggestions && (
                <p className="text-muted text-sm">Suggested friends</p>
            )}

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-muted" size={24} />
                </div>
            ) : (
                <UserList
                    users={usersToShow}
                    onFriendStatusChange={handleRefresh}
                />
            )}
        </div>
    )
}