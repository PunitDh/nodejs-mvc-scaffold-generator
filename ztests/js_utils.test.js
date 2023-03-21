import { DateFormats } from "../bin/constants.js";
import { assertEquals } from "../bin/test/test_utils.js";
import "../bin/utils/js_utils.js";
import { randomInteger } from "../bin/utils/num_utils.js";

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

const formats = DateFormats.keys();

const formattedDates = formats.map((format) => ({
  format,
  date: new Date("2023-03-21").strfTime(DateFormats[format]),
}));

console.table(formattedDates);