import Image from 'next/image';

const doctors = [
    {
        name: 'Dr. Melati Wati',
        role: 'Dokter Puskesmas',
        image: '/doctor-2.png',
    },
    {
        name: 'Heema Rasana',
        role: 'Bidan Posyandu',
        image: '/doctor-3.png', // Using the glasses one for variety as "male nurse/bidan" placeholder or similar
    },
    {
        name: 'Hermawan',
        role: 'Apoteker',
        image: '/doctor-1.png',
    },
    {
        name: 'Dr. Ahmad',
        role: 'Dokter Umum',
        image: '/doctor-3.png',
    },
];

export default function MedicalStaff() {
    return (
        <div className="bg-blue-50/50 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-12">
                    Tenaga Kesehatan Pendamping
                </h2>

                <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
                    {doctors.map((doctor, idx) => (
                        <div key={idx} className="min-w-[200px] md:min-w-[250px] flex-shrink-0 bg-white rounded-t-full rounded-b-lg overflow-hidden flex flex-col items-center pb-6 shadow-sm hover:shadow-md transition snap-center group cursor-pointer">
                            <div className="w-full aspect-square relative bg-blue-100 rounded-full overflow-hidden mb-4 mt-4 mx-4 border-4 border-white shadow-inner">
                                <Image src={doctor.image} alt={doctor.name} fill className="object-cover group-hover:scale-105 transition duration-500" />
                            </div>
                            <div className="text-center px-4">
                                <h3 className="font-bold text-gray-800 text-lg mb-1">{doctor.name}</h3>
                                <p className="text-blue-400 text-xs font-medium uppercase tracking-wide">{doctor.role}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 mt-4 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                </div>
            </div>
        </div>
    );
}
