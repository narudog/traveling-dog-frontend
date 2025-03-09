// Mock components for react-leaflet
export const MapContainer = ({ children, ...props }) => (
    <div data-testid="leaflet-map-container" role="region" className="leaflet-container" {...props}>
        {children}
    </div>
);

export const TileLayer = ({ url, attribution }) => <div data-testid="leaflet-tile-layer" data-url={url} data-attribution={attribution} />;

export const Polyline = ({ positions, color }) => (
    <svg>
        <path data-testid="leaflet-polyline" stroke={color} d={Array.isArray(positions) ? positions.map((pos) => pos.join(",")).join(" ") : ""} />
    </svg>
);

export const Marker = ({ position, children }) => (
    <div data-testid="leaflet-marker" data-position={position ? position.join(",") : ""}>
        {children}
    </div>
);

export const Popup = ({ children }) => <div data-testid="leaflet-popup">{children}</div>;

// 추가 컴포넌트
export const useMap = jest.fn(() => ({
    setView: jest.fn(),
    fitBounds: jest.fn(),
    getZoom: jest.fn(() => 10),
    getCenter: jest.fn(() => ({ lat: 0, lng: 0 })),
}));

export const useMapEvents = jest.fn((handlers) => {
    // 이벤트 핸들러가 있으면 호출
    if (handlers.click) {
        // 테스트에서 필요한 경우 이벤트를 시뮬레이션할 수 있음
    }
    return {
        getCenter: jest.fn(() => ({ lat: 0, lng: 0 })),
        getZoom: jest.fn(() => 10),
    };
});
