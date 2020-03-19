import * as t from '@babel/types';
import { declare } from '@babel/helper-plugin-utils';
import { stripLocationFromNode } from './util';

/**
 *
 */
function evacuateCodeAsComment(path, evacuatedTag) {
  const {
    leadingComments: leadingComments_ = [],
    innerComments,
    trailingComments: trailingComments_ = [],
    ...node
  } = stripLocationFromNode(path.node);
  const leadingComments = [...leadingComments_];
  const trailingComments = [...trailingComments_];
  path.node.leadingComments = [];
  path.node.trailingComments = [];
  path.addComment(
    'leading',
    `
@preserve
${evacuatedTag}
${JSON.stringify(node)}
`
  );
  path.addComments('leading', leadingComments);
  path.replaceWith(t.noop());
}

/**
 *
 */
const evacuateFeaturesPlugin = declare((api, options = {}) => {
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

export default evacuateFeaturesPlugin;
