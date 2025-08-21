import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, Grid, List, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockMedicines, categories, Medicine } from "@/data/medicines";
import MedicineCard from "@/components/MedicineCard";

const MedicinesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique manufacturers
  const manufacturers = useMemo(() => {
    const uniqueManufacturers = [...new Set(mockMedicines.map(m => m.manufacturer))];
    return uniqueManufacturers.sort();
  }, []);

  // Filter and sort medicines
  const filteredMedicines = useMemo(() => {
    let filtered = mockMedicines.filter((medicine) => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          medicine.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
      const matchesManufacturer = selectedManufacturer === 'all' || medicine.manufacturer === selectedManufacturer;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const price = medicine.price;
        switch (priceRange) {
          case 'under-20':
            matchesPrice = price < 20;
            break;
          case '20-50':
            matchesPrice = price >= 20 && price <= 50;
            break;
          case 'over-50':
            matchesPrice = price > 50;
            break;
        }
      }
      
      return matchesSearch && matchesCategory && matchesManufacturer && matchesPrice;
    });

    // Sort medicines
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'availability':
          return a.availability.localeCompare(b.availability);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedManufacturer, priceRange, sortBy]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value) {
      setSearchParams(prev => ({ ...Object.fromEntries(prev), search: value }));
    } else {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('search');
        return newParams;
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value !== 'all') {
      setSearchParams(prev => ({ ...Object.fromEntries(prev), category: value }));
    } else {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('category');
        return newParams;
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedManufacturer('all');
    setPriceRange('all');
    setSortBy('name');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold mb-4">Medicine Catalog</h1>
          <p className="text-muted-foreground text-lg">
            Browse our comprehensive collection of pharmaceutical products
          </p>
        </div>

        {/* Search and Filters Bar */}
        <Card className="mb-6 border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              
              {/* Search */}
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

              {/* Quick Category Filter */}
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

              {/* View Mode Toggle */}
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:w-auto border-primary text-primary"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t border-border mt-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Manufacturers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Manufacturers</SelectItem>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer} value={manufacturer}>
                          {manufacturer}
                        </SelectItem>
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
                    Showing {filteredMedicines.length} of {mockMedicines.length} medicines
                  </p>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {filteredMedicines.length === 0 ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-4xl">💊</div>
                <h3 className="text-xl font-poppins font-semibold">No medicines found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or clearing filters
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredMedicines.map((medicine) => (
              <MedicineCard 
                key={medicine.id} 
                medicine={medicine} 
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicinesPage;