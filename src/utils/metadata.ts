// utils/metadata.ts
import { convertToIpfsUrl } from './ipfs';

export const fetchTokenMetadata = async (tokenURI: string): Promise<any | null> => {
    try {
        const url = convertToIpfsUrl(tokenURI);
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error fetching token metadata:", err);
        return null;
    }
};
