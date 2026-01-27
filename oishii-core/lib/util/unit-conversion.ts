import { IngredientUnit } from "@/db/schemas/enum/ingredient-unit";

export type MeasurementSystem = "metric" | "us";

export interface UnitConversion {
    unit: IngredientUnit;
    amount: number;
    system: MeasurementSystem;
    label: string;
}

interface ConversionRule {
    fromUnit: IngredientUnit;
    toUnit: IngredientUnit;
    factor: number; // multiply fromUnit by this to get toUnit
}

// Conversion rules between units
const conversionRules: ConversionRule[] = [
    // Volume: metric <-> US
    { fromUnit: "ml", toUnit: "tsp", factor: 0.202884 },
    { fromUnit: "ml", toUnit: "tbsp", factor: 0.067628 },
    { fromUnit: "ml", toUnit: "cup", factor: 0.00422675 },
    { fromUnit: "l", toUnit: "cup", factor: 4.22675 },
    { fromUnit: "tsp", toUnit: "ml", factor: 4.92892 },
    { fromUnit: "tbsp", toUnit: "ml", factor: 14.7868 },
    { fromUnit: "cup", toUnit: "ml", factor: 236.588 },
    { fromUnit: "cup", toUnit: "l", factor: 0.236588 },

    // Volume: within US
    { fromUnit: "tsp", toUnit: "tbsp", factor: 1/3 },
    { fromUnit: "tbsp", toUnit: "tsp", factor: 3 },
    { fromUnit: "tbsp", toUnit: "cup", factor: 1/16 },
    { fromUnit: "cup", toUnit: "tbsp", factor: 16 },

    // Volume: within metric
    { fromUnit: "ml", toUnit: "l", factor: 0.001 },
    { fromUnit: "l", toUnit: "ml", factor: 1000 },

    // Weight: metric <-> US
    { fromUnit: "g", toUnit: "oz", factor: 0.035274 },
    { fromUnit: "kg", toUnit: "lb", factor: 2.20462 },
    { fromUnit: "oz", toUnit: "g", factor: 28.3495 },
    { fromUnit: "lb", toUnit: "kg", factor: 0.453592 },
    { fromUnit: "lb", toUnit: "g", factor: 453.592 },
    { fromUnit: "g", toUnit: "lb", factor: 0.00220462 },

    // Weight: within metric
    { fromUnit: "mg", toUnit: "g", factor: 0.001 },
    { fromUnit: "g", toUnit: "mg", factor: 1000 },
    { fromUnit: "g", toUnit: "kg", factor: 0.001 },
    { fromUnit: "kg", toUnit: "g", factor: 1000 },

    // Weight: within US
    { fromUnit: "oz", toUnit: "lb", factor: 0.0625 },
    { fromUnit: "lb", toUnit: "oz", factor: 16 },
];

// Unit metadata
const unitInfo: Record<IngredientUnit, { system: MeasurementSystem | "universal"; label: string; fullName: string }> = {
    // Volume (metric)
    ml: { system: "metric", label: "ml", fullName: "milliliter" },
    l: { system: "metric", label: "l", fullName: "liter" },

    // Volume (US)
    tsp: { system: "us", label: "tsp", fullName: "teaspoon" },
    tbsp: { system: "us", label: "tbsp", fullName: "tablespoon" },
    cup: { system: "us", label: "cup", fullName: "cup" },

    // Weight (metric)
    mg: { system: "metric", label: "mg", fullName: "milligram" },
    g: { system: "metric", label: "g", fullName: "gram" },
    kg: { system: "metric", label: "kg", fullName: "kilogram" },

    // Weight (US/Imperial)
    oz: { system: "us", label: "oz", fullName: "ounce" },
    lb: { system: "us", label: "lb", fullName: "pound" },

    // Length
    cm: { system: "metric", label: "cm", fullName: "centimeter" },
    mm: { system: "metric", label: "mm", fullName: "millimeter" },

    // Count-based (universal)
    piece: { system: "universal", label: "pc", fullName: "piece" },
    clove: { system: "universal", label: "clove", fullName: "clove" },
    slice: { system: "universal", label: "slice", fullName: "slice" },
    pinch: { system: "universal", label: "pinch", fullName: "pinch" },
    dash: { system: "universal", label: "dash", fullName: "dash" },

    // Special
    to_taste: { system: "universal", label: "to taste", fullName: "to taste" },
    none: { system: "universal", label: "", fullName: "" },
};

/**
 * Get the full name of a unit
 */
export function getUnitFullName(unit: IngredientUnit): string {
    return unitInfo[unit]?.fullName || unit;
}

/**
 * Get the measurement system for a unit
 */
export function getUnitSystem(unit: IngredientUnit): MeasurementSystem | "universal" {
    return unitInfo[unit]?.system || "universal";
}

/**
 * Check if a unit can be converted to other units
 */
export function isConvertibleUnit(unit: IngredientUnit): boolean {
    const system = getUnitSystem(unit);
    return system !== "universal";
}

