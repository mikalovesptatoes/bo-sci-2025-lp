import { useEffect, useRef, useState } from 'react';
import { RiChatSmile2Line } from "react-icons/ri";

const reviews = [
  {
    role: '2025年10月回にご参加いただいた方より',
    comment: '防災に興味を持つことのできる素晴らしいワークショップだと思います。',
  },
  {
    role: '2025年10月回にご参加いただいた方より',
    comment: '大変面白い取り組みで、良い体験をさせていただきました。',
  },
  {
    role: '2025年1月回にご参加いただいた方より',
    comment: '作品をつくるために、マップをよく見たりすることで、防災意識が高まると感じました。ありがとうございました。',
  },
  {
    role: '2025年1月回にご参加いただいた方より',
    comment: 'ハザードマップを自分事としてとらえることができて、とても有意義な経験だった。',
  },
  {
    role: '2025年1月回にご参加いただいた方より',
    comment: 'いつくるかしれない災害に対して、対応をしっかりしていくことを実感した。',
  },
];

export function ReviewsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += 0.5;

        // スクロール位置が半分を超えたらリセット
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }

        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <RiChatSmile2Line className="text-gray-900 text-lg" />
          <h2 className="text-gray-900 text-base sm:text-lg font-medium">
            参加者のお声
          </h2>
        </div>
        <p className="text-center text-gray-600">
          過去にも多くの方にご参加いただきました！
        </p>
      </div>

      <div
        // @ts-ignore
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* レビューを複製して無限スクロールを実装 */}
        {[...reviews, ...reviews].map((review, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[300px] sm:w-[350px] bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="mb-3">
              <p className="text-sm text-gray-500">{review.role}</p>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}