import { randomChoice, randomInteger } from "../bin/utils/num_utils.js";
import "../bin/utils/js_utils.js";
import Animal from "../models/Animal.js";
import { faker } from "@faker-js/faker";
import { LoremIpsum } from "lorem-ipsum";
import {
  CollectionOf,
  RandomCollectionOf,
} from "../bin/domain/ObjectCollection.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Company from "../models/Company.js";
import User from "../models/User.js";
import { hashed } from "../bin/utils/bcrypt.js";
import { generateCsrfToken } from "../bin/utils/token_generator.js";

const lorem = new LoremIpsum();
const maxInts = 10;

const animals = RandomCollectionOf(maxInts, Animal).withProps({
  name: () => faker.animal.type().capitalize(),
  color: () => faker.color.human().capitalize(),
});
// .save();

const blogs = RandomCollectionOf(maxInts, Blog).withProps({
  title: () => lorem.generateWords(3).capitalize(),
  body: () => lorem.generateSentences(5),
});
// .save();

const blogIds = (await Blog.all()).map((blog) => blog.id);

const comments = RandomCollectionOf(maxInts, Comment).withProps({
  blog_id: () => randomChoice(blogIds),
  body: () => lorem.generateSentences(1),
});
// .save();

const companies = RandomCollectionOf(maxInts, Company).withProps({
  name: () => faker.company.name().capitalize(),
  address: () =>
    `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()}, ${faker.address.zipCode()}`,
  number_of_employees: () => randomInteger(5, 150),
});

// .save();

const users = RandomCollectionOf(maxInts, User).withProps(() => {
  const first_name = () => faker.name.firstName();
  const last_name = () => faker.name.lastName();
  return {
    first_name,
    last_name,
    email: () => faker.internet.email(first_name(), last_name()),
    password: () => hashed("1234"),
    _csrf_token: () => generateCsrfToken(),
  };
});
// .save();

console.log(animals, blogs, blogIds, comments, companies, users);
