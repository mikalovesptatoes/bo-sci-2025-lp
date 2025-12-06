import { ChevronDown } from 'lucide-react';
// import titleImage from 'figma:asset/28859b9bced0c7d23223f644374f21c99c31dd7.png'; // 実際の画像パスに置き換える必要があります

const titleImage = "https://placehold.co/300x70/ffffff/000000?text=DisasterxArt";

export function Hero() {
  // SVGのカーブに沿ったテキスト用のカスタムスタイルは、別途CSSファイルまたは<style>タグで定義が必要です。
  // 例: .curved-text-svg { width: 100%; height: auto; }
  // 例: .yellow-text { fill: #facc15; }
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-orange-500 text-white">
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1763656444006-e12f1d7cb29e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBwcmVwYXJlZG5lc3MlMjBkaXNhc3RlcnxlbnwxfHx8fDE3NjUwMTA0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="背景画像"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative px-4 pt-8 pb-2 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        {/* SVG Curved Text: 簡略化のため、ここではテキストのみで表現します。
            実際のカーブテキストは、元のコードにあるSVGタグ全体を埋め込む必要があります。
            <svg>...</svg>
        */}
        <p className="text-xl font-medium mb-4">みんなで見つけて、<span className="text-yellow-300">みんなで</span>つくる</p>
        
        <div className="mb-8 flex justify-center">
          <img 
            src={titleImage} 
            alt="防災×市民科学×アート" 
            className="max-w-xs w-full h-auto"
          />
        </div>

        <p className="text-lg mb-4 text-white/80 max-w-2xl mx-auto">
          アートで表現する<br />あなたの地域の災害リスクと防災行動
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* 申込ボタン */}
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSeSGh8sGe47gxGbr9ikMCzr5L-RHMObzyRJo4onLc4fnZEitw/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-red-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-block
                       font-bold shadow-lg shadow-white/50 
                       transition-all duration-300 transform 
                       animate-pulse 
                       hover:scale-105"
          >
            ワークショップに申し込む
          </a>
          
          {/* 体験ボタン */}
          <a 
            href="#demo" 
            className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors inline-block
                       transition-all duration-300 transform 
                       hover:scale-105"
          >
            体験デモを見る
          </a>
        </div>

        {/* スクロール促進 */}
        <div className="mt-8 animate-bounce">
          <p className="text-white/90 text-sm mb-2">スクロールでもっと知る！</p>
          <ChevronDown className="w-6 h-6 mx-auto text-white/80" />
        </div>
      </div>
    </div>
  );
}