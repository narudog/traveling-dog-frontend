// Mock components for react-leaflet
export const MapContainer = ({ children, ...props }) => (
    <div data-testid="leaflet-map-container" role="region" className="leaflet-container" {...props}>
        {children}
    </div>
);

export const TileLayer = () => null;

export const Polyline = ({ positions }) => (
    <svg>
        <path data-testid="leaflet-polyline" stroke="blue" d={positions.map((pos) => pos.join(",")).join(" ")} />
    </svg>
);

export const Marker = ({ children }) => <div data-testid="leaflet-marker">{children}</div>;

export const Popup = ({ children }) => <div data-testid="leaflet-popup">{children}</div>;
