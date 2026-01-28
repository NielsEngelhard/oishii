export default function VersionBadge() {
    const version = process.env.NEXT_PUBLIC_APP_VERSION;

    if (!version) return null;

    return (
        <div className="flex items-center gap-1.5 text-xs text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>v{version}</span>
        </div>
    );
}
