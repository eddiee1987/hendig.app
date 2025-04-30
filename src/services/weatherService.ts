interface WeatherData {
  date: string
  temp: number
  description: string
  icon: string
}

interface OpenWeatherForecast {
  dt_txt: string
  main: {
    temp: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
}

export async function getWeatherForecast(location: string): Promise<WeatherData[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  if (!apiKey) {
    throw new Error('OpenWeather API key not configured')
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`
  )
  const data = await response.json() as { list: OpenWeatherForecast[]; message?: string }

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch weather data')
  }

  // Group by day and take first forecast of each day
  const dailyForecasts = data.list.reduce((acc: OpenWeatherForecast[], forecast: OpenWeatherForecast) => {
    const date = forecast.dt_txt.split(' ')[0]
    if (!acc.find(f => f.dt_txt.includes(date))) {
      acc.push(forecast)
    }
    return acc
  }, [] as OpenWeatherForecast[])

  return dailyForecasts.map((forecast: OpenWeatherForecast) => ({
    date: forecast.dt_txt,
    temp: forecast.main.temp,
    description: forecast.weather[0].description,
    icon: forecast.weather[0].icon
  }))
}
