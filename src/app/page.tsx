// src/app/page.tsx

"use client";
//天気
// ★インポートを@/に戻す
import CurrentWeather from './components/CurrentWeather';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaChevronRight, FaSearch, FaBook, FaApple } from 'react-icons/fa';
import { GiDiamondTrophy } from "react-icons/gi";
import Header from './components/Header';
import PeopleFilter from './components/PeopleFilter';


// 型定義
interface Work {
  title: string;
  slug: string;
  imageUrl: string;
}

const genres = [
  { name: 'メイド', slug: 'maid', description: 'ご主人様、お嬢様のために', imageUrl: '/genres/maid.jpg' },
  { name: 'アイドル', slug: 'idol', description: 'ステージで輝くポーズ', imageUrl: '/genres/idol.jpg' },
  { name: '学生', slug: 'student', description: '青春の1ページ', imageUrl: '/genres/student.jpg' },
  { name: '騎士', slug: 'knight', description: '剣と誇りを掲げて', imageUrl: '/genres/knight.jpg' },
  { name: '魔法少女', slug: 'magical-girl', description: '変身＆決めポーズ', imageUrl: '/genres/magical-girl.jpg' },
  { name: '忍者', slug: 'ninja', description: '忍び、舞う姿', imageUrl: '/genres/ninja.jpg' },
  { name: '普段着', slug: 'casual', description: '日常の自然な仕草', imageUrl: '/genres/casual.jpg' },
  { name: 'アクション', slug: 'action', description: '躍動感あふれる戦闘シーン', imageUrl: '/genres/action.png' },
];


