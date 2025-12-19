import Image from 'next/image';
import { Plus } from 'lucide-react';

export default function FAQSection() {
    const questions = [
        "Why choose our medical for your family?",
        "Why we are different from others?",
        "Trusted & experience senior care & love",
        "How to get appointment for emergency cases?"
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 pb-0">
            <h2 className="text-2xl font-bold text-center text-blue-900 mb-12">Frequently Asked Questions</h2>

            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2 relative h-[400px]">
                    <Image src="/faq-illustration.png" alt="Happy family with doctor" fill className="object-contain" />

                    {/* Floating cards */}
                    <div className="absolute top-20 left-0 bg-white p-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce delay-700">
                        <span className="text-yellow-400 text-2xl">😊</span>
                        <div>
                            <p className="font-bold text-gray-800">84k+</p>
                            <p className="text-xs text-gray-400">Happy Patients</p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 space-y-4">
                    {questions.map((q, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 group transition rounded-lg">
                            <span className="font-medium text-gray-700 group-hover:text-blue-600">{q}</span>
                            <Plus className="text-blue-400 w-5 h-5 group-hover:rotate-90 transition" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
