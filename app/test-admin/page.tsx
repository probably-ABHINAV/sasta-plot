
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

type TestResult = {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: string
}

export default function AdminTestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const testResults: TestResult[] = []

    // Test 1: API Routes
    try {
      const plotsRes = await fetch('/api/plots')
      if (plotsRes.ok) {
        const data = await plotsRes.json()
        testResults.push({
          name: 'Plots API',
          status: 'pass',
          message: `Found ${data.plots?.length || 0} plots`,
          details: 'GET /api/plots working correctly'
        })
      } else {
        testResults.push({
          name: 'Plots API',
          status: 'fail',
          message: 'Failed to fetch plots',
          details: `Status: ${plotsRes.status}`
        })
      }
    } catch (error) {
      testResults.push({
        name: 'Plots API',
        status: 'fail',
        message: 'Network error',
        details: String(error)
      })
    }

    // Test 2: Inquiries API
    try {
      const inquiryRes = await fetch('/api/inquiry')
      if (inquiryRes.ok) {
        const data = await inquiryRes.json()
        testResults.push({
          name: 'Inquiries API',
          status: 'pass',
          message: `Found ${data.inquiries?.length || 0} inquiries`,
          details: 'GET /api/inquiry working correctly'
        })
      } else {
        testResults.push({
          name: 'Inquiries API',
          status: 'fail',
          message: 'Failed to fetch inquiries',
          details: `Status: ${inquiryRes.status}`
        })
      }
    } catch (error) {
      testResults.push({
        name: 'Inquiries API',
        status: 'fail',
        message: 'Network error',
        details: String(error)
      })
    }

    // Test 3: Image Storage
    try {
      const storageRes = await fetch('/api/storage/init')
      if (storageRes.ok) {
        testResults.push({
          name: 'Storage System',
          status: 'pass',
          message: 'Storage initialization working',
          details: 'POST /api/storage/init responding correctly'
        })
      } else {
        testResults.push({
          name: 'Storage System',
          status: 'warning',
          message: 'Storage may need configuration',
          details: `Status: ${storageRes.status}`
        })
      }
    } catch (error) {
      testResults.push({
        name: 'Storage System',
        status: 'fail',
        message: 'Storage system error',
        details: String(error)
      })
    }

    // Test 4: Create Plot Test
    try {
      const createRes = await fetch('/api/plots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Plot - Delete Me',
          location: 'Test Location',
          price: 100000,
          size_sqyd: 100,
          size_unit: 'sq.yd',
          description: 'This is a test plot created by admin testing',
          featured: false
        })
      })

      if (createRes.ok) {
        const data = await createRes.json()
        testResults.push({
          name: 'Create Plot',
          status: 'pass',
          message: 'Plot creation working',
          details: `Created plot with slug: ${data.slug || 'unknown'}`
        })

        // Test 5: Delete the test plot
        if (data.slug) {
          try {
            const deleteRes = await fetch(`/api/plots/${data.slug}`, {
              method: 'DELETE'
            })
            if (deleteRes.ok) {
              testResults.push({
                name: 'Delete Plot',
                status: 'pass',
                message: 'Plot deletion working',
                details: 'Test plot successfully deleted'
              })
            } else {
              testResults.push({
                name: 'Delete Plot',
                status: 'fail',
                message: 'Failed to delete test plot',
                details: `Status: ${deleteRes.status}`
              })
            }
          } catch (error) {
            testResults.push({
              name: 'Delete Plot',
              status: 'fail',
              message: 'Delete operation error',
              details: String(error)
            })
          }
        }
      } else {
        testResults.push({
          name: 'Create Plot',
          status: 'fail',
          message: 'Plot creation failed',
          details: `Status: ${createRes.status}`
        })
      }
    } catch (error) {
      testResults.push({
        name: 'Create Plot',
        status: 'fail',
        message: 'Create operation error',
        details: String(error)
      })
    }

    // Test 6: Auth System
    try {
      const authRes = await fetch('/api/auth/mock')
      testResults.push({
        name: 'Auth System',
        status: authRes.ok ? 'pass' : 'warning',
        message: authRes.ok ? 'Auth system responding' : 'Auth system needs attention',
        details: `Status: ${authRes.status}`
      })
    } catch (error) {
      testResults.push({
        name: 'Auth System',
        status: 'fail',
        message: 'Auth system error',
        details: String(error)
      })
    }

    setResults(testResults)
    setTesting(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const passCount = results.filter(r => r.status === 'pass').length
  const failCount = results.filter(r => r.status === 'fail').length
  const warningCount = results.filter(r => r.status === 'warning').length

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin System Test</h1>
        <p className="text-muted-foreground">
          Comprehensive testing of all admin dashboard functionalities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{passCount}</div>
                <div className="text-sm text-muted-foreground">Passing</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{failCount}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-8">
        <Button onClick={runTests} disabled={testing}>
          {testing ? 'Running Tests...' : 'Run Tests Again'}
        </Button>
        <Button variant="outline" onClick={() => window.open('/dashboard-admin-2024', '_blank')}>
          Open Admin Dashboard
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Results</h2>
        {results.map((result, index) => (
          <Alert key={index} className={
            result.status === 'pass' ? 'border-green-200 bg-green-50' :
            result.status === 'fail' ? 'border-red-200 bg-red-50' :
            'border-yellow-200 bg-yellow-50'
          }>
            <div className="flex items-start gap-3">
              {result.status === 'pass' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
              {result.status === 'fail' && <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}
              {result.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{result.name}</h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    result.status === 'pass' ? 'bg-green-100 text-green-800' :
                    result.status === 'fail' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                <AlertDescription className="mt-1">
                  <div>{result.message}</div>
                  {result.details && (
                    <div className="text-xs text-muted-foreground mt-1 font-mono">
                      {result.details}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
      </div>

      {results.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              {testing ? 'Running tests...' : 'No test results yet'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
