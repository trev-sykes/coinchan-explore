import React, { useState, useEffect } from 'react';
import { useAllCoinsData } from '../../../hooks/useAllCoinsData';
import { useInView } from 'react-intersection-observer';
import styles from './ExploreGrid.module.css';
import { convertToIpfsUrl } from '../../../utils/ipfs';
import { fetchTokenMetadata } from '../../../utils/metadata';
import { scrollToTop } from '../../../utils/scroll';
import { CoinDetailModal } from '../../../components/common/coinDetailModal/CoinDetailModal';
import { fetchETHPrice } from '../../../hooks/useEthPrice';
import { BarLoader } from 'react-spinners';

const ITEMS_PER_PAGE = 25;

interface CoinMetadata {
    name: string;
    symbol: string;
    description: string;
    image: string;
}

export const ExploreGrid: React.FC = () => {
    const { data, error, isLoading: initialLoading } = useAllCoinsData();

    const [page, setPage] = useState(0);
    const [visibleCoins, setVisibleCoins] = useState<any[]>([]);
    const [coinMetadata, setCoinMetadata] = useState<{ [key: string]: CoinMetadata }>({});
    const [isMetadataLoading, setIsMetadataLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCoin, setSelectedCoin] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ethPrice, setEthPrice] = useState<any>();
    const [width, setWidth] = useState(window.innerWidth);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isLoadingPage, setIsLoadingPage] = useState(false);

    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.2,
    });

    // Handle window resizing
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scroll-to-top button toggle
    useEffect(() => {
        const handleScroll = () => setShowScrollButton(window.scrollY > 200);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Load ETH price once
    useEffect(() => {
        const getEthPrice = async () => {
            const price = await fetchETHPrice();
            setEthPrice(price);
        };
        getEthPrice();
    }, []);

    // Load next page of coins when `inView` is true and not loading already
    useEffect(() => {
        if (inView && data && !searchTerm && !isLoadingPage) {
            setIsLoadingPage(true);
            setPage((prev) => prev + 1);
        }
    }, [inView, data, searchTerm, isLoadingPage]);

    // Load visible coins when page changes or data is ready
    useEffect(() => {
        const loadVisibleCoins = async () => {
            if (!data || searchTerm) {
                setIsLoadingPage(false);
                return;
            }

            const start = page * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;

            // If no more coins to load, stop loading
            if (start >= data.length) {
                setIsLoadingPage(false);
                return;
            }

            const nextCoins = data.slice(start, end);

            setVisibleCoins((prev) => [...prev, ...nextCoins]);

            setIsMetadataLoading(true);
            const newMetadata: { [key: string]: CoinMetadata } = {};

            for (const coin of nextCoins) {
                const meta = await fetchTokenMetadata(coin.tokenURI);
                if (meta) {
                    newMetadata[coin.coinId.toString()] = meta;
                }
            }

            setCoinMetadata((prev) => ({ ...prev, ...newMetadata }));
            setIsMetadataLoading(false);

            setIsLoadingPage(false);
        };

        loadVisibleCoins();
    }, [page, data, searchTerm]);

    // Filtered coins (debounced) — runs when user types in search
    const [filteredCoins, setFilteredCoins] = useState<any[]>([]);
    useEffect(() => {
        const handler = setTimeout(() => {
            if (!searchTerm.trim()) {
                setFilteredCoins([]);
                return;
            }

            const term = searchTerm.toLowerCase();
            const results = data?.filter((coin) => {
                const meta = coinMetadata[coin.coinId.toString()];
                return (
                    meta &&
                    (meta.name?.toLowerCase().includes(term) ||
                        meta.symbol?.toLowerCase().includes(term) ||
                        meta.description?.toLowerCase().includes(term))
                );
            });

            setFilteredCoins(results || []);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm, data, coinMetadata]);

    const coinsToDisplay = searchTerm ? filteredCoins : visibleCoins;

    if (initialLoading && !data) return <div className={styles.loading}>Loading coins...</div>;
    if (error) return <div className={styles.error}>Error: {error.message}</div>;

    return (
        <div className={styles.coinsContainer}>
            <h1 className={styles.title}>Explore Coins</h1>

            {/* Search Bar */}
            <div className={styles.searchContainer}>
                <svg
                    className={styles.searchIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by name, symbol or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button className={styles.searchClear} onClick={() => setSearchTerm('')} aria-label="Clear search">
                        ✕
                    </button>
                )}
            </div>

            {/* Grid of Coins */}
            {coinsToDisplay.length > 0 ? (
                <>
                    <div className={styles.gridContainer}>
                        {coinsToDisplay.map((coin, index) => {
                            const meta = coinMetadata[coin.coinId.toString()];
                            const isLast = index === coinsToDisplay.length - 1;

                            return (
                                <div
                                    key={coin.coinId}
                                    className={styles.coinCard}
                                    onClick={() => {
                                        setSelectedCoin(coin);
                                        setIsModalOpen(true);
                                    }}
                                    ref={!searchTerm && isLast ? ref : null}
                                >
                                    <div className={styles.tokenDetails}>
                                        {meta ? (
                                            <>
                                                {width > 720 && <h4>{meta.name}</h4>}
                                                <p>
                                                    <strong>{width > 720 && 'Symbol: '}</strong>
                                                    {meta.symbol.length < 7 ? meta.symbol : meta.symbol.slice(0, 7)}
                                                </p>
                                                {width > 720 && (
                                                    <p>{meta.description.length > 50 ? meta.description.slice(0, 50) : meta.description}</p>
                                                )}
                                                <div className={styles.imageContainer}>
                                                    {meta.image && (
                                                        <img
                                                            src={convertToIpfsUrl(meta.image)}
                                                            onError={(e) => (e.currentTarget.src = '/favicon-light.png')}
                                                            alt={`${meta.name || 'Coin'} icon`}
                                                            className={styles.coinImage}
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : isMetadataLoading ? (
                                            <BarLoader />
                                        ) : (
                                            <p>Metadata not available</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Loading more indicator */}
                    {isLoadingPage && (
                        <div className={styles.loadingMore}>
                            <BarLoader />
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.noResults}>
                    {searchTerm ? <>No coins found matching "{searchTerm}"</> : <>No coins available</>}
                </div>
            )}

            {/* Coin Modal */}
            {isModalOpen && (
                <CoinDetailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    coin={selectedCoin}
                    metadata={selectedCoin ? coinMetadata[selectedCoin.coinId.toString()] : null}
                    ethPrice={ethPrice}
                />
            )}

            {/* Scroll to Top */}
            <button
                className={`${styles.scrollToTopButton} ${showScrollButton ? styles.show : ''}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                ↑
            </button>
        </div>
    );
};
