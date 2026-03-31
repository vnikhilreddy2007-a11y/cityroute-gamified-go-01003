import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import { DivIcon } from "leaflet";
import { Bus, MapPin, Clock, Users, Navigation, Crosshair, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";

// VIT Chennai campus location
const VIT_CHENNAI: [number, number] = [12.8406, 80.1534];

// Nearby bus stops within ~5km of VIT Chennai
const nearbyStops = [
  { id: "1", name: "Kelambakkam", position: [12.7878, 80.2194] as [number, number] },
  { id: "2", name: "Vandalur", position: [12.8924, 80.0811] as [number, number] },
  { id: "3", name: "Guduvanchery", position: [12.8444, 80.0617] as [number, number] },
  { id: "4", name: "Potheri", position: [12.8231, 80.0440] as [number, number] },
  { id: "5", name: "Urapakkam", position: [12.8706, 80.0867] as [number, number] },
  { id: "6", name: "Padur", position: [12.8300, 80.2000] as [number, number] },
  { id: "7", name: "OMR Toll", position: [12.8100, 80.2270] as [number, number] },
  { id: "8", name: "Thalambur", position: [12.8050, 80.1950] as [number, number] },
  { id: "9", name: "Karanai", position: [12.8500, 80.1200] as [number, number] },
  { id: "10", name: "Perungalathur", position: [12.9050, 80.0950] as [number, number] },
];

// Bus routes near VIT Chennai (stop ID sequences)
const busRoutes: Record<string, string[]> = {
  "S70": ["3", "4", "5", "2", "10"],
  "M51": ["1", "7", "6", "8"],
  "S60": ["10", "2", "5", "9", "3"],
  "119": ["4", "3", "9", "5", "2"],
  "M55": ["7", "1", "8", "6"],
  "S19": ["2", "10", "5", "9", "3", "4"],
};

const busesData = [
  { id: "S70", route: "S70", destination: "Guduvanchery → Perungalathur", eta: "4 min", occupancy: 55, speed: 30, color: "#10B981", status: "On Time" },
  { id: "M51", route: "M51", destination: "Kelambakkam → Thalambur", eta: "6 min", occupancy: 40, speed: 28, color: "#10B981", status: "On Time" },
  { id: "S60", route: "S60", destination: "Perungalathur → Guduvanchery", eta: "9 min", occupancy: 78, speed: 22, color: "#F59E0B", status: "Slight Delay" },
  { id: "119", route: "119", destination: "Potheri → Vandalur", eta: "3 min", occupancy: 62, speed: 32, color: "#10B981", status: "On Time" },
  { id: "M55", route: "M55", destination: "OMR Toll → Padur", eta: "7 min", occupancy: 85, speed: 20, color: "#EF4444", status: "Crowded" },
  { id: "S19", route: "S19", destination: "Vandalur → Potheri", eta: "5 min", occupancy: 50, speed: 26, color: "#10B981", status: "On Time" },
];

const getRouteWaypoints = (busId: string): [number, number][] => {
  const stopIds = busRoutes[busId];
  if (!stopIds) return [];
  return stopIds.map(id => {
    const stop = nearbyStops.find(s => s.id === id);
    return stop ? stop.position : [0, 0] as [number, number];
  }).filter(p => p[0] !== 0);
};

const interpolateRoute = (waypoints: [number, number][], progress: number): [number, number] => {
  if (waypoints.length < 2) return waypoints[0] || VIT_CHENNAI;
  const totalSegments = waypoints.length - 1;
  const scaledProgress = progress * totalSegments;
  const segIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
  const segProgress = scaledProgress - segIndex;
  const from = waypoints[segIndex];
  const to = waypoints[segIndex + 1];
  return [
    from[0] + (to[0] - from[0]) * segProgress,
    from[1] + (to[1] - from[1]) * segProgress,
  ];
};

const createStopIcon = () => new DivIcon({
  className: "bus-stop-marker",
  html: `<div style="width:18px;height:18px;background:hsl(222,47%,31%);border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const createUserIcon = () => new DivIcon({
  className: "user-marker",
  html: `<div style="width:32px;height:32px;background:hsl(262,83%,58%);border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px hsla(262,83%,58%,0.25),0 3px 10px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const createBusIcon = (route: string, color: string) => new DivIcon({
  className: "bus-marker",
  html: `<div style="width:36px;height:36px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 3px 10px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:10px;">${route}</div>`,
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
  const [busPositions, setBusPositions] = useState<Record<string, [number, number]>>({});
  const progressRef = useRef<Record<string, number>>({});

  useEffect(() => {
    setIsClient(true);
    const initProgress: Record<string, number> = {};
    busesData.forEach(bus => {
      initProgress[bus.id] = Math.random();
    });
    progressRef.current = initProgress;
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const interval = setInterval(() => {
      const newPositions: Record<string, [number, number]> = {};
      busesData.forEach(bus => {
        const waypoints = getRouteWaypoints(bus.id);
        if (waypoints.length < 2) return;
        const speedFactor = bus.speed / 3000;
        progressRef.current[bus.id] = (progressRef.current[bus.id] + speedFactor) % 1;
        newPositions[bus.id] = interpolateRoute(waypoints, progressRef.current[bus.id]);
      });
      setBusPositions(newPositions);
    }, 100);
    return () => clearInterval(interval);
  }, [isClient]);

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
            Live Tracking — VIT Chennai
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Buses Near{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VIT Chennai
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Showing live buses around your location at VIT Chennai, Kelambakkam.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Bus List */}
          <div className="lg:col-span-1 space-y-3 order-2 lg:order-1 max-h-[500px] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 sticky top-0 bg-muted/30 py-2 z-10">
              <Bus className="w-5 h-5 text-primary" />
              Nearby Buses ({busesData.length})
            </h3>
            {busesData.map((bus) => {
              const pos = busPositions[bus.id];
              return (
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
                    {pos && (
                      <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 bg-muted rounded-md">
                        <Crosshair className="w-3 h-3 text-primary shrink-0" />
                        <span className="text-xs font-mono text-muted-foreground">
                          {pos[0].toFixed(4)}°N, {pos[1].toFixed(4)}°E
                        </span>
                      </div>
                    )}
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
              );
            })}
          </div>

          {/* Map */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card className="overflow-hidden shadow-xl">
              <div className="relative h-[500px]">
                <MapContainer
                  center={VIT_CHENNAI}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* User location at VIT Chennai */}
                  <Marker position={VIT_CHENNAI} icon={createUserIcon()}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-bold">📍 You are here</p>
                        <p className="text-xs text-gray-500">VIT Chennai, Kelambakkam</p>
                        <p className="text-xs font-mono mt-1 text-purple-600">
                          {VIT_CHENNAI[0].toFixed(4)}°N, {VIT_CHENNAI[1].toFixed(4)}°E
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Radius circle around user */}
                  <Circle
                    center={VIT_CHENNAI}
                    radius={5000}
                    pathOptions={{
                      color: "hsl(262,83%,58%)",
                      fillColor: "hsl(262,83%,58%)",
                      fillOpacity: 0.06,
                      weight: 2,
                      dashArray: "6 4",
                    }}
                  />

                  {/* Selected bus route */}
                  {selectedBus && (
                    <Polyline
                      positions={getRouteWaypoints(selectedBus)}
                      pathOptions={{ color: "#6366f1", weight: 4, opacity: 0.6, dashArray: "8 6" }}
                    />
                  )}

                  {/* Nearby stops */}
                  {nearbyStops.map((stop) => (
                    <Marker key={stop.id} position={stop.position} icon={createStopIcon()}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold">{stop.name}</p>
                          <p className="text-xs text-gray-500">Bus Stop</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Moving buses */}
                  {busesData.map((bus) => {
                    const pos = busPositions[bus.id];
                    if (!pos) return null;
                    return (
                      <Marker
                        key={bus.id}
                        position={pos}
                        icon={createBusIcon(bus.route, bus.color)}
                        eventHandlers={{ click: () => setSelectedBus(bus.id) }}
                      >
                        <Popup>
                          <div className="min-w-[160px]">
                            <p className="font-bold text-sm">{bus.route}</p>
                            <p className="text-xs text-gray-600">{bus.destination}</p>
                            <p className="text-xs font-mono mt-1 text-blue-600">
                              📍 {pos[0].toFixed(4)}°N, {pos[1].toFixed(4)}°E
                            </p>
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
                    );
                  })}
                </MapContainer>

                {/* Info overlay */}
                <div className="absolute top-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-medium">{busesData.length} buses nearby</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[hsl(262,83%,58%)] border-2 border-white"></div>
                      <span>You (VIT Chennai)</span>
                    </div>
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
