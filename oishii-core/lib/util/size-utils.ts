export function bytesToDisplayString(bytes: number): string {
    return `${Math.round(bytes / (1024 * 1024))}MB`; // For now MB only is sufficient
}