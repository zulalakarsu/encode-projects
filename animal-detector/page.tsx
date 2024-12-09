'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

export default function Home() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<{
    animal: string
    description: string
    isDangerous: boolean
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) return

    setLoading(true)
    const formData = new FormData()
    formData.append('image', image)

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      })
      
      console.log('API Response status:', response.status)
      const data = await response.json()
      console.log('API Response data:', data)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Animal Classifier</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-grow"
                aria-label="Upload animal image"
              />
              <Button type="submit" disabled={!image || loading}>
                {loading ? 'Processing...' : 'Classify'}
              </Button>
            </div>
            {preview && (
              <div className="mt-4">
                <Image src={preview} alt="Preview of uploaded animal" width={300} height={300} className="rounded-md" />
              </div>
            )}
          </form>
          {result && (
            <div className="mt-4 space-y-2 p-4 bg-muted rounded-lg">
              <p><strong>Animal:</strong> {result.animal}</p>
              <p><strong>Description:</strong> {result.description}</p>
              <p><strong>Is Dangerous:</strong> {result.isDangerous ? 'Yes' : 'No'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

