"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { BrandConfig } from "@airnub/brand";
import { brand as defaultBrand } from "@airnub/brand";

const BrandContext = createContext<BrandConfig>(defaultBrand);

export interface BrandProviderProps {
  value?: BrandConfig;
  children: ReactNode;
}

export function BrandProvider({ value, children }: BrandProviderProps) {
  const resolvedBrand = useMemo(() => value ?? defaultBrand, [value]);

  return <BrandContext.Provider value={resolvedBrand}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}
