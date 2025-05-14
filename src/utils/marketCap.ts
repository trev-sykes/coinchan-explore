export const calculateTokenPriceInEth = (
    tokenReserve: bigint,
    ethReserve: bigint
): bigint => {
    if (tokenReserve === 0n) return 0n;

    // Price = ETH reserve / Token reserve (scaled by 10^8 for precision)
    const scale = 10n ** 8n;
    return (ethReserve * scale) / tokenReserve;
};

export const calculateMarketCap = (
    tokenPriceInEth: bigint,
    ethPriceInUsd: number, // Use number for USD price which may have decimals
    totalSupply: bigint = 21000000n
): bigint => {
    // Convert eth price to a scaled bigint (assuming 2 decimal places)
    const ethPriceScaled = BigInt(Math.round(ethPriceInUsd * 100));

    // Market Cap = Total Supply * Token Price in ETH * ETH Price in USD
    // Need to divide by 10^8 (token price scale) and by 100 (eth price scale)
    return (tokenPriceInEth * totalSupply * ethPriceScaled) / (10n ** 10n);
};