'use client';

import { useState } from 'react';
import { DetectionService, DetectionResult } from '@/lib/api/detectionService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ThreatDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (50MB max)
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleDetect = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const detectionResult = await DetectionService.detect(file);
      setResult(detectionResult);
      
      if (detectionResult.success) {
        const threatCount = detectionResult.type === 'image' 
          ? detectionResult.threat_count 
          : detectionResult.total_threats;
          
        toast({
          title: "Detection Complete",
          description: `Found ${threatCount} threat(s) with ${detectionResult.overall_threat_level} threat level`,
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Detection failed. Please try again.';
      setError(errorMessage);
      toast({
        title: "Detection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      case 'NONE': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getThreatIcon = (level: string) => {
    if (level === 'NONE' || level === 'LOW') {
      return <CheckCircle className="h-8 w-8 text-green-600" />;
    }
    return <AlertTriangle className="h-8 w-8 text-red-600" />;
  };

  return (
    <div className="w-full space-y-6">
      <Card className="p-6 shadow-lg border-2 border-cyan-200/50 bg-gradient-to-br from-white to-cyan-50/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Marine Threat Detection
            </h2>
            <p className="text-gray-600 text-sm">
              Upload images or videos to detect potential marine threats using AI
            </p>
          </div>
        </div>
        
        {/* File Upload */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-cyan-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-all bg-white/50 backdrop-blur-sm">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full">
                  <Upload className="h-12 w-12 text-cyan-600" />
                </div>
                <p className="mt-2 text-sm text-gray-700 font-medium">
                  {file ? `📄 ${file.name}` : 'Click to upload image or video'}
                </p>
                <p className="text-xs text-gray-500">
                  Supported: JPG, PNG, MP4, AVI, MOV (Max 50MB)
                </p>
              </div>
            </label>
          </div>

          <Button
            onClick={handleDetect}
            disabled={!file || loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing threats...
              </>
            ) : (
              <>
                🔍 Detect Threats
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {error}
            </p>
          </div>
        )}

        {/* Results Display */}
        {result && result.success && (
          <div className="mt-6 space-y-4">
            {/* Overall Status */}
            <Card className={`p-6 border-2 ${getThreatLevelColor(result.overall_threat_level)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl">Detection Results</h3>
                {getThreatIcon(result.overall_threat_level)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium opacity-80">Threat Level</p>
                  <p className="text-3xl font-bold">{result.overall_threat_level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-80">Threats Found</p>
                  <p className="text-3xl font-bold">
                    {result.type === 'image' ? result.threat_count : result.total_threats}
                  </p>
                </div>
              </div>
              {result.type === 'image' && result.overall_threat_score && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium opacity-80 mb-2">Threat Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${result.overall_threat_score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{(result.overall_threat_score * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </Card>

            {/* Image Results */}
            {result.type === 'image' && (
              <>
                {result.annotated_image && (
                  <Card className="overflow-hidden border-2 border-cyan-200">
                    <img
                      src={result.annotated_image}
                      alt="Annotated detection"
                      className="w-full"
                    />
                  </Card>
                )}

                {result.threats.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Detected Threats
                    </h4>
                    {result.threats.map((threat) => (
                      <Card key={threat.id} className="p-4 hover:shadow-md transition-shadow border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-bold text-lg">{threat.class}</p>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Confidence:</span>{' '}
                                <span className="font-bold text-cyan-600">{threat.confidence_percentage.toFixed(1)}%</span>
                              </p>
                              <p>
                                <span className="font-medium">Size:</span>{' '}
                                {threat.relative_size.toFixed(1)}% of image
                              </p>
                              <p>
                                <span className="font-medium">Position:</span>{' '}
                                ({threat.bounding_box.center_x.toFixed(0)}, {threat.bounding_box.center_y.toFixed(0)})
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getThreatLevelColor(threat.threat_level)}`}>
                            {threat.threat_level}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {result.threats.length === 0 && (
                  <Card className="p-6 bg-green-50 border-green-200 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-2" />
                    <p className="text-green-800 font-medium">No threats detected in this image</p>
                  </Card>
                )}
              </>
            )}

            {/* Video Results */}
            {result.type === 'video' && (
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
                  <h4 className="font-bold mb-3 text-lg">📹 Video Analysis Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-600 text-xs">Duration</p>
                      <p className="font-bold text-lg text-cyan-600">{result.video_metadata.duration_seconds}s</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-600 text-xs">Frames Analyzed</p>
                      <p className="font-bold text-lg text-cyan-600">{result.summary.frames_analyzed}</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-600 text-xs">Threats Detected</p>
                      <p className="font-bold text-lg text-red-600">{result.summary.frames_with_detections}</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-600 text-xs">Detection Rate</p>
                      <p className="font-bold text-lg text-orange-600">{result.summary.detection_rate.toFixed(1)}%</p>
                    </div>
                  </div>
                </Card>

                {result.frames_with_threats.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      ⏱️ Threat Timeline
                    </h4>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {result.frames_with_threats.map((frame, idx) => (
                        <Card key={idx} className="p-3 hover:shadow-md transition-shadow border border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-medium">Frame {frame.frame_number}</p>
                              <p className="text-sm text-gray-600">
                                ⏱️ {frame.timestamp.toFixed(2)}s | {frame.threat_count} threat(s) detected
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getThreatLevelColor(frame.threat_level)}`}>
                              {frame.threat_level}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="p-6 bg-green-50 border-green-200 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-2" />
                    <p className="text-green-800 font-medium">No threats detected in this video</p>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">About the Detection System</p>
            <p className="text-xs">
              This AI-powered system uses YOLOv8 to detect 5 types of marine threats: Mines, Submarines, AUVs/ROVs, and Divers. 
              Results include confidence scores, threat levels, and precise bounding box locations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

