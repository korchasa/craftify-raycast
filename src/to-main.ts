import { getSelectedText, Clipboard, showToast, Toast, showHUD } from "@raycast/api";
import { LLM } from "./llm";
import { mainLanguage, secondLanguage } from "./config";

export default async function Command() {
  try {
    const selectedText = await getSelectedText();
    const llm = new LLM();

    await showHUD("Translating text...");

    console.log("selectedText", selectedText);

    const { result } = (await llm.completeStructured(
      `
You will act as an EXPERT translator.

###INSTRUCTIONS###
FOLLOW these INSTRUCTIONS carefully for translating the text:
1. READ the provided text in the user's message.
2. Process the sentences one by one, according to the algorithm:
  - Determine the language of the sentence.
  - If the sentence is in ${mainLanguage}, translate it into ${secondLanguage}.
  - If the sentence is NOT in ${mainLanguage}, translate it into ${mainLanguage}.
3. Return your answer as a JSON object with one field:
   - "result": the translated text

### EXAMPLES ###

User message in russian:
Сообщение на русском языке
Your answer:
{"result": "Message in russian language"}
---
User message in other language:
Hi, this is a message with \`markdown\` and <b>tags</b>
Your answer:
{"result": "Привет, это сообщение в \`markdown\` с <b>тегами</b>"}

`,
      selectedText,
      { temperature: 0.0 },
    )) as { result: string };

    await Clipboard.paste(result);
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Cannot translate text",
      message: String(error),
    });
  }
}

/*
Hello world!

*/
