/**
 * PostCSS Configuration
 */
module.exports = (ctx) => {
  return {
    map: ctx.options.map,
    plugins: {
      "postcss-import": {
        // filter: () => true,
        // root: process.cwd(),
        // path: [],
        // plugins: undefined,
        plugins: [
          // require("stylelint")(),
        ],
        // resolve: null,
        // load: null,
        // skipDuplicates: true,
        // addModulesDirectories: [],
      },
      "postcss-preset-env": {
        stage: 3,
        // browsers: "last 2 versions",
        autoprefixer: {
          // env: undefined,
          // cascade: true,
          cascade: false,
          // add: true,
          // remove: true,
          // supports: true,
          // flexbox: true,
          // grid: false,
          grid: "autoplace",
          // stats: undefined,
          // browsers: undefined,
        },
        // insertBefore: {},
        // insertAfter: {},
        // preserve: false,
        // importFrom: undefined,
        // exportTo: undefined,
      },
      "postcss-flexbugs-fixes": {},
    },
  };
};
