import { User, ClipboardList, Hospital, Building2, ShieldCheck } from 'lucide-react';

export default function FeaturesGrid() {
    const features = [
        { label: 'Jadwal Dokter', icon: User, active: false },
        { label: 'Periksa Kesehatan', icon: ClipboardList, active: false },
        { label: 'Jadwal Posyandu', icon: Hospital, active: true }, // Highlighted in design
        { label: 'Jadwal Puskesmas', icon: Building2, active: false },
        { label: 'Riwayat Pemeriksaan', icon: ShieldCheck, active: false },
    ];

    // We only show 4 items based on the design grid, but let's stick to the 4 main ones plus maybe the last one if needed.
    // Design shows 5 items effectively if we count the rightmost one "Riwayat Pemeriksaan". 
    // Let's create a responsive grid.

    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            <h3 className="text-center text-lg md:text-xl font-bold text-gray-800 mb-10">Anda Mungkin Mencari</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {features.slice(0, 4).map((feature, idx) => (
                    <div
                        key={idx}
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
                    </div>
                ))}
                {/* Added the 5th item manually to match if needed, or handle grid size */}
            </div>
        </div>
    );
}
