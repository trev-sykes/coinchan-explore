import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'
import Logo from '../../../components/common/logo/Logo'

const LandingPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Logo isDark={false} width="8rem" height="8rem" />
                <h1 className={styles.title}>Welcome to Coinchan Explore</h1>
                <p className={styles.tagline}>Discover Coins deployed to ZAMM, a hyper-optimized DEX on Ethereum Mainnet</p>
                <Link to="/dashboard">
                    <button className={styles.enterButton}>Enter Dashboard</button>
                </Link>
            </div>
        </div>
    )
}

export default LandingPage
