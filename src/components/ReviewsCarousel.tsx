import { useEffect, useRef, useState } from 'react';

const reviews = [
  {
    role: '2025年10月回にご参加いただいた方より',
    comment: 'アートを通じて防災について考える新しい視点が得られました。自分の地域の災害リスクを創作活動で表現することで、より深く理解できました。',
  },
  {
    role: '2025年10月回にご参加いただいた方より',
    comment: '非常に分かりやすい内容で、防災意識が高まりました。他の人にもぜひ参加を勧めたいです。',
  },
  {
    role: '会社員',
    comment: '堅苦しい防災学習ではなく、創造性を活かした新しい取り組みだと感じました。参加して良かったです。',
  },
  {
    role: '大学生',
    comment: '地域課題とアートが結びつくことで、記憶に残りやすい学びとなりました。友人と参加しましたが、二人とも満足しています。',
  },
  {
    role: '主婦',
    comment: '自分の地域の災害リスクがこれほどアートで表現できるとは思いませんでした。日々の生活で防災を意識するようになりました。',
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
        <h2 className="text-center mb-4 text-gray-900">参加者の声</h2>
        <p className="text-center text-gray-600">
          過去のワークショップ参加者からのレビュー
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