type LocationResponse = {
  ip: string
  city: string
  region: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  timezone: string
  asn: number
  isp: string
}

export async function getLocation(ip: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.nelsonlai.dev/ip/geo?ip=${ip}`)

    console.warn(response.ok, response.status, response.statusText)

    if (!response.ok) throw new Error('Failed to fetch location')

    const data = (await response.json()) as LocationResponse

    const { country } = data
    const region = data.region ? `, ${data.region}` : ''

    return `${country}${region}`
  } catch (error) {
    console.warn(`Error fetching location for IP ${ip}:`, error)

    return null
  }
}
