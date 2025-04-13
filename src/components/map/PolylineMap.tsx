"use client";

import { LocationInfo } from "@/types/map";
import { AdvancedMarker, APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import LocationProcessor from "./LocationProcessor";
import { calculateCenter, fitMapToPositions } from "@/lib/mapUtils";

// 🧠 중심 이동 전용 서브 컴포넌트
function MapCenterController({ positions }: { positions: Array<{ lat: number; lng: number; name: string }> }) {
    const map = useMap();

    useEffect(() => {
        if (map && positions.length > 0) {
            fitMapToPositions(map, positions);
        }
    }, [positions, map]);

    return null;
}

export default function PolylineMap({ locationNames }: { locationNames: string[] | LocationInfo[] }) {
    const [positions, setPositions] = useState<Array<{ lat: number; lng: number; name: string }>>([]);

    const defaultPosition = calculateCenter(positions);

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
            <Map
                key={JSON.stringify(defaultPosition)} // 👉 여기가 포인트!
                defaultCenter={defaultPosition}
                defaultZoom={13}
                mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
                style={{ width: "100%", height: "100%" }}
            >
                {/* 중심 자동 이동 제어 */}
                {/* <MapCenterController positions={positions} /> */}

                {/* 경로 표시 (직선 또는 도로) */}
                <LocationProcessor locations={locationNames} onPositionsChange={setPositions} />
            </Map>
        </APIProvider>
    );
}
