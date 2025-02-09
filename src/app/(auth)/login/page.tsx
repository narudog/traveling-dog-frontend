import LoginForm from "@/components/auth/LoginForm";
import styles from "./page.module.scss";

const LoginPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Welcome to Traveling Dog</h1>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
