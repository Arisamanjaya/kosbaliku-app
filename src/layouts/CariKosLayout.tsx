import GlobalLayout from './GlobalLayout';
import FilterKos from '../components/CariKos/FilterKos';

export default function CariKosLayout({ kos } : { kos: any }) {
    
    
    return (
        <GlobalLayout>
            <FilterKos />
        </GlobalLayout>
    );
};