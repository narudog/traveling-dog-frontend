import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";
import SearchSection from "@/components/landing/SearchSection";

export default function Home() {
    return (
        <>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <Link href="/">
                        <Image src="/images/logo.png" alt="Logo" width={120} height={40} />
                    </Link>
                </div>
                <div className={styles.authButtons}>
                    <Link href="/login" className={styles.loginButton}>
                        로그인
                    </Link>
                    <Link href="/signup" className={styles.signupButton}>
                        회원가입
                    </Link>
                </div>
            </header>

            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>AI와 함께 만드는 완벽한 여행 계획</h1>
                        <p>복잡한 여행 계획은 이제 그만! AI가 당신의 여행 스타일에 맞는 최적의 일정을 무료로 제안해드립니다</p>

                        {/* Search Section */}
                        <SearchSection />
                    </div>
                    <div className={styles.heroImage}>
                        <Image src="/images/hero-travel.png" alt="Travel Planning" width={600} height={400} priority />
                    </div>
                </section>

                {/* Features Section */}
                <section className={styles.features}>
                    <h2>AI 여행 플래너의 특별한 기능</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}>
                                <i className="fas fa-magic"></i>
                            </div>
                            <h3>맞춤형 여행 추천</h3>
                            <p>선호하는 여행 스타일과 관심사를 반영한 최적의 여행지 추천</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}>
                                <i className="fas fa-route"></i>
                            </div>
                            <h3>스마트 동선 설계</h3>
                            <p>이동 시간과 거리를 고려한 효율적인 일정 수립</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.iconWrapper}>
                                <i className="fas fa-clock"></i>
                            </div>
                            <h3>실시간 업데이트</h3>
                            <p>날씨, 영업시간 등 실시간 정보 반영</p>
                        </div>
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

                {/* CTA Section */}
                <section className={styles.cta}>
                    <h2>지금 바로 여행 계획을 시작해보세요</h2>
                    <p>무료로 제공되는 AI 여행 플래너</p>
                    <Link href="/planner" className={styles.ctaButton}>
                        시작하기
                    </Link>
                </section>
            </main>
        </>
    );
}
