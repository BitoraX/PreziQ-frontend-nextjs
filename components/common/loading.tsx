import Lottie from 'lottie-react';
import animationData from '@/public/loading.json';

export default function Loading() {
return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="relative w-32 h-32">
      <Lottie animationData={animationData} loop={true} />
    </div>
  </div>
);
}
