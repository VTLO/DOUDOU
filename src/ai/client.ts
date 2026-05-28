import Anthropic from "@anthropic-ai/sdk";

export type AIModel = "claude-opus-4-7" | "claude-sonnet-4-6" | "claude-haiku-4-5-20251001";

export interface AIClientOptions {
  apiKey?: string;
  model?: AIModel;
  maxTokens?: number;
}

export class AIClient {
  private client: Anthropic;
  private model: AIModel;
  private maxTokens: number;

  constructor(options: AIClientOptions = {}) {
    this.client = new Anthropic({
      apiKey: options.apiKey ?? process.env.ANTHROPIC_API_KEY,
    });
    this.model = options.model ?? (process.env.CLAUDE_MODEL as AIModel) ?? "claude-opus-4-7";
    this.maxTokens = options.maxTokens ?? 4096;
  }

  async complete(
    systemPrompt: string,
    userMessage: string,
    options?: { maxTokens?: number }
  ): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens ?? this.maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    return content.text;
  }

  async completeWithCache(
    systemPrompt: string,
    userMessage: string,
    options?: { maxTokens?: number }
  ): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens ?? this.maxTokens,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMessage }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    return content.text;
  }

  async streamComplete(
    systemPrompt: string,
    userMessage: string,
    onChunk: (text: string) => void
  ): Promise<string> {
    let fullText = "";

    const stream = this.client.messages.stream({
      model: this.model,
      max_tokens: this.maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        onChunk(event.delta.text);
        fullText += event.delta.text;
      }
    }

    return fullText;
  }
}
