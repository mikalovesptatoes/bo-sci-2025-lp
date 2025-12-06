import { ChevronDown } from 'lucide-react';
import img1 from "../images/logoblue.png";
import img2 from "../images/fluid.png";

const titleImage = img1;

export function Hero() {
  return (
    <div className="relative overflow-hidden text-blue-900">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <img
          src={img2}
          alt="背景画像"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 中身（背景の上に載せる） */}
      <div className="relative px-4 pt-4 pb-2 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        {/* カーブしたテキスト */}
        <div className="flex justify-center mb-2">
          <svg width="300" height="80">
            <defs>
              <path
                id="curveText"
                d="M 20 80 Q 150 20 280 80"
                fill="transparent"
              />
            </defs>

            <text fontSize="15" fontWeight="600" textAnchor="middle" className="font-maru">
              <textPath href="#curveText" startOffset="50%">
                <tspan fill="#f97316">みんなで</tspan>
                <tspan fill="#18236C">見つけて、</tspan>
                <tspan fill="#f97316">みんなで</tspan>
                <tspan fill="#18236C">つくる</tspan>
              </textPath>
            </text>
          </svg>
        </div>

        {/* タイトルロゴ */}
        <div className="mb-6 flex justify-center">
          <img
            src={titleImage}
            alt="防災×市民科学×アート"
            className="max-w-xs w-full h-auto"
          />
        </div>

        <p className="text-lg mb-3 text-blue-900/80 max-w-2xl mx-auto font-maru">
          あなたの地域の<br />災害リスク・防災行動を<br />アートで表現するワークショップ！
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* 申込ボタン */}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeSGh8sGe47gxGbr9ikMCzr5L-RHMObzyRJo4onLc4fnZEitw/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-block
                       font-bold shadow-lg shadow-blue-900/50 
                       transition-all duration-300 transform 
                       animate-pulse 
                       hover:scale-105"
          >
            ワークショップに申し込む
          </a>

          {/* 体験ボタン */}
          <a
            href="#demo"
            className="bg-blue-900/10 backdrop-blur-sm border-2 border-blue-900 text-blue-900 px-8 py-3 rounded-lg hover:bg-blue-900/20 transition-colors inline-block
                       transition-all duration-300 transform 
                       hover:scale-105"
          >
            体験デモを見る
          </a>
        </div>

        {/* スクロール促進 */}
        <div className="mt-8 animate-bounce">
          <p className="text-blue-900/90 text-sm mb-2 font-maru">スクロールでもっと知る！</p>
          <ChevronDown className="w-6 h-6 mx-auto text-blue-900/80" />
        </div>
      </div>
    </div>
  );
}
