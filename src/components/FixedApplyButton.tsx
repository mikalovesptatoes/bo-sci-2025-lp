import { ExternalLink } from 'lucide-react';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeSGh8sGe47gxGbr9ikMCzr5L-RHMObzyRJo4onLc4fnZEitw/viewform?usp=header';

export function FixedApplyButton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white px-6 py-4 rounded-lg 
                     font-bold shadow-lg shadow-orange-500/50 
                     transition-all duration-300 transform 
                     animate-pulse 
                     hover:bg-orange-700 
                     hover:scale-105 
                     hover:shadow-xl"
        >
          <span className="text-lg">今すぐワークショップに申し込む！</span>
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}