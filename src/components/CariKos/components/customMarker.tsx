import { formatShortPrice } from '../../../utils/formatPrice';

interface CustomMarkerProps {
    price: number;
    isPremium: boolean;
}

const CustomMarker = ({ price, isPremium }: CustomMarkerProps) => {
    return (
        <div className="relative group flex flex-col items-center">
            <div className={`
                px-3 py-1.5 rounded-lg
                ${isPremium ? 'bg-secondary-500' : 'bg-white'} 
                ${isPremium ? 'text-white' : 'text-gray-700'}
                shadow-md border border-gray-100
                font-medium text-xs
                whitespace-nowrap
                transition-transform duration-200
                hover:scale-105
                min-w-[60px] text-center
            `}>
                {formatShortPrice(price)}
            </div>
            <div className="absolute -bottom-1.5">
                <div className={`
                    w-2.5 h-2.5 rotate-45 
                    ${isPremium ? 'bg-secondary-500' : 'bg-white'} 
                    border-r border-b border-gray-100
                    group-hover:scale-105
                    transition-transform duration-200
                `} />
            </div>
        </div>
    );
};

export default CustomMarker;