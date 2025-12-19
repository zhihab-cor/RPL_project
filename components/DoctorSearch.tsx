import { Search, MapPin } from 'lucide-react';

export default function DoctorSearch() {
    return (
        <div className="bg-blue-50/50 py-8 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-blue-900 mb-6">periksa kesehatan</h1>

                <div className="bg-white rounded-xl shadow-sm p-2 flex flex-col md:flex-row gap-2">
                    <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100">
                        <MapPin className="text-gray-400 w-5 h-5 mr-3" />
                        <input
                            type="text"
                            placeholder="Set your location"
                            className="w-full outline-none text-sm text-gray-700"
                        />
                    </div>

                    <div className="flex-[2] flex items-center px-4 py-2">
                        <Search className="text-gray-400 w-5 h-5 mr-3" />
                        <input
                            type="text"
                            placeholder="Search Doctor, Hospital"
                            className="w-full outline-none text-sm text-gray-700"
                        />
                    </div>

                    <button className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2">
                        <Search className="w-4 h-4" />
                        Search
                    </button>
                </div>

                <div className="flex gap-4 mt-6">
                    <div>
                        <select className="bg-white border border-gray-200 rounded px-4 py-2 text-xs text-gray-600 outline-none">
                            <option>Availability</option>
                        </select>
                    </div>
                    <div>
                        <select className="bg-white border border-gray-200 rounded px-4 py-2 text-xs text-gray-600 outline-none">
                            <option>Gender</option>
                        </select>
                    </div>
                    <div>
                        <select className="bg-white border border-gray-200 rounded px-4 py-2 text-xs text-gray-600 outline-none">
                            <option>Sort By : Relevance</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
