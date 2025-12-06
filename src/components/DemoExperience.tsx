import { useState } from 'react';
import { MapPin, Check, Users } from 'lucide-react';
import { RiChatSmile2Line } from "react-icons/ri";
import { LuPaintBucket } from "react-icons/lu";
import { PiHandTap } from "react-icons/pi";

type DemoStep = 'alert' | 'map' | 'safety';

export function DemoExperience() {
  const [activeStep, setActiveStep] = useState<DemoStep>('alert');
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState<{ [key: string]: boolean }>({});

  const familyMembers = ['お父さん', 'お母さん', '妹'];

  const handleSafetyCheck = (member: string) => {
    setSafetyStatus(prev => ({
      ...prev,
      [member]: !prev[member]
    }));
  };

  return (
    <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PiHandTap className="text-gray-900 text-lg" />
            <h2 className="text-gray-900 text-base sm:text-lg font-medium">
              ツールを体験してみてください！
            </h2>
          </div>
          <p className="text-gray-600">
            ワークショップの体験を<br />“少しだけ”お届け！
          </p>
        </div>

        {/* タブ切り替え */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveStep('alert')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${activeStep === 'alert'
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            <LuPaintBucket className="w-5 h-5" />
            マーブリング
          </button>
          <button
            onClick={() => setActiveStep('map')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${activeStep === 'map'
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            <MapPin className="w-5 h-5" />
            防災行動マップ
          </button>
          <button
            onClick={() => setActiveStep('safety')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${activeStep === 'safety'
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            <RiChatSmile2Line className="w-5 h-5" />
            ご近所アートチャット
          </button>
        </div>

        {/* デモコンテンツ */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* スマホ風フレーム */}
          <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
            <span className="text-sm">9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-white/30 rounded-full"></div>
              <div className="w-4 h-4 bg-white/30 rounded-full"></div>
              <div className="w-4 h-4 bg-white/30 rounded-full"></div>
            </div>
          </div>

          <div className="p-6 min-h-[400px]">
            {activeStep === 'alert' && (
              <div className="space-y-6">
                <h3 className="text-gray-900">緊急アラート体験</h3>
                <p className="text-gray-600 text-sm">
                  ボタンを押して、災害発生時のアラート通知を体験してください
                </p>

                {/* マーブリングの体験に合わせたアラートボタンの動作は、元のコードでは緊急アラート体験として実装されていますが、
                    動画ではマーブリングは視覚的なアート作成を示唆しています。
                    元のコードの意図通り、アラート機能として残します。
                */}
                <button
                  onClick={() => setIsAlertActive(!isAlertActive)}
                  className="w-full bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {isAlertActive ? 'アラートを停止' : '緊急アラートを発動'}
                </button>

                {isAlertActive && (
                  <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                      {/* Bellアイコンのインポートがないため、ここではプレースホルダーを使用します。 */}
                      {/* <Bell className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" /> */}
                      <span className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1">🔔</span>
                      <div>
                        <p className="text-red-900 mb-1">緊急地震速報</p>
                        <p className="text-red-800 text-sm mb-2">
                          強い揺れに警戒してください
                        </p>
                        <p className="text-red-700 text-sm">
                          震源地: 東京都23区<br />
                          予測震度: 震度5強<br />
                          到達まで: 約10秒
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 'map' && (
              <div className="space-y-6">
                <h3 className="text-gray-900">最寄りの避難所</h3>
                <p className="text-gray-600 text-sm">
                  現在地から最も近い避難所を表示します
                </p>

                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
                    </div>
                    {/* 避難所を示す赤いピン */}
                    <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-600 rounded-full"></div>
                    <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-600 rounded-full"></div>
                    <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-red-600 rounded-full"></div>
                  </div>
                  <MapPin className="w-12 h-12 text-blue-600 z-10" />
                </div>

                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-red-500 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-gray-900">渋谷区立防災センター</p>
                      <span className="text-red-600 text-sm">徒歩5分</span>
                    </div>
                    <p className="text-gray-600 text-sm">東京都渋谷区神南1-2-3</p>
                    <p className="text-gray-500 text-xs mt-1">収容人数: 500名</p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 'safety' && (
              <div className="space-y-6">
                <h3 className="text-gray-900">家族の安否確認</h3>
                <p className="text-gray-600 text-sm">
                  家族の安全状態をチェックしてください
                </p>

                <div className="space-y-3">
                  {familyMembers.map((member) => (
                    <button
                      key={member}
                      onClick={() => handleSafetyCheck(member)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${safetyStatus[member]
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${safetyStatus[member] ? 'bg-green-500' : 'bg-gray-200'
                          }`}>
                          {safetyStatus[member] ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : (
                            <Users className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-gray-900">{member}</p>
                          <p className="text-sm text-gray-500">
                            {safetyStatus[member] ? '安全を確認しました' : '未確認'}
                          </p>
                        </div>
                      </div>
                      {safetyStatus[member] && (
                        <span className="text-green-600 text-sm">✓ 無事</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 text-sm">
                    {Object.values(safetyStatus).filter(Boolean).length} / {familyMembers.length} 人の安全を確認
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}