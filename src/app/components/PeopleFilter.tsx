// components/PeopleFilter.tsx

import React, { useState } from 'react';
// 2人シルエットのアイコン (FaUserFriends もしくは FaUsersLine などが近いかもしれません)
// 今回は FaUserFriends を使用しますが、見た目に応じて変更してください。
import { FaUserFriends } from 'react-icons/fa'; 

// 選択可能な人数リスト
const peopleOptions = Array.from({ length: 10 }, (_, i) => i + 1); // 1から10までの配列

interface PeopleFilterProps {
  onSelectPeople: (count: number | null) => void; // 親コンポーネントに選択された人数を伝える関数
}

const PeopleFilter: React.FC<PeopleFilterProps> = ({ onSelectPeople }) => {
  const [isOpen, setIsOpen] = useState(false); // ドロップダウンが開いているかどうかの状態
  const [selectedPeople, setSelectedPeople] = useState<number | null>(null); // 選択された人数

  // ドロップダウンの開閉を切り替える関数
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 人数が選択されたときの処理
  const handleSelect = (count: number) => {
    setSelectedPeople(count); // 選択された人数を状態に保存
    onSelectPeople(count);   // 親コンポーネントに伝える
    setIsOpen(false);        // ドロップダウンを閉じる
  };

  // 「すべて」を選択する処理 (ここでは null で人数制限なしを表現)
  const handleSelectAll = () => {
    setSelectedPeople(null);
    onSelectPeople(null);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown} // クリックでドロップダウンを開閉
        className="flex-shrink-0 bg-white text-slate-500 py-2 px-4 border-l border-slate-200 flex items-center justify-center text-xl hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <FaUserFriends /> {/* 2人シルエットのアイコン */}
        {selectedPeople && <span className="ml-2 text-base">{selectedPeople}人</span>} {/* 人数が選択されていれば表示 */}
      </button>

      {isOpen && ( // isOpenがtrueの場合のみ表示
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button
                onClick={handleSelectAll}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                すべて
              </button>
            </li>
            {peopleOptions.map((count) => (
              <li key={count}>
                <button
                  onClick={() => handleSelect(count)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {count}人
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PeopleFilter;