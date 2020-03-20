function annotate() {}

function annotate2() {}

class A {
  __evacuated_0() {
    this.__evacuated__('classMethod', 'foo', [['annotate']]);
  }

  foo() {
    console.log('foo');
  }
}

class B {
  __evacuated_0() {
    this.__evacuated__('classMethod', 'foo', [['annotate']]);
  }

  /* method 1 */
  foo() {
    console.log('foo');
  }
  /* method 2 */

  __evacuated_1() {
    this.__evacuated__('classMethod', 'bar', [
      ['annotate'],
      [
        'annotate2',
        {
          flag: true
        }
      ]
    ]);
  }

  bar() {
    console.log('bar');
  }
  /* method 3, not decorated */

  baz() {
    console.log('bar');
  }
}
