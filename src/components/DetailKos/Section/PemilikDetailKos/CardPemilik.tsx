import { IconBrandWhatsapp, IconMail, IconBrandInstagram } from "@tabler/icons-react";

export default function CardPemilik({ kos }: { kos: any }) {
    return (
        <div className="w-72 h-fit bg-white border-slate-300 border rounded-xl p-4 shadow-xl flex flex-col gap-4 fixed">
            <div>
                <span className="text-xs font-medium text-white bg-primary-500 rounded-lg px-2 py-1">
                    {kos.durasi}
                </span>
            </div>
            <div className="flex items-center">
                <h5 className="text-secondary-500 text-xl font-semibold">Rp{kos.harga.toLocaleString("id-ID")}</h5>
                <span className="text-secondary-500 text-sm font-normal">/{kos.durasi}</span>
            </div>
            <hr />
            <div className="flex gap-4 flex-col">
                <h5 className="text-xl font-semibold text-slate-800">{kos.users?.user_name || "Pemilik Tidak Diketahui"}</h5>
                <div className="text-sm text-slate-500">
                    <ul className="gap-4 flex flex-col">
                        <li className="flex items-center gap-2">
                            <IconBrandInstagram size={24}/> 
                            {kos.users?.user_ig || "Belum ada IG"}    
                        </li>
                        <li className="flex items-center gap-2">
                            <IconMail size={24}/>
                            {kos.users?.user_email || "Email Tidak Diketahui"}
                        </li>
                        <li className="flex items-center gap-2">
                            <IconBrandWhatsapp size={24}/>
                            {kos.users?.user_phone || "No WhatsApp Tidak Diketahui"}
                        </li>
                    </ul>
                </div>
            </div>
            <button className="bg-primary-500 text-white rounded-full px-4 py-2 flex items-center gap-2 justify-center">
                <IconBrandWhatsapp size={24} />
                <a href={`https://wa.me/${kos.users?.user_phone}`} target="_blank" rel="noopener noreferrer">
                    Hubungi Pemilik
                </a>
            </button>
        </div>
    );
}

