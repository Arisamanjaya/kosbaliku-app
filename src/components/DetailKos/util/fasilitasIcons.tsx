import { IconAirConditioning, IconArmchair, IconBath, IconBed, IconBolt, IconBuildingStore, IconCar, IconChefHat, IconDeviceCctv, IconDeviceTv, IconFridge, IconMotorbike, IconPlant, IconPropeller, IconServer, IconSoup, IconStack, IconToiletPaper, IconUser, IconWashMachine, IconWifi, IconWindow } from '@tabler/icons-react';
import { JSX } from 'react';

const fasilitasIcons: Record<string, JSX.Element> = {
    "Air Panas": <IconSoup size={24} className="text-slate-500" />,
    "AC": <IconAirConditioning size={24} className="text-slate-500" />,
    "Kasur": <IconBed size={24} className="text-slate-500" />,
    "Listrik Token": <IconBolt size={24} className="text-slate-500" />,
    "Lemari Baju": <IconServer size={24} className="text-slate-500" />,
    "K. Mandi Dalam": <IconBath size={24} className="text-slate-500" />,
    "Toilet Duduk": <IconToiletPaper size={24} className="text-slate-500" />,
    "Kipas Angin": <IconPropeller size={24} className="text-slate-500" />,
    "Meja": <IconStack size={24} className="text-slate-500" />,
    "Kursi": <IconArmchair size={24} className="text-slate-500" />,
    "TV": <IconDeviceTv size={24} className="text-slate-500" />,
    "Jendela": <IconWindow size={24} className="text-slate-500" />,
    "Wi-Fi": <IconWifi size={24} className="text-slate-500" />,
    "Kulkas Bersama": <IconFridge size={24} className="text-slate-500" />,
    "Taman": <IconPlant size={24} className="text-slate-500" />,
    "Toko Kelontong": <IconBuildingStore size={24} className="text-slate-500" />,
    "CCTV": <IconDeviceCctv size={24} className="text-slate-500" />,
    "Parkir Motor": <IconMotorbike size={24} className="text-slate-500" />,
    "Parkir Mobil": <IconCar size={24} className="text-slate-500" />,
    "Penjaga Kos": <IconUser size={24} className="text-slate-500" />,
    "Dapur Bersama": <IconChefHat size={24} className="text-slate-500" />,
    "Laundry": <IconWashMachine size={24} className="text-slate-500" />,
};

export default fasilitasIcons;