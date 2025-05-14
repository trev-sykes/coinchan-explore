// utils/formatBigInt.ts
import { formatUnits } from 'viem';

export const formatBigInt = (value: bigint, decimals: number = 18): string => {
    return formatUnits(value, decimals);
};
export const formatBigIntToString = (value: bigint): string => {
    return formatUnits(value, 18);
}