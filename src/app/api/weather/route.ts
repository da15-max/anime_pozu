// src/app/api/weather/route.ts

import { NextResponse } from 'next/server';

// .env.local からキーを読み込む
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat'); // 緯度 (例: 35.6895)
  const lon = searchParams.get('lon'); // 経度 (例: 139.6917)

  // 緯度・経度のどちらかが送られてこなかったらエラー
  if (!lat || !lon) {
    return NextResponse.json({ error: '位置情報（緯度・経度）が必要です' }, { status: 400 });
  }

  // APIキーが設定されていなかったらエラー
  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json({ error: 'サーバー設定(Weather)が不完全です' }, { status: 500 });
  }

  try {
    // === OpenWeatherMap API 呼び出し ===
    // lang=ja (日本語)
    // units=metric (摂氏℃)
    const params = `?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&lang=ja&units=metric`;
    
    const response = await fetch(`${WEATHER_ENDPOINT}${params}`, {
      // データをキャッシュせず、常に最新の天気を取りに行く設定
      cache: 'no-store', 
    });

    if (!response.ok) {
      console.error("OpenWeatherMap API Error:", await response.text());
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    // フロントエンドに必要な情報だけを抽出して返す
    // (例: 'ja' -> '東京', 'weather[0].description' -> '晴れ', 'main.temp' -> 15.4)
    const weatherData = {
      locationName: data.name, // 場所名 (例: 新宿区)
      description: data.weather[0]?.description, // 天気の概要 (例: 晴れ)
      icon: data.weather[0]?.icon, // 天気アイコンID (例: 01d)
      temp: data.main?.temp, // 現在の気温 (例: 15.4)
    };

    return NextResponse.json(weatherData);

  } catch (error) {
    console.error("Error in /api/weather:", error); 
    return NextResponse.json(
      { error: '天気情報の取得に失敗しました' }, 
      { status: 500 }
    );
  }
}