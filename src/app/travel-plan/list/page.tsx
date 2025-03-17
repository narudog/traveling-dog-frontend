

import { TravelPlan, PlanStatus } from '@/types/plan';
import styles from './page.module.scss';
import PlanCard from './PlanCard';
import Link from 'next/link';
// 임시 데이터
const mockTravelPlans: TravelPlan[] = [
  {
    id: 1,
    title: '도쿄 여행',
    country: '일본',
    city: '도쿄',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    userId: 1,
    nickname: '여행자',
    travelLocations: [
      {
        id: 1,
        placeName: '센소지 템플',
        longitude: 139.7966,
        latitude: 35.7147,
        description: '도쿄에서 가장 오래된 사원',
        locationOrder: 1,
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15'
      },
      {
        id: 2,
        placeName: '시부야 스크램블 교차로',
        longitude: 139.7019,
        latitude: 35.6595,
        description: '세계에서 가장 분주한 횡단보도',
        locationOrder: 2,
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15'
      }
    ],
    viewCount: 120,
    likeCount: 45,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  },
  {
    id: 2,
    title: '제주도 힐링 여행',
    country: '대한민국',
    city: '제주',
    startDate: '2024-05-01',
    endDate: '2024-05-03',
    userId: 2,
    nickname: '제주사랑',
    travelLocations: [
      {
        id: 3,
        placeName: '성산일출봉',
        longitude: 126.9424,
        latitude: 33.4587,
        description: '유네스코 세계자연유산',
        locationOrder: 1,
        createdAt: '2024-03-16',
        updatedAt: '2024-03-16'
      },
      {
        id: 4,
        placeName: '월정리 해변',
        longitude: 126.9245,
        latitude: 33.5561,
        description: '에메랄드빛 바다가 아름다운 해변',
        locationOrder: 2,
        createdAt: '2024-03-16',
        updatedAt: '2024-03-16'
      }
    ],
    viewCount: 85,
    likeCount: 32,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-16',
    updatedAt: '2024-03-16'
  },
  {
    id: 3,
    title: '방콕 맛집 투어',
    country: '태국',
    city: '방콕',
    startDate: '2024-06-15',
    endDate: '2024-06-20',
    userId: 3,
    nickname: '먹방왕',
    travelLocations: [
      {
        id: 5,
        placeName: '짜뚜짝 시장',
        longitude: 100.5508,
        latitude: 13.7999,
        description: '태국 최대 규모의 시장, 현지 음식 천국',
        locationOrder: 1,
        createdAt: '2024-03-17',
        updatedAt: '2024-03-17'
      },
      {
        id: 6,
        placeName: '틸럭 로드',
        longitude: 100.5050,
        latitude: 13.7280,
        description: '차이나타운의 유명한 길거리 음식',
        locationOrder: 2,
        createdAt: '2024-03-17',
        updatedAt: '2024-03-17'
      }
    ],
    viewCount: 230,
    likeCount: 89,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-17',
    updatedAt: '2024-03-17'
  },
  {
    id: 4,
    title: '파리 로맨틱 여행',
    country: '프랑스',
    city: '파리',
    startDate: '2024-07-01',
    endDate: '2024-07-07',
    userId: 4,
    nickname: '파리지앵',
    travelLocations: [
      {
        id: 7,
        placeName: '에펠탑',
        longitude: 2.2945,
        latitude: 48.8584,
        description: '파리의 상징적인 랜드마크',
        locationOrder: 1,
        createdAt: '2024-03-18',
        updatedAt: '2024-03-18'
      },
      {
        id: 8,
        placeName: '루브르 박물관',
        longitude: 2.3376,
        latitude: 48.8606,
        description: '세계 최대의 미술관',
        locationOrder: 2,
        createdAt: '2024-03-18',
        updatedAt: '2024-03-18'
      }
    ],
    viewCount: 156,
    likeCount: 67,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-18',
    updatedAt: '2024-03-18'
  },
  {
    id: 5,
    title: '뉴욕 브루클린 투어',
    country: '미국',
    city: '뉴욕',
    startDate: '2024-08-15',
    endDate: '2024-08-22',
    userId: 5,
    nickname: 'NYC러버',
    travelLocations: [
      {
        id: 9,
        placeName: '브루클린 브릿지',
        longitude: -73.9969,
        latitude: 40.7061,
        description: '뉴욕의 상징적인 다리',
        locationOrder: 1,
        createdAt: '2024-03-19',
        updatedAt: '2024-03-19'
      },
      {
        id: 10,
        placeName: 'DUMBO',
        longitude: -73.9877,
        latitude: 40.7033,
        description: '인스타그램 성지, 예술적인 동네',
        locationOrder: 2,
        createdAt: '2024-03-19',
        updatedAt: '2024-03-19'
      }
    ],
    viewCount: 178,
    likeCount: 54,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19'
  },
  {
    id: 6,
    title: '오사카 먹방 여행',
    country: '일본',
    city: '오사카',
    startDate: '2024-09-01',
    endDate: '2024-09-05',
    userId: 6,
    nickname: '타코야키',
    travelLocations: [
      {
        id: 11,
        placeName: '도톤보리',
        longitude: 135.5022,
        latitude: 34.6687,
        description: '오사카의 대표적인 먹거리 거리',
        locationOrder: 1,
        createdAt: '2024-03-20',
        updatedAt: '2024-03-20'
      },
      {
        id: 12,
        placeName: '구로몬 시장',
        longitude: 135.5060,
        latitude: 34.6659,
        description: '신선한 해산물과 현지 식재료의 천국',
        locationOrder: 2,
        createdAt: '2024-03-20',
        updatedAt: '2024-03-20'
      }
    ],
    viewCount: 145,
    likeCount: 43,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20'
  },
  {
    id: 7,
    title: '베트남 다낭 휴양',
    country: '베트남',
    city: '다낭',
    startDate: '2024-10-01',
    endDate: '2024-10-06',
    userId: 7,
    nickname: '쌀국수',
    travelLocations: [
      {
        id: 13,
        placeName: '미케 비치',
        longitude: 108.2452,
        latitude: 16.0544,
        description: '다낭의 아름다운 해변',
        locationOrder: 1,
        createdAt: '2024-03-21',
        updatedAt: '2024-03-21'
      },
      {
        id: 14,
        placeName: '바나 힐',
        longitude: 107.9888,
        latitude: 15.9977,
        description: '프랑스 식민지 시대의 리조트',
        locationOrder: 2,
        createdAt: '2024-03-21',
        updatedAt: '2024-03-21'
      }
    ],
    viewCount: 92,
    likeCount: 28,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-21',
    updatedAt: '2024-03-21'
  },
  {
    id: 8,
    title: '싱가포르 도시 여행',
    country: '싱가포르',
    city: '싱가포르',
    startDate: '2024-11-10',
    endDate: '2024-11-15',
    userId: 8,
    nickname: '도시탐험가',
    travelLocations: [
      {
        id: 15,
        placeName: '가든스 바이 더 베이',
        longitude: 103.8636,
        latitude: 1.2816,
        description: '미래적인 식물원',
        locationOrder: 1,
        createdAt: '2024-03-22',
        updatedAt: '2024-03-22'
      },
      {
        id: 16,
        placeName: '마리나 베이 샌즈',
        longitude: 103.8610,
        latitude: 1.2834,
        description: '상징적인 호텔과 전망대',
        locationOrder: 2,
        createdAt: '2024-03-22',
        updatedAt: '2024-03-22'
      }
    ],
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

