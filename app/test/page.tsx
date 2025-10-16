'use client'

import { useState } from 'react'

export default function TestPage() {
  const [testResult, setTestResult] = useState<string>('')

  const testBackend = async () => {
    try {
      const response = await fetch('https://mereyecnn.onrender.com/health')
      const data = await response.json()
      setTestResult(`✅ Backend is working! Status: ${response.status}, Response: ${JSON.stringify(data)}`)
    } catch (error) {
      setTestResult(`❌ Backend error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          MAR EYE Test Page
        </h1>
        
        <div className="bg-slate-900/50 border border-blue-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Backend Connection Test</h2>
          
          <button
            onClick={testBackend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mb-4"
          >
            Test Backend Connection
          </button>
          
          {testResult && (
            <div className="bg-slate-800 border border-gray-600 rounded-lg p-4">
              <pre className="text-white text-sm whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
        </div>

        <div className="mt-8 bg-slate-900/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Navigation Links</h2>
          <div className="space-y-4">
            <a href="/cnn-model" className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center">
              🧠 Go to CNN Model Page
            </a>
            <a href="/cnn-dashboard" className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-center">
              🤖 Go to CNN Dashboard Page
            </a>
            <a href="/" className="block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-center">
              🏠 Go to Home Page
            </a>
          </div>
        </div>

        <div className="mt-8 bg-slate-900/50 border border-yellow-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Instructions</h2>
          <div className="text-white space-y-2">
            <p>1. Click "Test Backend Connection" to verify the backend is working</p>
            <p>2. Click "Go to CNN Model Page" to see image/video enhancement</p>
            <p>3. Click "Go to CNN Dashboard Page" to see analytics</p>
            <p>4. If you see this page, the frontend is working correctly</p>
          </div>
        </div>
      </div>
    </div>
  )
}
