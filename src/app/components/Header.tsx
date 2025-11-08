// components/Header.tsx

import Link from 'next/link';
// 使用するアイコンをインポート
import { FaCamera, FaRegUserCircle, FaPen } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-slate-700 text-white shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* サイトロゴ */}
        <Link href="/" className="text-3xl font-bold flex items-center gap-2">
          CosPose Navi <FaCamera />
        </Link>

        {/* ナビゲーションリンク */}
        <nav>
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <Link href="/login" className="flex items-center gap-1 hover:text-sky-300 transition-colors">
                <FaRegUserCircle /> ログイン
              </Link>
            </li>
            <li>
              <Link href="/post" className="flex items-center gap-1 hover:text-sky-300 transition-colors">
                <FaPen /> 投稿
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;