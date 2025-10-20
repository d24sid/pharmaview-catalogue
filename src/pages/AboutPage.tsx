import { Shield, Truck, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/pharma-hero.jpg";

const AboutPage = () => {
  const features = [
    {
      icon: Shield,
      title: "Trusted & Certified",
      description: "All our medicines are sourced from licensed manufacturers.",
    },
    {
      icon: Truck,
      title: "Nationwide Delivery",
      description:
        "Reliable supply chain and timely delivery to your doorstep.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our experts are available round-the-clock for your needs.",
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description: "Every product undergoes rigorous quality checks.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-poppins font-bold leading-tight">
              About <span className="text-primary">People Kind Pharma</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              We are a leading pharmaceutical distributor committed to
              delivering quality medicines and healthcare products to hospitals,
              clinics, and pharmacies across the nation. With years of
              experience, we have built a reputation for reliability,
              affordability, and trust.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-strong relative">
            <img
              src={heroImage}
              alt="Pharma warehouse"
              className="w-full h-[350px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-poppins font-bold">Our Mission</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To make essential medicines accessible and affordable to all,
              while ensuring uncompromised quality and customer service.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-poppins font-bold">Our Vision</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To be the most trusted pharmaceutical partner for healthcare
              providers by revolutionizing the supply chain with technology and
              transparency.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold mb-4">
              Why Choose Us?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We go beyond being just a distributor — we’re your trusted partner
              in healthcare.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="text-center border-0 shadow-soft hover:shadow-medium transition-all"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-poppins font-semibold text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center space-y-6 max-w-2xl">
          <h2 className="text-3xl font-poppins font-bold">
            Partner With People Kind Pharma
          </h2>
          <p className="text-xl text-white/90">
            Let’s build a healthier tomorrow, together.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
          >
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
