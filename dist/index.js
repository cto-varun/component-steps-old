"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _configurableSteps = _interopRequireDefault(require("./configurableSteps"));
var _steps = require("./steps.schema");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = {
  component: _configurableSteps.default,
  schema: _steps.schema,
  ui: _steps.ui
};
exports.default = _default;
module.exports = exports.default;