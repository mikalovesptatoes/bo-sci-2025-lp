import { LuPaintBucket } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuHeartHandshake } from "react-icons/lu";
import { MdFamilyRestroom } from "react-icons/md";
import { TbAlertHexagon } from "react-icons/tb";

const features = [
  {
    icon: LuPaintBucket,
    title: 'アートで表現',
    description: 'マーブリング・コラージュ',
  },
  {
    icon: FaPeopleGroup,
    title: '市民科学',
    description: '市民科学。',
  },
  {
    icon: LuHeartHandshake,
    title: '共助',
    description: 'いざというときに頼れるのはご近所さん',
  },
  {
    icon: MdFamilyRestroom,
    title: '子育て世代',
    description: '地域防災の担い手',
  },
];

export function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TbAlertHexagon className="text-gray-900 text-lg" />
          <h2 className="text-gray-900 text-base sm:text-lg font-medium">
            ワークショップの目的
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          説明
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 text-red-600 rounded-full mb-4">
              {/* アイコンはReact-Iconsからインポート */}
              <feature.icon className="w-7 h-7" />
            </div>
            <h3 className="mb-2 text-gray-900">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}