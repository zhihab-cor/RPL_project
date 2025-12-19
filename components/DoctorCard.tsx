import Image from 'next/image';

interface DoctorCardProps {
    image: string;
    name: string;
    specialty: string;
    qualification: string;
    experience: string;
    location: string;
    likes: number;
    available: boolean;
}

export default function DoctorCard({ image, name, specialty, qualification, experience, location, likes, available }: DoctorCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 mb-4">
            <div className="w-full md:w-auto flex justify-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-100 p-1">
                    <Image src={image} alt={name} fill className="object-cover rounded-full" />
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-600 mb-1">{name}</h3>
                <p className="text-sm text-gray-500 mb-1">{specialty}</p>
                <p className="text-xs text-gray-400 mb-2">{qualification}</p>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                    <span>{experience}</span>
                    <span>•</span>
                    <span><span className="font-bold">{likes}</span> Happy Patients</span>
                </div>

                <div className="flex gap-2">
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold">99%</div>
                    <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px]">72 Patient Stories</div>
                </div>
            </div>

            <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                {available && (
                    <div className="text-green-500 text-xs font-medium flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Available Today
                    </div>
                )}

                <div className="text-right">
                    <p className="text-xs text-gray-400">Next available appointment</p>
                    <p className="text-sm text-gray-600 font-medium">10:00 AM tomorrow</p>
                </div>

                <button className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition text-sm">
                    Book Clinic Visit
                </button>
            </div>
        </div>
    );
}
