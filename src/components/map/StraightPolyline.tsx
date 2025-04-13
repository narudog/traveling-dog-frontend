import { useEffect } from "react";

import { useMap } from "@vis.gl/react-google-maps";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { LatLngLiteral } from "leaflet";
import { useState } from "react";

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
            strokeWeight: 3,
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

export default StraightPolyline;
