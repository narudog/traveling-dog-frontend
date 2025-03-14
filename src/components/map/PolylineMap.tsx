"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

// Google Maps 타입 정의
interface LatLngLiteral {
  lat: number;
  lng: number;
}

// 직선 폴리라인 컴포넌트
const StraightPolyline = ({ positions }: { positions: LatLngLiteral[] }) => {
  const map = useMap();
  const mapsLibrary = useMapsLibrary("maps");
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!mapsLibrary || !map || !positions.length) return;

    // 기존 폴리라인 제거
    if (polyline) {
      polyline.setMap(null);
    }

    // 새 폴리라인 생성
    const newPolyline = new mapsLibrary.Polyline({
      path: positions,
      geodesic: true,
      strokeColor: "red", // 직선은 빨간색으로 표시
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });

    // 지도에 폴리라인 추가
    newPolyline.setMap(map);
    setPolyline(newPolyline);

    // 컴포넌트 언마운트 시 폴리라인 제거
    return () => {
      if (newPolyline) {
        newPolyline.setMap(null);
      }
    };
  }, [mapsLibrary, map, positions]);

  return null;
};

// 실제 도로 경로 컴포넌트
const RoadDirections = ({ positions }: { positions: LatLngLiteral[] }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [error, setError] = useState<boolean>(false);

  // 라이브러리 로드
  useEffect(() => {
    if (!routesLibrary || !map) return;

    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map,
        suppressMarkers: true, // 마커는 별도로 표시하므로 숨김
        polylineOptions: {
          strokeColor: "blue",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        },
      })
    );

    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [routesLibrary, map]);

  // 경로 계산 및 표시
  useEffect(() => {
    if (
      !directionsService ||
      !directionsRenderer ||
      !positions ||
      positions.length < 2
    )
      return;

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
      });
  }, [directionsService, directionsRenderer, positions]);

  // 경로 정보 표시 (선택 사항)
  return (
    <>
      {/* 오류 발생 시 직선 폴리라인 표시 */}
      {error && <StraightPolyline positions={positions} />}

      {/* 경로 정보 표시 */}
      {(routeInfo || error) && (
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
          }}
        >
          {error ? (
            <div style={{ color: "red" }}>
              경로를 찾을 수 없습니다. 직선 경로로 표시합니다.
            </div>
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

// 직선 거리 계산 함수 (Haversine 공식)
const calculateDistance = (p1: LatLngLiteral, p2: LatLngLiteral): number => {
  const R = 6371; // 지구 반경 (km)
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function PolylineMap() {
  // 연결할 좌표 배열 (위도, 경도)
  const positions: LatLngLiteral[] = [
    { lat: 37.5665, lng: 126.978 }, // 서울
    { lat: 35.1796, lng: 129.0756 }, // 부산
    { lat: 35.8714, lng: 128.6014 }, // 대구
  ];

  const defaultPosition = { lat: 36.5, lng: 127.8 }; // 한국 중심 좌표로 조정

  // 직선 경로와 도로 경로 전환 상태
  const [showDirectRoute, setShowDirectRoute] = useState(false);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <Map
        defaultCenter={defaultPosition}
        defaultZoom={7}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
        data-testid="google-map-container"
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        {/* 마커 추가 */}
        {positions.map((position, index) => (
          <AdvancedMarker key={index} position={position} />
        ))}

        {/* 경로 표시 (직선 또는 도로) */}
        {showDirectRoute ? (
          <StraightPolyline positions={positions} />
        ) : (
          <RoadDirections positions={positions} />
        )}
      </Map>
    </APIProvider>
  );
}
