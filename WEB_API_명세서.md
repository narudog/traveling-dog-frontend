# Traveling Dog 웹 API 명세서 (Web Front)

본 문서는 웹 프론트엔드가 구현할 API 명세입니다. `AppAuthController`를 제외한 모든 API를 포함합니다. 인증은 기본적으로 쿠키 기반(JWT)이며, 공개 엔드포인트는 별도 표시합니다.

- 공통 베이스 URL: `/api`
- 인증 방식(웹): JWT가 담긴 `jwt` 쿠키(httponly, secure, SameSite=None)
- 오류 포맷: `ErrorResponse { code: string, message: string, errors?: Record<string,string> }`
- 레이트리밋: 과다 요청 시 429 반환. 추후 `Retry-After` 헤더 추가 가능

---

## 인증 AuthController (웹)

- Base: `/api/auth`
- 공개 엔드포인트 포함

### POST /api/auth/signup

- body: `{ nickname: string, email: string, password: string }`
- response 200: `UserProfileDTO`
- side-effect: `jwt`(액세스), `refresh_token`(리프레시) 쿠키 설정

### POST /api/auth/login

- header: `Authorization: Basic base64(email:password)`
- response 200: `UserProfileDTO` + 위와 동일한 쿠키 설정

### POST /api/auth/refresh

- cookie: `refresh_token`
- response 200: 새 `jwt` 쿠키 설정, body 없음

### POST /api/auth/logout

- response 200: `jwt`, `refresh_token` 쿠키 삭제

---

## 사용자 UserController

- Base: `/api/user` (보호)

### GET /api/user/profile

- response 200: `UserProfileDTO`

---

## 여행 계획 TravelPlanController

- Base: `/api/travel/plan`
- 공개 엔드포인트 포함 표시

### POST /api/travel/plan

- desc: 여행 계획 생성 (보호)
- body: `TravelPlanRequest`
- response 200: `TravelPlanDTO`

### GET /api/travel/plan/list

- desc: 나의 여행 계획 목록 (보호)
- response 200: `TravelPlanDTO[]`

### POST /api/travel/plan/search

- desc: 검색 (보호)
- body: `TravelPlanSearchRequest` (nullable → 기본값 적용)
- response 200: `TravelPlanSearchResponse`

### GET /api/travel/plan/{id}

- desc: 여행 계획 상세 (공개)
- response 200: `TravelPlanDTO`

### PUT /api/travel/plan/{id}

- desc: 여행 계획 수정 (보호)
- body: `TravelPlanUpdateRequest`
- response 200: `TravelPlanDTO`

### DELETE /api/travel/plan/{id}

- desc: 여행 계획 삭제 (보호)
- response 204

### POST /api/travel/plan/{id}/like

- desc: 좋아요 토글 (보호)
- response 200: `boolean` (true 추가, false 취소)

### DELETE /api/travel/plan/{id}/like

- desc: 좋아요 취소 (보호)
- response 204

### GET /api/travel/plan/{id}/like/status

- desc: 좋아요 여부 (보호)
- response 200: `boolean`

### GET /api/travel/plan/like

- desc: 내가 좋아요한 여행 계획 목록 (보호)
- response 200: `TravelPlanDTO[]`

---

## 일정 활동 ItineraryActivityController (보호)

- Base: `/api/itinerary/activities`

### GET /api/itinerary/activities/{id}

- response 200: `ItineraryActivityDTO`

### GET /api/itinerary/activities/itinerary/{id}

- response 200: `ItineraryActivityDTO[]`

### POST /api/itinerary/activities

- body: `ItineraryActivityCreateRequest`
- response 201: `ItineraryActivityDTO`

### PUT /api/itinerary/activities/{id}

- body: `ItineraryActivityUpdateRequest`
- response 200: `ItineraryActivityDTO`

### DELETE /api/itinerary/activities/{id}

- response 204

### PUT /api/itinerary/activities/{id}/move-up

### PUT /api/itinerary/activities/{id}/move-down

### PUT /api/itinerary/activities/{id}/move-to-top

### PUT /api/itinerary/activities/{id}/move-to-bottom

- response 200: `ItineraryActivityDTO`

### PUT /api/itinerary/activities/{id}/move-to-position/{position}

- path: `position: number`
- response 200: `ItineraryActivityDTO`

---

## 오늘의 활동 TodayActivityController

- Base: `/api/today-activity`

### POST /api/today-activity/recommend

