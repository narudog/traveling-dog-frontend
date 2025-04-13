import { useEffect } from "react";

import { useMap } from "@vis.gl/react-google-maps";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { LatLngLiteral } from "leaflet";
import { useState } from "react";

// 직선 폴리라인 컴포넌트
const StraightPolyline = ({ positions, color = "red", isHighlighted = true }: { positions: LatLngLiteral[]; color?: string; isHighlighted?: boolean }) => {
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
            strokeOpacity: 0,
            icons: [
                {
                    icon: {
                        path: "M 0,-0.5 0,0.5", // 짧은 선 대시 패턴
                        strokeColor: color,
                        strokeOpacity: isHighlighted ? 1 : 0.4,
                        strokeWeight: isHighlighted ? 3 : 1,
                        scale: 4,
                    },
                    offset: "0",
                    repeat: "8px",
                },
            ],
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
    }, [mapsLibrary, map, positions, color, isHighlighted]);

    return null;
};

export default StraightPolyline;
