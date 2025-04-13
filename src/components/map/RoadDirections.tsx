import { useEffect } from "react";

import { useMapsLibrary } from "@vis.gl/react-google-maps";

import { useMap } from "@vis.gl/react-google-maps";
import { LatLngLiteral } from "leaflet";
import { useState } from "react";
import StraightPolyline from "./StraightPolyline";
import { fitMapToPositions } from "@/lib/mapUtils";

// 실제 도로 경로 컴포넌트
const RoadDirections = ({ positions, color = "red", isHighlighted = true }: { positions: LatLngLiteral[]; color?: string; isHighlighted?: boolean }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [routeInfo, setRouteInfo] = useState<{
        distance: string;
        duration: string;
    } | null>(null);
    const [error, setError] = useState<boolean>(false);

    // 라이브러리 로드
    useEffect(() => {
        if (!routesLibrary || !map) return;

        setDirectionsService(new routesLibrary.DirectionsService());

        // 기존 렌더러가 있으면 제거
        if (directionsRenderer) {
            directionsRenderer.setMap(null);
        }

        // 새 렌더러 생성
        const renderer = new routesLibrary.DirectionsRenderer({
            map,
            suppressMarkers: true, // 마커는 별도로 표시하므로 숨김
            polylineOptions: {
                strokeOpacity: 0,
                icons: [
                    {
                        icon: {
                            path: "M 0,-0.5 0,0.5", // 짧은 선 대시 패턴
                            strokeColor: color,
                            strokeOpacity: isHighlighted ? 1 : 0.3,
                            strokeWeight: isHighlighted ? 4 : 1,
                            scale: isHighlighted ? 5 : 3,
                        },
                        offset: "0",
                        repeat: isHighlighted ? "6px" : "10px",
                    },
                ],
            },
        });

        setDirectionsRenderer(renderer);

        return () => {
            if (renderer) {
                renderer.setMap(null);
            }
        };
    }, [routesLibrary, map, color, isHighlighted]);

    // 경로 계산 및 표시
    useEffect(() => {
        if (!directionsService || !directionsRenderer || !positions || positions.length < 2) return;

        const origin = positions[0];
        const destination = positions[positions.length - 1];

        // 중간 경유지 설정
        const waypoints = positions.slice(1, -1).map((point) => ({
            location: { lat: point.lat, lng: point.lng },
            stopover: true,
        }));

        directionsService
            .route({
                origin: { lat: origin.lat, lng: origin.lng },
                destination: { lat: destination.lat, lng: destination.lng },
                waypoints: waypoints,
                travelMode: google.maps.TravelMode.BICYCLING, // 자전거 모드 사용
                optimizeWaypoints: false, // 경유지 순서 최적화 여부
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
                setError(false);

                // 경로 정보 저장
                if (response.routes.length > 0) {
                    const route = response.routes[0];
                    let totalDistance = 0;
                    let totalDuration = 0;

                    route.legs.forEach((leg) => {
                        totalDistance += leg.distance?.value || 0;
                        totalDuration += leg.duration?.value || 0;
                    });

                    setRouteInfo({
                        distance: `${(totalDistance / 1000).toFixed(1)} km`,
                        duration: `${Math.floor(totalDuration / 60)} 분`,
                    });
                }
            })
            .catch((error) => {
                console.error("경로 계산 오류:", error);
                setError(true); // 오류 상태 설정

                // 경로 정보 초기화
                setRouteInfo(null);

                // 렌더러 초기화 (이전 경로가 남아있을 수 있음)
                if (directionsRenderer) {
                    directionsRenderer.setMap(null);
                    directionsRenderer.setMap(map);
                }

                // 오류 시에도 적절한 줌 레벨과 중심점을 계산하여 적용
                // fitMapToPositions(map, positions);
            });
    }, [directionsService, directionsRenderer, positions]);

    // 경로 정보 표시 (선택 사항)
    return (
        <>
            {/* 오류 발생 시 직선 폴리라인 표시 */}
            {error && <StraightPolyline positions={positions} color={color} isHighlighted={isHighlighted} />}

            {/* 경로 정보 표시 - 하이라이트된 경로만 정보 표시 */}
            {isHighlighted && (routeInfo || error) && (
                <div
                    className="route-info"
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        backgroundColor: "white",
                        padding: "8px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        zIndex: 1000,
                        color: color,
                        borderLeft: `4px solid ${color}`,
                    }}
                >
                    {error ? (
                        <div style={{ color: "red" }}>경로를 찾을 수 없습니다. 직선 경로로 표시합니다.</div>
                    ) : (
                        <>
                            <div>총 거리: {routeInfo?.distance}</div>
                            <div>예상 소요 시간: {routeInfo?.duration}</div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default RoadDirections;
