import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { CoinsMetadataHelperAbi, CoinsMetadataHelperAddress } from '../services/CoinsMetadataHelperABI';

const publicClient = createPublicClient({
    chain: mainnet,
    transport: http("https://mainnet.infura.io/v3/dfbc9a4fcf42465b8ae607ba43528f15"),
});

export async function fetchAllCoinsData() {
    const rawCoinsData = await publicClient.readContract({
        address: CoinsMetadataHelperAddress,
        abi: CoinsMetadataHelperAbi,
        functionName: 'getAllCoinsData',
    });
    console.log(`Raw Coins Data -`);
    console.log(rawCoinsData);
    return rawCoinsData;
}
