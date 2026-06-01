import { TODAY } from "@/data/goldData";

export type Unit = "bhori" | "gram" | "point" | "ana" | "roti" | "tola" | "oz" | "kg";
export type Karat = 24 | 22 | 21 | 18;

// 1 Bhori = 16 Ana = 96 Roti = 960 Point. Bhori = 11.664 g.
export const UNIT_TO_GRAM: Record<Unit, number> = {
    bhori: 11.664,
    gram: 1,
    ana: 11.664 / 16,
    roti: 11.664 / 96,
    point: 11.664 / 960,
    tola: 11.664,
    oz: 31.1035,
    kg: 1000,
};

export const UNIT_LABEL: Record<Unit, string> = {
    bhori: "Bhori (ভরি)",
    gram: "Gram",
    ana: "Ana (আনা)",
    roti: "Roti (রতি)",
    point: "Point (পয়েন্ট)",
    tola: "Tola",
    oz: "Troy Ounce",
    kg: "Kilogram",
};

export const UNIT_GROUPS: { label: string; units: Unit[] }[] = [
    { label: "Bangladesh", units: ["bhori", "ana", "roti", "point", "gram"] },
    { label: "International", units: ["tola", "oz", "kg"] },
];

export const toGrams = (weight: number, unit: Unit) =>
    weight * UNIT_TO_GRAM[unit];

export const pricePerGram = (karat: Karat) =>
({
    24: Math.round((TODAY.k22_gram * 24) / 22),
    22: TODAY.k22_gram,
    21: TODAY.k21_gram,
    18: TODAY.k18_gram,
}[karat]);

export const pricePerBhori = (karat: Karat) =>
    Math.round(pricePerGram(karat) * UNIT_TO_GRAM.bhori);

export const fmtBDT = (n: number) =>
    "৳ " + Math.round(n).toLocaleString("en-IN");

export const fmtNum = (n: number, digits = 2) =>
    n.toLocaleString("en-IN", {
        maximumFractionDigits: digits,
        minimumFractionDigits: 0,
    });
