import Link from "next/link";
import styles from "./Header.module.scss";

const UnauthenticatedButtons = () => {
  return (
    <>
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
