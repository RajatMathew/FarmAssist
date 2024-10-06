import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "../utils/auth";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="24" height="24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

interface Location {
  lat: number;
  lng: number;
}

interface LocationMarkerProps {
  tempLocation: Location;
  setTempLocation: (location: Location) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({
  tempLocation,
  setTempLocation,
}) => {
  const map = useMapEvents({
    click(e) {
      setTempLocation(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return tempLocation ? (
    <Marker position={tempLocation} icon={customIcon} />
  ) : null;
};

export default function ProfileCB({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role?: string;
}) {
  const [open, setOpen] = useState(false);
  const [farmLocation, setFarmLocation] = useState(() => {
    const saved = localStorage.getItem("farmLocation");
    return saved ? JSON.parse(saved) : null;
  });
  const [tempLocation, setTempLocation] = useState(farmLocation);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleSubmit = () => {
    setFarmLocation(tempLocation);
    localStorage.setItem("farmLocation", JSON.stringify(tempLocation));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-slate-800 text-white">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-semibold">{name}</h4>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>

          {role != "admin" && farmLocation && (
            <div>
              <p className="text-sm font-semibold">Farm Location:</p>
              <p className="text-sm">
                Lat: {farmLocation.lat.toFixed(4)}, Lng:{" "}
                {farmLocation.lng.toFixed(4)}
              </p>
            </div>
          )}

          {role != "admin" && (
            <>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="bg-slate-700">My Farm</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="p-4 h-[80vh] flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">
                      Select Your Farm Location
                    </h2>
                    <div className="flex-grow">
                      <MapContainer
                        center={farmLocation || [0, 0]}
                        zoom={3}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker
                          tempLocation={tempLocation}
                          setTempLocation={setTempLocation}
                        />
                      </MapContainer>
                    </div>
                    {tempLocation && (
                      <p className="mt-4">
                        Selected location: {tempLocation.lat.toFixed(4)},{" "}
                        {tempLocation.lng.toFixed(4)}
                      </p>
                    )}
                    <Button onClick={handleSubmit} className="mt-4">
                      Save
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
            </>
          )}
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
