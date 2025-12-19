import { Search, MapPin, User } from 'lucide-react';

export default function SearchSection() {
    return (
        <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">

                <div className="flex-1 w-full bg-gray-50 rounded-lg flex items-center px-4 py-3 border border-gray-100 focus-within:ring-2 ring-blue-100 transition">
                    <Search className="text-gray-400 w-5 h-5 mr-3" />
                    <input
                        type="text"
                        placeholder="Cari pasien (NIK / nama)"
                        className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-200"></div>

                <div className="flex-1 w-full bg-gray-50 rounded-lg flex items-center px-4 py-3 border border-gray-100 focus-within:ring-2 ring-blue-100 transition">
                    <Search className="text-gray-400 w-5 h-5 mr-3" />
                    <input
                        type="text"
                        placeholder="Cari Dokter"
                        className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-200"></div>

                <div className="flex-1 w-full bg-gray-50 rounded-lg flex items-center px-4 py-3 border border-gray-100 focus-within:ring-2 ring-blue-100 transition">
                    <MapPin className="text-gray-400 w-5 h-5 mr-3" />
                    <input
                        type="text"
                        placeholder="Cari lokasi Puskesmas"
                        className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                    />
                </div>

                <button className="bg-blue-400 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-lg shadow-md transition w-full md:w-auto flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                </button>

            </div>
        </div>
    );
}
