import * as t from '@babel/types';
import { declare } from '@babel/helper-plugin-utils';
import { stripLocationFromNode } from './util';

/**
 *
 */
function restoreEvacuatedCode(path, commentType, evacuatedTagRegex, container) {
  let remainingComments = [];
  const evacuatedNodes = [];
  const commentsProp = `${commentType}Comments`;
  const comments = path.node[commentsProp] || [];
  for (const comment of comments) {
    const { value: commentText } = comment;
    if (evacuatedTagRegex.test(commentText)) {
      const json = commentText.replace(evacuatedTagRegex, '');
      try {
        const node = JSON.parse(json);
        node.leadingComments = [
          ...remainingComments,
          ...(node.leadingComments || [])
        ];
        remainingComments = [];
        evacuatedNodes.push(node);
      } catch (e) {
        console.error(e);
      }
    } else {
      remainingComments.push(stripLocationFromNode(comment));
    }
  }
  if (evacuatedNodes.length > 0) {
    path.node[commentsProp] = remainingComments;
    const evacuatedNodes_ =
      commentType === 'leading' ? evacuatedNodes : evacuatedNodes.reverse();
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

function parseEvacuatedComment(comment, { evacuatedTagName }) {
  const regexp = new RegExp(
    `^[\\s\\*]*@preserve\\s[\\s\\*]*@${evacuatedTagName}\\s[\\s\\*]*(\\w+)\\s+(\\w+)(=|\\(\\))?`
  );
  const m = comment.match(regexp);
  if (m) {
    const [_, type, identifier, mod] = m;
    return { type, identifier, mod };
  }
  return null;
}

function createClassPropNode(identifier, mod, arg) {
  return mod === '='
    ? t.classProperty(t.identifier(identifier), arg)
    : t.classProperty(t.identifier(identifier));
}

function createDecoratorNode(identifier, mod, args) {
  return t.decorator(
    mod === '()'
      ? t.callExpression(t.identifier(identifier), args.elements)
      : t.identifier(identifier)
  );
}

function unevacuateDecoratorNode(decorator) {
  if (decorator.type !== 'ArrayExpression') {
    return;
  }
  const [name, ...args] = decorator.elements;
  if (!name || name.type !== 'StringLiteral') {
    return;
  }
  return t.decorator(
    args.length > 0
      ? t.callExpression(t.identifier(name.value), stripLocationFromNode(args))
      : t.identifier(name.value)
  );
}

function unevacuateCallNode(expression) {
  const [type, name, decorators, value] = expression.arguments;
  if (!type || type.type !== 'StringLiteral') {
    return;
  }
  if (!name || name.type !== 'StringLiteral') {
    return;
  }
  if (!decorators || decorators.type !== 'ArrayExpression') {
    return;
  }
  const unode =
    type.value === 'classProperty'
      ? t.classProperty(
          t.identifier(name.value),
          ...(value ? [stripLocationFromNode(value)] : [])
        )
      : type.value === 'classMethod'
      ? t.classMethod(
          'method',
          t.identifier(name.value),
          [],
          t.blockStatement([])
        )
      : undefined;
  if (!unode) {
    return;
  }
  unode.decorators = decorators.elements
    .map(unevacuateDecoratorNode)
    .filter(Boolean);
  return unode;
}

/**
 *
 */
function applyDecoratorsToClassMethod(path, methodNode) {
  const classBodyPath = path.parentPath;
  const body = classBodyPath.node.body;
  for (let i = 0; i < body.length; i++) {
    const entryPath = classBodyPath.get(`body.${i}`);
    const entry = entryPath.node;
    if (
      entry.type === 'ClassMethod' &&
      entry.key.name === methodNode.key.name
    ) {
      entry.decorators = stripLocationFromNode(methodNode.decorators);
      break;
    }
  }
  path.replaceWith(t.noop());
}

/**
 *
 */
const unevacuateFeaturesPlugin = declare((api, options) => {
  api.assertVersion(7);
  const { evacuatedTagName = 'evacuated' } = options;
  const evacuatedMethodRegex = new RegExp(`^__${evacuatedTagName}_`);
  return {
    name: 'transform-unevacuate-features',
    visitor: {
      ClassMethod(path) {
        const { node } = path;
        if (
          node.key.type === 'Identifier' &&
          evacuatedMethodRegex.test(node.key.name)
        ) {
          const stmt = node.body.body[0];
          if (stmt.type !== 'ExpressionStatement') {
            return;
          }
          const { expression } = stmt;
          if (expression.type !== 'CallExpression') {
            return;
          }
          const unode = unevacuateCallNode(expression);
          if (unode) {
            if (unode.type === 'ClassProperty') {
              path.replaceWith(unode);
            } else if (unode.type === 'ClassMethod') {
              applyDecoratorsToClassMethod(path, unode);
            }
          }
        }
      }
    }
  };
});

export default unevacuateFeaturesPlugin;
