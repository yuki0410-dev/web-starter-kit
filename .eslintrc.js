module.exports = {
  'extends': [
    'standard',
    'prettier'
  ],
  'env': {
    'browser': true
  },
  'plugins': [
    'prettier'
  ],
  'rules': {
    'prettier/prettier': [
      'error',
      {
        'singleQuote': true,
        'semi': false
      }
    ],
    'yoda': 0,
    'no-unused-vars': 1
  },
  'globals': {
    '$': false
  }
}
