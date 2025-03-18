const Person = require('./Person');

class Student extends Person {
  constructor(name, age, marks) {
    super(name, age);
    this.marks = marks;
  }

  calculateAverageMarks() {
    if (this.marks.length > 0) {
      const total = this.marks.reduce((acc, val) => (acc = acc + val), 0);
      return total / this.marks.length;
    }
  }
}

module.exports = Student;
