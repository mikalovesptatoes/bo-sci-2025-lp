import { MdRecommend } from "react-icons/md";

// WorkshopDetails.tsx
export function WorkshopDetails() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MdRecommend className="text-gray-900 text-lg" />
            <h2 className="text-gray-900 text-base sm:text-lg font-medium">
              こんな方におすすめです！
            </h2>
          </div>
          <p className="text-gray-600">
            下記に限らず、<br />どなたでも安心してご参加いただけます！
          </p>
        </div>

        {/* こんな方におすすめ */}
        <div className="mt-16 bg-gradient-to-br from-orange-50 to-orange-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-700">防災に関心があるけど、学ぶ機会が少ない方</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-700">日々忙しくて、防災を考える時間が取れない方</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-700">子どもと防災に関して話し合ってみたい方</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-700">地域の同じ防災意識を持った仲間と繋がりたい方</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}