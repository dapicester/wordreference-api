module.exports = {
  hooks: {
    'pre-push': 'yarn lint && yarn test'
  }
}
