import { Calendar,Clock , Users } from 'lucide-react';
import { LuPenLine } from "react-icons/lu";
import { AiOutlineSmile } from "react-icons/ai";

const details = [
  {
    icon: Calendar,
    label: '開催日時',
    value: '2026年1月18日（日）',
  },
  {
    icon: LuPenLine,
    label: '持ち物',
    value: '持ち物不要です！<br/>ツールの使用には最新型タブレットを準備しておりますので、<br/><span class="text-lg font-semibold">気軽にご参加できます！</span>',
  },
  {
    icon: Users,
    label: '対象',
    value: '防災に関心のある18歳以上の方<br/>（小学4年生以上のお子様も、保護者の方と一緒にご参加いただけます。参加者のご兄弟・ご姉妹は、小学校低学年までご一緒にご来場可能です。）',
  },
];

const curriculum = [
  {
    time: '10:00-12:00',
    title: '第１ターム',
    description:
      '場所：慶應義塾大学日吉キャンパス協生館２階<br/><span class="text-lg font-semibold">多目的教室３</span>',
  },
  {
    time: '13:00-15:00',
    title: '第２ターム',
    description:
      '場所：慶應義塾大学日吉キャンパス協生館２階<br/><span class="text-lg font-semibold">多目的教室３</span>',
  },
  {
    time: '15:30-17:30',
    title: '第３ターム',
    description:
      '場所：Be ACTO 日吉<br/><span class="text-lg font-semibold">まちのスタジオ</span>',
  },
];


export function WorkshopDetails() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-gray-900 text-center text-lg font-semibold">
              ワークショップ詳細
            </h3>
          <p className="text-gray-600">
            ご参加お待ちしております！
          </p>
        </div>

        {/* 開催概要 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {details.map((detail, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <detail.icon className="w-5 h-5 text-orange-600" />
                <span className="text-gray-600 text-sm">{detail.label}</span>
              </div>
              <p
                className="text-gray-900"
                dangerouslySetInnerHTML={{ __html: detail.value }}
              />
            </div>
          ))}
        </div>

        {/* カリキュラム */}
        <div>
        <div className="flex justify-center items-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-orange-600" />
            <h3 className="text-gray-900 text-center text-lg font-semibold">
              ご都合のつくタームを選んでご参加できます！
            </h3></div>
          <h4 className="mb-4 text-gray-600 text-center"><span className="text-xs">※各タームで同じ内容です。</span></h4>
          <div className="space-y-4">
            {curriculum.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:border-orange-500 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-sm whitespace-nowrap">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 text-gray-900">{item.title}</h4>
                    <p
                    className="text-gray-600 text-sm"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

       {/* こんな方におすすめ */}
<div className="mt-24">  
  <div className="flex justify-center items-center gap-2 mb-4">
    {/* 左にアイコン追加（Lucide の CheckCircle） */}
    <AiOutlineSmile className="w-6 h-6 text-orange-600" />
    <h3 className="text-gray-900 text-center text-lg font-semibold">
      こんな方におすすめ！
    </h3>
  </div>

  {/* 注意書き追加 */}
  <p className="text-center text-gray-600 mb-6 text-sm">
    下記以外でも、どんな方でも安心してご参加できます！
  </p>

  <div className="bg-gradient-to-br from-orange-50 to-orange-50 rounded-2xl p-8">
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
      </div>
    </section>
  );
}