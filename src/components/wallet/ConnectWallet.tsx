import styles from './ConnectWallet.module.css'
import { useConnect } from 'wagmi'

export function ConnectWallet({ onClose }: { onClose: () => void }) {
    const { connectors, connect, status, error } = useConnect()

    return (
        <>
            {status != 'success' && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <div className={styles.header}>
                            <h2>Select Wallet</h2>
                            <button onClick={onClose} className={styles.closeBtn}>×</button>
                        </div>

                        {connectors.map((connector) => (
                            <button
                                key={connector.uid}
                                onClick={() => connect({ connector })}
                                className={styles.walletButton}
                            >
                                {connector.name}
                            </button>
                        ))}

                        <div className={styles.status}>{status}</div>
                        {error && <div className={styles.error}>{error.message}</div>}
                    </div>
                </div>
            )}
        </>
    )
}
