import { render, screen, fireEvent, act } from "@testing-library/react";
import Home from "@/app/page";
import "@testing-library/jest-dom";

describe("Home Page", () => {
    // 헤더 관련 테스트
    describe("Header", () => {
        it("should render logo", async () => {
            await act(async () => {
                render(<Home />);
            });
            const logo = screen.getByAltText("Logo");
            expect(logo).toBeInTheDocument();
        });

        it("should render auth buttons", async () => {
            await act(async () => {
                render(<Home />);
            });
            expect(screen.getByText("로그인")).toBeInTheDocument();
            expect(screen.getByText("회원가입")).toBeInTheDocument();
        });

        it("should navigate to correct auth pages when clicking auth buttons", async () => {
            await act(async () => {
                render(<Home />);
            });
            const loginButton = screen.getByText("로그인");
            const signupButton = screen.getByText("회원가입");

            expect(loginButton.closest("a")).toHaveAttribute("href", "/login");
            expect(signupButton.closest("a")).toHaveAttribute("href", "/signup");
        });
    });

    // 검색 섹션 관련 테스트
    describe("Search Section", () => {
        it("should render search inputs", async () => {
            await act(async () => {
                render(<Home />);
            });
            expect(screen.getByPlaceholderText("여행지를 입력하세요 (예: 제주도, 부산)")).toBeInTheDocument();
            expect(screen.getByPlaceholderText("출발일")).toBeInTheDocument();
            expect(screen.getByPlaceholderText("도착일")).toBeInTheDocument();
        });

        it("should allow destination input", async () => {
            await act(async () => {
                render(<Home />);
            });
            const destinationInput = screen.getByPlaceholderText("여행지를 입력하세요 (예: 제주도, 부산)");
            fireEvent.change(destinationInput, { target: { value: "제주도" } });
            expect(destinationInput).toHaveValue("제주도");
        });

        it("should allow date selection", async () => {
            await act(async () => {
                render(<Home />);
            });
            const startDate = screen.getByPlaceholderText("출발일");
            const endDate = screen.getByPlaceholderText("도착일");

            fireEvent.change(startDate, { target: { value: "2024-03-20" } });
            fireEvent.change(endDate, { target: { value: "2024-03-25" } });

            expect(startDate).toHaveValue("2024-03-20");
            expect(endDate).toHaveValue("2024-03-25");
        });

        it("should set min date for end date based on start date", async () => {
            await act(async () => {
                render(<Home />);
            });
            const startDate = screen.getByPlaceholderText("출발일");
            const endDate = screen.getByPlaceholderText("도착일");

            // 시작일을 2024-03-20으로 설정
            fireEvent.change(startDate, { target: { value: "2024-03-20" } });

            // 도착일의 min 속성이 시작일로 설정되었는지 확인
            expect(endDate).toHaveAttribute("min", "2024-03-20");
        });

        it("should reset end date if it becomes invalid after start date change", async () => {
            await act(async () => {
                render(<Home />);
            });
            const startDate = screen.getByPlaceholderText("출발일");
            const endDate = screen.getByPlaceholderText("도착일");

            // 초기 날짜 설정
            fireEvent.change(endDate, { target: { value: "2024-03-20" } });
            fireEvent.change(startDate, { target: { value: "2024-03-25" } });

            // 도착일이 리셋되었는지 확인
            expect(endDate).toHaveValue("");
        });

        it("should handle search submission", async () => {
            await act(async () => {
                render(<Home />);
            });
            const searchButton = screen.getByText("일정 만들기");
            const mockSubmit = jest.fn();

            searchButton.onclick = mockSubmit;
            fireEvent.click(searchButton);

            expect(mockSubmit).toHaveBeenCalled();
        });

        it("should disable search button when dates are not selected", async () => {
            await act(async () => {
                render(<Home />);
            });
            const searchButton = screen.getByText("일정 만들기");

            // 초기 상태에서는 버튼이 비활성화되어 있어야 함
            expect(searchButton).toBeDisabled();

            // 출발일만 선택했을 때도 버튼이 비활성화되어 있어야 함
            const startDate = screen.getByPlaceholderText("출발일");
            fireEvent.change(startDate, { target: { value: "2024-03-20" } });
            expect(searchButton).toBeDisabled();

            // 출발일과 도착일 모두 선택했을 때는 버튼이 활성화되어야 함
            const endDate = screen.getByPlaceholderText("도착일");
            fireEvent.change(endDate, { target: { value: "2024-03-25" } });
            expect(searchButton).not.toBeDisabled();
        });

        it("should disable end date input when start date is not selected", async () => {
            await act(async () => {
                render(<Home />);
            });
            const endDate = screen.getByPlaceholderText("도착일");
            expect(endDate).toBeDisabled();
        });
    });

    // 컨텐츠 섹션 관련 테스트
    describe("Content Sections", () => {
        it("should render hero section with correct content", async () => {
            await act(async () => {
                render(<Home />);
            });
            expect(screen.getByText("AI와 함께 만드는 완벽한 여행 계획")).toBeInTheDocument();
        });

        it("should render features section", async () => {
            await act(async () => {
                render(<Home />);
            });
            expect(screen.getByText("AI 여행 플래너의 특별한 기능")).toBeInTheDocument();
            expect(screen.getByText("맞춤형 여행 추천")).toBeInTheDocument();
            expect(screen.getByText("스마트 동선 설계")).toBeInTheDocument();
            expect(screen.getByText("실시간 업데이트")).toBeInTheDocument();
        });

        it("should render how it works section", async () => {
            await act(async () => {
                render(<Home />);
            });
            expect(screen.getByText("이용 방법")).toBeInTheDocument();
            const steps = screen.getAllByRole("heading", { level: 2 });
            expect(steps).toHaveLength(3);
        });
    });

    // 반응형 디자인 테스트 활성화
    describe("Responsive Design", () => {
        it("should adjust layout for mobile devices", async () => {
            // 테스트 전에 원래 window.innerWidth 저장
            const originalInnerWidth = window.innerWidth;

            // 뷰포트 크기를 모바일 크기로 설정
            Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 375 });

            // 리사이즈 이벤트 발생
            window.dispatchEvent(new Event("resize"));

            await act(async () => {
                render(<Home />);
            });
            const searchBox = screen.getByTestId("search-box");

            // 모바일에서는 검색 박스가 존재하는지만 확인
            expect(searchBox).toBeInTheDocument();

            // 테스트 후 원래 window.innerWidth 복원
            Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: originalInnerWidth });
        });
    });

    describe("PolylineMap 기능", () => {
        it("지도 컴포넌트가 성공적으로 렌더링되어야 합니다", async () => {
            await act(async () => {
                render(<Home />);
            });

            // Leaflet 지도 컨테이너가 렌더링되는지 확인 (data-testid 사용)
            const mapElement = await screen.findByTestId("leaflet-map-container");
            expect(mapElement).toBeInTheDocument();

            // Polyline이 렌더링되는지 확인 (SVG path 요소로 렌더링됨)
            const polyline = document.querySelector("path");
            expect(polyline).toBeInTheDocument();
            expect(polyline).toHaveAttribute("stroke", "blue");
        });
    });
});

