import LoginForm from "@/components/auth/LoginForm";
import styles from "./page.module.scss";
import Link from "next/link";
const LoginPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Have a good trip!</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
