import { Mail } from 'lucide-react';
import { PiBuildingApartment } from "react-icons/pi";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* === 3列のグリッドレイアウト === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* 🌟 1列目: お問い合わせ・主催 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">お問い合わせ・主催</h3>
            <div className="space-y-4">
              
              {/* メールアドレス */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">ws@kohi.sd.keio.ac.jp</span>
              </div>
              
              <div className="flex items-start gap-3">
                <PiBuildingApartment className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" /> 
                <span className="text-gray-300 text-sm">慶應義塾大学 理工学部 システムデザイン工学科 小檜山研究室</span>
              </div>
            </div>
          </div>

          
          {/* 🌟 2列目: 共催・協力 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">共催・協力団体</h3>
            
            {/* 共催団体 */}
            <h4 className="text-gray-400 mb-2 text-sm font-medium">共催</h4>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-gray-300 text-sm">Tsunashima SST まちづくり運営協議会</span>
            </div>
            
            {/* 協力団体 */}
            <h4 className="text-gray-400 mb-2 text-sm font-medium">協力</h4>
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm">横浜市</span>
            </div>
          </div>


          {/* 🌟 3列目: 関連リンク */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">関連情報</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  プロジェクトについて
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  プライバシーポリシー
                </a>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; コピーライト必要？
          </p>
        </div>
      </div>
    </footer>
  );
}