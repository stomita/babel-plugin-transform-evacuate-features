"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _util = require("./util");

/**
 *
 */
function restoreEvacuatedCode(path, commentType, evacuatedTagRegex, container) {
  let remainingComments = [];
  const evacuatedNodes = [];
  const commentsProp = `${commentType}Comments`;
  const comments = path.node[commentsProp] || [];

  for (const comment of comments) {
    const {
      value: commentText
    } = comment;

    if (evacuatedTagRegex.test(commentText)) {
      const json = commentText.replace(evacuatedTagRegex, '');

      try {
        const node = JSON.parse(json);
        node.leadingComments = [...remainingComments, ...(node.leadingComments || [])];
        remainingComments = [];
        evacuatedNodes.push(node);
      } catch (e) {
        console.error(e);
      }
    } else {
      remainingComments.push((0, _util.stripLocationFromNode)(comment));
    }
  }

  if (evacuatedNodes.length > 0) {
    path.node[commentsProp] = remainingComments;
    const evacuatedNodes_ = commentType === 'leading' ? evacuatedNodes : evacuatedNodes.reverse();

    for (const evacuatedNode of evacuatedNodes_) {
      if (container) {
        path.pushContainer(container, evacuatedNode);
      } else {
        if (commentType === 'leading') {
          path.insertBefore(evacuatedNode);
        } else {
          path.insertAfter(evacuatedNode);
        }
      }
    }
  }
}
/**
 *
 */


const unevacuateFeaturesPlugin = (0, _helperPluginUtils.declare)((api, options) => {
  api.assertVersion(7);
  const {
    evacuatedTag = '@evacuated'
  } = options;
  const evacuatedTagRegex = new RegExp(`^\\s*@preserve\\s+${evacuatedTag}\\s+`);
  return {
    name: 'transform-unevacuate-features',
    visitor: {
      ClassMethod(path) {
        restoreEvacuatedCode(path, 'leading', evacuatedTagRegex);
        const next = path.getSibling(path.key + 1);

        if (next.node) {
          path.node.trailingComments = [];
        } else {
          restoreEvacuatedCode(path, 'trailing', evacuatedTagRegex);
        }
      },

      ClassBody(path) {
        restoreEvacuatedCode(path, 'inner', evacuatedTagRegex, 'body');
      }

    }
  };
});
var _default = unevacuateFeaturesPlugin;
exports.default = _default;
//# sourceMappingURL=unevacuate.js.map