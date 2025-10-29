'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageIcon } from 'lucide-react'

export default function CNNModelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-400" />
              CNN Model - Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              The CNN image enhancement feature is currently under maintenance.
              Please check back soon or use the Detection feature.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
