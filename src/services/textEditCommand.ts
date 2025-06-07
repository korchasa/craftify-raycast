import { getSelectedText, Clipboard, showHUD, showToast, Toast } from "@raycast/api";
import { LLM } from "./llm";

/**
 * Универсальная функция для команд, которые изменяют текст в редакторе (перевод, исправление и т.д.)
 * @param prompt - system prompt для LLM
 * @param options - опции для LLM (например, temperature)
 * @param hudMessage - сообщение для HUD при старте
 * @param successMessage - сообщение для HUD при успехе
 * @param errorMessage - сообщение для HUD при ошибке
 * @param parseResult - функция для парсинга результата (по умолчанию result из JSON)
 */
export async function textEditCommand({
  prompt,
  options = {},
  hudMessage = "Processing...",
  successMessage = "Done",
  errorMessage = "Error",
  parseResult = (r: { result: string }) => r.result,
}: {
  prompt: string;
  options?: Record<string, unknown>;
  hudMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  parseResult?: (r: { result: string }) => string;
}) {
  try {
    const selectedText = await getSelectedText();
    await showHUD(hudMessage);
    const llm = new LLM();
    const resultObj = await llm.completeStructured(prompt, selectedText, options);
    const result = parseResult(resultObj as { result: string });
    await Clipboard.paste(result);
    await showHUD(successMessage);
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: errorMessage,
      message: String(error),
    });
  }
}
