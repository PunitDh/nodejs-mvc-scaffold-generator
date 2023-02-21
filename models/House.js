import Model from "../bin/model.js";

class House extends Model {
  constructor(bedrooms, bathrooms, address, parking_spaces, listing_price) {
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.address = address;
    this.parking_spaces = parking_spaces;
    this.listing_price = listing_price;
  }
}

export default House;
