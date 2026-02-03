import { db } from "@/lib/db/db";
import { sql } from "drizzle-orm";

export interface HealthCheckResult {
    status: "healthy" | "unhealthy";
    timestamp: string;
    services: {
        database: {
            status: "connected" | "disconnected";
            latency: string;
            error?: string;
        };
    };
}

export async function performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
        await db.execute(sql`SELECT 1`);
        const dbLatency = Date.now() - startTime;

        return {
            status: "healthy",
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    status: "connected",
                    latency: `${dbLatency}ms`,
                },
            },
        };
    } catch (error) {
        const dbLatency = Date.now() - startTime;

        return {
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    status: "disconnected",
                    latency: `${dbLatency}ms`,
                    error: error instanceof Error ? error.message : "Unknown error",
                },
            },
        };
    }
}