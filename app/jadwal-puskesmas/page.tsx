'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Clock, MapPin, Building2, Filter } from 'lucide-react';

export default function JadwalPuskesmasPage() {
  const [filter, setFilter] = useState('Semua');

  const facilities = [
    {
      name: 'Puskesmas SP-1 Kalibumi',
      type: 'Puskesmas',
      address: 'Nabire, Papua Tengah, Indonesia',
      mapUrl: 'https://maps.app.goo.gl/hsY2EQbrFVcoRyE37',
      embedSrc: 'https://maps.google.com/maps?q=Puskesmas+SP-1+Kalibumi&t=&z=15&ie=UTF8&iwloc=&output=embed',
      schedule: [
        { day: 'Senin - Kamis', time: '07:30 - 12:00', type: 'normal' },
        { day: 'Jumat', time: '07:30 - 10:00', type: 'normal' },
        { day: 'Sabtu', time: '07:30 - 11:00', type: 'normal' },
        { day: 'Minggu / Hari Besar', time: 'Tutup / IGD 24 Jam', type: 'danger' }
      ]
    },
    {
      name: 'BLUD RSUD NABIRE',
      type: 'Rumah Sakit',
      address: 'Jl. Raya Nabire, Siriwini, Nabire, Papua Tengah',
      mapUrl: 'https://maps.app.goo.gl/v6cebHzFxAdXQsdz8',
      embedSrc: 'https://maps.google.com/maps?q=BLUD+RSUD+NABIRE&t=&z=15&ie=UTF8&iwloc=&output=embed',
      schedule: [
         { day: 'Senin - Sabtu', time: '08:00 - 14:00 (Poli)', type: 'normal' },
         { day: 'Minggu', time: 'Tutup (Kecuali IGD)', type: 'danger' },
         { day: 'IGD', time: 'Buka 24 Jam', type: 'highlight' }
      ]
    },
    {
      name: 'Puskesmas Nabire Kota',
      type: 'Puskesmas',
      address: 'Oyehe, Nabire, Papua Tengah, Indonesia',
      mapUrl: 'https://maps.app.goo.gl/MhwVHJgjT4h1fzvF7',
      embedSrc: 'https://maps.google.com/maps?q=Puskesmas+Nabire+Kota&t=&z=15&ie=UTF8&iwloc=&output=embed',
      schedule: [
        { day: 'Senin - Kamis', time: '08:00 - 12:00', type: 'normal' },
        { day: 'Jumat', time: '08:00 - 11:00', type: 'normal' },
        { day: 'Sabtu', time: '08:00 - 12:00', type: 'normal' },
        { day: 'Minggu', time: 'Tutup / IGD 24 Jam', type: 'danger' }
      ]
    }
  ];

  const filteredFacilities = filter === 'Semua' 
    ? facilities 
    : facilities.filter(f => f.type === filter);

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Calendar className="text-blue-600" size={32} />
            Jadwal Operasional Fasilitas Kesehatan Di Wilayah Nabire
        </h1>

        {/* Filter Menu */}
        <div className="flex gap-4 mb-8 overflow-x-auto p-4">
            {['Semua', 'Puskesmas', 'Rumah Sakit'].map((item) => (
                <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm flex items-center gap-1 whitespace-nowrap
                        ${filter === item 
                            ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                        }`}
                >
                    {item === 'Semua' && <Filter size={16} />}
                    {item === 'Puskesmas' && <Building2 size={16} />}
                    {item === 'Rumah Sakit' && <Building2 size={16} />} 
                    {item}
                </button>
            ))}
        </div>

        <div className="flex flex-col gap-12">
            {filteredFacilities.map((facility, idx) => (
                <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-blue-600 px-8 py-4 text-white flex items-center gap-3">
                         <Building2 className="w-6 h-6 text-blue-200" />
                         <span className="bg-blue-500/50 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-400">
                            {facility.type}
                         </span>
                         <h2 className="text-xl font-bold">{facility.name}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-0">
                         {/* Jam Buka */}
                        <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
                             <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                                <Clock className="text-blue-500" /> Jam Buka Pendaftaran
                            </h3>
                            <ul className="space-y-4">
                                {facility.schedule.map((sch, i) => (
                                    <li key={i} className={`flex justify-between items-center ${i !== facility.schedule.length -1 ? 'border-b border-dashed border-gray-200 pb-3' : 'pt-2'}`}>
                                        <span className={sch.type === 'danger' ? 'text-red-500 font-medium' : 'text-gray-600'}>
                                            {sch.day}
                                        </span>
                                        <span className={`font-bold px-3 py-1 rounded-full text-sm 
                                            ${sch.type === 'danger' ? 'text-red-600 bg-red-50' : 
                                              sch.type === 'highlight' ? 'text-green-700 bg-green-50' : 
                                              'text-blue-900 bg-blue-50'}`}>
                                            {sch.time}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                         {/* Lokasi */}
                        <div className="p-8">
                             <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                                <MapPin className="text-red-500" /> Lokasi Pelayanan
                            </h3>
                             <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin size={20} className="text-red-600"/>
                                    </div>
                                    <div>
                                        <p className="text-gray-700 text-sm font-medium">
                                            {facility.address}
                                        </p>
                                        <a 
                                            href={facility.mapUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 text-xs font-bold hover:underline mt-1 inline-block"
                                        >
                                            Buka di Google Maps
                                        </a>
                                    </div>
                                </div>
                                
                                <div className="h-56 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        frameBorder="0" 
                                        scrolling="no" 
                                        marginHeight={0} 
                                        marginWidth={0} 
                                        src={facility.embedSrc}
                                        title={`Peta Lokasi ${facility.name}`}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
