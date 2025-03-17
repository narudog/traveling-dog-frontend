import { TravelPlan, PlanStatus } from '@/types/plan';
import styles from './page.module.scss';
import { format } from 'date-fns';
import PolylineMap from '@/components/map/PolylineMap';
import { getPlanDetail } from '@/app/actions/planActions';
import { redirect } from 'next/navigation';

interface TravelPlanDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// 임시 데이터 (실제로는 API에서 받아올 예정)
const mockTravelPlan: TravelPlan = {
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
        },
        {
            id: 3,
            placeName: '시부야 타케노코 호텔',
            longitude: 139.7744,
            latitude: 35.6685,
            description: '도쿄에서 가장 비싼 호텔',
            locationOrder: 3,
            createdAt: '2024-03-15',
            updatedAt: '2024-03-15'
        },
        {
            id: 4,
            placeName: '도쿄도 현대 미술관',
            longitude: 139.7666,
            latitude: 35.6814,
            description: '도쿄에서 가장 비싼 미술관',
            locationOrder: 4,
            createdAt: '2024-03-15',
            updatedAt: '2024-03-15'
        }
    ],
    viewCount: 120,
    likeCount: 45,
    status: PlanStatus.PUBLISHED,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
};

const TravelPlanDetailPage = async ({ params }: TravelPlanDetailPageProps) => {
    const { id } = await params;
    try {
        const travelPlan = await getPlanDetail(id);
    } catch (error) {
        // alert('로그인 후 이용해주세요.');
        redirect('/login');
    }

    return (
        <div className={styles.planDetail}>
            <header className={styles.planDetail__header}>
                <div className={styles.planDetail__titleArea}>
                    <h1 className={styles.planDetail__title}>{mockTravelPlan.title}</h1>
                    <span className={styles.planDetail__location}>
                        {mockTravelPlan.country} - {mockTravelPlan.city}
                    </span>
                    <span className={styles.planDetail__date}>
                        {format(new Date(mockTravelPlan.startDate), 'yyyy.MM.dd')} ~ {format(new Date(mockTravelPlan.endDate), 'yyyy.MM.dd')}
                    </span>
                    <div className={styles.planDetail__stats}>
                        <div className={styles.planDetail__statsItem}>
                            <span className={styles.planDetail__statsLabel}>조회수</span>
                            <span className={styles.planDetail__statsValue}>{mockTravelPlan.viewCount}</span>
                        </div>
                        <div className={styles.planDetail__divider}>|</div>
                        <div className={styles.planDetail__statsItem}>
                            <span className={styles.planDetail__statsLabel}>좋아요</span>
                            <span className={styles.planDetail__statsValue}>{mockTravelPlan.likeCount}</span>
                        </div>
                        <div className={styles.planDetail__divider}>|</div>
                        <div className={styles.planDetail__statsItem}>
                            <span className={styles.planDetail__statsLabel}>작성자</span>
                            <span className={styles.planDetail__statsValue}>{mockTravelPlan.nickname}</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className={styles.planDetail__locations}>
                <h2 className={styles.planDetail__sectionTitle}>여행 장소</h2>
                <div className={styles.planDetail__locationList}>
                    {mockTravelPlan.travelLocations.map((location) => (
                        <div key={location.id} className={styles.planDetail__locationItem}>
                            <div className={styles.planDetail__locationHeader}>
                                <h3 className={styles.planDetail__locationName}>
                                    {location.placeName}
                                </h3>
                            </div>
                            <p className={styles.planDetail__locationDesc}>
                                {location.description}
                            </p>
                            <div className={styles.planDetail__locationOrder}>
                                <span>순서: {location.locationOrder}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className={styles.planDetail__map}>
                <PolylineMap positions={mockTravelPlan.travelLocations.map((location) => ({
                    lat: location.latitude,
                    lng: location.longitude
                }))} />
            </section>
        </div>
    );
};

export default TravelPlanDetailPage;


