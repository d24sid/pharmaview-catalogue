// MedicinesPage.tsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Grid, List, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockMedicines, categories, Medicine as MedicineType } from "@/data/medicines";
import MedicineCard from "@/components/MedicineCard";

/* ----------------------------- Config / constants ---------------------------- */
const SPREADSHEET_ID = "1ZDO0G2YTgxcXrK-Zw4sBofPXtcdsvirrSs4fKdnZIQI";
const GID = 0;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const CACHE_KEY = `sheet_cache_${SPREADSHEET_ID}_${GID}`;

/* ------------------------------- Utilities --------------------------------- */
function parseGviz(respText: string) {
  // strip google wrapper: /**/ google.visualization.Query.setResponse({...});
  const jsonText = respText.replace(/^[^\(]*\(|\);?$/g, "");
  return JSON.parse(jsonText);
}

/**
 * Forgiving mapper from a sheet row (headers -> values) to your typed MedicineType
 */
function mapRowToMedicine(row: Record<string, any>): MedicineType {
  const getKey = (candidates: string[]) => {
    const normalizedWanted = candidates.map(s => s.replace(/\s|_|-/g, '').toLowerCase());
    for (const k of Object.keys(row || {})) {
      const nk = k.replace(/\s|_|-/g, '').toLowerCase();
      if (normalizedWanted.includes(nk)) return k;
    }
    return undefined;
  };

  const get = (...aliases: string[]) => {
    const key = getKey(aliases);
    if (!key) return "";
    const v = row[key];
    return v === null || v === undefined ? "" : v;
  };

  const parseNumber = (v: any, fallback = 0) => {
    if (typeof v === "number") return v;
    const s = String(v || "").replace(/[^\d.-]/g, "");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : fallback;
  };

  const splitList = (v: any) => {
    if (!v) return [] as string[];
    if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean);
    return String(v).split(",").map(x => x.trim()).filter(Boolean);
  };

  const name = String(get("name", "medicine name", "drug") || "").trim() || "Unknown Medicine";
  const genericName = String(get("genericName", "generic name", "generic") || "").trim();
  const brand = String(get("brand", "company") || "").trim();
  const category = String(get("category", "therapeutic category") || "").trim() || "Uncategorized";
  const manufacturer = String(get("manufacturer", "maker", "manufacturer name") || "").trim();
  const description = String(get("description", "details", "notes") || "").trim();
  const dosage = String(get("dosage", "strength") || "").trim();
  const form = String(get("form", "dosage form", "type") || "").trim();

  const price = parseNumber(get("price", "cost", "mrp"), 0);
  const stock = Math.max(0, parseInt(String(parseNumber(get("stock", "quantity", "available")) || 0), 10) || 0);

  const availabilityRaw = String(get("availability", "status", "stock status") || "").toLowerCase();
  let availability: MedicineType["availability"] = "In Stock";
  if (availabilityRaw.includes("low")) availability = "Low Stock";
  else if (availabilityRaw.includes("out")) availability = "Out of Stock";

  const presRaw = String(get("prescription", "rx required", "requires prescription", "rx") || "").toLowerCase();
  const prescription = presRaw === "1" || presRaw === "true" || presRaw === "yes";

  const imageUrl = String(get("imageUrl", "image", "photo", "img") || "").trim() || undefined;

  const uses = splitList(get("uses", "indications"));
  const sideEffects = splitList(get("sideEffects", "side effects", "adverse effects"));
  const contraindications = splitList(get("contraindications", "contra indications", "contraindication"));

  const idFromSheet = String(get("id", "uid", "code") || "").trim();
  const id = idFromSheet || `${name.replace(/\s+/g, "-").toLowerCase()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    name,
    genericName,
    brand,
    category,
    manufacturer,
    description,
    dosage,
    form,
    price,
    stock,
    availability,
    prescription,
    imageUrl,
    uses,
    sideEffects,
    contraindications,
    raw: { ...row },
  } as MedicineType;
}

/* ------------------------------- Hooks ------------------------------------ */
/** tiny debounce hook */
function useDebounced<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/* ------------------------------ Component --------------------------------- */
const MedicinesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // UI state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounced(searchQuery, 250);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedManufacturer, setSelectedManufacturer] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  // data state
  const [medicines, setMedicines] = useState<MedicineType[]>(mockMedicines || []);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0); // bump to force re-fetch

  /* ------------------------- Fetch + cache effect ------------------------- */
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function loadSheet() {
      try {
        setLoading(true);
        setError(null);

        // check cache
        try {
          const cachedRaw = localStorage.getItem(CACHE_KEY);
          if (cachedRaw) {
            const parsed = JSON.parse(cachedRaw);
            if (Date.now() - parsed.ts < CACHE_TTL_MS && Array.isArray(parsed.data)) {
              if (mounted) {
                setMedicines(parsed.data);
                setLoading(false);
                return;
              }
            } else {
              localStorage.removeItem(CACHE_KEY);
            }
          }
        } catch (e) {
          // ignore localStorage errors
        }

        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const text = await res.text();
        const parsed = parseGviz(text);
        const table = parsed.table;
        const headers: string[] = table.cols.map((c: any) => (c.label || c.id || "").toString().trim());

        const rows: Record<string, any>[] = table.rows.map((r: any) => {
          const obj: Record<string, any> = {};
          headers.forEach((h, i) => {
            const key = h || `col${i}`;
            const cell = (r.c && r.c[i]) || null;
            obj[key] = cell ? cell.v : "";
          });
          return obj;
        });

        const mapped = rows.map(mapRowToMedicine);
        if (mounted) {
          setMedicines(mapped.length ? mapped : mockMedicines);
          setLoading(false);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: mapped }));
          } catch (e) {
            // ignore storage errors
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Failed to fetch sheet", err);
        if (mounted) {
          setError("Failed to load sheet data. Using fallback dataset.");
          setMedicines(mockMedicines || []);
          setLoading(false);
        }
      }
    }

    loadSheet();

    return () => {
      mounted = false;
      controller.abort();
    };
    // refreshToken in deps allows manual refresh
  }, [refreshToken]);

  /* -------------------------- Derived data / filters ---------------------- */
  const manufacturers = useMemo(() => {
    const unique = [...new Set(medicines.map(m => m.manufacturer || "Unknown"))];
    return unique.sort();
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    const q = String(debouncedSearch || "").toLowerCase().trim();

    let filtered = medicines.filter(medicine => {
      const name = (medicine.name || "").toLowerCase();
      const generic = (medicine.genericName || "").toLowerCase();
      const brand = (medicine.brand || "").toLowerCase();

      const matchesSearch = !q || name.includes(q) || generic.includes(q) || brand.includes(q);
      const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
      const matchesManufacturer = selectedManufacturer === "all" || medicine.manufacturer === selectedManufacturer;

      let matchesPrice = true;
      if (priceRange !== "all") {
        const price = Number(medicine.price || 0);
        switch (priceRange) {
          case "under-20":
            matchesPrice = price < 20;
            break;
          case "20-50":
            matchesPrice = price >= 20 && price <= 50;
            break;
          case "over-50":
            matchesPrice = price > 50;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesManufacturer && matchesPrice;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "availability":
          return String(a.availability || "").localeCompare(String(b.availability || ""));
        default:
          return 0;
      }
    });

    return filtered;
  }, [medicines, debouncedSearch, selectedCategory, selectedManufacturer, priceRange, sortBy]);

  /* ------------------------- URL search params helpers -------------------- */
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);

    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) params.set("search", value);
    else params.delete("search");
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value && value !== "all") params.set("category", value);
    else params.delete("category");
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleManufacturerChange = useCallback((value: string) => {
    setSelectedManufacturer(value);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value && value !== "all") params.set("manufacturer", value);
    else params.delete("manufacturer");
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedManufacturer("all");
    setPriceRange("all");
    setSortBy("name");
    setSearchParams({});
  };

  /* ---------------------------- Refresh handler -------------------------- */
  const handleRefresh = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (e) {
      // ignore
    }
    // bump token to force re-fetch effect
    setRefreshToken(t => t + 1);
  };

  /* ----------------------------- Render ---------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold mb-4">Medicine Catalog</h1>
          <p className="text-muted-foreground text-lg">Browse our comprehensive collection of pharmaceutical products</p>
        </div>

        {/* Search & Controls */}
        <Card className="mb-6 border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search medicines, brands, or generic names..."
                    className="pl-10 bg-background border-0"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full lg:w-48 bg-background border-0">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex bg-muted rounded-lg p-1">
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="h-8">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="h-8">
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2 items-center">
                <Button variant="outline" onClick={() => setShowFilters(s => !s)} className="lg:w-auto border-primary text-primary">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>

                <Button variant="ghost" onClick={handleRefresh} className="hidden lg:inline-flex">
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t border-border mt-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={selectedManufacturer} onValueChange={handleManufacturerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Manufacturers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Manufacturers</SelectItem>
                      {manufacturers.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-20">Under $20</SelectItem>
                      <SelectItem value="20-50">$20 - $50</SelectItem>
                      <SelectItem value="over-50">Over $50</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-low">Price (Low to High)</SelectItem>
                      <SelectItem value="price-high">Price (High to Low)</SelectItem>
                      <SelectItem value="availability">Availability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredMedicines.length} of {medicines.length} medicines
                  </p>
                  <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All Filters</Button>
                    <Button variant="ghost" size="sm" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" /> Reload</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading / Error / Results */}
        {loading ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="p-12 text-center">Loading medicines…</CardContent>
          </Card>
        ) : error ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-sm text-rose-600">{error}</div>
            </CardContent>
          </Card>
        ) : filteredMedicines.length === 0 ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-4xl">💊</div>
                <h3 className="text-xl font-poppins font-semibold">No medicines found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or clearing filters</p>
                <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {filteredMedicines.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicinesPage;
