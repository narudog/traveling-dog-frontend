import LoginForm from "@/components/auth/LoginForm";
import styles from "./page.module.scss";
import Link from "next/link";
const LoginPage = () => {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
