function annotate() {}

function annotate2() {}

class A {
  @annotate

  foo() {
    console.log('foo');
  }

}

class B {
  /* method 1 */
  @annotate

  foo() {
    console.log('foo');
  }

  /* method 2 */
  @annotate

  @annotate2({
    flag: true
  })

  bar() {
    console.log('bar');
  }

  /* method 3, not decorated */
  baz() {
    console.log('bar');
  }

}