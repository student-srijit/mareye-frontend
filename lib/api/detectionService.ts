// Detection API Service for MarEye
// Connects to the Render-deployed detection backend

const API_BASE_URL = process.env.NEXT_PUBLIC_DETECTION_API_URL || 'http://localhost:10000';

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  center_x: number;
  center_y: number;
}

export interface Threat {
  id: number;
  class: string;
  class_id: number;
  confidence: number;
  confidence_percentage: number;
  threat_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  bounding_box: BoundingBox;
  area_pixels: number;
  relative_size: number;
}

export interface ImageDetectionResult {
  success: boolean;
  type: 'image';
  filename: string;
  threats: Threat[];
  threat_count: number;
  overall_threat_level: string;
  overall_threat_score: number;
  annotated_image?: string; // Base64 encoded image
  metadata: {
    image_path: string;
    image_width: number;
    image_height: number;
    image_size_kb: number;
    model_used: string;
    confidence_threshold: number;
    detection_timestamp: string;
  };
  error?: string;
}

export interface VideoFrame {
  frame_number: number;
  timestamp: number;
  threats: Threat[];
  threat_count: number;
  threat_level: string;
}

export interface VideoDetectionResult {
  success: boolean;
  type: 'video';
  filename: string;
  video_metadata: {
    duration_seconds: number;
    fps: number;
    total_frames: number;
    processed_frames: number;
    frame_interval: number;
    resolution: string;
  };
  total_detections: number;
  total_threats: number;
  overall_threat_level: string;
  frames_with_threats: VideoFrame[];
  summary: {
    frames_analyzed: number;
    frames_with_detections: number;
    detection_rate: number;
  };
  error?: string;
}

export type DetectionResult = ImageDetectionResult | VideoDetectionResult;

export class DetectionService {
  private static baseUrl = API_BASE_URL;

  /**
   * Check API health status
   */
  static async checkHealth(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error('API health check failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  /**
   * Detect threats in an image
   */
  static async detectImage(file: File): Promise<ImageDetectionResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/api/detect/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Image detection failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Image detection error:', error);
      throw error;
    }
  }

  /**
   * Detect threats in a video
   */
  static async detectVideo(
    file: File,
    frameInterval: number = 30
  ): Promise<VideoDetectionResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('frame_interval', frameInterval.toString());

      const response = await fetch(`${this.baseUrl}/api/detect/video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Video detection failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Video detection error:', error);
      throw error;
    }
  }

  /**
   * Unified detection endpoint (auto-detects image vs video)
   */
  static async detect(file: File): Promise<DetectionResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/api/detect`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Detection failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Detection error:', error);
      throw error;
    }
  }

  /**
   * Get model information
   */
  static async getModelInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/model/info`);
      if (!response.ok) {
        throw new Error('Failed to fetch model info');
      }
      return await response.json();
    } catch (error) {
      console.error('Model info error:', error);
      throw error;
    }
  }
}

