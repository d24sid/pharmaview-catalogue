import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Medicine, categories } from "@/data/medicines";
import medicineImage from "@/assets/medicine-generic.jpg";

interface MedicineCardProps {
  medicine: Medicine;
  viewMode: 'grid' | 'list';
}

const MedicineCard = ({ medicine, viewMode }: MedicineCardProps) => {
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

  if (viewMode === 'list') {
    return (
      <Card className="border-0 shadow-soft hover:shadow-medium transition-all">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-48 h-32 sm:h-auto">
              <img 
                src={medicineImage} 
                alt={medicine.name}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
            
            <div className="flex-1 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <Link 
                      to={`/medicines/${medicine.id}`}
                      className="text-xl font-poppins font-semibold hover:text-primary transition-colors"
                    >
                      {medicine.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                    <p className="text-sm text-muted-foreground">by {medicine.manufacturer}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {category && (
                      <Badge variant="secondary" className="text-xs">
                        {category.icon} {category.name}
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={`text-xs border ${getAvailabilityColor(medicine.availability)}`}
                    >
                      {medicine.availability}
                    </Badge>
                    {medicine.prescription && (
                      <Badge variant="outline" className="text-xs border-primary text-primary">
                        Prescription Required
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {medicine.description}
                  </p>
                </div>

                <div className="text-right space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-primary">${medicine.price}</div>
                    <div className="text-xs text-muted-foreground">{medicine.dosage} • {medicine.form}</div>
                    <div className="text-xs text-muted-foreground">Stock: {medicine.stock}</div>
                  </div>
                  
                  <Button 
                    asChild 
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                  >
                    <Link to={`/medicines/${medicine.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 group">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={medicineImage} 
            alt={medicine.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {category && (
              <Badge className="bg-white/90 text-foreground hover:bg-white">
                {category.icon}
              </Badge>
            )}
            <Badge 
              className={`${getAvailabilityColor(medicine.availability)} border`}
            >
              {medicine.availability}
            </Badge>
          </div>
          {medicine.prescription && (
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-white/90 border-primary text-primary">
                Rx
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <Link 
              to={`/medicines/${medicine.id}`}
              className="font-poppins font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1"
            >
              {medicine.name}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-1">{medicine.genericName}</p>
            <p className="text-xs text-muted-foreground">by {medicine.manufacturer}</p>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {medicine.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-primary">${medicine.price}</div>
              <div className="text-xs text-muted-foreground">{medicine.dosage} • {medicine.form}</div>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              Stock: {medicine.stock}
            </div>
          </div>
          
          <Button 
            asChild 
            className="w-full bg-primary hover:bg-primary/90 group-hover:shadow-glow transition-all"
          >
            <Link to={`/medicines/${medicine.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineCard;