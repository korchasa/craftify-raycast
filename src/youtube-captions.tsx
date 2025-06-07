import { Form, ActionPanel, Action, showToast, Toast, Detail, useNavigation } from "@raycast/api";
import { useState } from "react";
import { YoutubeTranscript } from "youtube-transcript";
import { StreamingDetail } from "./services/StreamingDetail";
import { nativeLanguage } from "./config";

async function fetchYoutubeTranscript(url: string, attempts = 3): Promise<string> {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(url);
      if (!transcript || transcript.length === 0) {
        throw new Error("Transcript is empty");
      }
      return transcript.map((t) => t.text).join(" ");
    } catch (err) {
      lastError = err;
      if (attempt < attempts) {
        await new Promise((res) => setTimeout(res, 500));
      }
    }
  }
  throw lastError || new Error("Failed to fetch transcript");
}

export default function Command() {
  const { push } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: { url: string }) {
    setIsLoading(true);
    try {
      const text = await fetchYoutubeTranscript(values.url);
      const prompt = `You are an expert writer. Read this youtube video captions and rewrite it in ${nativeLanguage} language.`;
      push(<StreamingDetail prompt={prompt} text={text} onDone={() => setIsLoading(false)} />);
    } catch (error) {
      console.error("YouTube Captions Error:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: String(error),
      });
      push(<Detail markdown={`# Ошибка\n\n${String(error)}`} />);
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Get Captions" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="url" title="YouTube Video URL" placeholder="https://www.youtube.com/watch?v=..." />
    </Form>
  );
}
