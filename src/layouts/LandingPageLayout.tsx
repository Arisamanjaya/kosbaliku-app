import HeroLandingPage from '../components/Beranda/Hero/Hero';
import KosRekomen from '../components/Beranda/Section/KosRekomen';
import KosPremium from '../components/Beranda/Section/KosPremium';

export default function LandingPageLayout() {
    return (
        <>
            <HeroLandingPage />
            <div className='py-10 flex flex-col gap-8'>
            <KosPremium/>
            <KosRekomen />
            </div>
        </>
    );
}