import axios, { ResponseType } from 'axios'

export async function loadUrlData (url: string, responseType?: ResponseType): Promise<any> {
  try {
    const requestConfig: { url: string; method: string; responseType?: ResponseType; } = { url, method: 'GET' }
    if (responseType) { requestConfig.responseType = responseType }
    const response = await axios(requestConfig)
    return response.data
  } catch (error) {
    console.log('error', error)
    throw Error('Error loading data')
  }
}
