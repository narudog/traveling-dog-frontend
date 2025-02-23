"use client";

import dynamic from "next/dynamic";

const PolylineMap = dynamic(() => import("@/components/map/PolylineMap"), {
    ssr: false,
    loading: () => <div style={{ height: "400px", width: "600px", background: "#f0f0f0" }}>지도를 불러오는 중...</div>,
});

export default function DynamicMap() {
    return <PolylineMap />;
}
