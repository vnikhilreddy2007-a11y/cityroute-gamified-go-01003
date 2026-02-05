import { useState, useEffect, useMemo } from "react";
import { Bus, MapPin, Clock, Users, Navigation, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Chennai center coordinates and bounds
const MAP_BOUNDS = {
  minLat: 12.85,
  maxLat: 13.20,
  minLng: 80.05,
  maxLng: 80.35,
};

// Real Chennai bus stops with coordinates
const chennaiBusStops: BusStop[] = [
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
  { id: "12", name: "Tambaram", position: { lat: 12.9249, lng: 80.1270 } },
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
  { id: "26", name: "Koyambedu", position: { lat: 13.0700, lng: 80.1950 } },
  { id: "27", name: "Thirumangalam", position: { lat: 13.0950, lng: 80.2050 } },
  { id: "28", name: "Alandur", position: { lat: 13.0020, lng: 80.2030 } },
  { id: "29", name: "Teynampet", position: { lat: 13.0450, lng: 80.2520 } },
  { id: "30", name: "Thousand Lights", position: { lat: 13.0600, lng: 80.2550 } },
];

interface Position {
  lat: number;
  lng: number;
}

interface BusStop {
  id: string;
  name: string;
  position: Position;
}

interface BusRoute {
  id: string;
  route: string;
  routeStops: string[]; // Stop names this bus visits
  destination: string;
  eta: string;
  occupancy: number;
  speed: number;
  color: string;
  status: string;
}

// Define bus routes with their stop sequences
const busRoutes: BusRoute[] = [
  {
    id: "M70",
    route: "M70",
    routeStops: ["T. Nagar", "Kodambakkam", "Nungambakkam", "Egmore", "Central", "Broadway"],
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
    routeStops: ["Adyar", "Mylapore", "Triplicane", "Royapettah", "Central"],
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
    routeStops: ["Vadapalani", "Kodambakkam", "T. Nagar", "Saidapet", "Guindy"],
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
    routeStops: ["Perambur", "Kilpauk", "Aminjikarai", "Anna Nagar", "Koyambedu", "CMBT"],
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
    routeStops: ["Saidapet", "Ashok Nagar", "Vadapalani", "Koyambedu", "CMBT"],
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
    routeStops: ["Broadway", "Central", "Egmore", "Kilpauk", "Anna Nagar", "Thirumangalam"],
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
    routeStops: ["Velachery", "Alandur", "Guindy", "Saidapet", "T. Nagar"],
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
    routeStops: ["Tambaram", "Chromepet", "Pallavaram", "Alandur", "Guindy", "Saidapet"],
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
    routeStops: ["Washermenpet", "Perambur", "Kilpauk", "Nungambakkam", "Teynampet", "Mylapore"],
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
    routeStops: ["Porur", "Koyambedu", "Anna Nagar", "Aminjikarai", "Kilpauk", "Central"],
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
    routeStops: ["Guindy", "Alandur", "Velachery", "Pallavaram", "Chromepet", "Tambaram"],
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
    routeStops: ["Central", "Broadway", "Washermenpet", "Perambur", "Thirumangalam"],
    destination: "Central → Thirumangalam",
    eta: "14 min",
    occupancy: 40,
    speed: 35,
    color: "#10B981",
    status: "On Time",
  },
];

// Get position of a stop by name
const getStopPosition = (stopName: string): Position | null => {
  const stop = chennaiBusStops.find(s => s.name === stopName);
  return stop?.position || null;
};

// Get route path as array of positions
const getRoutePath = (routeStops: string[]): Position[] => {
  return routeStops
    .map(name => getStopPosition(name))
    .filter((pos): pos is Position => pos !== null);
};

// Interpolate position along a route
const interpolatePosition = (path: Position[], progress: number): Position => {
  if (path.length < 2) return path[0] || { lat: 13.0827, lng: 80.2707 };
  
  const totalSegments = path.length - 1;
  const segmentProgress = progress * totalSegments;
  const currentSegment = Math.min(Math.floor(segmentProgress), totalSegments - 1);
  const segmentT = segmentProgress - currentSegment;
  
  const start = path[currentSegment];
  const end = path[currentSegment + 1];
  
  return {
    lat: start.lat + (end.lat - start.lat) * segmentT,
    lng: start.lng + (end.lng - start.lng) * segmentT,
  };
};

interface BusTrackingMapProps {
  fromLocation?: string;
  toLocation?: string;
}

const BusTrackingMap = ({ fromLocation, toLocation }: BusTrackingMapProps) => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [busProgress, setBusProgress] = useState<Record<string, number>>({});

  // Initialize bus progress
  useEffect(() => {
    const initial: Record<string, number> = {};
    busRoutes.forEach((bus, index) => {
      initial[bus.id] = (index * 0.15) % 1; // Stagger initial positions
    });
    setBusProgress(initial);
  }, []);

  // Animate buses along their routes
  useEffect(() => {
    const interval = setInterval(() => {
      setBusProgress(prev => {
        const next: Record<string, number> = {};
        busRoutes.forEach(bus => {
          const currentProgress = prev[bus.id] || 0;
          // Different speeds for different buses
          const speedFactor = bus.speed / 100;
          next[bus.id] = (currentProgress + speedFactor * 0.01) % 1;
        });
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Get current bus positions
  const busPositions = useMemo(() => {
    const positions: Record<string, Position> = {};
    busRoutes.forEach(bus => {
      const path = getRoutePath(bus.routeStops);
      if (path.length > 0) {
        positions[bus.id] = interpolatePosition(path, busProgress[bus.id] || 0);
      }
    });
    return positions;
  }, [busProgress]);

  // Find highlighted route between from and to locations
  const highlightedPath = useMemo(() => {
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
  }, [fromLocation, toLocation]);

  // Calculate pixel position from lat/lng
  const getPixelPosition = (lat: number, lng: number, containerWidth: number, containerHeight: number) => {
    const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * containerWidth;
    const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * containerHeight;
    return { x, y };
  };

  // Create SVG path for route
  const createRouteSVG = (path: Position[], containerWidth: number, containerHeight: number) => {
    if (path.length < 2) return "";
    
    const points = path.map(pos => {
      const pixel = getPixelPosition(pos.lat, pos.lng, containerWidth, containerHeight);
      return `${pixel.x},${pixel.y}`;
    });
    
    return `M ${points.join(" L ")}`;
  };

  const containerWidth = 1000;
  const containerHeight = 600;

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
          <div className="lg:col-span-1 space-y-3 order-2 lg:order-1 max-h-[600px] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 sticky top-0 bg-muted/30 py-2">
              <Bus className="w-5 h-5 text-primary" />
              Available Buses ({busRoutes.length})
            </h3>
            {busRoutes.map((bus) => (
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
              <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-900">
                {/* SVG Map */}
                <svg
                  viewBox={`0 0 ${containerWidth} ${containerHeight}`}
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Background grid */}
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted/20" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Bus route lines */}
                  {busRoutes.map(bus => {
                    const path = getRoutePath(bus.routeStops);
                    const pathD = createRouteSVG(path, containerWidth, containerHeight);
                    const isSelected = selectedBus === bus.id;
                    
                    return (
                      <path
                        key={`route-${bus.id}`}
                        d={pathD}
                        fill="none"
                        stroke={isSelected ? bus.color : "#94a3b8"}
                        strokeWidth={isSelected ? 4 : 2}
                        strokeOpacity={isSelected ? 0.8 : 0.3}
                        strokeDasharray={isSelected ? "none" : "8 4"}
                        className="transition-all duration-300"
                      />
                    );
                  })}

                  {/* Highlighted route between from/to */}
                  {highlightedPath && (
                    <path
                      d={createRouteSVG(highlightedPath, containerWidth, containerHeight)}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="6"
                      strokeOpacity="0.8"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Bus stops */}
                  {chennaiBusStops.map(stop => {
                    const pos = getPixelPosition(stop.position.lat, stop.position.lng, containerWidth, containerHeight);
                    const isHighlighted = 
                      (fromLocation && stop.name.toLowerCase().includes(fromLocation.toLowerCase())) ||
                      (toLocation && stop.name.toLowerCase().includes(toLocation.toLowerCase()));
                    const isSelected = selectedStop === stop.id;
                    
                    return (
                      <g 
                        key={stop.id}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedStop(stop.id);
                          setSelectedBus(null);
                        }}
                      >
                        {/* Stop marker */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isHighlighted ? 12 : isSelected ? 10 : 8}
                          fill={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
                          stroke="white"
                          strokeWidth="2"
                          className="transition-all duration-200"
                        />
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={4}
                          fill="white"
                        />
                        
                        {/* Stop name label */}
                        <text
                          x={pos.x}
                          y={pos.y - 14}
                          textAnchor="middle"
                          className="text-[10px] font-medium fill-foreground pointer-events-none"
                        >
                          {stop.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* Moving buses */}
                  {busRoutes.map(bus => {
                    const position = busPositions[bus.id];
                    if (!position) return null;
                    
                    const pos = getPixelPosition(position.lat, position.lng, containerWidth, containerHeight);
                    const isSelected = selectedBus === bus.id;
                    
                    return (
                      <g
                        key={`bus-${bus.id}`}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedBus(bus.id);
                          setSelectedStop(null);
                        }}
                      >
                        {/* Bus marker */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? 18 : 14}
                          fill={bus.color}
                          stroke="white"
                          strokeWidth="3"
                          className="transition-all duration-200"
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 4}
                          textAnchor="middle"
                          className="text-[8px] font-bold fill-white pointer-events-none"
                        >
                          {bus.route}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Selected bus info popup */}
                {selectedBus && (
                  <div className="absolute bottom-4 left-4 bg-background rounded-lg shadow-xl p-4 min-w-[200px] z-20 border">
                    {(() => {
                      const bus = busRoutes.find(b => b.id === selectedBus);
                      if (!bus) return null;
                      return (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                              style={{ backgroundColor: bus.color }}
                            >
                              {bus.route}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{bus.destination}</p>
                              <Badge variant={bus.status === "On Time" ? "default" : "secondary"} className="text-xs">
                                {bus.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>ETA: {bus.eta}</p>
                            <p>Occupancy: {bus.occupancy}%</p>
                            <p>Stops: {bus.routeStops.join(" → ")}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Selected stop info popup */}
                {selectedStop && (
                  <div className="absolute bottom-4 left-4 bg-background rounded-lg shadow-xl p-4 min-w-[180px] z-20 border">
                    {(() => {
                      const stop = chennaiBusStops.find(s => s.id === selectedStop);
                      if (!stop) return null;
                      const servingBuses = busRoutes.filter(b => b.routeStops.includes(stop.name));
                      return (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <Circle className="w-4 h-4 text-primary" />
                            <p className="font-bold text-sm">{stop.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {servingBuses.length} buses serve this stop
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {servingBuses.map(bus => (
                              <Badge 
                                key={bus.id} 
                                variant="outline" 
                                className="text-xs cursor-pointer"
                                onClick={() => setSelectedBus(bus.id)}
                              >
                                {bus.route}
                              </Badge>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Map overlay info */}
                <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-medium">{busRoutes.length} buses • {chennaiBusStops.length} stops</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary border-2 border-white"></div>
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
