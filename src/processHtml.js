import cheerio from 'cheerio'

/**
 * Process the html returned from the request and generates the JSON.
 * @param  {string} html html string to be parsed
 * @return {Object}      worldreference object
 */
export default function processHtml(html) {
  const $ = cheerio.load(html)
  const word = $('h3.headerWord').text()
  let pronWR = $('span#pronWR').text()
  if (!pronWR) {
    $('span.pronWR span').remove()
    pronWR = $('span.pronWR').text()
  }
  const audio = $('div#listen_widget audio source')
    .map(function() { return $(this).attr('src') })
    .get()
  const translations = $('table.WRD')
    .map(function() { return $(this).html() })
    .get()
    .map(processTable)
  return { word, pronWR, audio, translations }
}

/**
 * Parses the a table.WRD html element and return it as a json
 * @param {String} html table.WRD html
 * @return {Object} table parsed
 */
function processTable(html) {
  // read the html and set the object to be returned
  const $ = cheerio.load(html, { xmlMode: true })
  const result = {}
  result.title = ''
  result.translations = []

  // iterate for each tr element
  $('tr').each(function() {
    const element = $(this)
    const html = element.html()
    // set the title
    if (isHeaderItem(element)) { // Creates a header item
      result.title = element.text()
    } else if (isTranslationItem(element)) { // create a "translations element"
      result.translations.push(createTranslationItem(html))
    } else if (isExampleItem(element)) {  // Adds the examples
      addExample(result, html)
    }
  })

  return result
}

const ARROW = /⇒/g

/**
 * Creates a translation item from the tr provided as html
 * @param  {String} html
 * @return {String}
 */
function createTranslationItem(html) {
  const $ = cheerio.load(html, { xmlMode: true })
  const from = $('strong').text().replace(ARROW, '')
  // delete tooltips
  $('.ToWrd em span').remove()
  $('.FrWrd em span').remove()
  const fromType = $('.FrWrd em').text()
  const toType = $('.ToWrd em').text()
  $('.ToWrd em').remove()
  const to = $('.ToWrd').text().replace(ARROW, '').trim()
  let [fromSense, toSense] = $('.FrWrd')[0].nextSibling.children
  fromSense = $(fromSense).text().trim()
  toSense = $(toSense).text().trim()
  return {
    from,
    fromType,
    fromSense,
    toType,
    toSense,
    to,
    example: {
      from: [],
      to: []
    }
  }
}

/**
 * add an example item contained in the html in the obj
 * @param  {Object} obj
 * @param  {String} html
 * @return {Object}
 */
function addExample(obj, html) {
  const $ = cheerio.load(html, { xmlMode: true })
  const last = obj.translations[obj.translations.length - 1].example

  if ($('.FrEx').text() !== '') {
    last.from.push($('.FrEx').text())
  } else if($('.ToEx').text() !== '') {
    last.to.push($('.ToEx').text())
  }
}

function isHeaderItem(element) {
  return element.attr('class') === 'wrtopsection'
}

function isTranslationItem(element) {
  const id = element.attr('id')
  const clss = element.attr('class')
  return (id !== undefined && (clss === 'even' || clss === 'odd'))
}

function isExampleItem(element) {
  const id = element.attr('id')
  const clss = element.attr('class')
  return (id === undefined && (clss === 'even' || clss === 'odd'))
}
