import { showToast, Toast, Detail, useNavigation, getSelectedText } from "@raycast/api";
import { useEffect, useState } from "react";
import { StreamingDetail } from "./services/StreamingDetail";
import { nativeLanguage } from "./config";
import { fetchYoutubeTranscript } from "./services/youtubeFetcher";

export default function Command() {
  const { push } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let url = (await getSelectedText())?.trim();
      if (!url || !url.startsWith("http")) {
        setIsLoading(false);
        await showToast({
          style: Toast.Style.Failure,
          title: "Не найден URL",
          message: "Выделите или скопируйте ссылку на YouTube видео",
        });
        push(<Detail markdown={`# Ошибка\n\nНе найден URL. Выделите или скопируйте ссылку на YouTube видео.`} />);
        return;
      }
      try {
        const text = await fetchYoutubeTranscript(url);
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
    })();
  }, [push]);

  return <Detail isLoading={isLoading} markdown={isLoading ? "Загрузка..." : ""} />;
}
