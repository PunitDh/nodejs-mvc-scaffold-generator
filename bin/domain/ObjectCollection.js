import { randomInteger } from "../utils/num_utils.js";
import "../utils/js_utils.js";

class ObjectCollection {
  /**
   * Creates an ObjectCollection object that takes in a count and a class
   * @param {Number} count - The number of instances to be created
   * @param {Class} Model - The class of instances to be created
   */
  constructor(count, Model) {
    this.count = count;
    this.instances = [];
    this.Model = Model;
  }

  /**
   * Saves all instances of the model to the database
   * @returns {Array}
   */
  saveAll() {
    return this.instances.map((instance) => instance.save());
  }

  /**
   * Applies props to the given object class
   * The propsObject must have the exact column signature as the defined model
   * @param {any} propsObject - The object or function that populates the columns
   * @returns {ObjectCollection}
   */
  withProps(propsObject) {
    const resultObj =
      typeof propsObject === "function" ? propsObject() : propsObject;
    Array(this.count)
      .fill(null)
      .map(() => {
        const instance = new this.Model();
        resultObj.entries().forEach(([key, value]) => {
          instance[key] = typeof value === "function" ? value() : value;
        });
        this.instances.push(instance);
      });
    return this;
  }
}

/**
 * When applied with .withProps(), returns a number of specified objects with the prop values
 * @param {Number} count - The number of instances to create
 * @param {Class} ModelClass - The class of the instance to be created
 * @returns {ObjectCollection}
 */
export function CollectionOf(count, ModelClass) {
  return new ObjectCollection(count, ModelClass);
}

/**
 * When applied with .withProps(), returns a random number of specified objects with the prop values
 * @param {Number} maxCount - The max number of instances to create
 * @param {Class} ModelClass - The class of the instance to be created
 * @returns {ObjectCollection}
 */
export function RandomCollectionOf(maxCount, ModelClass) {
  return new ObjectCollection(randomInteger(1, maxCount), ModelClass);
}
