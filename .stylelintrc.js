/**
 * stylelint Configuration
 */
module.exports = {
  plugins: ["stylelint-prettier", "stylelint-declaration-block-no-ignored-properties"],
  extends: [
    "stylelint-config-recess-order",
    "stylelint-config-standard",
    "stylelint-prettier/recommended",
    "stylelint-config-prettier",
  ],
  rules: {
    "plugin/declaration-block-no-ignored-properties": true,
    // custom
  },
};
