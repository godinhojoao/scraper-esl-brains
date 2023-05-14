import { loadUrlData } from './../../../../src/core/utils/loadUrlData'
import axios from 'axios'
import path from 'path'
import fs from 'fs'

jest.mock('axios');

describe('loadUrlData', () => {
  test('Given google url should return loaded html', async () => {
    const expectedFilePath = path.join(__dirname, '../../../mocks/google-page.html')
    const expectedHtmlString = fs.readFileSync(expectedFilePath, 'utf-8')
    axios.get = jest.fn().mockResolvedValue({ data: expectedHtmlString })
    const response = await loadUrlData('https://www.google.com')
    expect(response).toEqual(expectedHtmlString);
  });
})
