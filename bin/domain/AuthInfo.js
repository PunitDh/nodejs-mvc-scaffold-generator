import { getTableNameFromModel } from "../utils/model_utils.js";
import "../utils/js_utils.js";

class AuthInfo {
  constructor(model, identifier, authenticator) {
    this.model = model;
    this.Model = model.toUpperCase();
    this.router = getTableNameFromModel(model);
    this.identifier = identifier;
    this.authenticator = authenticator;
  }
}

export default AuthInfo;
