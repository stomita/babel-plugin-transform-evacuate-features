# babel-plugin-transform-evacuate-features

Turn proposal ES features (like class-properties or decorators) into comments for parsers which does not support these syntax.
It is expected to use with unevacuate plugin in order to restore the comment-evacuated feature.

## Example

### Input

```javascript
class A {
  a;

  @annotateProp
  b = 1;
  
  @annotateMethod({ flag: true })
  print() {
    console.log('a = ', this.a, ', b = ', this.b);
  }
}
```

### Output

```javascript
class A {
  /*
  @preserve
  @evacuated
  {"type":"ClassProperty","static":false,"key":{"type":"Identifier","name":"a"},"computed":false,"value":null}*/

  /*
  @preserve
  @evacuated
  {"type":"ClassProperty","decorators":[{"type":"Decorator","expression":{"type":"Identifier","name":"annotateProp"}}],"static":false,"key":{"type":"Identifier","name":"b"},"computed":false,"value":{"type":"NumericLiteral","extra":{"rawValue":1,"raw":"1"},"value":1}}*/

  /*
  @preserve
  @evacuated
  {"type":"Decorator","expression":{"type":"CallExpression","callee":{"type":"Identifier","name":"annotateMethod"},"arguments":[{"type":"ObjectExpression","properties":[{"type":"ObjectProperty","method":false,"key":{"type":"Identifier","name":"flag"},"computed":false,"shorthand":false,"value":{"type":"BooleanLiteral","value":true}}]}]}}*/
  print() {
    console.log('a = ', this.a, ', b = ', this.b);
  }

}
```

## Install

```
$ npm install babel-plugin-transform-evacuate-features --save-dev
```

## Setup

Add `transform-evacuate-features` in config file (`babel.config.js` or `.babelrc`), or `babel.transform()` options.

Note that `parserOpts.plugins` might be needed to tell babel parser to recognize these syntax.

```json
{
  "plugins": ["transform-evacuate-features"],
  "parserOpts": {
    "plugins": ["class-properties", "decorator-legacy"]
  }
}

```
