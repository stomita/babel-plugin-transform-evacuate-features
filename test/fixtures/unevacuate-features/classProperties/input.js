class A {
  __evacuated_0() {
    this.__evacuated__('classProperty', 'a', [], 1);
  }
}

class B {
  /* property */
  __evacuated_0() {
    this.__evacuated__('classProperty', 'b', [], 'b');
  }

  __evacuated_1() {
    this.__evacuated__('classProperty', 'c', []);
  }
  /* method */

  foo() {
    console.log('foo');
  }
}
