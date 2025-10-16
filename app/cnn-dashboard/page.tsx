'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  Play, 
  Download, 
  Settings, 
  BarChart3, 
  Image as ImageIcon, 
  Video, 
  Cpu, 
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Monitor
} from 'lucide-react'
import { toast } from 'sonner'

const CNN_BACKEND_URL = 'https://mereyecnn.onrender.com'

interface ProcessingResult {
  success: boolean
  data?: any
  error?: string
  metrics?: {
    psnr: number
    ssim: number
    uiqm_improvement: number
  }
}

export default function CNNDashboard() {
  const [activeTab, setActiveTab] = useState('image')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<ProcessingResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [onnxStatus, setOnnxStatus] = useState<'idle' | 'exporting' | 'completed' | 'error'>('idle')
  const [jetsonStatus, setJetsonStatus] = useState<'idle' | 'deploying' | 'completed' | 'error'>('idle')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResults(null)
      toast.success(`Selected: ${file.name}`)
    }
  }

  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
    return interval
  }

  const processImage = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first')
      return
    }

    setIsProcessing(true)
    const progressInterval = simulateProgress()

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('model', 'epoch4')

      const response = await fetch(`${CNN_BACKEND_URL}/api/process-image`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      clearInterval(progressInterval)
      setProgress(100)
      
      if (result.success) {
        setResults({
          success: true,
          data: result.data,
          metrics: result.metrics
        })
        toast.success('Image enhanced successfully!')
      } else {
        setResults({
          success: false,
          error: result.error || 'Processing failed'
        })
        toast.error('Image processing failed')
      }
    } catch (error) {
      clearInterval(progressInterval)
      setResults({
        success: false,
        error: 'Network error: Unable to connect to CNN backend'
      })
      toast.error('Failed to connect to CNN backend')
    } finally {
      setIsProcessing(false)
    }
  }

  const processVideo = async () => {
    if (!selectedFile) {
      toast.error('Please select a video first')
      return
    }

    setIsProcessing(true)
    const progressInterval = simulateProgress()

    try {
      const formData = new FormData()
      formData.append('video', selectedFile)
      formData.append('model', 'epoch4')

      const response = await fetch(`${CNN_BACKEND_URL}/api/process-video`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      clearInterval(progressInterval)
      setProgress(100)
      
      if (result.success) {
        setResults({
          success: true,
          data: result.data,
          metrics: result.metrics
        })
        toast.success('Video enhanced successfully!')
      } else {
        setResults({
          success: false,
          error: result.error || 'Processing failed'
        })
        toast.error('Video processing failed')
      }
    } catch (error) {
      clearInterval(progressInterval)
      setResults({
        success: false,
        error: 'Network error: Unable to connect to CNN backend'
      })
      toast.error('Failed to connect to CNN backend')
    } finally {
      setIsProcessing(false)
    }
  }

  const exportToONNX = async () => {
    setOnnxStatus('exporting')
    toast.info('Starting ONNX export...')

    try {
      const response = await fetch(`${CNN_BACKEND_URL}/api/export-onnx`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: 'standard',
          optimization: true
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setOnnxStatus('completed')
        toast.success('ONNX export completed!')
      } else {
        setOnnxStatus('error')
        toast.error('ONNX export failed')
      }
    } catch (error) {
      setOnnxStatus('error')
      toast.error('Failed to export to ONNX')
    }
  }

  const deployToJetson = async () => {
    setJetsonStatus('deploying')
    toast.info('Starting Jetson deployment...')

    try {
      const response = await fetch(`${CNN_BACKEND_URL}/api/deploy-jetson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device: 'jetson_orin',
          optimization: 'tensorrt_fp16'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setJetsonStatus('completed')
        toast.success('Jetson deployment completed!')
      } else {
        setJetsonStatus('error')
        toast.error('Jetson deployment failed')
      }
    } catch (error) {
      setJetsonStatus('error')
      toast.error('Failed to deploy to Jetson')
    }
  }

  const runAnalytics = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    setIsProcessing(true)
    const progressInterval = simulateProgress()

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('analysis_type', 'comprehensive')

      const response = await fetch(`${CNN_BACKEND_URL}/api/run-analytics`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      clearInterval(progressInterval)
      setProgress(100)
      
      if (result.success) {
        setResults({
          success: true,
          data: result.data,
          metrics: result.metrics
        })
        toast.success('Analytics completed!')
      } else {
        setResults({
          success: false,
          error: result.error || 'Analytics failed'
        })
        toast.error('Analytics failed')
      }
    } catch (error) {
      clearInterval(progressInterval)
      setResults({
        success: false,
        error: 'Network error: Unable to connect to CNN backend'
      })
      toast.error('Failed to run analytics')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      case 'exporting':
      case 'deploying': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      default: return <Monitor className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            MAR EYE CNN Dashboard
          </h1>
          <p className="text-xl text-blue-200">
            AI-Powered Underwater Image Enhancement & Edge Deployment
          </p>
          <Badge variant="outline" className="text-green-400 border-green-400">
            Backend: {CNN_BACKEND_URL}
          </Badge>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="image" className="data-[state=active]:bg-blue-600">
              <ImageIcon className="w-4 h-4 mr-2" />
              Image Enhancement
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-blue-600">
              <Video className="w-4 h-4 mr-2" />
              Video Enhancement
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="onnx" className="data-[state=active]:bg-blue-600">
              <Cpu className="w-4 h-4 mr-2" />
              ONNX Export
            </TabsTrigger>
            <TabsTrigger value="jetson" className="data-[state=active]:bg-blue-600">
              <Zap className="w-4 h-4 mr-2" />
              Jetson Deploy
            </TabsTrigger>
          </TabsList>

          {/* Image Enhancement Tab */}
          <TabsContent value="image" className="space-y-6">
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
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    className="bg-slate-800 border-blue-500/30 text-white"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-400">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Process Button */}
                <Button
                  onClick={processImage}
                  disabled={!selectedFile || isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing with Epoch 4...
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
                    <div className="flex justify-between text-sm text-white">
                      <span>Processing...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                {/* Results */}
                {results && (
                  <div className="space-y-4">
                    {results.success ? (
                      <Alert className="bg-green-900/50 border-green-500">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-200">
                          Image enhanced successfully!
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-red-900/50 border-red-500">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-200">
                          {results.error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {results.metrics && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-slate-800 rounded-lg">
                          <p className="text-cyan-200 text-sm">PSNR</p>
                          <p className="text-white text-2xl font-bold">
                            {results.metrics.psnr?.toFixed(2)} dB
                          </p>
                        </div>
                        <div className="text-center p-4 bg-slate-800 rounded-lg">
                          <p className="text-cyan-200 text-sm">SSIM</p>
                          <p className="text-white text-2xl font-bold">
                            {results.metrics.ssim?.toFixed(4)}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-slate-800 rounded-lg">
                          <p className="text-cyan-200 text-sm">UIQM Improvement</p>
                          <p className="text-white text-2xl font-bold">
                            +{results.metrics.uiqm_improvement?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Enhancement Tab */}
          <TabsContent value="video" className="space-y-6">
            <Card className="bg-slate-900/50 border-blue-500/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="w-6 h-6 text-blue-400" />
                  Video Enhancement with Epoch 4 Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="video-upload" className="text-white">
                    Select Video
                  </Label>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="bg-slate-800 border-blue-500/30 text-white"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-400">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Process Button */}
                <Button
                  onClick={processVideo}
                  disabled={!selectedFile || isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Video...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Enhance Video
                    </>
                  )}
                </Button>

                {/* Progress */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white">
                      <span>Processing Video...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                {/* Results */}
                {results && (
                  <div className="space-y-4">
                    {results.success ? (
                      <Alert className="bg-green-900/50 border-green-500">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-green-200">
                          Video enhanced successfully!
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-red-900/50 border-red-500">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-200">
                          {results.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-900/50 border-blue-500/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  Comprehensive Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="analytics-upload" className="text-white">
                    Select File for Analysis
                  </Label>
                  <Input
                    id="analytics-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="bg-slate-800 border-blue-500/30 text-white"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-400">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Run Analytics Button */}
                <Button
                  onClick={runAnalytics}
                  disabled={!selectedFile || isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running Analytics...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Run Comprehensive Analytics
                    </>
                  )}
                </Button>

                {/* Progress */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white">
                      <span>Analyzing...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                {/* Results */}
                {results && (
                  <div className="space-y-6">
                    {results.success ? (
                      <>
                        <Alert className="bg-green-900/50 border-green-500">
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription className="text-green-200">
                            Analytics completed successfully!
                          </AlertDescription>
                        </Alert>
                        
                        {/* Analytics Results Display */}
                        {results.data && (
                          <div className="space-y-6">
                            {/* Metrics Display */}
                            {results.metrics && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="bg-slate-800 border-blue-500/30">
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-400">
                                      {results.metrics.psnr?.toFixed(2) || 'N/A'} dB
                                    </div>
                                    <div className="text-sm text-gray-300">PSNR</div>
                                  </CardContent>
                                </Card>
                                <Card className="bg-slate-800 border-green-500/30">
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-400">
                                      {results.metrics.ssim?.toFixed(4) || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-300">SSIM</div>
                                  </CardContent>
                                </Card>
                                <Card className="bg-slate-800 border-purple-500/30">
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-400">
                                      {results.metrics.uiqm_improvement?.toFixed(1) || 'N/A'}%
                                    </div>
                                    <div className="text-sm text-gray-300">UIQM Improvement</div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                            
                            {/* Analytics Files Display */}
                            {results.data.analytics_files && (
                              <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-white">Analysis Reports & Graphs</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {Object.entries(results.data.analytics_files).map(([key, path]) => (
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
                            
                            {/* Download All Analytics */}
                            {results.data.analytics_path && (
                              <div className="text-center">
                                <Button
                                  onClick={() => window.open(`${CNN_BACKEND_URL}/api/download/${encodeURIComponent(results.data.analytics_path)}`, '_blank')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Complete Analytics Report
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <Alert className="bg-red-900/50 border-red-500">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-200">
                          {results.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONNX Export Tab */}
          <TabsContent value="onnx" className="space-y-6">
            <Card className="bg-slate-900/50 border-blue-500/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-blue-400" />
                  ONNX Export for Edge Devices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-white">
                    Export your trained CNN model to ONNX format for deployment on edge devices.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={exportToONNX}
                      disabled={onnxStatus === 'exporting'}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {onnxStatus === 'exporting' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Cpu className="w-4 h-4 mr-2" />
                          Export to ONNX
                        </>
                      )}
                    </Button>
                    
                    {getStatusIcon(onnxStatus)}
                    <span className="text-white">
                      {onnxStatus === 'idle' && 'Ready to export'}
                      {onnxStatus === 'exporting' && 'Exporting model...'}
                      {onnxStatus === 'completed' && 'Export completed!'}
                      {onnxStatus === 'error' && 'Export failed'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jetson Deployment Tab */}
          <TabsContent value="jetson" className="space-y-6">
            <Card className="bg-slate-900/50 border-blue-500/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-400" />
                  Jetson Edge Deployment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-white">
                    Deploy your CNN model to NVIDIA Jetson devices with TensorRT optimization.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={deployToJetson}
                      disabled={jetsonStatus === 'deploying'}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {jetsonStatus === 'deploying' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Deploy to Jetson
                        </>
                      )}
                    </Button>
                    
                    {getStatusIcon(jetsonStatus)}
                    <span className="text-white">
                      {jetsonStatus === 'idle' && 'Ready to deploy'}
                      {jetsonStatus === 'deploying' && 'Deploying to Jetson...'}
                      {jetsonStatus === 'completed' && 'Deployment completed!'}
                      {jetsonStatus === 'error' && 'Deployment failed'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
