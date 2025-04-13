// 위치 정보 타입
export interface LocationInfo {
    coords?: { lat: number; lng: number };
    name: string;
    region?: string; // 지역 정보 추가 (도시, 국가 등)
}
