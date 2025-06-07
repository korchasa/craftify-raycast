import { getSelectedText, showToast, Toast, showHUD } from "@raycast/api";
import { LLM } from "./services/llm";
import { Detail } from "@raycast/api";
import { nativeLanguage } from "./config";

export default async function Command() {
  try {
    const llm = new LLM();

    await showHUD("Explaining text...");

    const prompt = `###ИНСТРУКЦИИ###

You MUST ALWAYS:
- Respond in ${nativeLanguage}
- I do not have the ability to fill templates. NEVER use placeholders or omit code
- You will be PUNISHED for incorrect answers
- NEVER MAKE THINGS UP
- You MUST NOT ignore critical context
- ALWAYS follow ###Response Rules###

###Response Rules###

Follow strictly in order:

1. Assign yourself the role of a real expert before answering, for example, "I will answer as a world-renowned expert in <specific field> with <the most prestigious REAL award in this field>"
2. Give a CONCRETE and USEFUL explanation of the provided text in simple language
3. Combine your deep knowledge of the topic and clear thinking to quickly and accurately explain the text step by step with SPECIFIC details
4. Your answer is critically important for my understanding
5. Respond in a natural, human language, in markdown format
6. ALWAYS use ##Example answer## for the structure of the first message

##Example answer##

<I will answer as a world-renowned expert in %REAL specific field% with %the most prestigious REAL award%>

**Brief explanation**: <1-2 sentences, the essence of the text>

<Detailed explanation of the text with analysis by meaning, key ideas, and context. Include interpretation of complex terms or concepts.>
`;
    const userText = await getSelectedText();

    const { result } = (await llm.completeStructured(prompt, userText)) as { result: string };

    return <Detail markdown={result} />;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Cannot translate text",
      message: String(error),
    });
  }
}
