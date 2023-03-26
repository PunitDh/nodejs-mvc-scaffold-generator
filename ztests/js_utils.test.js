import { DateFormats } from "../bin/constants.js";
import "../bin/utils/js_utils.js";

const nums = [1, 2, 3, 4, 5, 6];
const num2 = [4.5, 5.3, 6.1, 7.6, 8.4, 9.3];
const num3 = [null, 0, 1, {}, [], undefined, false, true, 1.1];

// console.log(nums.difference([4,5,6,7,8,9]));

// console.log(nums.intersection([4,5,6,7,8,9]));

// console.log(nums.count(item => item > 2));

// console.log(num3.filterNull());

// console.log(num3.filterUndefined());

const tests = [
  {
    type: "IELTS",
    count: 30,
  },
  {
    type: "IELTS",
    count: 20,
  },
  {
    type: "IELTS",
    count: 35,
  },
  {
    type: "PTE",
    count: 25,
  },
  {
    type: "PTE",
    count: 50,
  },
  {
    type: "PTE",
    count: 45,
  },
];

const expected = {
  PTE: [
    {
      type: "PTE",
      count: 45,
    },
    {
      type: "PTE",
      count: 25,
    },
    {
      type: "PTE",
      count: 50,
    },
  ],
  IELTS: [
    {
      type: "IELTS",
      count: 30,
    },
    {
      type: "IELTS",
      count: 20,
    },
    {
      type: "IELTS",
      count: 35,
    },
  ],
};

// console.log(
//   [
//     { a: 1 },
//     { b: 2 },
//     { c: 3 },
//     { d: 4 },
//     { e: [1,Symbol(5.00001)] },
//     { f: 6 },
//     {
//       g: (arg) => {
//         arg;
//       },
//     },
//   ].includesObject({ e: [Symbol(5.00001),1] })
// );

console.log(
  {
    a: () => Symbol(3),
    e: { f: [5, [{ z: 5 }], 6] },
    g: 1,
    h: Symbol(1),
  }.equals({
    a: () => Symbol(3),
    g: 1,
    h: Symbol(1),
    e: { f: [5, [{ z: 5 }], 6] },
  })
);

const inventory = [
  { name: "asparagus", type: "vegetables", quantity: 5 },
  { name: "bananas", type: "fruit", quantity: 0 },
  { name: "goat", type: "meat", quantity: 23 },
  { name: "cherries", type: "fruit", quantity: 5 },
  { name: "fish", type: "meat", quantity: 22 },
];

const expectedInv = {
  vegetables: [{ name: "asparagus", type: "vegetables", quantity: 5 }],
  fruit: [
    { name: "bananas", type: "fruit", quantity: 0 },
    { name: "cherries", type: "fruit", quantity: 5 },
  ],
  meat: [
    { name: "goat", type: "meat", quantity: 23 },
    { name: "fish", type: "meat", quantity: 22 },
  ],
};

const actualInv = inventory.groupBy(({ type }) => type);

console.log(expectedInv.equals(actualInv));

console.log([1, { l: 1 }, 2n, [undefined], null, true].equals([1, { l: 1 }, 2n, [undefined], null, true]));
