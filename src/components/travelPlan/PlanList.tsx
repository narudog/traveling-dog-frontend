import Link from "next/link";
import PlanCard from "./PlanCard";
import styles from "./PlanList.module.scss";
import { TravelPlan } from "@/types/plan";

interface PlanListProps {
  planList: TravelPlan[];
}

const PlanList = ({ planList }: PlanListProps) => {
  return (
    <div className={styles["travel-plan-list__container"]}>
      <div className={styles["travel-plan-list__grid"]}>
        {planList.map((plan) => (
          <Link href={`/travel-plan/${plan.id}`} key={plan.id}>
            <PlanCard plan={plan} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlanList;
