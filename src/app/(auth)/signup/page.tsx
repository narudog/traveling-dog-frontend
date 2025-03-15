import styles from "./page.module.scss";
import SignupForm from "@/components/auth/SignupForm";

const SignupPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Create an Account</h1>
            <SignupForm />
        </div>
    );
};

export default SignupPage;
