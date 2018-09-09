module.exports = ctx => {

  const isProd = (process.env.NODE_ENV === 'production');

  return {
    plugins: {
      'postcss-gap-properties': {
        /**
         * @module postcss-gap-properties
         * @url https://www.npmjs.com/package/postcss-gap-properties
         * --------------------------------------------------------- */
        // 'preserve': true,
      },
      'autoprefixer': {
        /**
         * @module autoprefixer
         * @url https://www.npmjs.com/package/autoprefixer
         * --------------------------------------------------------- */
        // 'env': ,
        // 'cascade': true,
        'cascade': false,
        // 'add': true,
        // 'remove': true,
        // 'supports': true,
        // 'flexbox': true,
        // 'grid': false,
        'grid': true,
        // 'stats':,
        // 'browsers': ,
      },
      'postcss-flexbugs-fixes': {
        /**
         * @module postcss-flexbugs-fixes
         * @url https://www.npmjs.com/package/postcss-flexbugs-fixes
         * --------------------------------------------------------- */
      },
      'csswring': isProd ? {
        /**
         * @module csswring
         * @url https://www.npmjs.com/package/csswring
         * --------------------------------------------------------- */
        // 'preserveHacks': false,
        'preserveHacks': true,
        // 'removeAllComments': false,
        'removeAllComments': true,
      } : false,
      'postcss-reporter': {
        /**
         * @module postcss-reporter
         * @url https://www.npmjs.com/package/postcss-reporter
         * --------------------------------------------------------- */
        // 'clearReportedMessages': false,
        'clearReportedMessages': true,
        // 'formatter': ,
        // 'plugins': [],
        // 'filter': function(message) { return (message.type === 'warning'); },
        // 'clearAllMessages': false,
        'clearAllMessages': true,
        // 'throwError': false,
        // 'sortByPosition': true,
        // 'positionless ': 'first',
        // 'noIcon': false,
        // 'noPlugin': false,
      },
    },
  }
}
