// src/app/genres/[slug]/page.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import { posesData, Pose } from '@/data/poses'; // 正しいパス
import { FaUser, FaHeart } from 'react-icons/fa';

const genreNames: { [key: string]: string } = {
  idol: 'アイドル',
  maid: 'メイド',
  student: '学生',
  knight: '騎士',
  'magical-girl': '魔法少女',
  ninja: '忍者',
  casual: '普段着',
  action: 'アクション',
};

const idolTags = ['全て', 'ソロ', 'ユニット', 'マッシー', 'クール', 'キュート'];

type Props = {
  params: {
    slug: string;
  };
};

const GenrePage = ({ params }: Props) => {
  const { slug } = params;
  const genreName = genreNames[slug] || '不明なジャンル';
  const allPoses = posesData.filter((pose: Pose) => pose.genre === slug);

  const [activeFilter, setActiveFilter] = useState('全て');

  // ▼▼▼ pose.tags の代わりに peopleCount などを使うか、一旦 allPoses を使う ▼▼▼
  // const filteredPoses = activeFilter === '全て'
  //   ? allPoses
  //   : allPoses.filter(pose => pose.tags && pose.tags.includes(activeFilter)); // tags がないので一旦コメントアウト
  const filteredPoses = allPoses; // ← とりあえず全件表示にする場合

  const handleFilterClick = (tag: string) => {
    setActiveFilter(tag);
  };

  return (
    <div className="bg-slate-800 min-h-screen text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-slate-400">
          <Link href="/" className="hover:text-white">ホーム</Link>
          <span className="mx-2">&gt;</span>
          <span>{genreName}</span>
        </div>
        <h1 className="text-3xl font-bold mb-6">
          {genreName} ポーズ一覧
        </h1>

        {slug === 'idol' && (
          <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            {idolTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleFilterClick(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === tag
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {filteredPoses.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredPoses.map((pose) => (
              <Link href={`/poses/${pose.id}`} key={pose.id} className="bg-slate-700 rounded-lg overflow-hidden shadow-md group block">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={pose.imageUrl}
                    alt={pose.title} // ★ name から title に変更
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold truncate mb-1">{pose.title}</p> {/* ★ name から title に変更 */}
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <FaUser />
                      {/* ▼▼▼ pose.tags の代わりに peopleCount を表示する例 ▼▼▼ */}
                      {pose.peopleCount}人 {/* ← tags の代わりに人数を表示 */}
                    </span>
                    <button className="flex items-center gap-1 hover:text-pink-500">
                      <FaHeart /> {/* いいね数を表示する場合は {pose.likes} を追加 */}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          activeFilter === '全て' ? (
             <p>このジャンルのポーズはまだ登録されていません。</p>
          ) : (
             <p>この条件に合うポーズは見つかりませんでした。</p>
          )
        )}
      </main>
    </div>
  );
};

export default GenrePage;