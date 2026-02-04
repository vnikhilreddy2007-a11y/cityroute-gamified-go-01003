import { useEffect, useState } from "react";
import { Bus, MapPin, Clock, Users, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Chennai center coordinates
const CHENNAI_CENTER = { lat: 13.0827, lng: 80.2707 };

// Sample bus data for Chennai routes
const initialBuses = [
  {
    id: "M70",
    route: "M70",
    position: { lat: 13.0674, lng: 80.2376 },
    destination: "T. Nagar to Broadway",
    eta: "3 min",
    occupancy: 65,
    speed: 28,
    color: "#10B981",
    status: "On Time",
  },
  {
    id: "21G",
    route: "21G",
    position: { lat: 13.0524, lng: 80.2508 },
    destination: "Adyar to Central",
    eta: "7 min",
    occupancy: 82,
    speed: 22,
    color: "#F59E0B",
    status: "Slight Delay",
  },
  {
    id: "27C",
    route: "27C",
    position: { lat: 13.0892, lng: 80.2219 },
    destination: "Vadapalani to Beach",
    eta: "12 min",
    occupancy: 45,
    speed: 35,
    color: "#10B981",
    status: "On Time",
  },
  {
    id: "29C",
    route: "29C",
    position: { lat: 13.1103, lng: 80.2849 },
    destination: "Perambur to Guindy",
    eta: "5 min",
    occupancy: 90,
    speed: 18,
    color: "#EF4444",
    status: "Crowded",
  },
  {
    id: "47A",
    route: "47A",
    position: { lat: 13.0401, lng: 80.2327 },
    destination: "Saidapet to CMBT",
    eta: "9 min",
    occupancy: 55,
    speed: 30,
    color: "#10B981",
    status: "On Time",
  },
];

const BusTrackingMap = () => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [animatedBuses, setAnimatedBuses] = useState(initialBuses);

  // Simulate bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          position: {
            lat: bus.position.lat + (Math.random() - 0.5) * 0.002,
            lng: bus.position.lng + (Math.random() - 0.5) * 0.002,
          },
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Create OpenStreetMap embed URL with markers
  const getMapUrl = () => {
    const zoom = 12;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${CHENNAI_CENTER.lng - 0.15},${CHENNAI_CENTER.lat - 0.08},${CHENNAI_CENTER.lng + 0.15},${CHENNAI_CENTER.lat + 0.08}&layer=mapnik&marker=${CHENNAI_CENTER.lat},${CHENNAI_CENTER.lng}`;
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4">
            <MapPin className="w-3 h-3 mr-1" />
            Live Tracking
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Track Buses in{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Real-Time
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See where your bus is right now. Get accurate ETAs and live updates for all Chennai MTC buses.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Bus List */}
          <div className="lg:col-span-1 space-y-3 order-2 lg:order-1">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Bus className="w-5 h-5 text-primary" />
              Nearby Buses
            </h3>
            {animatedBuses.map((bus) => (
              <Card
                key={bus.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  selectedBus === bus.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedBus(bus.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: bus.color }}
                      >
                        {bus.route}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{bus.destination}</p>
                        <Badge
                          variant={bus.status === "On Time" ? "default" : bus.status === "Crowded" ? "destructive" : "secondary"}
                          className="text-xs mt-1"
                        >
                          {bus.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{bus.eta}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{bus.occupancy}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      <span>{bus.speed} km/h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card className="overflow-hidden shadow-xl">
              <div className="relative">
                {/* Map Container */}
                <div className="relative h-[500px] bg-muted">
                  <iframe
                    title="Chennai Bus Tracking Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    src={getMapUrl()}
                    allowFullScreen
                  />
                  
                  {/* Bus Markers Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {animatedBuses.map((bus) => {
                      // Calculate position relative to map bounds
                      const xPercent = ((bus.position.lng - (CHENNAI_CENTER.lng - 0.15)) / 0.3) * 100;
                      const yPercent = ((CHENNAI_CENTER.lat + 0.08 - bus.position.lat) / 0.16) * 100;
                      
                      return (
                        <div
                          key={bus.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-1000"
                          style={{
                            left: `${Math.max(5, Math.min(95, xPercent))}%`,
                            top: `${Math.max(5, Math.min(95, yPercent))}%`,
                          }}
                          onClick={() => setSelectedBus(bus.id)}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-white transition-transform ${
                              selectedBus === bus.id ? "scale-125 z-10" : ""
                            }`}
                            style={{ backgroundColor: bus.color }}
                          >
                            <Bus className="w-5 h-5" />
                          </div>
                          {selectedBus === bus.id && (
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-background rounded-lg shadow-xl p-3 min-w-[180px] z-20 border">
                              <p className="font-bold text-sm">{bus.route}</p>
                              <p className="text-xs text-muted-foreground">{bus.destination}</p>
                              <div className="flex gap-3 mt-2 text-xs">
                                <span className="text-primary font-medium">{bus.eta}</span>
                                <span>{bus.occupancy}% full</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Map overlay info */}
                <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-medium">{animatedBuses.length} buses active</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 right-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                      <span>On Time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                      <span>Delayed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                      <span>Crowded</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusTrackingMap;