const HomePage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeopleCount, setSelectedPeopleCount] = useState<number | null>(null);
  const [popularWorks, setPopularWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const genreScrollContainer = useRef<HTMLDivElement>(null);
  const workScrollContainer = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right', containerRef: React.RefObject<HTMLDivElement>) => {
    const scrollAmount = 300;
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchPopularWorks = async () => {
      try {
        // 仮のAPIエンドポイント。実際にはバックエンドからデータを取得
        const dummyData: Work[] = [
          { title: 'アニメタイトルA', slug: 'anime-a', imageUrl: '/works/anime_a.jpg' },
          { title: '作品B', slug: 'work-b', imageUrl: '/works/work_b.jpg' },
          { title: '長めのタイトルのアニメC', slug: 'anime-c', imageUrl: '/works/anime_c.jpg' },
          { title: '作品D', slug: 'work-d', imageUrl: '/works/work_d.jpg' },
          { title: 'アニメE', slug: 'anime-e', imageUrl: '/works/anime_e.jpg' },
        ];
        setPopularWorks(dummyData); // ダミーデータを使用
      } catch (error) {
        console.error('人気作品の取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopularWorks();
  }, []);

  const handlePeopleFilterChange = (count: number | null) => {
    setSelectedPeopleCount(count);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.append('q', searchTerm.trim());
    }
    if (selectedPeopleCount !== null) {
      params.append('people', selectedPeopleCount.toString());
    }
    const queryString = params.toString();
    if (queryString) {
      router.push(`/search?${queryString}`);
    }
  };

  return (
    <div className="bg-slate-800 min-h-screen text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 検索バーエリア */}
        <div className="bg-slate-700 p-8 rounded-lg shadow-lg mb-12">
          <div className="flex w-full mb-4">
            <button className="flex-shrink-0 bg-white text-slate-500 py-2 px-4 rounded-l-md flex items-center justify-center text-xl">
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="アニメタイトル、キャラクター名で検索"
              className="flex-1 w-auto px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <PeopleFilter onSelectPeople={handlePeopleFilterChange} />
            <button
              onClick={handleSearch}
              className="flex-shrink-0 bg-sky-500 text-white font-bold py-2 px-6 rounded-r-md hover:bg-sky-600 transition-colors"
            >
              さがす
            </button>
          </div>
          <div className="flex items-center gap-6 text-sm text-white justify-center">
            <Link href="/search?category=rank" className="flex items-center gap-1 hover:text-sky-300"><GiDiamondTrophy /> 階級</Link>
            <Link href="/search?category=novel" className="flex items-center gap-1 hover:text-sky-300"><FaBook /> 小説</Link>
            <Link href="/search?category=adam" className="flex items-center gap-1 hover:text-sky-300"><FaApple /> アダム</Link>
            <div className="border-l border-slate-500 h-4"></div>
            <Link href="/search" className="flex items-center gap-1 hover:text-sky-300"><FaSearch /> 詳細検索</Link>
          </div>
        </div>

        {/* ジャンル一覧セクション */}
        <h2 className="text-2xl font-bold mb-6">ジャンルから探す</h2>
        <div className="relative">
          <div ref={genreScrollContainer} className="flex overflow-x-auto space-x-6 pb-4 no-scrollbar">
            {genres.map((genre) => (
              <Link href={`/genres/${genre.slug}`} key={genre.slug} className="group block relative rounded-lg overflow-hidden shadow-lg aspect-[2/3] w-64 flex-shrink-0">
                <Image src={genre.imageUrl} alt={genre.name} fill sizes="33vw" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                  <h3 className="text-xl font-bold p-4 text-white">{genre.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          <button onClick={() => handleScroll('left', genreScrollContainer)} className="absolute top-1/2 left-0 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-opacity opacity-50 hover:opacity-100 z-10">
            <FaChevronLeft size={24} />
          </button>
          <button onClick={() => handleScroll('right', genreScrollContainer)} className="absolute top-1/2 right-0 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-opacity opacity-50 hover:opacity-100 z-10">
            <FaChevronRight size={24} />
          </button>
        </div>

        {/* 人気作品一覧セクション */}
        <h2 className="text-2xl font-bold mb-6 mt-12">人気作品から探す</h2>
        <div className="relative">
          <div ref={workScrollContainer} className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar">
            {isLoading ? (
              <div className="w-full text-center py-4">作品を読み込み中...</div>
            ) : (
              popularWorks.map((work) => (
                <Link
                  href={`/works/${work.slug}`}
                  key={work.slug}
                  className="group block relative rounded-lg overflow-hidden shadow-lg aspect-[2/3] w-64 flex-shrink-0"
                >
                  <Image
                    src={work.imageUrl}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                    <h3 className="text-xl font-bold p-4 text-white" title={work.title}>
                      {work.title}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
          <button onClick={() => handleScroll('left', workScrollContainer)} className="absolute top-1/2 left-0 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-opacity opacity-50 hover:opacity-100 z-10">
            <FaChevronLeft size={24} />
          </button>
          <button onClick={() => handleScroll('right', workScrollContainer)} className="absolute top-1/2 right-0 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-opacity opacity-50 hover:opacity-100 z-10">
            <FaChevronRight size={24} />
          </button>
        </div>

        {/* --- ツールセクション --- */}
        <h2 className="text-2xl font-bold mb-6 mt-12">ツール</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            
            {/* ★★★ 天気コンポーネントを配置 ★★★ */}
            {/* エラーは無視して、実行時に問題ないか確認 */}
            <CurrentWeather /> 
            
            {/* その他のTIPS項目 */}
            <Link href="/tips/locations" className="p-2 border border-gray-600 bg-slate-700 rounded-lg text-center shadow-sm hover:border-sky-500 transition block">
              <div className="text-sm font-bold mb-1">ロケ地情報</div>
              <img src="/tips/map.png" alt="ロケ地アイコン" className="w-16 h-16 mx-auto object-contain" />
              <div className="text-xs text-gray-400 mt-2">異国のタジンクロニクル</div>
            </Link>

            <Link href="/tips/gear" className="p-2 border border-gray-600 bg-slate-700 rounded-lg text-center shadow-sm hover:border-sky-500 transition block">
              <div className="text-sm font-bold mb-1">カメラ機材</div>
              <img src="/tips/camera.png" alt="カメラアイコン" className="w-16 h-16 mx-auto object-contain" />
              <div className="text-xs text-gray-400 mt-2">機材の選び方と使い方</div>
            </Link>
            
            {/* TIPS項目をさらに追加する場合はここに追加してください */}

        </div>
        {/* --- 旬襷TIPSセクション終了 --- */}

      </main>
      
      {/* 4. フッター（既存コードなし。簡略化） */}
      <footer className="bg-slate-700 text-white p-4 mt-10 text-center text-xs">
          <p>CosPose Navi © 2025</p>
      </footer>

    </div>
  );
};

export default HomePage;