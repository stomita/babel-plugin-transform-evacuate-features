class A {
  a;

  @annotateProp
  b = 1;
  
  @annotateMethod({ flag: true })
  print() {
    console.log('a = ', this.a, ', b = ', this.b);
  }
}