import { useState, useEffect } from "react";
import { Detail } from "@raycast/api";
import { LLM } from "./llm";

export function StreamingDetail({ prompt, text, onDone }: { prompt: string; text: string; onDone?: () => void }) {
  const [markdown, setMarkdown] = useState("");
  useEffect(() => {
    let cancelled = false;
    const llm = new LLM();
    let acc = "";
    async function run() {
      for await (const chunk of llm.streamComplete(prompt, text, { temperature: 0.1 })) {
        if (cancelled) break;
        acc += chunk;
        setMarkdown(acc);
      }
      if (onDone) onDone();
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [prompt, text, onDone]);
  return <Detail markdown={markdown} />;
}
