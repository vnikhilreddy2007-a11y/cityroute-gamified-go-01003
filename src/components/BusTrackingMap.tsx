import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bus, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Chennai center coordinates
const CHENNAI_CENTER: [number, number] = [13.0827, 80.2707];

// Sample bus data for Chennai routes
const initialBuses = [
  {
    id: "M70",
    route: "M70",
    position: [13.0674, 80.2376] as [number, number],
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
    position: [13.0524, 80.2508] as [number, number],
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
    position: [13.0892, 80.2219] as [number, number],
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
    position: [13.1103, 80.2849] as [number, number],
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
    position: [13.0401, 80.2327] as [number, number],
    destination: "Saidapet to CMBT",
    eta: "9 min",
    occupancy: 55,
    speed: 30,
    color: "#10B981",
    status: "On Time",
  },
];

// Sample route path for demonstration
const routePath: [number, number][] = [
  [13.0674, 80.2376],
  [13.0650, 80.2450],
  [13.0700, 80.2550],
  [13.0750, 80.2650],
  [13.0827, 80.2707],
];

// Bus stops
const busStops = [
  { name: "T. Nagar Bus Stand", position: [13.0418, 80.2341] as [number, number] },
  { name: "Mambalam", position: [13.0383, 80.2233] as [number, number] },
  { name: "Saidapet", position: [13.0221, 80.2241] as [number, number] },
  { name: "Guindy", position: [13.0067, 80.2206] as [number, number] },
  { name: "Chennai Central", position: [13.0827, 80.2755] as [number, number] },
  { name: "Egmore", position: [13.0732, 80.2609] as [number, number] },
  { name: "Anna Nagar", position: [13.0850, 80.2101] as [number, number] },
  { name: "Koyambedu CMBT", position: [13.0694, 80.1948] as [number, number] },
];

// Custom bus icon creator
const createBusIcon = (color: string) => {
  return L.divIcon({
    className: "custom-bus-icon",
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 6v6"></path>
          <path d="M15 6v6"></path>
          <path d="M2 12h19.6"></path>
          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
          <circle cx="7" cy="18" r="2"></circle>
          <path d="M9 18h5"></path>
          <circle cx="16" cy="18" r="2"></circle>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

// Stop icon
const stopIcon = L.divIcon({
  className: "custom-stop-icon",
  html: `
    <div style="
      background: #22c55e;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const BusTrackingMap = () => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [animatedBuses, setAnimatedBuses] = useState(initialBuses);
  const [isClient, setIsClient] = useState(false);

  // Ensure we only render map on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simulate bus movement
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      setAnimatedBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          position: [
            bus.position[0] + (Math.random() - 0.5) * 0.002,
            bus.position[1] + (Math.random() - 0.5) * 0.002,
          ] as [number, number],
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isClient]);

  // Memoize bus icons
  const busIcons = useMemo(() => {
    const icons: Record<string, L.DivIcon> = {};
    animatedBuses.forEach((bus) => {
      if (!icons[bus.color]) {
        icons[bus.color] = createBusIcon(bus.color);
      }
    });
    return icons;
  }, []);

  if (!isClient) {
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
          </div>
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
                <MapContainer
                  center={CHENNAI_CENTER}
                  zoom={12}
                  style={{ height: "500px", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Route line */}
                  <Polyline
                    positions={routePath}
                    pathOptions={{
                      color: "#22c55e",
                      weight: 4,
                      opacity: 0.7,
                      dashArray: "10, 10",
                    }}
                  />

                  {/* Bus stops */}
                  {busStops.map((stop, index) => (
                    <Marker key={index} position={stop.position} icon={stopIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>{stop.name}</strong>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Buses */}
                  {animatedBuses.map((bus) => (
                    <Marker
                      key={bus.id}
                      position={bus.position}
                      icon={busIcons[bus.color] || createBusIcon(bus.color)}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                              style={{ backgroundColor: bus.color }}
                            >
                              {bus.route}
                            </div>
                            <div>
                              <p className="font-bold">{bus.destination}</p>
                              <p className="text-xs text-muted-foreground">{bus.status}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-center mt-3">
                            <div className="bg-muted rounded p-2">
                              <p className="font-bold text-primary">{bus.eta}</p>
                              <p className="text-muted-foreground">ETA</p>
                            </div>
                            <div className="bg-muted rounded p-2">
                              <p className="font-bold text-primary">{bus.occupancy}%</p>
                              <p className="text-muted-foreground">Full</p>
                            </div>
                            <div className="bg-muted rounded p-2">
                              <p className="font-bold text-primary">{bus.speed}</p>
                              <p className="text-muted-foreground">km/h</p>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>

                {/* Map overlay info */}
                <div className="absolute top-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-medium">{animatedBuses.length} buses active</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        .leaflet-container {
          font-family: inherit;
        }
        .custom-bus-icon > div {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  );
};

export default BusTrackingMap;
