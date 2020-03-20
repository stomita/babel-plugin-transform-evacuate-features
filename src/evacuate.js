import * as t from '@babel/types';
import { declare } from '@babel/helper-plugin-utils';
import { stripLocationFromNode } from './util';

/**
 *
 */
function getEvacuatedCommentText(
  type,
  identifier,
  mod = '',
  { evacuatedTagName }
) {
  return `
 * @preserve
 * @${evacuatedTagName} ${type} ${identifier}${mod}
 `;
}

/**
 *
 */
function createEvacuatedCallNode(args, { evacuatedTagName }) {
  return t.callExpression(
    t.memberExpression(
      t.thisExpression(),
      t.identifier(`__${evacuatedTagName}__`)
    ),
    args
  );
}

/**
 *
 */
function createEvacuatedClassMethodNode(args, { evacuatedTagName, index }) {
  return t.classMethod(
    'method',
    t.identifier(`__${evacuatedTagName}_${index}`),
    [],
    t.blockStatement([
      t.expressionStatement(createEvacuatedCallNode(args, { evacuatedTagName }))
    ])
  );
}

/**
 *
 */
function createDecoratorNode(node) {
  const { expression } = node;
  const elements = [];
  if (expression.type === 'Identifier') {
    const identifier = expression.name;
    elements.push(t.stringLiteral(identifier));
  } else if (expression.type === 'CallExpression') {
    const identifier = expression.callee.name;
    elements.push(t.stringLiteral(identifier));
    elements.push(...expression.arguments.map(a => stripLocationFromNode(a)));
  }
  return t.arrayExpression(elements);
}

/**
 *
 */
function evacuateClassPropNode(node, options) {
  const {
    decorators = [],
    key: { name: propName }
  } = node;
  const args = [
    t.stringLiteral('classProperty'),
    t.stringLiteral(propName),
    t.arrayExpression(decorators.map(createDecoratorNode))
  ];
  if (node.value) {
    args.push(stripLocationFromNode(node.value));
  }
  return createEvacuatedClassMethodNode(args, options);
}

/**
 *
 */
function evacuateClassMethodDecoratorsNode(node, options) {
  const {
    decorators = [],
    key: { name: methodName }
  } = node;
  const args = [
    t.stringLiteral('classMethod'),
    t.stringLiteral(methodName),
    t.arrayExpression(decorators.map(createDecoratorNode))
  ];
  return createEvacuatedClassMethodNode(args, options);
}

/**
 *
 */
const evacuateFeaturesPlugin = declare((api, options = {}) => {
  api.assertVersion(7);
  const {
    features = ['classProperties', 'decorator'],
    evacuatedTagName = 'evacuated'
  } = options;

  let evacuateIndex = 0;
  return {
    name: 'transform-evacuate-features',
    visitor: {
      ClassBody() {
        evacuateIndex = 0;
      },
      ClassMethod(path) {
        if (features.includes('decorator')) {
          const { node } = path;
          if (node.decorators && node.decorators.length > 0) {
            const enode = evacuateClassMethodDecoratorsNode(node, {
              evacuatedTagName,
              index: evacuateIndex++
            });
            node.decorators = [];
            path.insertBefore(enode);
          }
        }
      },
      ClassProperty(path) {
        if (features.includes('classProperties')) {
          const { node } = path;
          const enode = evacuateClassPropNode(node, {
            evacuatedTagName,
            index: evacuateIndex++
          });
          path.replaceWith(enode);
        }
      }
    }
  };
});

export default evacuateFeaturesPlugin;
