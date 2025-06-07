import { Detail, showToast, Toast, ActionPanel, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import { LLM } from "./llm";
import { analyzeUserInput } from "./inputAnalyzer";
import { fetchYoutubeTranscript } from "./youtubeFetcher";
import { fetchUrlAndExtractText } from "./urlFetcher";

/**
 * Универсальный компонент для команд, которые выводят результат в Detail
 * @param prompt - system prompt для LLM
 * @param input - текст для LLM (или undefined, если используется inputPromise)
 * @param inputPromise - Promise для получения текста (например, getSelectedText)
 * @param options - опции для LLM
 */
export function DetailCommand({
  prompt,
  input,
  inputPromise,
  options = {},
}: {
  prompt: string;
  input?: string;
  inputPromise?: Promise<string>;
  options?: Record<string, unknown>;
}) {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const llm = new LLM();
    let acc = "";
    async function run() {
      try {
        let actualInput = input;
        if (!actualInput && inputPromise) {
          actualInput = await inputPromise;
        }
        if (!actualInput) {
          throw new Error("No input provided");
        }
        const { text, isUrl, isYoutubeVideo } = analyzeUserInput(actualInput);
        let processedInput = text;
        if (isYoutubeVideo) {
          setMarkdown("⏬ Downloading YouTube subtitles...");
          processedInput = await fetchYoutubeTranscript(text);
        } else if (isUrl) {
          setMarkdown("🌐 Downloading page text...");
          processedInput = await fetchUrlAndExtractText(text);
        }
        for await (const chunk of llm.streamComplete(prompt, processedInput, options)) {
          if (cancelled) break;
          acc += chunk;
          setMarkdown(acc);
        }
      } catch (e) {
        await showToast({ style: Toast.Style.Failure, title: "Error", message: String(e) });
        setMarkdown(`# Ошибка\n\n${String(e)}`);
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [prompt, input, inputPromise, JSON.stringify(options)]);

  return (
    <Detail
      isLoading={loading}
      markdown={markdown}
      actions={
        !loading && markdown ? (
          <ActionPanel>
            <Action.CopyToClipboard title="Copy Result" content={markdown} />
            <Action.Paste title="Paste Result to Frontmost App" content={markdown} />
          </ActionPanel>
        ) : undefined
      }
    />
  );
}
