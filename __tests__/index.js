import fetch from 'cross-fetch'

import wr from '../src'

jest.mock('cross-fetch')

describe('wordreference-api', () => {
  test('invalid word', async () => {
    await expect(wr()).rejects.toThrow('Invalid word')
    expect(fetch).not.toHaveBeenCalled()
  })

  test('invalid from language', async () => {
    await expect(wr('rainbox', 'tr')).rejects.toThrow('Invalid language')
    expect(fetch).not.toHaveBeenCalled()
  })

  test('invalid to language', async () => {
    await expect(wr('rainbox', 'en', 'tr')).rejects.toThrow('Invalid language')
    expect(fetch).not.toHaveBeenCalled()
  })

  test('result', async () => {
    fetch.mockResolvedValue({ text: () => Promise.resolve('<html><body></body></html>') })

    const result = await wr('rainbow', 'en', 'it')
    expect(result).toMatchObject({
      word: expect.any(String),
      pronWR: expect.any(String),
      audio: expect.any(Array),
      translations: expect.any(Array),
    })
  })
})
