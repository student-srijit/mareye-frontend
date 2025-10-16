'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  Play, 
  Download, 
  Image as ImageIcon, 
  Video, 
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

const CNN_BACKEND_URL = 'https://mereyecnn.onrender.com'

interface ProcessingResult {
  success: boolean
  data?: {
    original_path: string
    enhanced_path: string
    enhanced_data?: string
    filename: string
  }
  error?: string
  metrics?: {
    psnr: number
    ssim: number
    uiqm_improvement: number
  }
}

interface AnalyticsResult {
  success: boolean
  data?: {
    analytics_path: string
    original_path: string
    enhanced_path: string
    analytics_files: Record<string, string>
  }
  error?: string
  metrics?: {
    psnr: number
    ssim: number
    uiqm_improvement: number
    color_improvement: number
    brightness_improvement: number
    contrast_improvement: number
  }
}

export default function CNNModelPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [imageResult, setImageResult] = useState<ProcessingResult | null>(null)
  const [analyticsResult, setAnalyticsResult] = useState<AnalyticsResult | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [videoResult, setVideoResult] = useState<ProcessingResult | null>(null)
  const [isVideoProcessing, setIsVideoProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImageResult(null)
      setAnalyticsResult(null)
    }
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedVideo(file)
      setVideoResult(null)
    }
  }

  const processImage = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setImageResult(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch(`${CNN_BACKEND_URL}/api/process-image`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      clearInterval(progressInterval)
      setProgress(100)

      if (result.success) {
        setImageResult({
          success: true,
          data: result.data,
          metrics: result.metrics
        })
        toast.success('Image enhanced successfully!')
      } else {
        setImageResult({
          success: false,
          error: result.error || 'Image processing failed'
        })
        toast.error('Image processing failed')
      }
    } catch (error) {
      clearInterval(progressInterval)
      setImageResult({
        success: false,
        error: 'Network error: Unable to connect to CNN backend'
      })
      toast.error('Failed to process image')
    } finally {
      setIsProcessing(false)
    }
  }

  const runAnalytics = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first')
      return
    }

    setIsAnalyzing(true)
    setProgress(0)
    setAnalyticsResult(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 5
      })
    }, 300)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch(`${CNN_BACKEND_URL}/api/run-analytics`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      clearInterval(progressInterval)
      setProgress(100)

      if (result.success) {
        setAnalyticsResult({
          success: true,
          data: result.data,
          metrics: result.metrics
        })
        toast.success('Analytics completed!')
      } else {
        setAnalyticsResult({
          success: false,
          error: result.error || 'Analytics failed'
        })
        toast.error('Analytics failed')
      }
    } catch (error) {
      clearInterval(progressInterval)
      setAnalyticsResult({
        success: false,
        error: 'Network error: Unable to connect to CNN backend'
      })
      toast.error('Failed to run analytics')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const processVideo = async () => {
    if (!selectedVideo) {
      toast.error('Please select a video first')
      return
    }

    setIsVideoProcessing(true)
    setProgress(0)
    setVideoResult(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 8
      })
    }, 250)

    try {
      const formData = new FormData()
      formData.append('video', selectedVideo)

      const response = await fetch(`${CNN_BACKEND_URL}/api/process-video`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      clearInterval(progressInterval)
      setProgress(100)

      if (result.success) {
        setVideoResult({
          success: true,
          data: result.data,
          metrics: result.metrics
        })
        toast.success('Video enhanced successfully!')
      } else {
        setVideoResult({
          success: false,
          error: result.error || 'Video processing failed'
        })
        toast.error('Video processing failed')
      }
    } catch (error) {
      clearInterval(progressInterval)
      setVideoResult({
        success: false,
        error: 'Network error: Unable to connect to CNN backend'
      })
      toast.error('Failed to process video')
    } finally {
      setIsVideoProcessing(false)
    }
  }

  const downloadEnhancedImage = () => {
    if (imageResult?.data?.enhanced_path) {
      window.open(`${CNN_BACKEND_URL}/api/download/${encodeURIComponent(imageResult.data.enhanced_path)}`, '_blank')
    }
  }

  const downloadEnhancedVideo = () => {
    if (videoResult?.data?.enhanced_path) {
      window.open(`${CNN_BACKEND_URL}/api/download/${encodeURIComponent(videoResult.data.enhanced_path)}`, '_blank')
    }
  }

  const downloadAnalyticsReport = () => {
    if (analyticsResult?.data?.analytics_path) {
      window.open(`${CNN_BACKEND_URL}/api/download/${encodeURIComponent(analyticsResult.data.analytics_path)}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            MAR EYE CNN Model
          </h1>
          <p className="text-blue-200 text-lg">
            Advanced Underwater Image & Video Enhancement with Epoch 4 Model
          </p>
        </div>

        {/* Image Enhancement Section */}
        <Card className="bg-slate-900/50 border-blue-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-400" />
              Image Enhancement with Epoch 4 Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="image-upload" className="text-white">
                Select Image
              </Label>
              <Input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="bg-slate-800 border-blue-500/30 text-white"
              />
              {selectedImage && (
                <p className="text-sm text-gray-300">
                  Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Process Button */}
            <Button
              onClick={processImage}
              disabled={!selectedImage || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enhancing Image...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Enhance Image
                </>
              )}
            </Button>

            {/* Progress */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Results - Original vs Enhanced Images */}
            {imageResult && (
              <div className="space-y-6">
                {imageResult.success ? (
                  <>
                    <Alert className="bg-green-900/50 border-green-500">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-200">
                        Image enhanced successfully!
                      </AlertDescription>
                    </Alert>

                    {/* Side by Side Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Original Image */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Original Image</h3>
                        <div className="bg-slate-800 rounded-lg p-4 border border-gray-600">
                          {selectedImage && (
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="Original"
                              className="w-full h-auto rounded-lg"
                            />
                          )}
                        </div>
                      </div>

                      {/* Enhanced Image */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Enhanced Image</h3>
                        <div className="bg-slate-800 rounded-lg p-4 border border-gray-600">
                          {imageResult.data?.enhanced_data ? (
                            <img
                              src={`data:image/jpeg;base64,${imageResult.data.enhanced_data}`}
                              alt="Enhanced"
                              className="w-full h-auto rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                              Enhanced image not available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    {imageResult.metrics && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-slate-800 border-blue-500/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-400">
                              {imageResult.metrics.psnr?.toFixed(2) || 'N/A'} dB
                            </div>
                            <div className="text-sm text-gray-300">PSNR</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-800 border-green-500/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">
                              {imageResult.metrics.ssim?.toFixed(4) || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-300">SSIM</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-800 border-purple-500/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-400">
                              {imageResult.metrics.uiqm_improvement?.toFixed(1) || 'N/A'}%
                            </div>
                            <div className="text-sm text-gray-300">UIQM Improvement</div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Download Buttons */}
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={downloadEnhancedImage}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Enhanced Image
                      </Button>
                      <Button
                        onClick={runAnalytics}
                        disabled={isAnalyzing}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Run Analytics
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <Alert className="bg-red-900/50 border-red-500">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">
                      {imageResult.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Analytics Results */}
            {analyticsResult && (
              <div className="space-y-6">
                {analyticsResult.success ? (
                  <>
                    <Alert className="bg-green-900/50 border-green-500">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-200">
                        Analytics completed successfully!
                      </AlertDescription>
                    </Alert>

                    {/* Analytics Files */}
                    {analyticsResult.data?.analytics_files && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Analysis Reports & Graphs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(analyticsResult.data.analytics_files).map(([key, path]) => (
                            <Card key={key} className="bg-slate-800 border-blue-500/30">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-white capitalize">
                                      {key.replace(/_/g, ' ')}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {typeof path === 'string' ? path.split('/').pop() : 'Generated'}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => window.open(`${CNN_BACKEND_URL}/api/download/${encodeURIComponent(path)}`, '_blank')}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Download Analytics Report */}
                    <div className="text-center">
                      <Button
                        onClick={downloadAnalyticsReport}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Download Complete Analytics Report
                      </Button>
                    </div>
                  </>
                ) : (
                  <Alert className="bg-red-900/50 border-red-500">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">
                      {analyticsResult.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Enhancement Section */}
        <Card className="bg-slate-900/50 border-blue-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Video className="w-6 h-6 text-blue-400" />
              Video Enhancement with Epoch 4 Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Upload */}
            <div className="space-y-2">
              <Label htmlFor="video-upload" className="text-white">
                Select Video
              </Label>
              <Input
                ref={videoInputRef}
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="bg-slate-800 border-blue-500/30 text-white"
              />
              {selectedVideo && (
                <p className="text-sm text-gray-300">
                  Selected: {selectedVideo.name} ({(selectedVideo.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Process Video Button */}
            <Button
              onClick={processVideo}
              disabled={!selectedVideo || isVideoProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isVideoProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enhancing Video...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Enhance Video
                </>
              )}
            </Button>

            {/* Progress */}
            {isVideoProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Video Results - Original vs Enhanced Videos */}
            {videoResult && (
              <div className="space-y-6">
                {videoResult.success ? (
                  <>
                    <Alert className="bg-green-900/50 border-green-500">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-200">
                        Video enhanced successfully!
                      </AlertDescription>
                    </Alert>

                    {/* Side by Side Videos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Original Video */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Original Video</h3>
                        <div className="bg-slate-800 rounded-lg p-4 border border-gray-600">
                          {selectedVideo && (
                            <video
                              src={URL.createObjectURL(selectedVideo)}
                              controls
                              className="w-full h-auto rounded-lg"
                            />
                          )}
                        </div>
                      </div>

                      {/* Enhanced Video */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Enhanced Video</h3>
                        <div className="bg-slate-800 rounded-lg p-4 border border-gray-600">
                          {videoResult.data?.enhanced_path ? (
                            <video
                              src={`${CNN_BACKEND_URL}/api/download/${encodeURIComponent(videoResult.data.enhanced_path)}`}
                              controls
                              className="w-full h-auto rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                              Enhanced video not available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Video Metrics */}
                    {videoResult.metrics && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-slate-800 border-blue-500/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-400">
                              {videoResult.metrics.psnr?.toFixed(2) || 'N/A'} dB
                            </div>
                            <div className="text-sm text-gray-300">PSNR</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-800 border-green-500/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">
                              {videoResult.metrics.ssim?.toFixed(4) || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-300">SSIM</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-800 border-purple-500/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-400">
                              {videoResult.metrics.uiqm_improvement?.toFixed(1) || 'N/A'}%
                            </div>
                            <div className="text-sm text-gray-300">UIQM Improvement</div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Download Enhanced Video */}
                    <div className="text-center">
                      <Button
                        onClick={downloadEnhancedVideo}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Enhanced Video
                      </Button>
                    </div>
                  </>
                ) : (
                  <Alert className="bg-red-900/50 border-red-500">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">
                      {videoResult.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
