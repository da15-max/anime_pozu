// src/app/search/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Markdown表示用ライブラリ
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 画像検索APIから返される型
interface PoseImage {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  pageUrl: string;
  snippet: string;
}

// アドバイスAPIから返される型
interface PoseAdvice {
  advice: string;
  // sources は空配列でも型を合わせておく
  sources: { uri: string, title: string }[]; 
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [images, setImages] = useState<PoseImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- アドバイス機能用のState ---
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [adviceData, setAdviceData] = useState<PoseAdvice | null>(null);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  
  const query = searchParams.get('q');
  const poseType = searchParams.get('poseType') || 'all';

  // 1. 画像検索の実行
  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setImages([]); // 新しい検索のために古い結果をクリア
    setError(null);

    // /api/search-images を呼び出し
    fetch(`/api/search-images?q=${encodeURIComponent(query)}&poseType=${poseType}`)
      .then(res => res.json())
      .then((data: PoseImage[] | { error: string }) => {
        if ('error' in data) {
          throw new Error(data.error);
        }
        setImages(data);
      })
      .catch(err => {
        console.error("画像検索エラー:", err);
        setError(err.message || '画像の検索に失敗しました。');
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [query, poseType]);

  // 2. ★「アドバイスを見る」ボタンが押された時の処理
  const handleGetAdvice = async (title: string, imageUrl: string) => { // ★ imageUrl を引数に追加
    setIsLoadingAdvice(true);
    setAdviceData(null);
    setAdviceError(null);
    
    try {
      // ★ APIに imageUrl もクエリパラメータとして渡す
      const response = await fetch(
        `/api/pose-advice?title=${encodeURIComponent(title)}&imageUrl=${encodeURIComponent(imageUrl)}`
      );
      const data = await response.json(); // APIからのレスポンスを待つ

      if (!response.ok || data.error) {
        // data.error にAPIルートで設定したエラーメッセージが入る
        throw new Error(data.error || 'アドバイスの取得に失敗しました。');
      }
      
      // ★ 修正: APIは { advice: "..." } の形式で返す
      // フロントエンドの型 (PoseAdvice) に合わせるため、sources: [] を追加
      setAdviceData({ advice: data.advice, sources: [] }); 

    } catch (err) {
      console.error("アドバイス取得エラー:", err);
      setAdviceError((err as Error).message);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  // 3. ★モーダルを閉じる処理
  const closeAdviceModal = () => {
    setAdviceData(null);
    setAdviceError(null);
  };

  return (
    <div className="bg-slate-800 min-h-screen text-white">
      {/* (ヘッダーコンポーネントをここに配置) */}
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-slate-400">
          <Link href="/" className="hover:text-white">
            ホーム
          </Link>
          <span className="mx-2">&gt;</span>
          <span>検索結果</span>
        </div>
        <h1 className="text-2xl font-bold mb-6">
          検索結果: <span className="text-sky-400">{query}</span>
        </h1>

        {/* --- 画像検索結果の表示 --- */}
        {isLoading && <p>画像を検索中...</p>}
        {error && <p className="text-red-400">エラー: {error}</p>}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map(image => (
            <div key={image.id} className="bg-slate-700 rounded-lg shadow-lg overflow-hidden flex flex-col">
              <Link href={image.pageUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-square">
                <Image
                  src={image.thumbnailUrl} // サムネイルURL
                  alt={image.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => e.currentTarget.src = 'https://placehold.co/300x300/e2e8f0/94a3b8?text=Error'}
                />
              </Link>
              <div className="p-3 flex flex-col flex-grow">
                <p className="text-xs text-gray-400 truncate">{image.snippet}</p>
                <h3 className="text-sm font-semibold text-white truncate my-1 flex-grow" title={image.title}>
                  {image.title}
                </h3>
                
                {/* ★「アドバイスを見る」ボタンの onClick を修正 */}
                <button
                  onClick={() => handleGetAdvice(image.title, image.imageUrl)} // ★ image.imageUrl を渡す
                  className="w-full mt-2 px-3 py-1.5 bg-sky-500 text-white text-xs font-bold rounded-md hover:bg-sky-600 transition-colors"
                >
                  撮影アドバイスを見る
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- ★アドバイス表示用モーダル --- */}
      {(isLoadingAdvice || adviceData || adviceError) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={closeAdviceModal} // 背景クリックで閉じる
        >
          <div 
            className="bg-slate-800 w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl overflow-y-auto p-6 border border-slate-600"
            onClick={(e) => e.stopPropagation()} // モーダル内部のクリックは伝播させない
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-sky-400">撮影アドバイス</h2>
              <button
                onClick={closeAdviceModal}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            {isLoadingAdvice && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto"></div>
                <p className="mt-4 text-lg">AIにアドバイスを生成させています...</p>
              </div>
            )}
            
            {adviceError && (
              <div className="bg-red-900 border border-red-600 text-red-100 p-4 rounded-lg">
                <p className="font-bold">エラーが発生しました</p>
                <p className="text-sm">{adviceError}</p>
              </div>
            )}

            {adviceData && (
              <div className="prose prose-invert prose-slate max-w-none">
                {/* ★react-markdown を使ってMarkdownを表示 */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {adviceData.advice}
                </ReactMarkdown>

                {/* (Gemini版と異なり、OpenAI版は sources: [] を返すのでここは表示されない) */}
                {adviceData.sources && adviceData.sources.length > 0 && (
                  <div className="mt-6 border-t border-slate-600 pt-4">
                    <h4 className="font-bold text-sm text-slate-400 mb-2">参照元:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {adviceData.sources.map((source, index) => (
                        <li key={index} className="text-xs">
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:underline"
                          >
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}