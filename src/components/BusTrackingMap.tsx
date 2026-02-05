import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import { Bus, MapPin, Clock, Users, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";

// Chennai center coordinates
const CHENNAI_CENTER: [number, number] = [13.0827, 80.2707];

// Real Chennai bus stops with coordinates
const chennaiBusStops = [
  { id: "1", name: "CMBT", position: [13.0694, 80.2002] as [number, number] },
  { id: "2", name: "Central", position: [13.0827, 80.2707] as [number, number] },
  { id: "3", name: "Egmore", position: [13.0732, 80.2609] as [number, number] },
  { id: "4", name: "T. Nagar", position: [13.0418, 80.2341] as [number, number] },
  { id: "5", name: "Anna Nagar", position: [13.0850, 80.2101] as [number, number] },
  { id: "6", name: "Adyar", position: [13.0063, 80.2574] as [number, number] },
  { id: "7", name: "Velachery", position: [12.9815, 80.2180] as [number, number] },
  { id: "8", name: "Guindy", position: [13.0067, 80.2206] as [number, number] },
  { id: "9", name: "Vadapalani", position: [13.0520, 80.2121] as [number, number] },
  { id: "10", name: "Broadway", position: [13.0903, 80.2839] as [number, number] },
  { id: "11", name: "Mylapore", position: [13.0339, 80.2676] as [number, number] },
  { id: "12", name: "Tambaram", position: [12.9249, 80.1270] as [number, number] },
  { id: "13", name: "Perambur", position: [13.1167, 80.2333] as [number, number] },
  { id: "14", name: "Royapettah", position: [13.0544, 80.2627] as [number, number] },
  { id: "15", name: "Kodambakkam", position: [13.0521, 80.2255] as [number, number] },
  { id: "16", name: "Saidapet", position: [13.0206, 80.2230] as [number, number] },
  { id: "17", name: "Ashok Nagar", position: [13.0372, 80.2119] as [number, number] },
  { id: "18", name: "Nungambakkam", position: [13.0569, 80.2425] as [number, number] },
  { id: "19", name: "Kilpauk", position: [13.0800, 80.2400] as [number, number] },
  { id: "20", name: "Porur", position: [13.0358, 80.1564] as [number, number] },
  { id: "21", name: "Chromepet", position: [12.9516, 80.1462] as [number, number] },
  { id: "22", name: "Pallavaram", position: [12.9675, 80.1491] as [number, number] },
  { id: "23", name: "Washermenpet", position: [13.1167, 80.2833] as [number, number] },
  { id: "24", name: "Triplicane", position: [13.0569, 80.2775] as [number, number] },
  { id: "25", name: "Aminjikarai", position: [13.0700, 80.2200] as [number, number] },
  { id: "26", name: "Koyambedu", position: [13.0700, 80.1950] as [number, number] },
  { id: "27", name: "Thirumangalam", position: [13.0950, 80.2050] as [number, number] },
  { id: "28", name: "Alandur", position: [13.0020, 80.2030] as [number, number] },
  { id: "29", name: "Teynampet", position: [13.0450, 80.2520] as [number, number] },
  { id: "30", name: "Thousand Lights", position: [13.0600, 80.2550] as [number, number] },
];

// Bus data with static positions
const buses = [
  {
    id: "M70",
    route: "M70",
    position: [13.0550, 80.2450] as [number, number],
    destination: "T. Nagar → Broadway",
    eta: "3 min",
    occupancy: 65,
    speed: 28,
    color: "#10B981",
    status: "On Time",
  },
  {
    id: "21G",
    route: "21G",
    position: [13.0200, 80.2620] as [number, number],
    destination: "Adyar → Central",
    eta: "7 min",
    occupancy: 82,
    speed: 22,
    color: "#F59E0B",
    status: "Slight Delay",
  },
  {
    id: "27C",
    route: "27C",
    position: [13.0400, 80.2200] as [number, number],
    destination: "Vadapalani → Guindy",
    eta: "12 min",
    occupancy: 45,
    speed: 35,
    color: "#10B981",
    status: "On Time",
  },
  {
    id: "29C",
    route: "29C",
    position: [13.0900, 80.2250] as [number, number],
    destination: "Perambur → CMBT",
    eta: "5 min",
    occupancy: 90,
    speed: 18,
    color: "#EF4444",
    status: "Crowded",
  },
  {
    id: "47A",
    route: "47A",
    position: [13.0300, 80.2150] as [number, number],
    destination: "Saidapet → CMBT",
    eta: "9 min",
    occupancy: 55,
    speed: 30,
    color: "#10B981",
    status: "On Time",
  },
  {
    id: "5C",
    route: "5C",
    position: [13.0850, 80.2600] as [number, number],
    destination: "Broadway → Thirumangalam",
    eta: "4 min",
    occupancy: 70,
    speed: 25,
    color: "#10B981",
    status: "On Time",
  },
  {
    id: "11B",
    route: "11B",
    position: [12.9900, 80.2100] as [number, number],
    destination: "Velachery → T. Nagar",
    eta: "8 min",
    occupancy: 60,
    speed: 32,
    color: "#10B981",
    status: "On Time",
  },
  {
    id: "15A",
    route: "15A",
    position: [12.9600, 80.1480] as [number, number],
    destination: "Tambaram → Saidapet",
    eta: "15 min",
    occupancy: 85,
    speed: 20,
    color: "#F59E0B",
    status: "Slight Delay",
  },
  {
    id: "32A",
    route: "32A",
    position: [13.0750, 80.2550] as [number, number],
    destination: "Washermenpet → Mylapore",
    eta: "6 min",
    occupancy: 72,
    speed: 24,
    color: "#10B981",
    status: "On Time",
  },
  {
    id: "45B",
    route: "45B",
    position: [13.0600, 80.1800] as [number, number],
    destination: "Porur → Central",
    eta: "11 min",
    occupancy: 50,
    speed: 28,
    color: "#10B981",
    status: "On Time",
  },
  {
    id: "19M",
    route: "19M",
    position: [12.9700, 80.1800] as [number, number],
    destination: "Guindy → Tambaram",
    eta: "10 min",
    occupancy: 78,
    speed: 26,
    color: "#10B981",
    status: "On Time",
  },
  {
    id: "23C",
    route: "23C",
    position: [13.1000, 80.2700] as [number, number],
    destination: "Central → Thirumangalam",
    eta: "14 min",
    occupancy: 40,
    speed: 35,
    color: "#10B981",
    status: "On Time",
  },
];

// Create bus stop icon
const createStopIcon = () => new DivIcon({
  className: "bus-stop-marker",
  html: `<div style="
    width: 20px;
    height: 20px;
    background: hsl(222, 47%, 31%);
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Create bus icon with route number
const createBusIcon = (route: string, color: string) => new DivIcon({
  className: "bus-marker",
  html: `<div style="
    width: 36px;
    height: 36px;
    background: ${color};
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 3px 10px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 10px;
  ">${route}</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

interface BusTrackingMapProps {
  fromLocation?: string;
  toLocation?: string;
}

const BusTrackingMap = ({ fromLocation, toLocation }: BusTrackingMapProps) => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Find route between from and to locations
  const getRouteLine = (): [number, number][] | null => {
    if (!fromLocation || !toLocation) return null;
    
    const fromStop = chennaiBusStops.find(s => 
      s.name.toLowerCase().includes(fromLocation.toLowerCase()) ||
      fromLocation.toLowerCase().includes(s.name.toLowerCase())
    );
    const toStop = chennaiBusStops.find(s => 
      s.name.toLowerCase().includes(toLocation.toLowerCase()) ||
      toLocation.toLowerCase().includes(s.name.toLowerCase())
    );
    
    if (!fromStop || !toStop) return null;
    
    return [fromStop.position, toStop.position];
  };

  const routeLine = getRouteLine();

  if (!isClient) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="h-[500px] bg-muted rounded-lg animate-pulse flex items-center justify-center">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </section>
    );
  }

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
          <div className="lg:col-span-1 space-y-3 order-2 lg:order-1 max-h-[500px] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 sticky top-0 bg-muted/30 py-2 z-10">
              <Bus className="w-5 h-5 text-primary" />
              Available Buses ({buses.length})
            </h3>
            {buses.map((bus) => (
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
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
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
              <div className="relative h-[500px]">
                <MapContainer
                  center={CHENNAI_CENTER}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Route line between from and to */}
                  {routeLine && (
                    <Polyline
                      positions={routeLine}
                      pathOptions={{
                        color: "hsl(142, 71%, 45%)",
                        weight: 6,
                        opacity: 0.8,
                      }}
                    />
                  )}

                  {/* Bus stops */}
                  {chennaiBusStops.map((stop) => (
                    <Marker
                      key={stop.id}
                      position={stop.position}
                      icon={createStopIcon()}
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold">{stop.name}</p>
                          <p className="text-xs text-gray-500">Bus Stop</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Buses */}
                  {buses.map((bus) => (
                    <Marker
                      key={bus.id}
                      position={bus.position}
                      icon={createBusIcon(bus.route, bus.color)}
                      eventHandlers={{
                        click: () => setSelectedBus(bus.id),
                      }}
                    >
                      <Popup>
                        <div className="min-w-[150px]">
                          <p className="font-bold text-sm">{bus.route}</p>
                          <p className="text-xs text-gray-600">{bus.destination}</p>
                          <div className="flex gap-3 mt-2 text-xs">
                            <span className="text-green-600 font-medium">{bus.eta}</span>
                            <span>{bus.occupancy}% full</span>
                          </div>
                          <Badge 
                            className="mt-2 text-xs"
                            variant={bus.status === "On Time" ? "default" : bus.status === "Crowded" ? "destructive" : "secondary"}
                          >
                            {bus.status}
                          </Badge>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>

                {/* Map overlay info */}
                <div className="absolute top-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-medium">{buses.length} buses • {chennaiBusStops.length} stops</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[hsl(222,47%,31%)] border-2 border-white"></div>
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
