import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBajusPrices, syncBajusPrices, type LivePrices } from "./bajus.functions";
import { TODAY } from "@/data/goldData";

export const FALLBACK_PRICES: LivePrices = {
  k22_gram: TODAY.k22_gram,
  k21_gram: TODAY.k21_gram,
  k18_gram: TODAY.k18_gram,
  trad_gram: TODAY.trad_gram,
  k22_bhori: TODAY.k22_bhori,
  k21_bhori: TODAY.k21_bhori,
  k18_bhori: TODAY.k18_bhori,
  trad_bhori: TODAY.trad_bhori,
  silver_gram: TODAY.silver_gram,
  silver_bhori: TODAY.silver_bhori,
  fetchedAt: TODAY.date,
  source: "fallback",
};

export const pricesQueryOptions = queryOptions({
  queryKey: ["bajus", "prices"],
  queryFn: () => fetchBajusPrices(),
  staleTime: 1000 * 60 * 30, // 30 min
  refetchOnWindowFocus: false,
  placeholderData: FALLBACK_PRICES,
});

export type Karat = 24 | 22 | 21 | 18;

export function pricePerGramOf(prices: LivePrices, karat: Karat) {
  switch (karat) {
    case 24:
      return Math.round((prices.k22_gram * 24) / 22);
    case 22:
      return prices.k22_gram;
    case 21:
      return prices.k21_gram;
    case 18:
      return prices.k18_gram;
  }
}

export function usePrices() {
  const q = useQuery(pricesQueryOptions);
  return {
    prices: q.data ?? FALLBACK_PRICES,
    isFetching: q.isFetching,
  };
}

export function useSyncPrices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => syncBajusPrices(),
    onSuccess: (data) => {
      qc.setQueryData(["bajus", "prices"], data);
    },
  });
}
