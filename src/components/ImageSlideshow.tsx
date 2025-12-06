import { useState, useEffect } from 'react';
import img1 from "../images/example1.png";
import img2 from "../images/example2.png";
import img3 from "../images/example3.png";
import img4 from "../images/example4.png";
import { TbDeviceTabletHeart } from "react-icons/tb";

const images = [
  {
    url: img1,
    caption: "大雨のとき、二階に非難！危険なら公園へ！",
  },
  {
    url: img2,
    caption: "日吉駅周辺にも危険個所はある！",
  },
  {
    url: img3,
    caption: "逃げよう！",
  },
  {
    url: img4,
    caption: "逃げる",
  },
];

export function ImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto mb-8">

        <div className="flex items-center justify-center gap-2 mb-4">
          <TbDeviceTabletHeart className="text-gray-900 text-lg" />
          <h2 className="text-gray-900 text-base sm:text-lg font-medium">
            こんなデジタル作品をつくります！
          </h2>
        </div>
        {/* ★ 説明文（同じ text-base） */}
        <p className="text-center text-gray-600 text-base">
          どうやってつくるのか？<br />どんなことを表しているのか？<br />詳細はワークショップにて！
        </p>

      </div>

      {/* スライドショー */}
      <div className="max-w-6xl mx-auto">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-white text-xl sm:text-2xl">
                  {image.caption}
                </p>
              </div>
            </div>
          ))}

          {/* インジケーター */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
                  }`}
                aria-label={`スライド ${index + 1} を表示`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
