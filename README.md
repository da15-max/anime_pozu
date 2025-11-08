ConPose Navi (anime_pozu)

概要

ConPose Navi（コンポーズ・ナビ）は、アニメやマンガのキャラクターの「こんなポーズが見たい」を瞬時に検索し、さらにAIがその撮影方法をアドバイスしてくれるWebアプリケーションです。

コスプレイヤーの方、またはカメラマンの方が、インスピレーションを得たり、具体的な撮影の構図を考える際のサポートを目的としています。

主な機能

ポーズ画像検索機能

アニメや、ゲームのキャラクターの名前を入力することでそのキャラクターの全身が映った画像が検索できるようになっています。
画像をクリックすると、元の掲載ページにアクセスできます。

AI撮影アドバイス機能

検索結果の各画像にある「撮影アドバイスを見る」ボタンをクリックすると、OpenAIのAPI（GPT）がその画像とタイトルを基に、「どのようなカメラ設定、構図、ライティングで撮影すればよいか」を具体的にアドバイスします。

プレビュー
ホーム画面
<img width="1882" height="859" alt="スクリーンショット 2025-11-08 160830" src="https://github.com/user-attachments/assets/77b9e9ca-0e8e-4f7a-926c-47951dea0f44" />

ジャンルからアイドルを選択
<img width="1914" height="866" alt="スクリーンショット 2025-11-08 160841" src="https://github.com/user-attachments/assets/44abb974-a379-4f14-baba-c9a177bddc7d" />

ページ下に現在地の天気やイベント会場の場所などを調べるツール
<img width="1857" height="817" alt="スクリーンショット 2025-11-08 160852" src="https://github.com/user-attachments/assets/0aad655f-fb18-4f80-b85f-d4c8f15ce9a2" />

竈門炭治郎と検索
<img width="1573" height="155" alt="スクリーンショット 2025-11-08 160947" src="https://github.com/user-attachments/assets/4c59ba8d-ead4-4340-a7cd-10f851b233d4" />

検索結果の表示（制限しているので10件の結果）
<img width="1865" height="865" alt="スクリーンショット 2025-11-08 161010" src="https://github.com/user-attachments/assets/a7e6f097-9c81-4bde-9ddb-fc002ec17860" />

取りたいポーズのアドバイスをもらう（生成に10秒ほどかかります）
<img width="336" height="451" alt="スクリーンショット 2025-11-08 161414" src="https://github.com/user-attachments/assets/d21b92fa-aa5d-4763-aedc-6967a34df642" />

AIによるおススメの撮影方法の表示
<img width="1882" height="874" alt="スクリーンショット 2025-11-08 161353" src="https://github.com/user-attachments/assets/70234281-7485-4280-8845-9763415c6640" />





今後の改善点
AI撮影アドバイスの文章が見づらい
アニメのタイトルで検索した際にその作品のアニメキャラ一覧の画像を表示
検索語の画質の改善
ログイン機能によるアドバイスの記録
検索結果の画面の保持

使用技術

このプロジェクトは、以下の技術を使用して構築されています。

フロントエンド: Next.js, React, Tailwind CSS

バックエンド (APIルート): Next.js API Routes

画像検索: Google Custom Search API

AIアドバイス: OpenAI API (GPT)

デプロイ: Vercel

ローカルでの実行方法

このリポジトリを自分のPCで動かす場合の手順です。

リポジトリをクローン

git clone [https://github.com/da15-max/anime_pozu.git](https://github.com/da15-max/anime_pozu.git)
cd anime_pozu


依存関係をインストール

npm install


環境変数の設定
プロジェクトのルートに .env.local という名前のファイルを作成し、以下の内容を貼り付けて、ご自身のAPIキーを設定してください。

# OpenAI API
OPENAI_API_KEY=sk-.....

# Google Custom Search API
GOOGLE_SEARCH_API_KEY=AIzaSy.....
GOOGLE_CSE_ID=...


開発サーバーの起動

npm run dev


ブラウザで http://localhost:3000 を開いてください。
