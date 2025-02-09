import styles from "./page.module.scss";
import Signup from "@/components/auth/Signup";

const SignupPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Create an Account</h1>
            <Signup />
        </div>
    );
};

export default SignupPage;
