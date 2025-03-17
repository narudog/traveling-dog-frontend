import Header from "@/components/commons/Header";
import SearchSection from "@/components/landing/SearchSection";
import PolylineMap from "@/components/map/PolylineMap";
import styles from "./page.module.scss";
import { LatLngLiteral } from "leaflet";
const positions: LatLngLiteral[] = [
  { lat: 37.5665, lng: 126.978 }, // 서울
  { lat: 35.1796, lng: 129.0756 }, // 부산
  { lat: 35.8714, lng: 128.6014 }, // 대구
];
export default function Home() {
  return (
    <>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>AI와 함께 만드는 완벽한 여행 계획</h1>
            <p>
              복잡한 여행 계획은 이제 그만! AI가 당신의 여행 스타일에 맞는
              최적의 일정을 무료로 제안해드립니다
            </p>

            {/* Search Section */}
            <SearchSection />
          </div>
          <div className={styles.heroImage}>
            <PolylineMap positions={positions} />
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorks}>
          <h2>이용 방법</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>여행 정보 입력</h3>
              <p>여행지와 일정을 선택하세요</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>AI 일정 생성</h3>
              <p>AI가 최적의 여행 코스를 만들어드립니다</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>일정 커스터마이징</h3>
              <p>제안된 일정을 자유롭게 수정하세요</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
