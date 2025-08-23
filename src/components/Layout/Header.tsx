import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="People Kind Pharma Logo" className="h-10 w-10 rounded-lg shadow-soft" />
            <span className="font-poppins text-xl font-bold text-primary">People Kind Pharma</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
              Home
            </Link>
            <Link to="/medicines" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
              Medicines
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
              About
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medicines..."
                className="w-64 pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
              Search
            </Button>
          </form>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/medicines" 
                className="text-muted-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Medicines
              </Link>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-muted-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center space-x-2 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search medicines..."
                    className="pl-10 bg-muted/50 border-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
                  Search
                </Button>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;