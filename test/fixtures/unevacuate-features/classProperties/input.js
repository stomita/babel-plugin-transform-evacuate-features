class A {
  /*
  @preserve
  @evacuated
  {"type":"ClassProperty","static":false,"key":{"type":"Identifier","name":"a"},"computed":false,"value":{"type":"NumericLiteral","extra":{"rawValue":1,"raw":"1"},"value":1}}*/

}

class B {
  /* property */

  /*
  @preserve
  @evacuated
  {"type":"ClassProperty","static":false,"key":{"type":"Identifier","name":"b"},"computed":false,"value":{"type":"StringLiteral","extra":{"rawValue":"b","raw":"'b'"},"value":"b"}}*/

  /* method */
  foo() {
    console.log('foo');
  }

}