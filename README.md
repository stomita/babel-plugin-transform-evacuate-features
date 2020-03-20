# babel-plugin-transform-evacuate-features

Turn proposal ES features (like class-properties or decorators) into class methods for parsers which does not support these syntax.
It is expected to use with unevacuate plugin to restore the evacuated feature.

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
  __evacuated_0() {
    this.__evacuated__("classProperty", "a", []);
  }

  __evacuated_1() {
    this.__evacuated__("classProperty", "b", [["annotateProp"]], 1);
  }

  __evacuated_2() {
    this.__evacuated__("classMethod", "print", [["annotateMethod", {
      flag: true
    }]]);
  }

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

If you want to restore the evacuated class property / class method decorators, it is required to import `unevacuateFeaturesPlugin` and pass to the babel plugin.

```json
import { unevacuateFeaturesPlugin } from 'babel-plugin-transform-evacuate-features';
module.exports = {
  plugins: [unevacuateFeaturesPlugin],
  parserOpts: {
    plugins: ["class-properties", "decorator-legacy"]
  }
};
```
