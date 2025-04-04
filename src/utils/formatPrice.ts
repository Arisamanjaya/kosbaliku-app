export const formatShortPrice = (price: number): string => {
    if (price >= 1000000) {
        return `${(price / 1000000).toLocaleString('id-ID', { 
            maximumFractionDigits: 1,
            minimumFractionDigits: 0
        })}jt`;
    } else if (price >= 1000) {
        return `${Math.floor(price / 1000)}rb`;
    }
    return price.toString();
};