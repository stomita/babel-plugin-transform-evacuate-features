class A {
  /*
  @preserve
  @evacuated
  {"type":"ClassProperty","static":false,"key":{"type":"Identifier","name":"a"},"computed":false,"value":null}
  */

  /*
  @preserve
  @evacuated
  {"type":"ClassProperty","decorators":[{"type":"Decorator","expression":{"type":"Identifier","name":"annotateProp"}}],"static":false,"key":{"type":"Identifier","name":"b"},"computed":false,"value":{"type":"NumericLiteral","extra":{"rawValue":1,"raw":"1"},"value":1}}
  */

  /*
  @preserve
  @evacuated
  {"type":"Decorator","expression":{"type":"CallExpression","callee":{"type":"Identifier","name":"annotateMethod"},"arguments":[{"type":"ObjectExpression","properties":[{"type":"ObjectProperty","method":false,"key":{"type":"Identifier","name":"flag"},"computed":false,"shorthand":false,"value":{"type":"BooleanLiteral","value":true}}]}]}}
  */
  print() {
    console.log('a = ', this.a, ', b = ', this.b);
  }

}
