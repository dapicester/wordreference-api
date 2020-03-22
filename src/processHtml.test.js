import fs from 'fs'
import path from 'path'

import processHtml from '../src/processHtml'

describe('processHtml', () => {
  const PREFIX = '../__tests__/'
  const readFile = name => fs.readFileSync(path.resolve(__dirname, PREFIX + name))
  const requireFile = name => require(PREFIX + name)

  test('definition', () => {
    const html = readFile('rainbow.html')
    const expected = requireFile('rainbow.json')

    const result = processHtml(html)
    expect(result).toEqual(expected)
  })

  test('translation', () => {
    const html = readFile('costruire.html')
    const expected = requireFile('costruire.json')

    const result = processHtml(html)
    expect(result).toEqual(expected)
  })
})