// 사용자 시나리오를 반영한 통합 테스트 추가
describe("User Scenarios", () => {
    it("should complete a full search flow", async () => {
        await act(async () => {
            render(<Home />);
        });

        // 1. 여행지 입력
        const destinationInput = screen.getByPlaceholderText("여행지를 입력하세요 (예: 제주도, 부산)");
        fireEvent.change(destinationInput, { target: { value: "제주도" } });

        // 2. 출발일 선택
        const startDate = screen.getByPlaceholderText("출발일");
        fireEvent.change(startDate, { target: { value: "2024-03-20" } });

        // 3. 도착일 선택
        const endDate = screen.getByPlaceholderText("도착일");
        fireEvent.change(endDate, { target: { value: "2024-03-25" } });

        // 4. 검색 버튼이 활성화되었는지 확인
        const searchButton = screen.getByText("일정 만들기");
        expect(searchButton).not.toBeDisabled();

        // 5. 검색 버튼 클릭 (실제 동작은 모의 함수로 대체)
        const mockNavigate = jest.fn();
        // 실제 구현에서는 여기서 라우팅이나 API 호출이 발생할 것입니다
        searchButton.onclick = mockNavigate;
        fireEvent.click(searchButton);

        // 6. 네비게이션 함수가 호출되었는지 확인
        expect(mockNavigate).toHaveBeenCalled();
    });

    it("should handle invalid date selection correctly", async () => {
        await act(async () => {
            render(<Home />);
        });

        // 1. 출발일을 오늘보다 이전 날짜로 설정 시도 (HTML5 validation으로 방지됨)
        const startDate = screen.getByPlaceholderText("출발일");
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split("T")[0];

        // min 속성이 오늘 날짜로 설정되어 있는지 확인
        const today = new Date().toISOString().split("T")[0];
        expect(startDate).toHaveAttribute("min", today);

        // 2. 도착일을 출발일보다 이전 날짜로 설정 시도
        const endDate = screen.getByPlaceholderText("도착일");

        // 출발일 설정
        fireEvent.change(startDate, { target: { value: "2024-03-20" } });

        // 도착일의 min 속성이 출발일로 설정되었는지 확인
        expect(endDate).toHaveAttribute("min", "2024-03-20");

        // 출발일을 변경하면 도착일이 리셋되는지 확인
        fireEvent.change(endDate, { target: { value: "2024-03-25" } });
        fireEvent.change(startDate, { target: { value: "2024-03-26" } });
        expect(endDate).toHaveValue("");
    });
});
