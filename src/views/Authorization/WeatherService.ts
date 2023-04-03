import axios from 'axios'

export class WeatherService {
  private readonly apiKey = '0c51b8a0df1215976f3e9c65add89c0a'
  private readonly apiUrl = 'https://restapi.amap.com/v3/weather/weatherInfo'

  async getWeather(city: string): Promise<any> {
    const url = `${this.apiUrl}?city=${city}&key=${this.apiKey}`
    const response = await axios.get(url)
    return response.data
  }
}
