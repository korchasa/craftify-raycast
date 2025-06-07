import { getSelectedText, Clipboard, showToast, Toast, showHUD } from "@raycast/api";
import { LLM } from "./services/llm";

export default async function Command() {
  try {
    const selectedText = await getSelectedText();
    const llm = new LLM();

    await showHUD("Fixing text...");

    const systemPrompt = `You will act as an EXPERT editor.

### INSTRUCTIONS ###
FOLLOW these INSTRUCTIONS carefully for translating the text:
1. READ the provided text in the user's message.
2. Fix the text if it is not correct.
3. Return your answer as a JSON object with one field:
   - "result": the fixed text

###EXAMPLE 1###
User message:
Hi tis is a mesage with \`markdown\` and <b>tegs</b>
Your answer:
{"result": "Hi, this is a message with \`markdown\` and <b>tags</b>"}

###EXAMPLE 2###
User message:
Привит это саобщение с \`markdown\`, и <b>тегими</b>
Your answer:
{"result": "Привет, это сообщение с \`markdown\` и <b>тегами</b>"}
`;

    const { result } = (await llm.completeStructured(systemPrompt, selectedText, { temperature: 0.1 })) as {
      result: string;
    };

    await Clipboard.paste(result);
    await showHUD("Text fixed and copied to clipboard");
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Cannot fix text",
      message: String(error),
    });
  }
}
