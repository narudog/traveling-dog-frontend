// 위치에 맞게 지도 뷰를 조정하는 함수
export function fitMapToPositions(map: google.maps.Map | null, positions: Array<{ lat: number; lng: number } | { lat: number; lng: number; name: string }>) {
    if (!map || positions.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    // 모든 위치를 포함하는 경계 설정
    positions.forEach((pos) => {
        bounds.extend(new google.maps.LatLng(pos.lat, pos.lng));
    });

    // 지도 뷰를 경계에 맞게 조정
    map.fitBounds(bounds);

    // 위치가 한 개인 경우 적절한 줌 레벨 설정
    if (positions.length === 1) {
        map.setZoom(13); // 한 위치만 있을 경우 도시 수준의 줌 레벨
    } else {
        // 줌 레벨이 너무 가깝거나 멀면 조정
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 16) {
            map.setZoom(16);
        } else if (currentZoom && currentZoom < 4) {
            map.setZoom(4);
        }
    }
}

// 중심 좌표 계산 함수
export const calculateCenter = (positions: Array<{ lat: number; lng: number; name: string }>): { lat: number; lng: number } => {
    if (positions.length === 0) {
        return { lat: 36.5, lng: 127.8 }; // 기본값: 한국 중심 좌표
    }

    const totalLat = positions.reduce((sum, pos) => sum + pos.lat, 0);
    const totalLng = positions.reduce((sum, pos) => sum + pos.lng, 0);

    return {
        lat: totalLat / positions.length,
        lng: totalLng / positions.length,
    };
};
