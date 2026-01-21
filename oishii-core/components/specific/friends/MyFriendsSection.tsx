"use client"

import SearchBar from "@/components/ui/SearchBar";
import { IUserTeaser } from "@/models/user-models";
import { IPaginatedResponse } from "@/models/recipe-models";
import { useCallback, useEffect, useState } from "react";
import UserList from "./UserList";
import Button from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

export default function MyFriendsSection() {
    const [friends, setFriends] = useState<IUserTeaser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchFriends = useCallback(async (pageNum: number, searchQuery: string, append: boolean = false) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(pageNum),
                pageSize: "20",
            });
            if (searchQuery) {
                params.set("search", searchQuery);
            }

            const response = await fetch(`/api/friends?${params}`);
            if (response.ok) {
                const data: IPaginatedResponse<IUserTeaser> = await response.json();
                setFriends(prev => append ? [...prev, ...data.items] : data.items);
                setHasMore(data.pagination.hasNextPage);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFriends(1, search, false);
        setPage(1);
    }, [search, fetchFriends]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFriends(nextPage, search, true);
    };

    const handleRefresh = () => {
        fetchFriends(1, search, false);
        setPage(1);
    };

    const usersWithFriendStatus = friends.map(friend => ({
        ...friend,
        isFriend: true,
    }));

    return (
        <div className="w-full flex flex-col space-y-3 md:space-y-6">
            <SearchBar
                placeholder="Search your friends..."
                value={search}
                onChange={setSearch}
            />

            {isLoading && friends.length === 0 ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-muted" size={24} />
                </div>
            ) : (
                <>
                    <UserList
                        users={usersWithFriendStatus}
                        onFriendStatusChange={handleRefresh}
                    />

                    {hasMore && (
                        <div className="flex justify-center">
                            <Button
                                text={isLoading ? "Loading..." : "Load more"}
                                variant="skeleton"
                                onClick={handleLoadMore}
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}