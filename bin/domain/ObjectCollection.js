import { randomInteger } from "../utils/num_utils.js";
import "../utils/js_utils.js";

class ObjectCollection {
  constructor(count, Model) {
    this.count = count;
    this.instances = [];
    this.Model = Model;
  }

  /**
   * Saves all models to the database
   * @returns Saved instances as promises
   */
  async saveAll() {
    return this.instances.mapAsync((instance) => instance.save());
  }

  /**
   * Applies props to the given object class
   * The propsObject must have the exact column signature as the defined model
   * @param {object} propsObject
   * @returns
   */
  withProps(propsObject) {
    const resultObj =
      typeof propsObject === "function" ? propsObject() : propsObject;
    Array(this.count)
      .fill(null)
      .map(() => {
        const instance = new this.Model();
        Object.entries(resultObj).forEach(([key, value]) => {
          instance[key] = typeof value === "function" ? value() : value;
        });
        this.instances.push(instance);
      });
    return this;
  }
}

/**
 * When applied with .withProps(), returns a number of specified objects with the prop values
 * @param {integer} count
 * @param {Class} ModelClass
 * @returns ObjectCollection
 */
export function CollectionOf(count, ModelClass) {
  return new ObjectCollection(count, ModelClass);
}

/**
 * When applied with .withProps(), returns a random number of specified objects with the prop values
 * @param {integer} maxCount
 * @param {Class} ModelClass
 * @returns
 */
export function RandomCollectionOf(maxCount, ModelClass) {
  return new ObjectCollection(randomInteger(1, maxCount), ModelClass);
}
