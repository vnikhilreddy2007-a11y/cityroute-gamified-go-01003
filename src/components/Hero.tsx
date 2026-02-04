import { useState } from "react";
import RouteSearch from "@/components/RouteSearch";
import BusTrackingMap from "@/components/BusTrackingMap";

const Hero = () => {
  const [searchData, setSearchData] = useState<{ from: string; to: string } | null>(null);

  const handleSearch = (from: string, to: string) => {
    setSearchData({ from, to });
    // Scroll to map section
    setTimeout(() => {
      document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <RouteSearch onSearch={handleSearch} />
      <div id="map-section">
        <BusTrackingMap 
          fromLocation={searchData?.from} 
          toLocation={searchData?.to} 
        />
      </div>
    </>
  );
};

export default Hero;
