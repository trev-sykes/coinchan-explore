import React from 'react';
import styles from './CoinDetailModal.module.css';
import { convertToIpfsUrl } from '../../../utils/ipfs';

import { formatUnits } from 'viem';

interface CoinDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    coin: any;
    metadata: any;
    ethPrice: any;
}

export const CoinDetailModal: React.FC<CoinDetailModalProps> = ({ isOpen, onClose, coin, metadata }) => {
    if (!coin || !metadata) return null;
    return (
        <div className={`${styles.modalOverlay} ${isOpen ? 'active' : ''}`}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h2 className={styles.modalTitle}>{metadata.name} ({metadata.symbol})</h2>

                {metadata.image && (
                    <div className={styles.imageContainer}>
                        <img
                            src={convertToIpfsUrl(metadata.image)}
                            alt={metadata.name}
                            className={styles.coinImage}
                        />
                    </div>
                )}

                <div className={styles.coinDetails}>
                    <p><strong>Description:</strong> {metadata.description}</p>
                    <p><strong>ETH Reserves:</strong> {formatUnits(coin.reserve0, 18)}</p>
                    <p><strong>Total Supply:</strong> {formatUnits(coin.reserve1, 18).split('.')[0]}</p>

                </div>

                <div className={styles.modalFooter}>
                    <a href={`https://coinchan.vercel.app/c/${coin.coinId}`} target="_blank">Trade</a>
                </div>
            </div>
        </div >
    );
};