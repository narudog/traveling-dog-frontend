import Link from "next/link";
import PlanCard from "./PlanCard";
import styles from "./PlanList.module.scss";
import { usePlanStore } from "@/store/plan";

const PlanList = () => {
  const { isLoading, planList } = usePlanStore();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* 로딩 중일 때 스켈레톤 카드들 표시 */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonSubtitle}></div>
                <div className={styles.skeletonDescription}></div>
                <div className={styles.skeletonMeta}>
                  <div className={styles.skeletonDate}></div>
                  <div className={styles.skeletonLikes}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {planList.length === 0 ? (
        <div className={styles.empty}>
          <div>여행 계획이 없습니다.</div>
          <Link href="/">
            <button className={styles.button}>여행 계획 만들기</button>
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {planList.map((plan) => (
            <Link href={`/travel-plan/${plan.id}`} key={plan.id}>
              <PlanCard plan={plan} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanList;
