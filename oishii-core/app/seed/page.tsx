"use client";

import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/layout/PageHeader";
import { Sprout, User, Loader2, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

interface SeedResult {
    success: boolean;
    user?: {
        username: string;
        email: string;
    };
    recipesCreated?: number;
    error?: string;
}

export default function SeedPage() {
    const [isSeeding, setIsSeeding] = useState(false);
    const [results, setResults] = useState<SeedResult[]>([]);

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            const response = await fetch("/api/seed", {
                method: "POST",
            });
            const data = await response.json();

            if (response.ok) {
                setResults(prev => [...prev, {
                    success: true,
                    user: data.user,
                    recipesCreated: data.recipesCreated,
                }]);
            } else {
                setResults(prev => [...prev, {
                    success: false,
                    error: data.error || "Unknown error occurred",
                }]);
            }
        } catch (error) {
            setResults(prev => [...prev, {
                success: false,
                error: error instanceof Error ? error.message : "Network error",
            }]);
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="flex flex-col container py-4 lg:py-6 space-y-8 max-w-2xl mx-auto">
            <PageHeader
                title="Seed Data"
                description="Development tool for seeding test data"
            />

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-medium">Development Only</p>
                        <p className="mt-1 opacity-80">
                            This page is only visible in development mode. Each click creates a new user with 10 random recipes.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-warm space-y-6">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto">
                        <Sprout className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Create Test User</h2>
                        <p className="text-sm text-muted mt-1">
                            Creates a random user with 10 random recipes.<br />
                            Password is always: <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">kaaskaas</code>
                        </p>
                    </div>
                </div>

                <Button
                    text={isSeeding ? "Seeding..." : "Seed User + Recipes"}
                    Icon={isSeeding ? Loader2 : User}
                    variant="primary"
                    className="w-full justify-center"
                    onClick={handleSeed}
                    disabled={isSeeding}
                />
            </div>

            {results.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-medium text-sm text-muted">Seed Results</h3>
                    <div className="space-y-2">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                                    result.success
                                        ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                        : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                }`}
                            >
                                {result.success ? (
                                    <>
                                        <Check className="w-4 h-4 flex-shrink-0" />
                                        <span>
                                            Created <strong>{result.user?.username}</strong> ({result.user?.email}) with {result.recipesCreated} recipes
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{result.error}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
