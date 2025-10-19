import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import logo from "@/assets/pkpharma.jpeg";
import banner from "@/assets/banner-bgwhite.jpeg";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="People Kind Pharma Logo" className="h-8 w-8 rounded-lg" />
              <img src={banner} alt="People Kind Pharma" height={32} className="h-8 object-contain"/>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted pharmaceutical dealer providing quality medicines and healthcare products with professional service and competitive prices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-smooth text-sm">
                Home
              </Link>
              <Link to="/medicines" className="text-muted-foreground hover:text-primary transition-smooth text-sm">
                Medicines Catalog
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth text-sm">
                About Us
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-smooth text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-foreground">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+91 6200255521</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">info@pharmaview.com</span>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">DANIYAWA BAZAR<br />CHILKA-PAR, HILSA ROAD<br />PATNA-801304</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-foreground">Business Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <div className="text-muted-foreground">
                  <div>Mon - Fri: 8:00 AM - 8:00 PM</div>
                  <div>Sat: 9:00 AM - 6:00 PM</div>
                  <div>Sun: 10:00 AM - 4:00 PM</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 People Kind Pharma. All rights reserved. | Licensed Pharmaceutical Dealer | Powered by 
            <a href="https://www.ascendons.in/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> Ascendons</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;