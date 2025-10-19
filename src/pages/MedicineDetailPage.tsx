import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Building, Pill, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/data/medicines";
import medicineImage from "@/assets/medicine-generic.jpg";

const [medicines, setMedicines] = (() => {
  const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
  return medicines;
})();

const MedicineDetailPage = () => {
  const { id } = useParams();
  const medicine = medicines.find(m => m.id === id);

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="border-0 shadow-medium">
          <CardContent className="p-12 text-center space-y-4">
            <div className="text-4xl">💊</div>
            <h2 className="text-2xl font-poppins font-bold">Medicine Not Found</h2>
            <p className="text-muted-foreground">The requested medicine could not be found.</p>
            <Button asChild variant="outline">
              <Link to="/medicines">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Medicines
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const category = categories.find(c => c.id === medicine.category);
  
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="hover:bg-primary/10">
            <Link to="/medicines">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Medicines
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Medicine Image and Basic Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={medicineImage} 
                    alt={medicine.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {category && (
                      <Badge className="bg-white/90 text-foreground hover:bg-white">
                        {category.icon} {category.name}
                      </Badge>
                    )}
                  </div>
                  {medicine.prescription && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/90 border-primary text-primary">
                        Prescription Required
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={`${getAvailabilityColor(medicine.availability)} border text-sm`}
                    >
                      {medicine.availability}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Stock Available</div>
                      <div className="font-semibold">{medicine.stock} units</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price and Purchase Info */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">${medicine.price}</div>
                  <div className="text-muted-foreground">per {medicine.form.toLowerCase()}</div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dosage:</span>
                    <span className="font-medium">{medicine.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Form:</span>
                    <span className="font-medium">{medicine.form}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span className="font-medium">{medicine.manufacturer}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 shadow-glow" 
                  size="lg"
                  disabled={medicine.availability === 'Out of Stock'}
                >
                  {medicine.availability === 'Out of Stock' ? 'Currently Unavailable' : 'Contact for Quote'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="space-y-6">
            
            {/* Main Details */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  {medicine.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Generic Name
                  </h4>
                  <p className="font-medium">{medicine.genericName}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Brand
                  </h4>
                  <p className="font-medium">{medicine.brand}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Description
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">{medicine.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Uses */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-secondary" />
                  Medical Uses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {medicine.uses.map((use, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {use}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Side Effects */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Possible Side Effects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {medicine.sideEffects.map((effect, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contraindications */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Contraindications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {medicine.contraindications.map((contraindication, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {contraindication}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="border-0 shadow-soft bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-primary mb-1">Important Medical Notice</p>
                    <p className="text-muted-foreground leading-relaxed">
                      This medicine should only be used under proper medical supervision. 
                      Always consult with a qualified healthcare professional before use. 
                      Keep out of reach of children.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MedicineDetailPage;