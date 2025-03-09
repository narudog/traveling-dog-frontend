// Next.js 모킹
const useRouter = jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
    events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    },
});

const usePathname = jest.fn().mockReturnValue("/");
const useSearchParams = jest.fn().mockReturnValue(new URLSearchParams());
const useParams = jest.fn().mockReturnValue({});

// 모킹 설정
export const setupNextJsMocks = () => {
    jest.mock("next/navigation", () => ({
        useRouter,
        usePathname,
        useSearchParams,
        useParams,
    }));
};

// 모킹 검증 헬퍼 함수
export const verifyRouterCalls = {
    pushWasCalled: (path) => {
        const router = useRouter();
        expect(router.push).toHaveBeenCalled();
        if (path) {
            expect(router.push).toHaveBeenCalledWith(path);
        }
    },

    replaceWasCalled: (path) => {
        const router = useRouter();
        expect(router.replace).toHaveBeenCalled();
        if (path) {
            expect(router.replace).toHaveBeenCalledWith(path);
        }
    },
};
