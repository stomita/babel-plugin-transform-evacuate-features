"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "evacuateFeaturesPlugin", {
  enumerable: true,
  get: function () {
    return _evacuate.default;
  }
});
Object.defineProperty(exports, "unevacuateFeaturesPlugin", {
  enumerable: true,
  get: function () {
    return _unevacuate.default;
  }
});
exports.default = void 0;

var _evacuate = _interopRequireDefault(require("./evacuate"));

var _unevacuate = _interopRequireDefault(require("./unevacuate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _evacuate.default;
exports.default = _default;
//# sourceMappingURL=index.js.map