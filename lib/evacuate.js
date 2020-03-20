"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _util = require("./util");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 *
 */
function evacuateCodeAsComment(path, evacuatedTag) {
  const _stripLocationFromNod = (0, _util.stripLocationFromNode)(path.node),
        {
    leadingComments: leadingComments_ = [],
    innerComments,
    trailingComments: trailingComments_ = []
  } = _stripLocationFromNod,
        node = _objectWithoutProperties(_stripLocationFromNod, ["leadingComments", "innerComments", "trailingComments"]);

  const leadingComments = [...leadingComments_];
  const trailingComments = [...trailingComments_];
  path.node.leadingComments = [];
  path.node.trailingComments = [];
  path.addComment('leading', `
@preserve
${evacuatedTag}
${JSON.stringify(node)}
`);
  path.addComments('leading', leadingComments);
  path.replaceWith(t.noop());
}
/**
 *
 */


const evacuateFeaturesPlugin = (0, _helperPluginUtils.declare)((api, options = {}) => {
  api.assertVersion(7);
  const {
    features = ['classProperties', 'decorator'],
    evacuatedTag = '@evacuated'
  } = options;
  return {
    name: 'transform-evacuate-features',
    visitor: {
      ClassProperty(path) {
        if (features.includes('classProperties')) {
          console.log(path.node);
          evacuateCodeAsComment(path, evacuatedTag);
        }
      },

      Decorator(path) {
        if (features.includes('decorator')) {
          evacuateCodeAsComment(path, evacuatedTag);
        }
      }

    }
  };
});
var _default = evacuateFeaturesPlugin;
exports.default = _default;
//# sourceMappingURL=evacuate.js.map