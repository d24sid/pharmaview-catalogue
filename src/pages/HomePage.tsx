import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Shield, Truck, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/medicines";
import heroImage from "@/assets/pharma-hero.jpg";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Licensed & Certified",
      description: "All medicines are sourced from certified manufacturers"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery to your doorstep"
    },
    {
      icon: Clock,
      title: "Always Available",
      description: "Professional support and consultation available"
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "Highest quality pharmaceutical products guaranteed"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-poppins font-bold leading-tight">
                  Your Trusted
                  <span className="text-primary block">Pharmaceutical</span>
                  <span className="text-secondary">Partner</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Browse our comprehensive catalog of quality medicines and healthcare products. 
                  Professional service, competitive prices, and reliable supply.
                </p>
              </div>

              {/* Hero Search */}
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for medicines..."
                    className="pl-12 h-12 text-base shadow-medium border-0 bg-background/80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-12 px-8 gradient-primary text-white font-semibold shadow-glow hover:shadow-strong transition-all"
                >
                  Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="flex flex-wrap gap-4">
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  <Link to="/medicines">Browse All Medicines</Link>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-strong">
                <img 
                  src={heroImage} 
                  alt="Modern pharmaceutical warehouse" 
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold mb-4">Why Choose People Kind Pharma?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're committed to providing the highest quality pharmaceutical products and services 
              to healthcare professionals and institutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-soft hover:shadow-medium transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-poppins font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">
              Find the medicines you need organized by medical category
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/medicines?category=${category.id}`}
                className="group"
              >
                <Card className="h-full border-0 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-poppins font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-poppins font-bold">
              Ready to Explore Our Medicine Catalog?
            </h2>
            <p className="text-xl text-white/90">
              Discover thousands of quality pharmaceutical products at competitive prices
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
            >
              <Link to="/medicines">
                View All Medicines
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;