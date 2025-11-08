// src/components/CurrentWeather.tsx
"use client";

import React, { useState, useEffect } from 'react';

// 天気APIから返されるデータの型
interface WeatherData {
  locationName: string; // 場所名 (例: 新宿区)
  description: string;  // 天気の概要 (例: 晴れ)
  icon: string;         // 天気アイコンID (例: 01d)
  temp: number;         // 現在の気温 (例: 15.4)
}

const CurrentWeather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ① ブラウザが位置情報取得に対応しているかチェック
    if (!navigator.geolocation) {
      setError('ブラウザが位置情報取得をサポートしていません。');
      setLoading(false);
      return;
    }

    // ② 現在地を取得する関数
    const fetchWeatherByLocation = (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      // 作成したAPIルートを呼び出し
      fetch(`/api/weather?lat=${lat}&lon=${lon}`)
        .then(res => {
          if (!res.ok) {
            // HTTPエラー（400や500）の場合
            return res.json().then(err => {
              throw new Error(err.error || 'サーバー側でエラーが発生しました。');
            });
          }
          return res.json();
        })
        .then((data: WeatherData) => {
          // 成功: 天気データをセット
          setWeather(data);
          setError(null);
        })
        .catch((e) => {
          // 失敗: エラーメッセージをセット
          console.error("天気取得エラー:", e);
          setError(e.message || "現在地の天気情報取得に失敗しました。");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    // ③ 位置情報取得を開始
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      fetchWeatherByLocation, // 成功時のコールバック
      (geoError) => {         // 失敗時のコールバック
        console.error("位置情報エラー:", geoError);
        setError("位置情報の取得が拒否されました。ブラウザ設定を確認してください。");
        setLoading(false);
      }
    );
  }, []);

  // --- 表示部分 ---

if (loading) {
    return (
      // TIPSアイテムのデザインに合わせる
      <div className="p-2 border border-gray-600 bg-slate-700 rounded-lg text-center shadow-sm text-gray-400">
        現在地の天気を取得中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 border border-red-500 bg-red-800 rounded-lg text-center shadow-md text-sm text-white">
        ⚠️ {error}
      </div>
    );
  }

  if (!weather) {
      return null;
  }

  // OpenWeatherMapのアイコンURL (アイコンIDを埋め込む)
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  const tempRounded = Math.round(weather.temp);

  return (
    // TIPSアイテムのデザインに合わせ、青いボーダーとホバー効果を追加
    <div className="p-2 border border-blue-400 bg-slate-700 rounded-lg text-center shadow-md hover:border-sky-500 transition block cursor-pointer">
      <div className="text-sm font-bold text-sky-300 mb-1">現在の天気</div>
      
      {/* 天気アイコンと気温 */}
      <img 
        src={iconUrl} 
        alt={weather.description} 
        className="w-16 h-16 mx-auto object-contain" 
        style={{ marginTop: '-4px', marginBottom: '-4px' }} // アイコンを中央に寄せるための微調整
      />
      
      <div className="text-2xl font-extrabold text-white">
        {tempRounded}°C
      </div>
      <div className="text-xs text-gray-400 font-medium mt-2">
        {weather.locationName} | {weather.description}
      </div>
    </div>
  );
};

export default CurrentWeather;