/**
 * Get available conversions for a unit and amount
 */
export function getConversions(unit: IngredientUnit, amount: number): UnitConversion[] {
    if (!isConvertibleUnit(unit)) {
        return [];
    }

    const conversions: UnitConversion[] = [];
    const currentSystem = getUnitSystem(unit);

    // Find all applicable conversion rules
    for (const rule of conversionRules) {
        if (rule.fromUnit === unit) {
            const convertedAmount = amount * rule.factor;
            const targetSystem = getUnitSystem(rule.toUnit);

            // Only include conversions to the opposite system or useful within-system conversions
            if (targetSystem !== "universal") {
                conversions.push({
                    unit: rule.toUnit,
                    amount: convertedAmount,
                    system: targetSystem as MeasurementSystem,
                    label: unitInfo[rule.toUnit].fullName,
                });
            }
        }
    }

    // Sort: opposite system first, then by amount (prefer whole numbers)
    conversions.sort((a, b) => {
        // Opposite system first
        if (a.system !== currentSystem && b.system === currentSystem) return -1;
        if (a.system === currentSystem && b.system !== currentSystem) return 1;

        // Prefer amounts closer to nice numbers (1, 0.5, 0.25, etc.)
        const aScore = getReadabilityScore(a.amount);
        const bScore = getReadabilityScore(b.amount);
        return bScore - aScore;
    });

    // Limit to most useful conversions (max 4)
    return conversions.slice(0, 4);
}

/**
 * Score how "readable" a number is (whole numbers and simple fractions score higher)
 */
function getReadabilityScore(num: number): number {
    if (num === 0) return 0;

    // Whole numbers score highest
    if (Number.isInteger(num)) return 100;

    // Common fractions score well
    const commonFractions = [0.25, 0.5, 0.75, 0.33, 0.67];
    const decimal = num % 1;
    if (commonFractions.some(f => Math.abs(decimal - f) < 0.01)) return 80;

    // Numbers close to whole numbers score well
    if (Math.abs(num - Math.round(num)) < 0.1) return 60;

    // Very small or very large numbers score poorly
    if (num < 0.01 || num > 1000) return 10;

    return 40;
}

/**
 * Format an amount for display (smart rounding)
 */
export function formatAmount(amount: number): string {
    if (amount === 0) return "0";

    // Very small amounts
    if (amount < 0.01) return "<0.01";

    // Check for common fractions
    const fractionMap: Record<number, string> = {
        0.25: "¼",
        0.33: "⅓",
        0.5: "½",
        0.67: "⅔",
        0.75: "¾",
    };

    const whole = Math.floor(amount);
    const decimal = amount - whole;

    // Check if decimal matches a common fraction
    for (const [value, symbol] of Object.entries(fractionMap)) {
        if (Math.abs(decimal - parseFloat(value)) < 0.02) {
            return whole > 0 ? `${whole}${symbol}` : symbol;
        }
    }

    // Round to reasonable precision
    if (amount >= 100) return Math.round(amount).toString();
    if (amount >= 10) return amount.toFixed(1).replace(/\.0$/, "");
    if (amount >= 1) return amount.toFixed(2).replace(/\.?0+$/, "");
    return amount.toFixed(2).replace(/\.?0+$/, "");
}

/**
 * Parse an amount string to a number (handles fractions)
 */
export function parseAmount(amountStr: string | undefined): number | null {
    if (!amountStr) return null;

    const trimmed = amountStr.trim();
    if (!trimmed) return null;

    // Handle unicode fractions
    const fractionReplacements: Record<string, string> = {
        "¼": "0.25",
        "½": "0.5",
        "¾": "0.75",
        "⅓": "0.333",
        "⅔": "0.667",
        "⅛": "0.125",
        "⅜": "0.375",
        "⅝": "0.625",
        "⅞": "0.875",
    };

    let normalized = trimmed;
    for (const [fraction, decimal] of Object.entries(fractionReplacements)) {
        if (normalized.includes(fraction)) {
            // Handle "1½" -> "1 + 0.5"
            const parts = normalized.split(fraction);
            const wholePart = parseFloat(parts[0]) || 0;
            normalized = (wholePart + parseFloat(decimal)).toString();
            break;
        }
    }

    // Handle "1/2" style fractions
    const fractionMatch = normalized.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (fractionMatch) {
        return parseFloat(fractionMatch[1]) / parseFloat(fractionMatch[2]);
    }

    // Handle "1 1/2" style mixed fractions
    const mixedMatch = normalized.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (mixedMatch) {
        return parseFloat(mixedMatch[1]) + parseFloat(mixedMatch[2]) / parseFloat(mixedMatch[3]);
    }

    // Try parsing as a regular number
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? null : parsed;
}

/**
 * Scale an amount by a multiplier
 */
export function scaleAmount(amountStr: string | undefined, multiplier: number): string {
    const amount = parseAmount(amountStr);
    if (amount === null) return amountStr || "";

    const scaled = amount * multiplier;
    return formatAmount(scaled);
}
