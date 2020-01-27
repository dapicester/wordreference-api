'use strict';

var processHtml = require('./lib/process-html');
var validateLanguage = require('./lib/validate-language');
require('babel-core/register');
require('babel-polyfill');
/**
 * Gets the result for the given word
 * @param  {String} word Word to be searched
 * @param  {String} from from language, default en
 * @param  {String} to   to language, default es
 * @return {Object}      Object with the word data
 */

module.exports = function (word, from, to) {
  validateLanguage(from);
  validateLanguage(to);
  // Set the url
  var url = 'http://www.wordreference.com/' + from + to + '/' + word;
  console.log("***WR URL", url);
  // Make the request
  return fetch(url, {
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }
  }).then(function (result) {
    console.log("***W RESULT", result);
    return result.text();
  }).then(function (html) {
    return processHtml(html);
  });
  // Process the HTML
};