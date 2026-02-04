import { useState } from "react";
import { MapPin, Navigation, ArrowRight, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// Popular Chennai locations for autocomplete suggestions
const popularLocations = [
  "T. Nagar",
  "Anna Nagar",
  "Adyar",
  "Velachery",
  "Tambaram",
  "Central Railway Station",
  "CMBT",
  "Guindy",
  "Vadapalani",
  "Broadway",
  "Egmore",
  "Mylapore",
  "Nungambakkam",
  "Kodambakkam",
  "Perambur",
  "Koyambedu",
  "Ashok Nagar",
  "Saidapet",
  "Chromepet",
  "Porur",
];

interface RouteSearchProps {
  onSearch: (from: string, to: string) => void;
}

const RouteSearch = ({ onSearch }: RouteSearchProps) => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const filteredFromSuggestions = popularLocations.filter((loc) =>
    loc.toLowerCase().includes(fromLocation.toLowerCase())
  );

  const filteredToSuggestions = popularLocations.filter((loc) =>
    loc.toLowerCase().includes(toLocation.toLowerCase())
  );

  const handleSearch = () => {
    if (fromLocation && toLocation) {
      onSearch(fromLocation, toLocation);
    }
  };

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Bus className="h-4 w-4" />
            <span>Chennai's Smart Bus Companion</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Where do you want to
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              go today?
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Enter your pickup and drop locations to find the best bus routes across Chennai
          </p>
        </div>

        <Card className="max-w-xl mx-auto shadow-2xl border-0 bg-background/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              {/* From Location */}
              <div className="relative">
                <Label htmlFor="from" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  From
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  <Input
                    id="from"
                    placeholder="Enter pickup location"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    onFocus={() => setShowFromSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {showFromSuggestions && fromLocation && filteredFromSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredFromSuggestions.slice(0, 5).map((loc) => (
                      <button
                        key={loc}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm"
                        onClick={() => {
                          setFromLocation(loc);
                          setShowFromSuggestions(false);
                        }}
                      >
                        <MapPin className="inline h-4 w-4 mr-2 text-muted-foreground" />
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap button */}
              <div className="flex justify-center -my-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-background hover:bg-primary hover:text-primary-foreground transition-all"
                  onClick={swapLocations}
                >
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </Button>
              </div>

              {/* To Location */}
              <div className="relative">
                <Label htmlFor="to" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  To
                </Label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                  <Input
                    id="to"
                    placeholder="Enter destination"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    onFocus={() => setShowToSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {showToSuggestions && toLocation && filteredToSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredToSuggestions.slice(0, 5).map((loc) => (
                      <button
                        key={loc}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm"
                        onClick={() => {
                          setToLocation(loc);
                          setShowToSuggestions(false);
                        }}
                      >
                        <Navigation className="inline h-4 w-4 mr-2 text-muted-foreground" />
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <Button
                size="lg"
                className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg transition-all duration-300"
                onClick={handleSearch}
                disabled={!fromLocation || !toLocation}
              >
                <Bus className="mr-2 h-5 w-5" />
                Find Buses
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex justify-center gap-8 mt-8 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-xs text-muted-foreground">Bus Routes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">3000+</p>
                <p className="text-xs text-muted-foreground">Bus Stops</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">24/7</p>
                <p className="text-xs text-muted-foreground">Live Tracking</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RouteSearch;
