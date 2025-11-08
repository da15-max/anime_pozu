// 1. Poseの「型」を定義します
// これにより、idやtitleなどを書き忘れるミスを防げます
export interface Pose {
  id: string;          // ポーズ固有のID（ユニークな文字列）
  title: string;       // ポーズのタイトル
  imageUrl: string;    // 画像のパス
  genre: string;       // ジャンル（'maid', 'idol' など）
  peopleCount: number; // 人数
  likes: number;       // いいねの数（ダミー）
  tags?: string[];    // 任意：タグの配列
}

// 2. ポーズの「実データ」の配列を作成します
// この posesData を page.tsx で読み込んで使います
export const posesData: Pose[] = [
  // ここにポーズのデータを追加していきます
  
  // --- ジャンルごとのダミーデータ例 ---
  { 
    id: 'maid-001', 
    title: 'お出迎えのポーズ', 
    imageUrl: '/poses/maid_01.jpg', // public/poses/maid_01.jpg に画像が必要
    genre: 'maid', 
    peopleCount: 1, 
    likes: 120 
  },
  { 
    id: 'maid-002', 
    title: 'お辞儀のポーズ', 
    imageUrl: '/poses/maid_02.jpg',
    genre: 'maid', 
    peopleCount: 1, 
    likes: 95 
  },
  { 
    id: 'idol-001', 
    title: '決めポーズ（センター）', 
    imageUrl: '/poses/idol_01.jpg',
    genre: 'idol', 
    peopleCount: 1, 
    likes: 350 
  },
  { 
    id: 'idol-002', 
    title: 'グループポーズ', 
    imageUrl: '/poses/idol_02.jpg',
    genre: 'idol', 
    peopleCount: 3, 
    likes: 480 
  },
  { 
    id: 'student-001', 
    title: '教室の窓辺で', 
    imageUrl: '/poses/student_01.jpg',
    genre: 'student', 
    peopleCount: 1, 
    likes: 210 
  },
  { 
    id: 'action-001', 
    title: '剣を構える', 
    imageUrl: '/poses/action_01.jpg',
    genre: 'action', 
    peopleCount: 1, 
    likes: 180 
  },
  // ... 他のジャンルのデータも同様に追加 ...
];