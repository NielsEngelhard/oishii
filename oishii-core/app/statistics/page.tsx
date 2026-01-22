"use client"

import NarrowPageWrapper from "@/components/ui/layout/NarrowPageWrapper";
import { IGlobalStatistics } from "@/schemas/statistic-schemas";
import { useEffect, useState } from "react"

export default function StatisticsPage() {
    const [stats, setStats] = useState<IGlobalStatistics | null>(null);

    useEffect(() => {
        let ignore = false;

        async function fetchStatistics() {
            try {
                const response = await fetch(`/api/statistics`);
                if (!response.ok) return;

                const data = await response.json();
                if (!ignore) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        }

        fetchStatistics();

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <NarrowPageWrapper>
            <div className="flex flex-col gap-2 w-full items-center">
                <h1>Statistics</h1>
                <p>Simple global statistics.</p>                
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                <div className="flex justify-center w-full">
                    <div className="w-24 h-24 bg-primary/75 font-bold flex items-center justify-center flex-col text-center rounded-full">
                        <span>{stats?.totalUsers}</span>
                        <span className="text-sm">Users</span>
                    </div>                    
                </div>

                <div className="flex justify-center w-full">
                    <div className="w-24 h-24 bg-secondary/75 font-bold flex items-center justify-center flex-col text-center rounded-full">
                        <span>{stats?.totalRecipes}</span>
                        <span className="text-sm">Recipes</span>
                    </div>                
                </div>

                <div className="flex justify-center w-full">
                    <div className="w-24 h-24 bg-accent/75 font-bold flex items-center justify-center flex-col text-center rounded-full">
                        <span>{stats?.totalLikes}</span>
                        <span className="text-sm">Likes</span>
                    </div>   
                </div>                             
            </div>
        </NarrowPageWrapper>
    );
}