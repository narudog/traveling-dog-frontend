"use client";

import { LocationInfo } from "@/types/map";
import { AdvancedMarker, APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState, useMemo } from "react";
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

interface ItineraryLocation {
    locations: LocationInfo[];
    color: string;
    dayNumber: number;
}

export default function PolylineMap({ locationNames, allItineraryLocations, selectedDayNumber }: { locationNames?: string[] | LocationInfo[]; allItineraryLocations?: ItineraryLocation[]; selectedDayNumber?: number }) {
    const [positions, setPositions] = useState<Array<{ lat: number; lng: number; name: string }>>([]);
    const [allPositions, setAllPositions] = useState<Array<{ lat: number; lng: number; name: string }>>([]);

    // 모든 위치의 중심점 계산
    const defaultPosition = calculateCenter(allPositions.length > 0 ? allPositions : positions);

    // 렌더링 순서를 조정하여 하이라이트된 항목이 마지막에 렌더링되도록 정렬
    const sortedItineraries = useMemo(() => {
        if (!allItineraryLocations) return [];

        // 선택된 itinerary와 나머지를 분리하여 선택된 것이 마지막에 렌더링되도록 정렬
        return [...allItineraryLocations].sort((a, b) => {
            if (a.dayNumber === selectedDayNumber) return 1; // 선택된 것은 마지막으로
            if (b.dayNumber === selectedDayNumber) return -1; // 선택된 것은 마지막으로
            return a.dayNumber - b.dayNumber; // 나머지는 일반 순서대로
        });
    }, [allItineraryLocations, selectedDayNumber]);

    useEffect(() => {
        // 모든 위치를 하나의 배열로 합치기 (지도 중심 계산용)
        if (allItineraryLocations && allItineraryLocations.length > 0) {
            const allPositionsArray: Array<{ lat: number; lng: number; name: string }> = [];
            // 나중에 LocationProcessor에서 설정한 positions를 모으는 함수
            const collectPositions = (positions: Array<{ lat: number; lng: number; name: string }>) => {
                if (positions.length > 0) {
                    allPositionsArray.push(...positions);
                    setAllPositions(allPositionsArray);
                }
            };
        }
    }, [allItineraryLocations]);

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
            <Map
                key={JSON.stringify(defaultPosition)} // 👉 여기가 포인트!
                defaultCenter={defaultPosition}
                defaultZoom={13}
                mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
                style={{ width: "100%", height: "100%" }}
                mapTypeControl={false}
                zoomControl={true}
                fullscreenControl={false}
                streetViewControl={false}
            >
                {/* 다중 일정 표시 모드 - 정렬된 순서대로 렌더링 (선택된 것이 마지막에) */}
                {sortedItineraries.map((itinerary, index) => (
                    <LocationProcessor
                        key={`itinerary-${itinerary.dayNumber}`}
                        locations={itinerary.locations}
                        onPositionsChange={(positions) => {
                            // 해당 일차가 선택되었을 때만 지도 중심 이동
                            if (selectedDayNumber === itinerary.dayNumber) {
                                setPositions(positions);
                            }

                            // 모든 위치 수집 (지도 경계 계산용)
                            if (allPositions.length === 0) {
                                setAllPositions((prev) => [...prev, ...positions]);
                            }
                        }}
                        color={itinerary.color}
                        dayNumber={itinerary.dayNumber}
                        isHighlighted={selectedDayNumber === itinerary.dayNumber}
                    />
                ))}

                {/* 단일 위치 표시 모드 (기존 호환성 유지) */}
                {locationNames && <LocationProcessor locations={locationNames} onPositionsChange={setPositions} color="#E91E63" dayNumber={1} isHighlighted={true} />}
            </Map>
        </APIProvider>
    );
}
