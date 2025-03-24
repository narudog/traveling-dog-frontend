'use client'

import { TravelPlan, PlanStatus } from '@/types/plan';
import styles from './page.module.scss';
import PlanCard from './PlanCard';
import Link from 'next/link';
import { usePlanStore } from '@/store/plan';
import { useEffect } from 'react';

const TravelPlanList = () => {
  const { planList, getPlanList } = usePlanStore();

  useEffect(() => {
    getPlanList();
  }, []);

  return (
    <div className={styles['travel-plan-list']}>
      <h1 className={styles['travel-plan-list__title']}>
        여행 계획 목록
      </h1>

      <div className={styles['travel-plan-list__container']}>
        <div className={styles['travel-plan-list__grid']}>
          {planList.map((plan) => (
            <Link href={`/travel-plan/${plan.id}`} key={plan.id}>
              <PlanCard plan={plan} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelPlanList;

