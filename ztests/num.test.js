import { ImaginaryNumber } from "../bin/utils/num_utils.js";
import "../bin/utils/js_utils.js";

const img1 = new ImaginaryNumber(2, 3);
const img2 = new ImaginaryNumber(2, 2);

console.log(img1.minus(img2).toString());

console.log([71,4].range());
