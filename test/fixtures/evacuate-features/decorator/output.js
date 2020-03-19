function annotate() {}

function annotate2() {}

class A {
  /*
  @preserve
  @evacuated
  {"type":"Decorator","expression":{"type":"Identifier","name":"annotate"}}
  */
  foo() {
    console.log('foo');
  }

}

class B {
  /* method 1 */

  /*
  @preserve
  @evacuated
  {"type":"Decorator","expression":{"type":"Identifier","name":"annotate"}}
  */
  foo() {
    console.log('foo');
  }
  /* method 2 */


  /*
  @preserve
  @evacuated
  {"type":"Decorator","expression":{"type":"Identifier","name":"annotate"}}
  */

  /*
  @preserve
  @evacuated
  {"type":"Decorator","expression":{"type":"CallExpression","callee":{"type":"Identifier","name":"annotate2"},"arguments":[{"type":"ObjectExpression","properties":[{"type":"ObjectProperty","method":false,"key":{"type":"Identifier","name":"flag"},"computed":false,"shorthand":false,"value":{"type":"BooleanLiteral","value":true}}]}]}}
  */
  bar() {
    console.log('bar');
  }
  /* method 3, not decorated */


  baz() {
    console.log('bar');
  }

}