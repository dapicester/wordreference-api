'use strict';

module.exports = function (lang) {
  if (['es', 'en', 'it', 'fr'].indexOf(lang) != -1) return lang;else throw Error('Invalid language');
};