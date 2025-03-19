const Person = require('./Person');
const Student = require('./Student');

const person1 = new Person('John', 19);
const person2 = new Student('Dave', 20, [80, 80]);

const avg = person2.calculateAverageMarks();
console.log(avg);
