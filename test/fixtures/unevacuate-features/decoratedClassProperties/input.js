class A {
  __evacuated_0() {
    this.__evacuated__('classProperty', 'a', []);
  }
  /* double annotated class prop */

  __evacuated_1() {
    this.__evacuated__(
      'classProperty',
      'b',
      [
        ['annotateProp'],
        [
          'annotateProp2',
          {
            flag: true
          },
          123
        ]
      ],
      1
    );
  }
  /* annotated print method */

  __evacuated_2() {
    this.__evacuated__('classMethod', 'print', [
      [
        'annotateMethod',
        {
          flag: true
        }
      ]
    ]);
  }

  print() {
    console.log('a = ', this.a, ', b = ', this.b);
  }

  print2() {
    console.log('print2');
  }
  /* end of class A */
}
