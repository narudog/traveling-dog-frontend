import Link from "next/link";
import styles from "./Header.module.scss";

const UnauthenticatedButtons = () => {
  return (
    <>
      <Link
        href="/travel-plan/list"
        className={`${styles.headerButton} ${styles.travelPlanButton}`}
      >
        내 여행
      </Link>
      <Link
        href="/login"
        className={`${styles.headerButton} ${styles.loginButton}`}
      >
        로그인
      </Link>
    </>
  );
};

export default UnauthenticatedButtons;
