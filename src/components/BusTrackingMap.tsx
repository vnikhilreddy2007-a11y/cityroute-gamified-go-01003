import { useState } from "react";
import { Bus, MapPin, Clock, Users, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Chennai center coordinates
const CHENNAI_CENTER = { lat: 13.0827, lng: 80.2707 };

// Real Chennai bus stops with coordinates
const chennaiBusStops = [
  { id: "1", name: "CMBT", position: { lat: 13.0694, lng: 80.2002 } },
  { id: "2", name: "Central", position: { lat: 13.0827, lng: 80.2707 } },
  { id: "3", name: "Egmore", position: { lat: 13.0732, lng: 80.2609 } },
  { id: "4", name: "T. Nagar", position: { lat: 13.0418, lng: 80.2341 } },
  { id: "5", name: "Anna Nagar", position: { lat: 13.0850, lng: 80.2101 } },
  { id: "6", name: "Adyar", position: { lat: 13.0063, lng: 80.2574 } },
  { id: "7", name: "Velachery", position: { lat: 12.9815, lng: 80.2180 } },
  { id: "8", name: "Guindy", position: { lat: 13.0067, lng: 80.2206 } },
  { id: "9", name: "Vadapalani", position: { lat: 13.0520, lng: 80.2121 } },
  { id: "10", name: "Broadway", position: { lat: 13.0903, lng: 80.2839 } },
  { id: "11", name: "Mylapore", position: { lat: 13.0339, lng: 80.2676 } },
  { id: "12", name: "Tambaram", position: { lat: 12.9249, lng: 80.1000 } },
  { id: "13", name: "Perambur", position: { lat: 13.1167, lng: 80.2333 } },
  { id: "14", name: "Royapettah", position: { lat: 13.0544, lng: 80.2627 } },
  { id: "15", name: "Kodambakkam", position: { lat: 13.0521, lng: 80.2255 } },
  { id: "16", name: "Saidapet", position: { lat: 13.0206, lng: 80.2230 } },
  { id: "17", name: "Ashok Nagar", position: { lat: 13.0372, lng: 80.2119 } },
  { id: "18", name: "Nungambakkam", position: { lat: 13.0569, lng: 80.2425 } },
  { id: "19", name: "Kilpauk", position: { lat: 13.0800, lng: 80.2400 } },
  { id: "20", name: "Porur", position: { lat: 13.0358, lng: 80.1564 } },
  { id: "21", name: "Chromepet", position: { lat: 12.9516, lng: 80.1462 } },
  { id: "22", name: "Pallavaram", position: { lat: 12.9675, lng: 80.1491 } },
  { id: "23", name: "Washermenpet", position: { lat: 13.1167, lng: 80.2833 } },
  { id: "24", name: "Triplicane", position: { lat: 13.0569, lng: 80.2775 } },
  { id: "25", name: "Aminjikarai", position: { lat: 13.0700, lng: 80.2200 } },
];

// Static bus data for Chennai routes (no movement)
const staticBuses = [
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

interface BusTrackingMapProps {
  fromLocation?: string;
  toLocation?: string;
}

const BusTrackingMap = ({ fromLocation, toLocation }: BusTrackingMapProps) => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);

  // Create OpenStreetMap embed URL
  const getMapUrl = () => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${CHENNAI_CENTER.lng - 0.15},${CHENNAI_CENTER.lat - 0.08},${CHENNAI_CENTER.lng + 0.15},${CHENNAI_CENTER.lat + 0.08}&layer=mapnik&marker=${CHENNAI_CENTER.lat},${CHENNAI_CENTER.lng}`;
  };

  // Calculate position on map
  const getMapPosition = (lat: number, lng: number) => {
    const xPercent = ((lng - (CHENNAI_CENTER.lng - 0.15)) / 0.3) * 100;
    const yPercent = ((CHENNAI_CENTER.lat + 0.08 - lat) / 0.16) * 100;
    return {
      left: `${Math.max(2, Math.min(98, xPercent))}%`,
      top: `${Math.max(2, Math.min(98, yPercent))}%`,
    };
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
          {fromLocation && toLocation ? (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Showing routes from <span className="font-semibold text-primary">{fromLocation}</span> to{" "}
              <span className="font-semibold text-accent">{toLocation}</span>
            </p>
          ) : (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See where your bus is right now. Get accurate ETAs and live updates for all Chennai MTC buses.
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Bus List */}
          <div className="lg:col-span-1 space-y-3 order-2 lg:order-1">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Bus className="w-5 h-5 text-primary" />
              Available Buses
            </h3>
            {staticBuses.map((bus) => (
              <Card
                key={bus.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  selectedBus === bus.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedBus(bus.id);
                  setSelectedStop(null);
                }}
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
                  
                  {/* Bus Stop Markers */}
                  <div className="absolute inset-0 pointer-events-none">
                    {chennaiBusStops.map((stop) => {
                      const pos = getMapPosition(stop.position.lat, stop.position.lng);
                      return (
                        <div
                          key={stop.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                          style={pos}
                          onClick={() => {
                            setSelectedStop(stop.id);
                            setSelectedBus(null);
                          }}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center bg-primary/80 border-2 border-white shadow-md transition-transform hover:scale-110 ${
                              selectedStop === stop.id ? "scale-125 ring-2 ring-primary ring-offset-2" : ""
                            }`}
                          >
                            <Bus className="w-3 h-3 text-primary-foreground" />
                          </div>
                          {/* Stop name tooltip */}
                          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-background rounded px-2 py-1 text-xs font-medium shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                            {stop.name}
                          </div>
                          {selectedStop === stop.id && (
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-background rounded-lg shadow-xl p-3 min-w-[140px] z-20 border">
                              <p className="font-bold text-sm">{stop.name}</p>
                              <p className="text-xs text-muted-foreground">Bus Stop</p>
                              <p className="text-xs text-primary mt-1">Click to see routes</p>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Static Bus Markers */}
                    {staticBuses.map((bus) => {
                      const pos = getMapPosition(bus.position.lat, bus.position.lng);
                      return (
                        <div
                          key={bus.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                          style={pos}
                          onClick={() => {
                            setSelectedBus(bus.id);
                            setSelectedStop(null);
                          }}
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
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-medium">{staticBuses.length} buses • {chennaiBusStops.length} stops</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 right-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary/80"></div>
                      <span>Bus Stop</span>
                    </div>
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
