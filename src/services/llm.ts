import OpenAI from "openai";
import { Msg } from "@agentic/core";
import { z, ZodType } from "zod";
import { mainModel, openaiToken } from "../config";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type CompletionOptions = {
  model: string;
  temperature: number;
};

export const OnlyResultSchema = z.object({
  result: z.string().describe("Исправленный текст"),
});

export class LLM {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: openaiToken });
  }

  /**
   * Определяет провайдера на основе имени модели
   */
  private getProviderFromModel(model: string): "anthropic" | "openai" {
    const modelLowerCase = model.toLowerCase();
    if (modelLowerCase.startsWith("gpt")) {
      return "openai";
    } else if (modelLowerCase.startsWith("claude")) {
      return "anthropic";
    } else {
      // Если не удалось определить, используем Anthropic по умолчанию
      console.warn(`Неизвестная модель: ${model}, используем Anthropic по умолчанию`);
      return "anthropic";
    }
  }

  // Structured completion (JSON output, validated)
  async complete(systemPrompt: string, userText: string, options?: Partial<CompletionOptions>): Promise<string> {
    const mergedOptions = {
      model: mainModel,
      temperature: 0.1,
      max_tokens: 4096,
      ...options,
    };
    const messages = [Msg.system(systemPrompt), Msg.user(userText)];
    const response = await this.openai.chat.completions.create({
      ...mergedOptions,
      messages,
    });
    return response.choices[0]?.message?.content ?? "";
  }

  // Structured completion (JSON output, validated)
  async completeStructured<T>(
    systemPrompt: string,
    userText: string,
    options?: Partial<CompletionOptions>,
    schema: ZodType<T> = OnlyResultSchema as unknown as ZodType<T>,
  ): Promise<T> {
    const mergedOptions = { model: mainModel, temperature: 0.1, ...options };
    const messages = [Msg.system(systemPrompt), Msg.user(userText)];
    const response = await this.openai.chat.completions.create({
      model: mergedOptions.model,
      max_tokens: 4096,
      temperature: mergedOptions.temperature,
      messages,
      response_format: { type: "json_object" },
    });
    const content = response.choices[0]?.message?.content ?? "";
    return schema.parse(JSON.parse(content));
  }

  // Streaming completion (yields text chunks as they arrive)
  async *streamComplete(
    systemPrompt: string,
    userText: string,
    options?: Partial<CompletionOptions>,
  ): AsyncGenerator<string, void, unknown> {
    const mergedOptions = {
      model: mainModel,
      temperature: 0.1,
      max_tokens: 4096,
      ...options,
    };
    const messages = [Msg.system(systemPrompt), Msg.user(userText)];
    const stream = await this.openai.chat.completions.create({
      ...mergedOptions,
      messages,
      stream: true,
    });
    for await (const part of stream) {
      const delta = part.choices[0]?.delta?.content;
      if (delta) {
        yield delta;
      }
    }
  }
}
