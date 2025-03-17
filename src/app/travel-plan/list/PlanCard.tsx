import { TravelPlan } from "@/types/plan";
import styles from "./PlanCard.module.scss";
import { format } from "date-fns";

const PlanCard = ({ plan }: { plan: TravelPlan }) => {
    return <div key={plan.id} className={styles['plan-card__container']}>
        <h2 className={styles['plan-card__title']}>
            {plan.title}
        </h2>

        <div className={styles['plan-card__location']}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
                <circle cx="12" cy="9" r="2.5" />
            </svg>
            {plan.country} - {plan.city}
        </div>

        <div className={styles['plan-card__date']}>
            {format(new Date(plan.startDate), 'yyyy.MM.dd')} - {format(new Date(plan.endDate), 'yyyy.MM.dd')}
        </div>

        <div className={styles['plan-card__footer']}>
            <div className={styles['plan-card__author']}>
                작성자: {plan.nickname}
            </div>

            <div className={styles['plan-card__stats']}>
                <div className={styles['plan-card__stats-item']}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                    {plan.viewCount}
                </div>
                <div className={styles['plan-card__stats-item']}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {plan.likeCount}
                </div>
            </div>
        </div>
    </div>;
};

export default PlanCard;

