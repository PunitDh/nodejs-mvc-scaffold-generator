export class ObjectCollection extends Array {
  async save() {
    for (const i of this) {
      await i.save();
    }
    return this;
  }
}

export function ArrayOf(instances) {
  return new ObjectCollection(instances).fill(null);
}
