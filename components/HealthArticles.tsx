import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const articles = [
    {
        title: 'Waspada Super Flu 2026: Gejala, Pencegahan, dan Kapan Harus ke Dokter',
        author: 'Dr. Ahmad Fauzi',
        date: 'Januari 14, 2026',
        image: '/superflue.png',
        tag: 'Trending',
        description: 'Super flu yang sedang mewabah memiliki gejala lebih berat dari flu biasa. Kenali tanda-tandanya.',
        link: 'https://www.halodoc.com/artikel/waspada-super-flu-kenali-gejala-dan-cara-menanganinya?srsltid=AfmBOooniN52gsHEaUe8RPtWM5rJ42I23rgMREtUyHKOfd1zPdeHLlmo',
    },
    {
        title: 'HMPV (Human Metapneumovirus): Virus Baru yang Perlu Diwaspadai',
        author: 'Dr. Sarah Wijaya',
        date: 'Januari 12, 2026',
        image: '/hmpv.jpg',
        tag: 'Virus',
        description: 'WHO mengimbau masyarakat waspada terhadap penyebaran HMPV. Berikut fakta lengkapnya.',
        link: 'https://www.alodokter.com/hmpv-ketahui-gejala-penyebab-dan-pencegahannya',
    },
    {
        title: 'Tips Menjaga Imunitas Tubuh di Musim Pancaroba 2026',
        author: 'Tim DokTerKu',
        date: 'Januari 10, 2026',
        image: '/pancaroba2.jpeg',
        tag: 'Kesehatan',
        description: 'Cuaca tidak menentu membuat tubuh rentan sakit. Ikuti tips berikut untuk tetap sehat.',
        link: 'https://upk.kemkes.go.id/new/tips-sehat-selama-musim-pancaroba',
    },
    {
        title: 'Bahaya Resistensi Antibiotik: Jangan Sembarangan Minum Obat',
        author: 'Dr. Budi Santoso',
        date: 'Januari 8, 2026',
        image: '/article-antibiotik.jpg',
        tag: 'Edukasi',
        description: 'Penggunaan antibiotik tanpa resep dokter dapat menyebabkan resistensi. Ketahui bahayanya.',
        link: '',
    },
    {
        title: 'Mental Health Awareness: Pentingnya Kesehatan Mental di Era Digital',
        author: 'Dr. Lisa Permata',
        date: 'Januari 5, 2026',
        image: '/article-mental.jpg',
        tag: 'Mental Health',
        description: 'Stres dan kecemasan meningkat di era digital. Pelajari cara menjaga kesehatan mental Anda.',
        link: '',
    },
    {
        title: 'Vaksinasi COVID-19 Booster 2026: Siapa yang Perlu Mendapatkannya?',
        author: 'Dr. Rini Hartati',
        date: 'Januari 3, 2026',
        image: '/article-vaksin.jpg',
        tag: 'Vaksinasi',
        description: 'Pemerintah menganjurkan booster terbaru untuk kelompok rentan. Cek apakah Anda termasuk.',
        link: '',
    },
];

export default function HealthArticles() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <span className="text-rose-500 font-semibold text-sm uppercase tracking-wide">Artikel Terbaru</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                        Berita Kesehatan Terkini
                    </h2>
                </div>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition">
                    Lihat Semua
                    <ArrowUpRight className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.slice(0, 3).map((article, idx) => (
                    <a 
                        key={idx} 
                        href={article.link || '#'} 
                        target={article.link ? '_blank' : undefined}
                        rel={article.link ? 'noopener noreferrer' : undefined}
                        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 block"
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            {/* Use actual image or gradient fallback */}
                            {article.image ? (
                                <Image 
                                    src={article.image} 
                                    alt={article.title} 
                                    fill 
                                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            ) : (
                                <div className={`absolute inset-0 ${
                                    idx === 0 ? 'bg-gradient-to-br from-red-400 to-orange-500' :
                                    idx === 1 ? 'bg-gradient-to-br from-purple-400 to-indigo-500' :
                                    'bg-gradient-to-br from-green-400 to-teal-500'
                                }`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-white/20 text-6xl font-bold">
                                            {idx === 0 ? '🦠' : idx === 1 ? '🔬' : '💪'}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide z-10 ${
                                article.tag === 'Trending' ? 'bg-red-500 text-white' :
                                article.tag === 'Virus' ? 'bg-purple-500 text-white' :
                                'bg-white/90 backdrop-blur-sm text-gray-700'
                            }`}>
                                {article.tag === 'Trending' && '🔥 '}{article.tag}
                            </span>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                <span className="text-blue-500 font-medium">{article.tag}</span>
                                <span>•</span>
                                <span>{article.date}</span>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg leading-snug mb-2 group-hover:text-blue-600 transition line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                {article.description}
                            </p>
                            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                    {article.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">{article.author}</span>
                                    <p className="text-xs text-gray-400">Penulis</p>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Second Row - Smaller Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {articles.slice(3, 6).map((article, idx) => (
                    <a 
                        key={idx} 
                        href={article.link || '#'}
                        target={article.link ? '_blank' : undefined}
                        rel={article.link ? 'noopener noreferrer' : undefined}
                        className="group cursor-pointer flex gap-4 p-4 bg-white rounded-xl hover:bg-gray-50 transition border border-gray-100"
                    >
                        <div className={`w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center ${
                            idx === 0 ? 'bg-amber-100' :
                            idx === 1 ? 'bg-pink-100' :
                            'bg-blue-100'
                        }`}>
                            <span className="text-3xl">
                                {idx === 0 ? '💊' : idx === 1 ? '🧠' : '💉'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                idx === 0 ? 'bg-amber-100 text-amber-700' :
                                idx === 1 ? 'bg-pink-100 text-pink-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {article.tag}
                            </span>
                            <h4 className="font-semibold text-gray-800 text-sm mt-2 line-clamp-2 group-hover:text-blue-600 transition">
                                {article.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">{article.date}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
