import { User, ClipboardList, Hospital, Building2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesGrid() {
    const features = [
        { label: 'Jadwal Dokter', icon: User, active: false, href: '/jadwal-dokter' },
        { label: 'Periksa Kesehatan', icon: ClipboardList, active: false, href: '/periksa' },
        { label: 'Jadwal Puskesmas', icon: Building2, active: false, href: '/jadwal-puskesmas' },
        { label: 'Riwayat Pemeriksaan', icon: ShieldCheck, active: false, href: '#' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            <h3 className="text-center text-lg md:text-xl font-bold text-gray-800 mb-10">Anda Mungkin Mencari</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {features.slice(0, 4).map((feature, idx) => (
                    <Link
                        key={idx}
                        href={feature.href}
                        className={`flex flex-col items-center justify-center p-8 rounded-xl cursor-pointer transition-all duration-300
                    ${feature.active
                                ? 'bg-blue-50 border-2 border-blue-400 shadow-lg scale-105'
                                : 'bg-gray-50 hover:bg-white hover:shadow-md border border-transparent'
                            }
                `}
                    >
                        <feature.icon className={`w-12 h-12 mb-4 ${feature.active ? 'text-blue-500' : 'text-blue-400'}`} strokeWidth={1.5} />
                        <span className={`text-sm font-medium ${feature.active ? 'text-blue-600' : 'text-gray-500'}`}>
                            {feature.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
