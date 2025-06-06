import { getSelectedText, Clipboard, showToast, Toast, showHUD } from "@raycast/api";
import { LLM } from "./llm";

export default async function Command() {
  try {
    const selectedText = await getSelectedText();
    const llm = new LLM();

    await showHUD("Translating text...");

    const { result } = (await llm.completeStructured(
      `
You will act as an EXPERT translator.

###INSTRUCTIONS###
FOLLOW these INSTRUCTIONS carefully for translating the text:
1. READ the provided text in the user's message.
2. Translate the text into Bulgarian.
3. Return your answer as a JSON object with one field:
   - "result": the translated text

###EXAMPLE 1###
User message:
Hi, this is a message with \`markdown\` and <b>tags</b>
Your answer:
{"result": "Здравей, това е съобщение с \`markdown\` и <b>тегове</b>"}
`,
      selectedText,
      { temperature: 0.1 },
    )) as { result: string };

    await Clipboard.paste(result);
    await showHUD("Text translated and copied to clipboard");
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Cannot translate text",
      message: String(error),
    });
  }
}
