import { randomInteger } from "../utils/num_utils.js";
import "../utils/js_utils.js";

class ObjectCollection {
  constructor(count, Model) {
    this.count = count;
    this.instances = [];
    this.Model = Model;
  }

  async save() {
    return this.instances.mapAsync((instance) => instance.save());
  }

  withProps(object) {
    const resultObj = typeof object === "function" ? object() : object;
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

export function CollectionOf(count, Model) {
  return new ObjectCollection(count, Model);
}

export function RandomCollectionOf(count, Model) {
  return new ObjectCollection(randomInteger(1, count), Model);
}