- desc: 공개
- body: `TodayActivityRequestDTO`
- response 200: `TodayActivityResponseDTO`

### POST /api/today-activity/save

- desc: 보호
- body: `SaveActivityRequestDTO`
- response 200: `SavedActivityResponseDTO`

### GET /api/today-activity/saved

- desc: 보호
- response 200: `SavedActivityResponseDTO[]`

### GET /api/today-activity/saved/category/{category}

- desc: 보호
- response 200: `SavedActivityResponseDTO[]`

### DELETE /api/today-activity/saved/{activityId}

- desc: 보호
- response 204

### GET /api/today-activity/saved/count

- desc: 보호
- response 200: `number`

### GET /api/today-activity/health

- desc: 보호
- response 200: `string`

---

## 이미지 ImageController (보호)

- Base: `/api/images`

### POST /api/images/upload

- desc: 보호
- multipart/form-data: `file: File` (required), `folder: string` (default `review`)
- response 200: `{ imageUrl: string, message: string }`

### POST /api/images/upload/multiple

- desc: 보호
- multipart/form-data: `files: File[]` (<=5), `folder: string`
- response 200: `{ imageUrls: string[], count: number, message: string }`

### DELETE /api/images/delete

- desc: 보호
- query: `imageUrl: string`
- response 200: `{ message: string }`

### GET /api/images/guide

- desc: 보호
- response 200: `{ maxFileSize: string, allowedFormats: string[], maxFilesPerUpload: number, folders: string[] }`

---

## 후기 TripReviewController

- Base: `/api/reviews`
- 공개 엔드포인트 포함 표시

### POST /api/reviews

- desc: 후기 작성 (보호)
- body: `TripReviewCreateRequest`
- response 201: `TripReviewResponseDTO`

### PUT /api/reviews/{reviewId}

- desc: 후기 수정 (보호)
- body: `TripReviewUpdateRequest`
- response 200: `TripReviewResponseDTO`

### DELETE /api/reviews/{reviewId}

- desc: 후기 삭제 (보호)
- response 204

### GET /api/reviews/{reviewId}

- desc: 후기 상세 (공개)
- response 200: `TripReviewResponseDTO`

### GET /api/reviews/feed

- desc: 공개 피드 (공개)
- query: `sortBy=latest|popular|views` `page` `size`
- response 200: `Page<TripReviewResponseDTO>`

### GET /api/reviews/following

- desc: 팔로잉 피드 (보호)
- query: `page` `size`
- response 200: `Page<TripReviewResponseDTO>`

### GET /api/reviews/user/{userId}

- desc: 사용자별 후기 (보호)
- query: `publicOnly`(default true), `page`, `size`
- response 200: `Page<TripReviewResponseDTO>`

### GET /api/reviews/search

- desc: 키워드 검색 (공개)
- query: `keyword`, `page`, `size`
- response 200: `Page<TripReviewResponseDTO>`

### GET /api/reviews/search/tag

- desc: 태그 검색 (공개)
- query: `tag`, `page`, `size`
- response 200: `Page<TripReviewResponseDTO>`

### GET /api/reviews/search/location

- desc: 지역 검색 (공개)
- query: `location`, `page`, `size`
- response 200: `Page<TripReviewResponseDTO>`

### GET /api/reviews/tags/popular

- desc: 인기 태그 (보호)
- query: `limit`
- response 200: `string[]`

### POST /api/reviews/{reviewId}/like

- desc: 좋아요 (보호)
- response 200

### DELETE /api/reviews/{reviewId}/like

- desc: 좋아요 취소 (보호)
- response 200

### GET /api/reviews/liked

- desc: 내가 좋아요한 후기 (보호)
- query: `page`, `size`
- response 200: `Page<TripReviewResponseDTO>`

---

## 소셜 SocialController

- Base: `/api/social`

### POST /api/social/follow/{userId}

- desc: 팔로우 (보호)
- response 200

### DELETE /api/social/follow/{userId}

- desc: 언팔로우 (보호)
- response 200

### GET /api/social/users/{userId}/followers

- desc: 팔로워 목록 (보호)
- query: `page`, `size`
- response 200: `Page<SocialProfileResponseDTO>`

### GET /api/social/users/{userId}/following

- desc: 팔로잉 목록 (보호)
- query: `page`, `size`
- response 200: `Page<SocialProfileResponseDTO>`

### GET /api/social/users/{userId}/profile

