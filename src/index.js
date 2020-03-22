import fetch from 'cross-fetch'

import processHtml from './processHtml'

function validateWord(word) {
  if (!word || word.trim().length === 0)
    throw new Error('Invalid word')
}

function validateLanguage(lang) {
  // TODO: check these!
  if (!['es', 'en', 'it', 'fr'].includes(lang))
    throw Error('Invalid language')
}

/**
 * Gets the result for the given word
 * @param  {String} word Word to be searched
 * @param  {String} from from language, default en
 * @param  {String} to   to language, default es
 * @return {Object}      Object with the word data
 */

export default async function(word, from = 'en', to = 'it') {
  try {
    validateWord(word)
    validateLanguage(from)
    validateLanguage(to)
  } catch (error) {
    return Promise.reject(error)
  }

  // Set the url
  var url = `http://www.wordreference.com/${from}${to}/${word}`
  // Make the request and process the HTML
  return fetch(url, {
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }
  }).then(result => {
    return result.text()
  }).then(html => {
    return processHtml(html)
  })
}
