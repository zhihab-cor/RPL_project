import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSearch from '@/components/DoctorSearch';
import DoctorCard from '@/components/DoctorCard';
import FAQSection from '@/components/FAQSection';
import Image from 'next/image';

const doctors = [
    {
        name: 'Dr. Shantanu Jambhekar',
        specialty: 'Dentist',
        qualification: '10 years experience overall',
        experience: 'Parell, Mumbai',
        location: 'Smilestudio Center For Advanced Dentistry + 1 more',
        likes: 99,
        available: true,
        image: '/doctor-1.png'
    },
    {
        name: 'Dr. Melati Wati',
        specialty: 'General Practitioner',
        qualification: '8 years experience overall',
        experience: 'Semarang, Central Java',
        location: 'Puskesmas Pandanaran',
        likes: 95,
        available: true,
        image: '/doctor-2.png'
    },
    {
        name: 'Dr. Ahmad',
        specialty: 'Pediatrician',
        qualification: '15 years experience overall',
        experience: 'Jakarta, Indonesia',
        location: 'Rumah Sakit Bunda',
        likes: 98,
        available: false,
        image: '/doctor-3.png'
    },
    {
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        qualification: '12 years experience overall',
        experience: 'Surabaya, East Java',
        location: 'Mitra Keluarga Hospital',
        likes: 97,
        available: true,
        image: '/checkup-2.png' // Using generic placeholder for variety
    },
    {
        name: 'Dr. Budi Santoso',
        specialty: 'Orthopedic',
        qualification: '20 years experience overall',
        experience: 'Bandung, West Java',
        location: 'Hasan Sadikin Hospital',
        likes: 92,
        available: true,
        image: '/doctor-1.png'
    }
];

export default function JadwalDokterPage() {
    return (
        <main className="min-h-screen bg-white font-sans">
            <Navbar />

            <DoctorSearch />

            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
                {/* Left Content - Cards */}
                <div className="flex-[3]">
                    <h2 className="text-lg font-bold text-gray-700 mb-2">99 doctors available in Andheri west</h2>
                    <p className="text-xs text-gray-500 mb-6 flex items-center gap-1">
                        <span className="bg-green-100 p-0.5 rounded-full">✓</span> Book appointments with minimum wait-time & verified doctor details
                    </p>

                    {doctors.map((doc, idx) => (
                        <DoctorCard key={idx} {...doc} />
                    ))}

                    {/* Pagination Mockup */}
                    <div className="flex gap-2 mt-8 justify-center">
                        <button className="w-8 h-8 rounded border text-gray-500 hover:bg-gray-50">&lt;</button>
                        <button className="w-8 h-8 rounded bg-blue-400 text-white">1</button>
                        <button className="w-8 h-8 rounded border text-gray-500 hover:bg-gray-50">2</button>
                        <button className="w-8 h-8 rounded border text-gray-500 hover:bg-gray-50">3</button>
                        <span className="flex items-center text-gray-400">...</span>
                        <button className="w-8 h-8 rounded border text-gray-500 hover:bg-gray-50">10</button>
                        <button className="w-8 h-8 rounded border text-gray-500 hover:bg-gray-50">&gt;</button>
                    </div>
                </div>

                {/* Right Content - Widgets */}
                <div className="flex-1 space-y-6 hidden lg:block">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-sm mb-4">Provide current location to see dentist near you</h3>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-4">
                            <span className="bg-gray-100 px-2 py-1 rounded">Andheri West</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Goregaon East</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Versova</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 border border-blue-400 text-blue-500 text-xs py-2 rounded">Select Location</button>
                            <button className="flex-1 bg-blue-400 text-white text-xs py-2 rounded">Current Location</button>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-sm mb-2 text-blue-900">This World Oral Health Day,</h3>
                        <h4 className="font-bold text-lg mb-4 text-blue-600">Get a FREE Appointment* with Top Dentists.</h4>
                        <p className="text-xs text-gray-500 mb-4">*T&C Apply</p>

                        <button className="w-full bg-blue-400 hover:bg-blue-500 text-white text-sm py-2 rounded">Book FREE Clinic Visit</button>
                    </div>
                </div>
            </div>

            <FAQSection />

            <Footer />
        </main>
    );
}
