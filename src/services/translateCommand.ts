import { Clipboard, getSelectedText, showHUD, showToast, Toast } from "@raycast/api";
import { LLM } from "./llm";
import { nativeLanguage } from "../config";

/**
 * Translator: translates from the native language to the target language and back, depending on the input text.
 * @param selectedText text to translate
 * @param nativeLanguage user's native language (for example, "russian")
 * @param targetLanguage target language (for example, "english")
 * @param nativeLangExample example in the native language
 * @param targetLangExample example in the target language
 * @returns translated text
 */
export async function translateCommand({
  targetLanguage,
  nativeLangExample,
  targetLangExample,
}: {
  targetLanguage: string;
  nativeLangExample: string;
  targetLangExample: string;
}) {
  const prompt = `You will act as an EXPERT translator.

###INSTRUCTIONS###
FOLLOW these INSTRUCTIONS carefully for translating the text:
1. READ the provided text in the user's message.
2. Process the sentences one by one, according to the algorithm:
  - Determine the language of the sentence.
  - If the sentence is in ${nativeLanguage}, translate it into ${targetLanguage}.
  - If the sentence is NOT in ${nativeLanguage}, translate it into ${nativeLanguage}.
3. Return your answer as a JSON object with one field:
   - "result": the translated text

### EXAMPLES ###

User message in ${nativeLanguage}:
${nativeLangExample}
Your answer:
{"result": "${targetLangExample}"}
---
User message in other language:
${targetLangExample}
Your answer:
{"result": "${nativeLangExample}"}
`;

  try {
    const selectedText = await getSelectedText();
    await showHUD("Translating text...");
    const llm = new LLM();
    const { result } = await llm.completeStructured<{ result: string }>(prompt, selectedText, { temperature: 0.0 });
    await Clipboard.paste(result);
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Cannot translate text: " + String(error),
      message: String(error),
    });
  }
}
