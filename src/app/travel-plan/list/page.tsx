import { TravelPlan, PlanStatus } from '@/types/plan';
import styles from './page.module.scss';
import PlanCard from './PlanCard';
// 임시 데이터
const mockTravelPlans: TravelPlan[] = [
  {
    id: '1',
    title: '도쿄 여행',
    country: '일본',
    city: '도쿄',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    userId: 'user1',
    nickname: '여행자',
    travelLocations: [],
    viewCount: 120,
    likeCount: 45,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  },
  {
    id: '2',
    title: '제주도 힐링 여행',
    country: '대한민국',
    city: '제주',
    startDate: '2024-05-01',
    endDate: '2024-05-03',
    userId: 'user2',
    nickname: '제주사랑',
    travelLocations: [],
    viewCount: 85,
    likeCount: 32,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-16',
    updatedAt: '2024-03-16'
  },
  {
    id: '3',
    title: '방콕 맛집 투어',
    country: '태국',
    city: '방콕',
    startDate: '2024-06-15',
    endDate: '2024-06-20',
    userId: 'user3',
    nickname: '먹방왕',
    travelLocations: [],
    viewCount: 230,
    likeCount: 89,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-17',
    updatedAt: '2024-03-17'
  },
  {
    id: '4',
    title: '파리 로맨틱 여행',
    country: '프랑스',
    city: '파리',
    startDate: '2024-07-01',
    endDate: '2024-07-07',
    userId: 'user4',
    nickname: '파리지앵',
    travelLocations: [],
    viewCount: 156,
    likeCount: 67,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-18',
    updatedAt: '2024-03-18'
  },
  {
    id: '5',
    title: '뉴욕 브루클린 투어',
    country: '미국',
    city: '뉴욕',
    startDate: '2024-08-15',
    endDate: '2024-08-22',
    userId: 'user5',
    nickname: 'NYC러버',
    travelLocations: [],
    viewCount: 178,
    likeCount: 54,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19'
  },
  {
    id: '6',
    title: '오사카 먹방 여행',
    country: '일본',
    city: '오사카',
    startDate: '2024-09-01',
    endDate: '2024-09-05',
    userId: 'user6',
    nickname: '타코야키',
    travelLocations: [],
    viewCount: 145,
    likeCount: 43,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20'
  },
  {
    id: '7',
    title: '베트남 다낭 휴양',
    country: '베트남',
    city: '다낭',
    startDate: '2024-10-01',
    endDate: '2024-10-06',
    userId: 'user7',
    nickname: '쌀국수',
    travelLocations: [],
    viewCount: 92,
    likeCount: 28,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-21',
    updatedAt: '2024-03-21'
  },
  {
    id: '8',
    title: '싱가포르 도시 여행',
    country: '싱가포르',
    city: '싱가포르',
    startDate: '2024-11-10',
    endDate: '2024-11-15',
    userId: 'user8',
    nickname: '도시탐험가',
    travelLocations: [],
    viewCount: 134,
    likeCount: 47,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-22',
    updatedAt: '2024-03-22'
  }
];

const TravelPlanList = () => {
  return (
    <div className={styles['travel-plan-list']}>
      <h1 className={styles['travel-plan-list__title']}>
        여행 계획 목록
      </h1>

      <div className={styles['travel-plan-list__container']}>
        <div className={styles['travel-plan-list__grid']}>
          {mockTravelPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelPlanList;

