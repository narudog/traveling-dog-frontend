import { LocationInfo } from "@/types/map";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import RoadDirections from "./RoadDirections";
import { PlaceWithRating } from "@/types/plan";

// 위치 정보 처리 내부 컴포넌트
function LocationProcessor({
    locations,
    onPositionsChange,
    onPlaceDetailsChange, // 평점 정보를 포함한 장소 상세 정보를 전달하는 콜백
    color = "#E91E63",
    dayNumber = 1,
    isHighlighted = true,
    activityIds = [], // 액티비티 ID를 전달받는 옵션 추가
}: {
    locations: string[] | LocationInfo[];
    onPositionsChange: (positions: Array<{ lat: number; lng: number; name: string }>) => void;
    onPlaceDetailsChange?: (places: PlaceWithRating[]) => void;
    color?: string;
    dayNumber?: number;
    isHighlighted?: boolean;
    activityIds?: number[];
}) {
    const map = useMap();
    const placesLibrary = useMapsLibrary("places");

    const [positions, setPositions] = useState<Array<{ lat: number; lng: number; name: string }>>([]);
    const [placesWithRatings, setPlacesWithRatings] = useState<PlaceWithRating[]>([]);

    // 문자열 배열인지 객체 배열인지 확인
    const isStringArray = locations.length > 0 && typeof locations[0] === "string";

    useEffect(() => {
        if (!placesLibrary || !map) return;

        const processLocations = async () => {
            if (isStringArray) {
                // 문자열 위치 이름 배열 처리
                const stringLocations = locations as string[];
                const results: Array<{ lat: number; lng: number; name: string }> = [];
                const placeResults: PlaceWithRating[] = [];

                for (let i = 0; i < stringLocations.length; i++) {
                    const name = stringLocations[i];
                    try {
                        // 이름과 지역 분리 (형식: "이름, 지역")
                        const parts = name.split(",");
                        const placeName = parts[0].trim();
                        const regionName = parts.length > 1 ? parts[1].trim() : "";

                        const queryString = regionName ? `${placeName} ${regionName}` : placeName;

                        // 새로운 Place API를 사용
                        const { places } = await placesLibrary.Place.searchByText({
                            textQuery: queryString,
                            fields: ["displayName", "location", "photos", "rating", "userRatingCount", "id", "reviews"],
                        });

                        if (places && places.length > 0) {
                            const place = places[0];
                            if (place.location) {
                                const locationInfo = {
                                    lat: place.location.lat(),
                                    lng: place.location.lng(),
                                    name: place.displayName || name,
                                };

                                results.push(locationInfo);

                                // 평점 정보를 포함한 장소 데이터 저장
                                placeResults.push({
                                    id: activityIds[i], // 연결된 액티비티 ID가 있다면 저장
                                    name: place.displayName || name,
                                    rating: place.rating !== null ? place.rating : undefined,
                                    totalRatings: place.userRatingCount || undefined,
                                    placeId: place.id,
                                    photos: place.photos || undefined,
                                    reviews: place.reviews || undefined,
                                });

                                if (results.length === stringLocations.length) {
                                    setPositions(results);
                                    setPlacesWithRatings(placeResults);
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
                const placeResults: PlaceWithRating[] = [];

                for (let i = 0; i < locInfoArray.length; i++) {
                    const loc = locInfoArray[i];
                    try {
                        // 좌표가 없고 이름만 있는 경우
                        const queryString = loc.region ? `${loc.name} ${loc.region}` : loc.name;

                        // 새로운 Place API를 사용
                        const { places } = await placesLibrary.Place.searchByText({
                            textQuery: queryString,
                            fields: ["displayName", "location", "photos", "rating", "userRatingCount", "id", "reviews"],
                        });

                        if (places && places.length > 0) {
                            const place = places[0];
                            if (place.location) {
                                const locationInfo = {
                                    lat: place.location.lat(),
                                    lng: place.location.lng(),
                                    name: place.displayName || loc.name,
                                };

                                results.push(locationInfo);

                                // 평점 정보를 포함한 장소 데이터 저장
                                placeResults.push({
                                    id: activityIds[i], // 연결된 액티비티 ID가 있다면 저장
                                    name: place.displayName || loc.name,
                                    rating: place.rating !== null ? place.rating : undefined,
                                    totalRatings: place.userRatingCount || undefined,
                                    placeId: place.id,
                                    photos: place.photos || undefined,
                                    reviews: place.reviews || undefined,
                                });
                            }
                        }
                    } catch (error) {
                        console.error("장소 검색 오류:", error);
                    }
                }

                if (results.length > 0) {
                    setPositions(results);
                    setPlacesWithRatings(placeResults);
                }
            }
        };

        processLocations();
    }, [placesLibrary, map, locations, isStringArray, activityIds]);

    useEffect(() => {
        if (positions.length > 0) {
            onPositionsChange(positions);
        }
    }, [positions]);

    // 평점 정보를 포함한 장소 데이터 상태가 변경되면 콜백으로 전달
    useEffect(() => {
        if (placesWithRatings.length > 0 && onPlaceDetailsChange) {
            onPlaceDetailsChange(placesWithRatings);
        }
    }, [placesWithRatings]);

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
