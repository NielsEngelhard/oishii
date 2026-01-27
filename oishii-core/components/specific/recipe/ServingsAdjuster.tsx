"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";

interface Props {
    originalServings: number;
    currentServings: number;
    onServingsChange: (servings: number) => void;
}

export default function ServingsAdjuster({ originalServings, currentServings, onServingsChange }: Props) {
    const isModified = currentServings !== originalServings;
    const minServings = 1;
    const maxServings = 99;

    const decrease = () => {
        if (currentServings > minServings) {
            onServingsChange(currentServings - 1);
        }
    };

    const increase = () => {
        if (currentServings < maxServings) {
            onServingsChange(currentServings + 1);
        }
    };

    const reset = () => {
        onServingsChange(originalServings);
    };

    return (
        <div className="flex items-center gap-1">
            {/* Decrease button */}
            <button
                onClick={decrease}
                disabled={currentServings <= minServings}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-background-secondary active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
                aria-label="Decrease servings"
            >
                <Minus size={16} />
            </button>

            {/* Current value */}
            <div className="min-w-[2.5rem] text-center">
                <span className={`text-lg font-bold ${isModified ? "text-primary" : ""}`}>
                    {currentServings}
                </span>
            </div>

            {/* Increase button */}
            <button
                onClick={increase}
                disabled={currentServings >= maxServings}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-background-secondary active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
                aria-label="Increase servings"
            >
                <Plus size={16} />
            </button>

            {/* Reset button (only shown when modified) */}
            {isModified && (
                <button
                    onClick={reset}
                    className="ml-1 w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-background-secondary active:scale-95 transition-all touch-manipulation"
                    aria-label="Reset to original"
                    title={`Reset to ${originalServings}`}
                >
                    <RotateCcw size={14} />
                </button>
            )}
        </div>
    );
}
