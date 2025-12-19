import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const articles = [
    {
        title: 'Cegah hipertensi berat dengan cek tekanan darah di rumah',
        author: 'Tim DokTerKu',
        date: 'March 11, 2022',
        image: '/article-1.png',
        tag: 'Kesehatan',
    },
    {
        title: '5 Tips to Protect Your Mental Health When You\'re Sick',
        author: 'Rebecca Lee',
        date: 'March 11, 2022',
        image: '/article-1.png', // Reusing placeholder
        tag: 'Kesehatan',
    },
    {
        title: '5 Tips to Protect Your Mental Health When You\'re Sick',
        author: 'Rebecca Lee',
        date: 'March 09, 2022',
        image: '/article-1.png', // Reusing placeholder
        tag: 'Medical',
    }
];

export default function HealthArticles() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Manfaat Periksa Kesehatan Secara Rutin
                </h2>
                <ArrowUpRight className="text-blue-500 w-8 h-8" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, idx) => (
                    <div key={idx} className="group cursor-pointer">
                        <div className="relative h-64 w-full rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition">
                            <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 uppercase">
                                {article.tag}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <span>{article.tag}</span>
                            <span>•</span>
                            <span>{article.date}</span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg leading-snug mb-3 group-hover:text-blue-600 transition">
                            {article.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden relative">
                                {/* Placeholder avatar */}
                                <Image src="/doctor-1.png" alt={article.author} fill className="object-cover" />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{article.author}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
