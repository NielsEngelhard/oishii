import getGeneralStatistics from "@/features/statistics/get-general-statistics-query";
import { NextResponse } from "next/server";

export const revalidate = 900; // 15 minutes

export async function GET() {
    const result = await getGeneralStatistics();

    return NextResponse.json(result, {
        headers: {
            'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=59`
        }
    });
}
