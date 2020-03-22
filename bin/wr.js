#!/usr/bin/env node -r esm

import api from '../src'

api('rainbow', 'en', 'it') // TODO: process.argv
  .then(response => process.stdout.write(JSON.stringify(response, null,2)))
  .catch(error => process.stderr.write(String(error)))
