export interface HealthCheckResult {
    name: string;
    statusCode: number;
    url: string;
    details?: string;
}

export async function performHealthCheck(): Promise<HealthCheckResult[]> {
    return [];
}