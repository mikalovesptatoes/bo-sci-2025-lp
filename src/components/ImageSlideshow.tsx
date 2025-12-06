import { useState, useEffect } from 'react';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1533157918045-03b7d765596d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBkaXNhc3RlciUyMHByZXZlbnRpb24lMjBjb21tdW5pdHl8ZW58MXx8fHwxNzY1MDEyODI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    caption: '地域の災害リスクをアートで可視化',
  },
  {
    url: 'https://images.unsplash.com/photo-1753162658596-2ccba5e4246a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjcmVhdGl2ZSUyMHdvcmtzaG9wJTIwcGVvcGxlJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NjUwMTI4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    caption: '参加者全員で協力しながら作品を制作',
  },
  {
    url: 'https://images.unsplash.com/photo-1732566249941-8f6fe9695bd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMGRpc3BsYXl8ZW58MXx8fHwxNzY1MDEyODI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    caption: '完成作品の展示・発表会',
  },
  {
    url: 'https://images.unsplash.com/photo-1761064039914-bae38479faa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb21tdW5pdHklMjBldmVudCUyMHBhcnRpY2lwYW50c3xlbnwxfHx8fDE3NjUwMTI4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    caption: 'コミュニティと一体となった防災活動',
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
      <div className="max-w-6xl mx-auto">
        <div className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
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
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
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