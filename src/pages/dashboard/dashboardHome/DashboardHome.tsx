import styles from './DashboardHome.module.css';

export const DashboardHome = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Coinchan Overview Section */}
                <div className={styles.section}>
                    <h2 className={styles.subtitle}>Coinchan Overview</h2>
                    <p className={styles.text}>
                        Coinchan is a ruthlessly optimized coin launcher for Ethereum, utilizing the ERC6909 standard. All 21,000,000 tokens are initially locked in an AMM pool for fair distribution while creators earn swap fees. Sound good?
                    </p>
                </div>

                {/* Token Information Section */}
                <div className={styles.section}>
                    <h2 className={styles.subtitle}>Token Information</h2>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Total Supply:</span>
                        <span className={styles.infoValue}>21,000,000 (fixed)</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Pool Supply:</span>
                        <span className={styles.infoValue}>100% in AMM pool</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Swap Fee:</span>
                        <span className={styles.infoValue}>1%</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Vesting:</span>
                        <span className={styles.infoValue}>6 months (creator LP tokens vested linearly)</span>
                    </div>
                </div>

                {/* ERC6909 Section */}
                <div className={styles.section}>
                    <h2 className={styles.subtitle}>ERC6909 Standard</h2>
                    <p className={styles.text}>
                        ERC6909 extends the ERC20 standard with singleton state (one contract for all coins), metadata (tokenURI) support, and is fully compatible with existing ERC20 DeFi applications.
                    </p>
                    <span className={styles.badge}>ERC6909</span>
                </div>

                {/* Call to Action */}
                <div className={styles.section}>
                    <p className={styles.text}>
                        Ready to get started with Coinchan? Join us in launching this optimized coin for Ethereum.
                    </p>
                    <a
                        className={styles.ctaButton}
                        href={"https://coinchan.vercel.app/create"}
                        target="_blank"
                    >I want to coin it!</a>
                </div>
            </div>
        </div>
    );
};
