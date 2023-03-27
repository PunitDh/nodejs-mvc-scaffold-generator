import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-n29yNYBQeVUBjvrMRjxSUl3n",
  apiKey: process.env.OPENAI_API_KEY,
});
const openAI = new OpenAIApi(configuration);

class OpenAIResponse {
  constructor({
    id,
    created,
    model,
    choices,
    usage: { prompt_tokens, completion_tokens, total_tokens },
  } = {}) {
    this.id = id;
    this.created = created;
    this.model = model;
    this.answer = choices[0].text || choices[0].message.content;
    this.prompt_tokens = prompt_tokens;
    this.completion_tokens = completion_tokens;
    this.total_tokens = total_tokens;
  }
}

async function completeWithDaVinci(prompt) {
  return openAI
    .createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      max_tokens: 500,
    })
    .then((resp) => new OpenAIResponse(resp.data))
    .catch((err) => err);
}

async function completeWithGPT3(content) {
  return axios
    .post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    )
    .then((response) => new OpenAIResponse(response.data))
    .catch((error) => error);
}

export default { completeWithDaVinci, completeWithGPT3 };
