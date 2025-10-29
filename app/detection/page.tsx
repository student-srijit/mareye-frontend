import ThreatDetection from '@/components/threat-detection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Threat Detection | MarEye',
  description: 'AI-powered marine threat detection system using YOLOv8',
};

export default function DetectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50/30 to-blue-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Marine Threat Detection System
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Advanced AI-powered detection system for identifying potential threats in marine environments.
              Upload images or videos to analyze using our YOLOv8-based detection model.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <ThreatDetection />
          
          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-cyan-100">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-bold text-lg mb-2">High Accuracy</h3>
              <p className="text-sm text-gray-600">
                YOLOv8-powered detection with confidence scores and precise bounding boxes
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-cyan-100">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-lg mb-2">Fast Processing</h3>
              <p className="text-sm text-gray-600">
                Real-time analysis with results in seconds for images and minutes for videos
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-cyan-100">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-bold text-lg mb-2">Multi-Class Detection</h3>
              <p className="text-sm text-gray-600">
                Detects 5 threat categories: Mines, Submarines, AUVs/ROVs, and Divers
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-cyan-100">
            <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2 text-cyan-600 font-bold">
                  1
                </div>
                <p className="text-sm font-medium">Upload File</p>
                <p className="text-xs text-gray-600 mt-1">Select an image or video</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2 text-cyan-600 font-bold">
                  2
                </div>
                <p className="text-sm font-medium">AI Analysis</p>
                <p className="text-xs text-gray-600 mt-1">YOLOv8 processes the data</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2 text-cyan-600 font-bold">
                  3
                </div>
                <p className="text-sm font-medium">Threat Detection</p>
                <p className="text-xs text-gray-600 mt-1">Identifies potential threats</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2 text-cyan-600 font-bold">
                  4
                </div>
                <p className="text-sm font-medium">View Results</p>
                <p className="text-xs text-gray-600 mt-1">See annotated detections</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

