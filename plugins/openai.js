import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-n29yNYBQeVUBjvrMRjxSUl3n",
  apiKey: process.env.OPENAI_API_KEY,
});
const openAI = new OpenAIApi(configuration);

export default async function (prompt) {
  return openAI
    .createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      max_tokens: 500,
    })
    .then((resp) => resp.data)
    .catch((err) => err);
}

// export default async function (content) {
//   return axios
//     .post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "text-davinci-003",
//         messages: [{ role: "user", content }],
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       }
//     )
//     .then((response) => response.data)
//     .catch((error) => error);
// }
