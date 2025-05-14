// DashboardLayout.jsx
import { useAccount, useConnect } from 'wagmi'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Profile } from '../../profile/Profile'
import { ConnectWallet } from '../../wallet/ConnectWallet'
import DashboardNav from '../../nav/DashboardNav'
import styles from './DashboardLayout.module.css'

const DashboardLayout = () => {
    const { address } = useAccount()
    const { status } = useConnect()
    const [isConnectOpen, setIsConnectOpen] = useState(false)

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <Profile />
                {!address && status !== 'success' && (
                    <button className={styles.connectButton} onClick={() => setIsConnectOpen(true)}>
                        Connect Wallet
                    </button>
                )}
            </header>

            <main className={styles.main}>
                <Outlet />
            </main>

            <DashboardNav />

            {isConnectOpen && <ConnectWallet onClose={() => setIsConnectOpen(false)} />}
        </div>
    )
}

export default DashboardLayout
