import { Clock, Phone, MapPin } from 'lucide-react';

export default function ContactSection() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-16">
                Butuh Bantuan?
            </h2>

            <div className="flex flex-col md:flex-row gap-12">
                {/* Left Info */}
                <div className="md:w-1/3 space-y-8">
                    <div>
                        <h3 className="text-blue-400 font-bold text-lg mb-4">Kontak Layanan Puskesmas</h3>
                    </div>

                    <div className="flex items-start gap-4">
                        <Clock className="text-blue-400 w-6 h-6 mt-1" />
                        <div>
                            <p className="text-blue-400 text-sm">Mon - Fri : 8.00 am - 10.00 pm</p>
                            <p className="text-blue-400 text-sm">Sat - Sun : 9.00 am - 9.00 pm</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Phone className="text-blue-400 w-6 h-6 mt-1" />
                        <div>
                            <p className="text-blue-400 text-sm">Phone : +0800 2560 0020</p>
                            <p className="text-blue-400 text-sm">Email : booking@healthpoint.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <MapPin className="text-blue-400 w-6 h-6 mt-1" />
                        <div>
                            <p className="text-blue-400 text-sm">Phone : +0800 2560 0020</p>
                            <p className="text-blue-400 text-sm">Email : booking@healthpoint.com</p>
                        </div>
                    </div>

                    <button className="bg-blue-400 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded text-sm transition mt-4">
                        Lihat Lokasi di Peta
                    </button>
                </div>

                {/* Right Form */}
                <div className="md:w-2/3">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                            <input type="text" placeholder="Full Name" className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-blue-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                            <input type="email" placeholder="Email Address" className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-blue-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                            <input type="text" placeholder="+62" className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-blue-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
                            <select className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-blue-400 bg-white text-gray-500">
                                <option>Clinic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Time</label>
                            <select className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-blue-400 bg-white text-gray-500">
                                <option>4:00 PM</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                            <input type="date" className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-blue-400 text-gray-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                            <textarea placeholder="Anything else you want to communicate" rows={3} className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-blue-400"></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <button type="submit" className="bg-gray-200 text-gray-500 font-medium px-8 py-2 rounded text-sm hover:bg-gray-300 transition">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
