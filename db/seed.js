import { randomChoice, randomInteger } from "../bin/utils/num_utils.js";
import "../bin/utils/js_utils.js";
import Animal from "../models/Animal.js";
import { faker } from "@faker-js/faker";
import { LoremIpsum } from "lorem-ipsum";
import { ArrayOf } from "../bin/domain/ObjectCollection.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Company from "../models/Company.js";
import User from "../models/User.js";
import { hashed } from "../bin/utils/bcrypt.js";
import { generateCsrfToken } from "../bin/utils/token_generator.js";

const lorem = new LoremIpsum();

const maxInts = 10;

ArrayOf(randomInteger(1, maxInts))
  .map(
    () =>
      new Animal({
        name: faker.animal.type().capitalize(),
        color: faker.color.human().capitalize(),
      })
  )
  .save();

ArrayOf(randomInteger(1, maxInts))
  .map(
    () =>
      new Blog({
        title: lorem.generateWords(3).capitalize(),
        body: lorem.generateSentences(5),
      })
  )
  .save();

const blogIds = (await Blog.all()).map((blog) => blog.id);

ArrayOf(randomInteger(1, maxInts))
  .map(
    () =>
      new Comment({
        blog_id: randomChoice(blogIds),
        body: lorem.generateSentences(1),
      })
  )
  .save();

ArrayOf(randomInteger(1, maxInts))
  .map(
    () =>
      new Company({
        name: faker.company.name().capitalize(),
        address: `${faker.address.streetAddress()}, ${faker.address.city()} ${faker.address.state()} ${faker.address.zipCode()}`,
        number_of_employees: randomInteger(5, 150),
      })
  )
  .save();

ArrayOf(randomInteger(1, maxInts))
  .map(() => {
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const email = faker.internet.email(first_name, last_name);
    const password = hashed("1234");
    const _csrf_token = generateCsrfToken();
    return new User({
      first_name,
      last_name,
      email,
      password,
      _csrf_token,
    });
  })
  .save();
