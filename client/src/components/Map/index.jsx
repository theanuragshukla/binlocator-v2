import { MapContainer, TileLayer } from "react-leaflet";
import "./Map.css";
import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import Mark from "./Marker";
import { Box } from "@chakra-ui/react";

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click() {
            map.locate();
        },
        locationfound(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Mark position={position} text="You are here" />
    );
}

const redirectTo = (position) => {
    window.open(
        `http://maps.google.com/?q=${position[0]},${position[1]}`,
        "_blank"
    );
};

const Map = () => {
    const position = [51.505, -0.09];

    return (
        <Box height="100%" width="100%">
            <MapContainer
                center={position}
                zoom={18}
                scrollWheelZoom={false}
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Mark
                    position={position}
                    eventHandlers={{
                        dblclick: () => {
                            redirectTo(position);
                        },
                    }}
                />
                <LocationMarker />
            </MapContainer>
        </Box>
    );
};

export default Map;
