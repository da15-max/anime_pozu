// src/app/api/search-images/route.ts

import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_API_KEY;
const CSE_ID = process.env.GOOGLE_CSE_ID;
const BASE_URL = "https://www.googleapis.com/customsearch/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q'); // ユーザーの入力 (例: "セイバー")
  
  // ▼▼▼ 1. 新しいパラメータを受け取る ▼▼▼
  const poseType = searchParams.get('poseType'); // 'stand' または 'sit'

  if (!query) {
    return NextResponse.json({ error: '検索キーワードが必要です' }, { status: 400 });
  }
  if (!API_KEY || !CSE_ID) {
    return NextResponse.json({ error: 'サーバー設定が不完全です' }, { status: 500 });
  }

  try {
    const userQuery = query; 
    
    // ▼▼▼ 2. 立ち/座り用のキーワードを準備 ▼▼▼
    let poseTypeKeywords = '';
    if (poseType === 'stand') {
      poseTypeKeywords = '("立ち" OR "立ち姿" OR "立位")';
    } else if (poseType === 'sit') {
      poseTypeKeywords = '("座り" OR "座る" OR "座位")';
    }
    // poseType が 'all' または null の場合は空のまま（絞り込まない）

    // 既存のキーワード
    const positiveKeywords = `("全身" OR "上半身" OR "立ち絵" OR "ポーズ集" OR "イラスト")`;
    const negativeKeywords = "-写真 -実写 -コスプレ -台座 -箱 -中古 -パーツ -レビュー -開封 -Amazon -楽天 -あみあみ -駿河屋 -メルカリ -ヤフオク -背景 -壁紙 -スクリーンショット";

    // ▼▼▼ 3. すべてを組み合わせて検索語を作成 ▼▼▼
    const enhancedQuery = `${userQuery} ${poseTypeKeywords} ${positiveKeywords} ${negativeKeywords}`;
    
    console.log("Googleに送信する検索語:", enhancedQuery);
    
    // --- 30件取得するロジック (変更なし) ---
    
    const urlPage1 = `${BASE_URL}?key=${API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(enhancedQuery)}&searchType=image&num=10&start=1`;
    // const urlPage2 = `${BASE_URL}?key=${API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(enhancedQuery)}&searchType=image&num=10&start=11`;
    // const urlPage3 = `${BASE_URL}?key=${API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(enhancedQuery)}&searchType=image&num=10&start=21`;

    const [response1, ] = await Promise.all([
      //response2, response3
      fetch(urlPage1),
      // fetch(urlPage2),
      // fetch(urlPage3)
    ]);

    if (!response1.ok ) {
      // || !response2.ok || !response3.ok) {
      console.error("Google API Error Response 1:", await response1.text());
      // console.error("Google API Error Response 2:", await response2.text());
      // console.error("Google API Error Response 3:", await response3.text());
      throw new Error(`Google API error: ${response1.statusText} `);
      /// ${response2.statusText} / ${response3.statusText}
    }

    const data1 = await response1.json();
    // const data2 = await response2.json();
    // const data3 = await response3.json();

    const items1 = (data1.items && data1.items.length > 0) ? data1.items : [];
    // const items2 = (data2.items && data2.items.length > 0) ? data2.items : [];
    // const items3 = (data3.items && data3.items.length > 0) ? data3.items : [];

    const allItems = [...items1, ];
    //...items2, ...items3
    if (allItems.length === 0) {
      return NextResponse.json([]); 
    }
    
    const images = allItems
      .map((item: any) => {
        if (item && item.link && item.title && item.snippet && item.image && item.image.contextLink) {
          return {
            id: item.cacheId || item.link,
            title: item.title,
            imageUrl: item.link, 
            thumbnailUrl: item.image.thumbnailLink, 
            pageUrl: item.image.contextLink, 
            snippet: item.snippet,
          };
        }
        return null;
      })
      .filter(Boolean);

    return NextResponse.json(images);

  } catch (error) {
    console.error("Error in /api/search-images:", error); 
    return NextResponse.json(
      { error: '画像検索に失敗しました' }, 
      { status: 500 }
    );
  }
}