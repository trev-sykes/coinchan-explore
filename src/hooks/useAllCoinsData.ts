import { useQuery } from '@tanstack/react-query';
import { fetchAllCoinsData } from '../services/Coins'; // adjust path as needed

export function useAllCoinsData() {
    return useQuery({
        queryKey: ['allCoinsData'],
        queryFn: fetchAllCoinsData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
}
