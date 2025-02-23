"use client";

import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function PolylineMap() {
    // 연결할 좌표 배열 (위도, 경도)
    const positions: [number, number][] = [
        [37.5665, 126.978], // 서울
        [35.1796, 129.0756], // 부산
        [35.8714, 128.6014], // 대구
    ];

    return (
        <MapContainer center={positions[0]} zoom={7} style={{ height: "400px", width: "600px" }} data-testid="leaflet-map-container">
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={positions} color="blue" />
        </MapContainer>
    );
}
