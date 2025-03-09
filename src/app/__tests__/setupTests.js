// 테스트 설정 파일
import * as RecoilMock from "./__mocks__/recoilMock";

// Recoil 모킹 설정
jest.mock("recoil", () => ({
    RecoilRoot: RecoilMock.RecoilRoot,
    atom: RecoilMock.atom,
    selector: RecoilMock.selector,
    useRecoilState: RecoilMock.useRecoilState,
    useRecoilValue: RecoilMock.useRecoilValue,
    useSetRecoilState: RecoilMock.useSetRecoilState,
    useResetRecoilState: RecoilMock.useResetRecoilState,
}));

// Next.js 모킹 설정
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        pathname: "/",
        query: {},
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}));

// 환경 변수 모킹
jest.mock("next/config", () => () => ({
    publicRuntimeConfig: {
        API_URL: "http://localhost:3000/api",
    },
}));

// 이미지 모킹
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img {...props} />;
    },
}));

// 링크 모킹
jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ children, href, ...props }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

// 동적 임포트 모킹
// jest.mock("next/dynamic", () => (func) => {
//     // 동적으로 임포트하려는 실제 컴포넌트를 바로 반환
//     return func();
// });

// 글로벌 모킹 설정
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// 테스트 전역 설정
beforeAll(() => {
    // 필요한 전역 설정
});

afterAll(() => {
    // 테스트 후 정리
});
