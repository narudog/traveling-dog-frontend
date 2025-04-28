import Link from "next/link";
import PlanCard from "./PlanCard";
import styles from "./PlanList.module.scss";
import { TravelPlan } from "@/types/plan";

interface PlanListProps {
  planList: TravelPlan[];
}

const PlanList = ({ planList }: PlanListProps) => {
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
