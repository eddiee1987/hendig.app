'use client'

import { useEffect, useState } from 'react'
import { getWeatherForecast } from '@/services/weatherService'

export default function WeatherWidget() {
  const [forecast, setForecast] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherForecast('Nesbyen,NO')
        setForecast(data.slice(0, 7)) // Next 7 days
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather')
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [])

  if (loading) return <div>Loading weather...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 border border-gray-700">
      <h2 className="text-lg font-semibold mb-2 text-white">Værvarsel for Nesbyen</h2>
      <div className="grid grid-cols-7 gap-4 xl:gap-6">
        {forecast.map((day) => (
          <div key={day.date} className="text-center">
            <div className="text-sm text-gray-300">
              {new Date(day.date).toLocaleDateString('no-NO', { weekday: 'short' })}
            </div>
            <img 
              src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
              alt={day.description}
              className="mx-auto"
            />
            <div className="font-medium text-white">{Math.round(day.temp)}°C</div>
          </div>
        ))}
      </div>
    </div>
  )
}
