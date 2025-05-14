// DashboardLayout.jsx
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { ConnectWallet } from '../../wallet/ConnectWallet'
import DashboardNav from '../../nav/DashboardNav'
import styles from './DashboardLayout.module.css'

const DashboardLayout = () => {

    const [isConnectOpen, setIsConnectOpen] = useState(false)

    return (
        <div className={styles.wrapper}>

            <main className={styles.main}>
                <Outlet />
            </main>

            <DashboardNav />

            {isConnectOpen && <ConnectWallet onClose={() => setIsConnectOpen(false)} />}
        </div>
    )
}

export default DashboardLayout
