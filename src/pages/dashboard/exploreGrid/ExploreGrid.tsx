import React, { useState, useEffect } from 'react';
import { useAllCoinsData } from '../../../hooks/useAllCoinsData';
import { useInView } from 'react-intersection-observer';
import styles from './ExploreGrid.module.css';
import { convertToIpfsUrl } from '../../../utils/ipfs';
import { fetchTokenMetadata } from '../../../utils/metadata';
import { scrollToTop } from '../../../utils/scroll'; // optional
import { CoinDetailModal } from '../../../components/common/coinDetailModal/CoinDetailModal';
import { fetchETHPrice } from '../../../hooks/useEthPrice';
import { BarLoader } from 'react-spinners';
interface CoinMetadata {
    name: string;
    symbol: string;
    description: string;
    image: string;
}

export const ExploreGrid: React.FC = () => {
    const { data, error, isLoading } = useAllCoinsData();
    const [isMetadataLoading, setIsMetadataLoading] = useState(true);
    const [coinMetadata, setCoinMetadata] = useState<{ [key: string]: CoinMetadata }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState<any>();
    const [selectedCoin, setSelectedCoin] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ethPrice, setEthPrice] = useState<any>();
    const [width, setWidth] = useState<any>(window.innerWidth);



    const { ref } = useInView({
        triggerOnce: false,
        threshold: 0.2,
    });

    const [showScrollButton, setShowScrollButton] = useState(false);
    // Control changes in the window width
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerWidth]);
    // Detect if the user has scrolled down
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    // Fetch metadata for all coins
    useEffect(() => {
        const fetchAllMetadata = async () => {
            if (data && data.length > 0) {
                setIsMetadataLoading(true);
                const metadata: { [key: string]: CoinMetadata } = {};
                for (let coin of data) {
                    const metadataForCoin = await fetchTokenMetadata(coin.tokenURI);
                    if (metadataForCoin) {
                        metadata[coin.coinId.toString()] = metadataForCoin;
                    }
                }
                setCoinMetadata(metadata);
                setIsMetadataLoading(false);
            }
        };
        fetchAllMetadata();
    }, [data]);


    // Debounced filtering
    useEffect(() => {
        if (!data) return;

        const timeout = setTimeout(() => {
            if (!searchTerm.trim()) {
                setFilteredData(data);
                return;
            }

            const searchTermLower = searchTerm.toLowerCase();
            const filtered = data.filter((coin) => {
                const metadata = coinMetadata[coin.coinId.toString()];
                if (!metadata) return false;

                return (
                    metadata.name?.toLowerCase().includes(searchTermLower) ||
                    metadata.symbol?.toLowerCase().includes(searchTermLower) ||
                    metadata.description?.toLowerCase().includes(searchTermLower)
                );
            });

            setFilteredData(filtered);
        }, 300); // debounce delay in ms

        return () => clearTimeout(timeout);
    }, [searchTerm, data, coinMetadata]);

    useEffect(() => {
        const getEthPrice = async () => {
            const ethPrice = await fetchETHPrice();
            setEthPrice(ethPrice);
            console.log("ETH price set", ethPrice);
        }
        getEthPrice();
    }, []);
    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm('');
    };

    // Handle loading and error states
    if (isLoading && !data) return <div className={styles.loading}>Loading coins...</div>;
    if (error) return <div className={styles.error}>Error: {error.message}</div>;

    return (
        <div className={styles.coinsContainer}>
            <h1 className={styles.title}>Explore Coins</h1>

            {/* Search Bar */}
            <div className={styles.searchContainer}>
                <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by name, symbol or description..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                {searchTerm && (
                    <button
                        className={styles.searchClear}
                        onClick={handleClearSearch}
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            {filteredData && filteredData.length > 0 ? (
                <div className={styles.gridContainer}>
                    {filteredData.map((coin: any, index: number) => (
                        <div
                            key={index}
                            className={styles.coinCard}
                            onClick={() => {
                                setSelectedCoin(coin);
                                setIsModalOpen(true);  // Explicitly set modal to open
                                console.log('Modal state:', true);  // This will show that the modal is being opened
                            }}
                            ref={index === filteredData.length - 1 ? ref : null}
                        >

                            <div className={styles.tokenDetails}>
                                {coinMetadata[coin.coinId.toString()] ? (
                                    <>
                                        {width > 720 && <h4>{coinMetadata[coin.coinId.toString()]?.name}</h4>}
                                        <p><strong>{width > 720 && 'Symbol: '}</strong> {width < 720 && coinMetadata[coin.coinId.toString()]?.symbol.length < 7 ? coinMetadata[coin.coinId.toString()]?.symbol : coinMetadata[coin.coinId.toString()]?.symbol.slice(0, 7)}</p>
                                        {width > 720 && <p>{coinMetadata[coin.coinId.toString()]?.description.length > 50 ? coinMetadata[coin.coinId.toString()]?.description.slice(0, 50) : coinMetadata[coin.coinId.toString()]?.description}</p>}
                                        <div className={styles.imageContainer}>
                                            {coinMetadata[coin.coinId.toString()]?.image && (
                                                <img
                                                    src={convertToIpfsUrl(coinMetadata[coin.coinId.toString()]?.image)}
                                                    onError={(e) => (e.currentTarget.src = '/favicon-light.png')}
                                                    alt={`${coinMetadata[coin.coinId.toString()]?.name || 'Coin'} icon`}
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
                    ))}
                </div>
            ) : (
                <div className={styles.noResults}>
                    {searchTerm ? (
                        <>No coins found matching "{searchTerm}"</>
                    ) : (
                        <>No coins available</>
                    )}
                </div>
            )
            }
            {isModalOpen && (<CoinDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                coin={selectedCoin}
                metadata={selectedCoin ? coinMetadata[selectedCoin.coinId.toString()] : null}
                ethPrice={ethPrice}
            />)}
            {/* Bottom loading indicator for more coins */}
            {isLoading && data && <div className={styles.loading}>Loading more coins...</div>}

            {/* Scroll to Top Button */}
            <button
                className={`${styles.scrollToTopButton} ${showScrollButton ? styles.show : ''}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                ↑
            </button>
        </div >
    );
};