- desc: 소셜 프로필 (보호)
- response 200: `SocialProfileResponseDTO`

### POST /api/social/reviews/{reviewId}/comments

- desc: 댓글 작성 (보호)
- body: `ReviewCommentCreateRequest`
- response 201: `ReviewCommentResponseDTO`

### PUT /api/social/comments/{commentId}

- desc: 댓글 수정 (보호)
- form/query: `content: string`
- response 200: `ReviewCommentResponseDTO`

### DELETE /api/social/comments/{commentId}

- desc: 댓글 삭제 (보호)
- response 204

### GET /api/social/reviews/{reviewId}/comments

- desc: 댓글 목록 (공개)
- query: `page`, `size`
- response 200: `Page<ReviewCommentResponseDTO>`

### GET /api/social/comments/{commentId}/replies

- desc: 대댓글 목록 (공개)
- response 200: `ReviewCommentResponseDTO[]`

### GET /api/social/users/{userId}/follow-status

- desc: 팔로우 관계 (보호)
- response 200: `boolean`

### GET /api/social/users/{userId}/mutual-follow

- desc: 상호 팔로우 (보호)
- response 200: `boolean`

---

## 맛집 추천 RestaurantController

- Base: `/api/travel/plan/{planId}/restaurants`

### GET /api/travel/plan/{planId}/restaurants

- desc: 기본 추천 생성 (보호)
- response 200: `RestaurantRecommendationResponseDTO`

### POST /api/travel/plan/{planId}/restaurants

- desc: 옵션을 포함한 추천 생성 (보호)
- body: `RestaurantRecommendationRequestDTO | null`
- response 200: `RestaurantRecommendationResponseDTO`

---

## 보호 자원 확인 ProtectedController (보호)

- Base: `/api/protected`

### GET /api/protected

- response 200: `string`

---

## 공개 엔드포인트 목록 (SecurityConfig/JwtAuthenticationFilter 기준)

- /api/auth/\*\*
- GET /api/travel/plan/{id}
- POST /api/today-activity/recommend
- GET /api/reviews/{reviewId}
- GET /api/reviews/feed
- GET /api/reviews/search/\*\* (키워드/태그/지역)
- GET /api/social/reviews/{reviewId}/comments
- GET /api/social/comments/{commentId}/replies
- Swagger/OpenAPI 리소스: `/swagger-ui.html`, `/swagger-ui/**`, `/v3/api-docs/**`, `/swagger-resources/**`, `/webjars/**`
- /error

그 외 모든 요청은 인증 필요(보호).

---

## 주요 DTO 스키마 요약

- TravelPlanRequest: `{ city: string, startDate: string(YYYY-MM-DD), endDate: string(YYYY-MM-DD), travelStyle?: string, interests?: string, accommodation?: string, transportation?: string, userSpecifiedAccommodations?: UserSpecifiedAccommodation[] }`
- TravelPlanDTO: 여행 계획 상세 구조(필드 다수, 서버 DTO 참조)
- TravelPlanSearchRequest: `{ keyword?, country?, city?, sortBy?: popular|recent|oldest, page?: number, size?: number }`
- TravelPlanSearchResponse: 페이지네이션 메타 포함
- ItineraryActivityCreateRequest / UpdateRequest
- TodayActivityRequestDTO / ResponseDTO / SaveActivityRequestDTO / SavedActivityResponseDTO
- TripReviewCreateRequest / UpdateRequest / ResponseDTO
- RestaurantRecommendationRequestDTO / ResponseDTO
- UserProfileDTO / SocialProfileResponseDTO / ReviewComment\* DTO

---

## 보안/인증 규칙(요약)

- 공개 엔드포인트: 문서에 (공개)로 표시된 항목. 그 외는 인증 필요.
- 웹은 쿠키 기반 인증만 사용(비공개 엔드포인트에서 Bearer 거부). 앱은 `X-Client-Type: APP` + Bearer.
- CORS: `http://localhost:3000`, `https://*.narudog.com` 허용.

## 에러 코드(예시)

- 400: `INVALID_REQUEST`, `VALIDATION_FAILED`, `MISSING_HEADER`
- 401: `UNAUTHORIZED`, `INVALID_JWT`, `EXPIRED_JWT`, `INVALID_REFRESH_TOKEN`
- 403: `FORBIDDEN`
- 404: `NOT_FOUND`
- 429: Too Many Requests
- 500/503: `SERVER_ERROR`, `EXTERNAL_API_ERROR`
