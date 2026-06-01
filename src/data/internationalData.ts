// Indicative international 22K gold retail prices (per Bhori, BDT) for the SonarDam comparison.
// Source notes are illustrative — actual rates vary by retailer, FX, VAT and making charges.
export type Market = {
    country: string;
    region: string;
    currency: string;
    fxToBdt: number; // 1 unit local = X BDT
    pricePerBhori: number; // BDT per Bhori (22K)
    source: string;
    url: string;
};

export const INTL_MARKETS: Market[] = [
    { country: "Italy", region: "Europe", currency: "EUR", fxToBdt: 142.96, pricePerBhori: 189375, source: "Retail", url: "https://www.goldpricedata.com/en/gold-rates/italy/22K/" },
    { country: "United Kingdom", region: "Europe", currency: "GBP", fxToBdt: 164.96, pricePerBhori: 189429, source: "Retail", url: "https://www.goldpricedata.com/en/gold-rates/united_kingdom/22K/" },
    { country: "Oman", region: "Middle East", currency: "OMR", fxToBdt: 319.08, pricePerBhori: 189549, source: "Retail", url: "https://www.goldrate24.com/gold-prices/middle-east/oman/gram/22K/" },
    { country: "Singapore", region: "Asia", currency: "SGD", fxToBdt: 96.10, pricePerBhori: 189632, source: "Retail", url: "https://www.goldrate24.com/gold-prices/asia/singapore/gram/22K/" },
    { country: "Qatar", region: "Middle East", currency: "QAR", fxToBdt: 33.71, pricePerBhori: 189691, source: "Retail", url: "https://www.goldrate24.com/gold-prices/middle-east/qatar/gram/22K/" },
    { country: "Malaysia", region: "Asia", currency: "MYR", fxToBdt: 30.93, pricePerBhori: 189982, source: "Retail", url: "https://www.goldrate24.com/gold-prices/asia/malaysia/gram/22K/" },
    { country: "USA", region: "North America", currency: "USD", fxToBdt: 122.70, pricePerBhori: 190130, source: "Retail", url: "https://www.goldrate24.com/" },
    { country: "Bahrain", region: "Middle East", currency: "BHD", fxToBdt: 326.37, pricePerBhori: 190225, source: "Retail", url: "https://www.goldrate24.com/gold-prices/middle-east/bahrain/gram/22K/" },
    { country: "Saudi Arabia", region: "Middle East", currency: "SAR", fxToBdt: 32.72, pricePerBhori: 190337, source: "Retail", url: "https://www.zahabprice.com/en-sa/karat/22-k" },
    { country: "Kuwait", region: "Middle East", currency: "KWD", fxToBdt: 399.20, pricePerBhori: 190973, source: "Retail", url: "https://www.goldrate24.com/gold-prices/middle-east/kuwait/gram/22K/" },
    { country: "Dubai / UAE", region: "Middle East", currency: "AED", fxToBdt: 33.41, pricePerBhori: 195537, source: "Retail", url: "https://goldrateuae.ae/" },
];
