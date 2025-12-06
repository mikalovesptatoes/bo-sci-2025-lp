import { Hero } from './components/Hero';
import { ImageSlideshow } from './components/ImageSlideshow';
import { ReviewsCarousel } from './components/ReviewsCarousel';
import { Features } from './components/Features';
import { DemoExperience } from './components/DemoExperience';
import { WorkshopDetails } from './components/WorkshopDetails';
import { FixedApplyButton } from './components/FixedApplyButton';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      {/* テスト用の大きな赤文字 */}
      <h1 style={{ fontSize: '40px', color: 'red' }}>TEST UPDATE 999</h1>

      <div className="min-h-screen bg-white">
        <Hero />
        <ImageSlideshow />
        <ReviewsCarousel />
        <Features />
        <DemoExperience />
        <WorkshopDetails />
        <Footer />
        <FixedApplyButton />
        {/* 固定ボタンのスペース確保 */}
        <div className="h-20"></div>
      </div>
    </>
  );
}
