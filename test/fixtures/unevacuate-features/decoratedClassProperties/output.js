class A {
  a;
  /* double annotated class prop */

  @annotateProp
  @annotateProp2({
    flag: true
  }, 123)
  b = 1;
  /* annotated print method */

  @annotateMethod({
    flag: true
  })
  print() {
    console.log('a = ', this.a, ', b = ', this.b);
  }

  print2() {
    console.log('print2');
  }
  /* end of class A */


}
