import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-subtle text-center">
        <div className="container mx-auto px-4 space-y-4">
          <h1 className="text-4xl font-poppins font-bold">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We’d love to hear from you. Whether you’re a healthcare
            professional, a partner, or have general inquiries — reach out to us
            anytime.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-poppins font-semibold">
              Contact Information
            </h2>
            <p className="text-muted-foreground">
              Our support team is here to assist you with any queries regarding
              medicines, partnerships, or orders.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-5 w-5 text-primary" />
                <a
                  href="tel:+916200255521"
                  className="text-muted-foreground hover:text-primary"
                >
                  +91 6200255521
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-5 w-5 text-primary" />
                <a
                  href="mailto:peoplekindpharma01@gmail.com"
                  className="text-muted-foreground hover:text-primary"
                >
                  peoplekindpharma01@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  DANIYAWA BAZAR
                  <br />
                  CHILKA-PAR, HILSA ROAD
                  <br />
                  PATNA-801304
                </span>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  Mon - Fri: 8:00 AM - 8:00 PM
                  <br />
                  Sat: 9:00 AM - 6:00 PM
                  <br />
                  Sun: 10:00 AM - 4:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-muted/20 p-8 rounded-2xl shadow-soft">
            <h2 className="text-2xl font-poppins font-semibold mb-6">
              Send Us a Message
            </h2>
            <form className="space-y-4">
              <Input
                type="text"
                placeholder="Your Name"
                className="h-12 text-base"
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                className="h-12 text-base"
                required
              />
              <Textarea
                placeholder="Your Message"
                className="min-h-[120px] text-base"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="w-full gradient-primary text-white shadow-glow"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
