import axios, { ResponseType } from 'axios'
import { authHeaders } from '../../config'

interface RequestConfig {
  responseType?: ResponseType;
  headers?: any;
}

export async function loadUrlData (url: string, requestConfig: RequestConfig = {}): Promise<any> {
  requestConfig.headers = authHeaders
  try {
    const response = await axios.get(url, requestConfig)
    return response.data
  } catch (error) {
    console.log('error loading data', error)
    throw Error('Error loading data')
  }
}
