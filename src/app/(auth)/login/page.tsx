import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";
import styles from "./page.module.scss";
const LoginPage = () => {
  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
