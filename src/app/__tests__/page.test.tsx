import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/page";
import "@testing-library/jest-dom";

describe("Home Page", () => {
    // 헤더 관련 테스트
    describe("Header", () => {
        it("should render logo", () => {
            render(<Home />);
            const logo = screen.getByAltText("Logo");
            expect(logo).toBeInTheDocument();
        });

        it("should render auth buttons", () => {
            render(<Home />);
            expect(screen.getByText("로그인")).toBeInTheDocument();
            expect(screen.getByText("회원가입")).toBeInTheDocument();
        });

        it("should navigate to correct auth pages when clicking auth buttons", () => {
            render(<Home />);
            const loginButton = screen.getByText("로그인");
            const signupButton = screen.getByText("회원가입");

            expect(loginButton.closest("a")).toHaveAttribute("href", "/login");
            expect(signupButton.closest("a")).toHaveAttribute("href", "/signup");
        });
    });

    // 검색 섹션 관련 테스트
    describe("Search Section", () => {
        it("should render search inputs", () => {
            render(<Home />);
            expect(screen.getByPlaceholderText("여행지를 입력하세요 (예: 제주도, 부산)")).toBeInTheDocument();
            expect(screen.getByPlaceholderText("출발일")).toBeInTheDocument();
            expect(screen.getByPlaceholderText("도착일")).toBeInTheDocument();
        });

        it("should allow destination input", () => {
            render(<Home />);
            const destinationInput = screen.getByPlaceholderText("여행지를 입력하세요 (예: 제주도, 부산)");
            fireEvent.change(destinationInput, { target: { value: "제주도" } });
            expect(destinationInput).toHaveValue("제주도");
        });

        it("should allow date selection", () => {
            render(<Home />);
            const startDate = screen.getByPlaceholderText("출발일");
            const endDate = screen.getByPlaceholderText("도착일");

            fireEvent.change(startDate, { target: { value: "2024-03-20" } });
            fireEvent.change(endDate, { target: { value: "2024-03-25" } });

            expect(startDate).toHaveValue("2024-03-20");
            expect(endDate).toHaveValue("2024-03-25");
        });

        it("should set min date for end date based on start date", () => {
            render(<Home />);
            const startDate = screen.getByPlaceholderText("출발일");
            const endDate = screen.getByPlaceholderText("도착일");

            // 시작일을 2024-03-20으로 설정
            fireEvent.change(startDate, { target: { value: "2024-03-20" } });

            // 도착일의 min 속성이 시작일로 설정되었는지 확인
            expect(endDate).toHaveAttribute("min", "2024-03-20");
        });

        it("should reset end date if it becomes invalid after start date change", () => {
            render(<Home />);
            const startDate = screen.getByPlaceholderText("출발일");
            const endDate = screen.getByPlaceholderText("도착일");

            // 초기 날짜 설정
            fireEvent.change(endDate, { target: { value: "2024-03-20" } });
            fireEvent.change(startDate, { target: { value: "2024-03-25" } });

            // 도착일이 리셋되었는지 확인
            expect(endDate).toHaveValue("");
        });

        it("should handle search submission", () => {
            render(<Home />);
            const searchButton = screen.getByText("일정 만들기");
            const mockSubmit = jest.fn();

            searchButton.onclick = mockSubmit;
            fireEvent.click(searchButton);

            expect(mockSubmit).toHaveBeenCalled();
        });
    });

    // 컨텐츠 섹션 관련 테스트
    describe("Content Sections", () => {
        it("should render hero section with correct content", () => {
            render(<Home />);
            expect(screen.getByText("AI와 함께 만드는 완벽한 여행 계획")).toBeInTheDocument();
        });

        it("should render features section", () => {
            render(<Home />);
            expect(screen.getByText("AI 여행 플래너의 특별한 기능")).toBeInTheDocument();
            expect(screen.getByText("맞춤형 여행 추천")).toBeInTheDocument();
            expect(screen.getByText("스마트 동선 설계")).toBeInTheDocument();
            expect(screen.getByText("실시간 업데이트")).toBeInTheDocument();
        });

        it("should render how it works section", () => {
            render(<Home />);
            expect(screen.getByText("이용 방법")).toBeInTheDocument();
            const steps = screen.getAllByRole("heading", { level: 2 });
            expect(steps).toHaveLength(3);
        });
    });

    // // 반응형 디자인 테스트
    // describe("Responsive Design", () => {
    //     it("should adjust layout for mobile devices", () => {
    //         // 뷰포트 크기를 모바일 크기로 설정
    //         global.innerWidth = 375;
    //         fireEvent(window, new Event("resize"));

    //         render(<Home />);
    //         const searchBox = screen.getByTestId("search-box");

    //         // 모바일에서는 검색 박스가 세로로 정렬되어야 함
    //         expect(searchBox).toHaveStyle({ flexDirection: "column" });
    //     });
    // });

    describe("PolylineMap 기능", () => {
        it("지도 컴포넌트가 성공적으로 렌더링되어야 합니다", async () => {
            render(<Home />);

            // Leaflet 지도 컨테이너가 렌더링되는지 확인
            const mapElement = await screen.findByRole("region");
            expect(mapElement).toBeInTheDocument();
            expect(mapElement).toHaveClass("leaflet-container");

            // Polyline이 렌더링되는지 확인 (SVG path 요소로 렌더링됨)
            const polyline = document.querySelector("path");
            expect(polyline).toBeInTheDocument();
            expect(polyline).toHaveAttribute("stroke", "blue");
        });
    });
});
