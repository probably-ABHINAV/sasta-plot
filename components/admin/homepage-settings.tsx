'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, Check } from 'lucide-react'
import Image from 'next/image'

export interface HomepageSettings {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroImage: string
  startingPrice: string
  priceUnit: string
  showFeaturedPlotsInLatest: boolean
  latestPlotsLimit: number
}

export default function HomepageSettingsManager() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('Failed to fetch settings')
      const data = await response.json()
      setSettings(data)
    } catch (err) {
      setError('Failed to load settings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    try {
      setSaving(true)
      setSaved(false)
      setError(null)

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to save settings')
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save settings')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof HomepageSettings, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Homepage Settings</h2>
          <p className="text-gray-300">Customize your homepage hero section and featured content</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm">
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      {saved && (
        <Alert className="border-green-500/50 bg-green-500/10 backdrop-blur-sm">
          <AlertDescription className="text-green-400">Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Hero Section</CardTitle>
          <CardDescription className="text-gray-300">
            Customize the main hero section on your homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle" className="text-white">Hero Subtitle/Badge</Label>
            <Input
              id="heroSubtitle"
              value={settings.heroSubtitle}
              onChange={(e) => updateSetting('heroSubtitle', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Trusted & Affordable Plots"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroTitle" className="text-white">Hero Title</Label>
            <Input
              id="heroTitle"
              value={settings.heroTitle}
              onChange={(e) => updateSetting('heroTitle', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Premium Plot Ownership Made Simple"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroDescription" className="text-white">Hero Description</Label>
            <Textarea
              id="heroDescription"
              value={settings.heroDescription}
              onChange={(e) => updateSetting('heroDescription', e.target.value)}
              className="bg-white/5 border-white/20 text-white min-h-[100px]"
              placeholder="Discover verified residential and commercial plots..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startingPrice" className="text-white">Starting Price (₹)</Label>
              <Input
                id="startingPrice"
                type="number"
                value={settings.startingPrice}
                onChange={(e) => updateSetting('startingPrice', e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="16500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceUnit" className="text-white">Price Unit</Label>
              <Input
                id="priceUnit"
                value={settings.priceUnit}
                onChange={(e) => updateSetting('priceUnit', e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="per sq/yd"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroImage" className="text-white">Hero Image Path</Label>
            <Input
              id="heroImage"
              value={settings.heroImage}
              onChange={(e) => updateSetting('heroImage', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="/images/plots/plot-1.png"
            />
            <p className="text-xs text-gray-400">
              Upload images to /public/images/plots/ folder and reference them here
            </p>
            {settings.heroImage && (
              <div className="mt-2 relative aspect-video w-full max-w-md rounded-lg overflow-hidden">
                <Image
                  src={settings.heroImage}
                  alt="Hero preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Latest Properties Section</CardTitle>
          <CardDescription className="text-gray-300">
            Control which plots appear in the "Latest Properties" section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="latestPlotsLimit" className="text-white">Number of Plots to Show</Label>
            <Input
              id="latestPlotsLimit"
              type="number"
              min="1"
              max="12"
              value={settings.latestPlotsLimit}
              onChange={(e) => updateSetting('latestPlotsLimit', parseInt(e.target.value))}
              className="bg-white/5 border-white/20 text-white"
            />
            <p className="text-xs text-gray-400">
              Show the most recently added {settings.latestPlotsLimit} plots
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showFeaturedPlotsInLatest"
              checked={settings.showFeaturedPlotsInLatest}
              onChange={(e) => updateSetting('showFeaturedPlotsInLatest', e.target.checked)}
              className="h-4 w-4 rounded border-white/20"
            />
            <Label htmlFor="showFeaturedPlotsInLatest" className="text-white cursor-pointer">
              Only show featured plots in Latest Properties section
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
