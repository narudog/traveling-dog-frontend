import { LocationInfo } from "@/types/map";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import RoadDirections from "./RoadDirections";

// 위치 정보 처리 내부 컴포넌트
function LocationProcessor({ locations, onPositionsChange, color = "#E91E63", dayNumber = 1, isHighlighted = true }: { locations: string[] | LocationInfo[]; onPositionsChange: (positions: Array<{ lat: number; lng: number; name: string }>) => void; color?: string; dayNumber?: number; isHighlighted?: boolean }) {
    const map = useMap();
    const placesLibrary = useMapsLibrary("places");

    const [positions, setPositions] = useState<Array<{ lat: number; lng: number; name: string }>>([]);

    // 문자열 배열인지 객체 배열인지 확인
    const isStringArray = locations.length > 0 && typeof locations[0] === "string";

    useEffect(() => {
        if (!placesLibrary || !map) return;

        const processLocations = async () => {
            if (isStringArray) {
                // 문자열 위치 이름 배열 처리
                const stringLocations = locations as string[];
                const results: Array<{ lat: number; lng: number; name: string }> = [];

                for (const name of stringLocations) {
                    try {
                        // 이름과 지역 분리 (형식: "이름, 지역")
                        const parts = name.split(",");
                        const placeName = parts[0].trim();
                        const regionName = parts.length > 1 ? parts[1].trim() : "";

                        const queryString = regionName ? `${placeName} ${regionName}` : placeName;

                        // 새로운 Place API를 사용
                        const { places } = await placesLibrary.Place.searchByText({
                            textQuery: queryString,
                            fields: ["displayName", "location"],
                        });

                        if (places && places.length > 0) {
                            const place = places[0];
                            if (place.location) {
                                results.push({
                                    lat: place.location.lat(),
                                    lng: place.location.lng(),
                                    name: place.displayName || name,
                                });

                                if (results.length === stringLocations.length) {
                                    setPositions(results);
                                }
                            }
                        }
                    } catch (error) {
                        console.error("장소 검색 오류:", error);
                    }
                }
            } else {
                // LocationInfo 객체 배열 처리
                const locInfoArray = locations as LocationInfo[];
                const results: Array<{ lat: number; lng: number; name: string }> = [];

                for (const loc of locInfoArray) {
                    if (loc.coords) {
                        // 이미 좌표가 있는 경우
                        results.push({
                            lat: loc.coords.lat,
                            lng: loc.coords.lng,
                            name: loc.name,
                        });
                    } else {
                        try {
                            // 좌표가 없고 이름만 있는 경우
                            const queryString = loc.region ? `${loc.name} ${loc.region}` : loc.name;

                            // 새로운 Place API를 사용
                            const { places } = await placesLibrary.Place.searchByText({
                                textQuery: queryString,
                                fields: ["displayName", "location"],
                            });

                            if (places && places.length > 0) {
                                const place = places[0];
                                if (place.location) {
                                    results.push({
                                        lat: place.location.lat(),
                                        lng: place.location.lng(),
                                        name: place.displayName || loc.name,
                                    });
                                }
                            }
                        } catch (error) {
                            console.error("장소 검색 오류:", error);
                        }
                    }
                }

                if (results.length > 0) {
                    setPositions(results);
                }
            }
        };

        processLocations();
    }, [placesLibrary, map, locations, isStringArray]);

    useEffect(() => {
        if (positions.length > 0) {
            onPositionsChange(positions);
        }
    }, [positions]);

    return (
        <>
            {positions.map((position, index) => (
                <AdvancedMarker key={index} position={position}>
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                background: color,
                                color: "white",
                                padding: "5px 10px",
                                borderRadius: "50%",
                                fontWeight: "bold",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                                width: "25px",
                                height: "25px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: isHighlighted ? 1 : 0.3,
                                fontSize: "1rem",
                            }}
                        >
                            {index + 1}
                        </div>
                        <div
                            style={{
                                width: "0",
                                height: "0",
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderTop: `12px solid ${color}`,
                                marginTop: "-4px",
                                opacity: isHighlighted ? 1 : 0.3,
                            }}
                        />
                    </div>
                </AdvancedMarker>
            ))}

            {positions.length > 1 && <RoadDirections positions={positions} color={color} isHighlighted={isHighlighted} />}
        </>
    );
}

export default LocationProcessor;
