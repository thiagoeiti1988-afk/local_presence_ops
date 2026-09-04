import type { Review } from "@local-presence-ops/reviews";
import type {
  ContentProvider,
  DraftedPost,
  DraftPostInput,
  ReviewsSummary,
} from "../provider.js";

const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Optional provider — only usable when OPENAI_API_KEY is configured. Nothing
 * in the rest of the codebase requires this class at compile time or at
 * runtime; it exists purely as an opt-in upgrade over
 * RuleBasedContentProvider (see docs/CONTENT.md).
 */
export class OpenAIContentProvider implements ContentProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string = "gpt-4o-mini",
  ) {
    if (!apiKey) {
      throw new Error(
        "OpenAIContentProvider requires OPENAI_API_KEY. Use MockContentProvider or RuleBasedContentProvider instead.",
      );
    }
  }

  private async chat(prompt: string): Promise<string> {
    const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    return data.choices[0]?.message.content ?? "";
  }

  async draftReviewReply(review: Review): Promise<string> {
    return this.chat(
      `Write a short, empathetic reply (max 60 words) to this ${review.rating}-star review from ${review.author}: "${review.comment ?? ""}". Do not make promises about refunds or guarantees.`,
    );
  }

  async draftPost(input: DraftPostInput): Promise<DraftedPost> {
    const content = await this.chat(
      `Write a short Google Business Profile ${input.type} post (max 80 words) for "${input.businessName}" about: ${input.topic}. Return only the post body, no title.`,
    );
    return {
      title: `${input.type[0]?.toUpperCase()}${input.type.slice(1)}: ${input.topic}`,
      body: content,
      cta: input.type === "offer" ? "Book now" : null,
    };
  }

  async summarizeReviews(reviews: Review[]): Promise<ReviewsSummary> {
    const rated = reviews.filter((r) => typeof r.rating === "number");
    const averageRating =
      rated.length === 0
        ? null
        : rated.reduce((sum, r) => sum + r.rating, 0) / rated.length;

    const commentsBlock = reviews
      .slice(0, 50)
      .map((r) => `${r.rating}★: ${r.comment ?? ""}`)
      .join("\n");

    const summary = await this.chat(
      `Summarize the recurring positive and negative themes in these reviews as two short bullet lists:\n${commentsBlock}`,
    );

    return {
      totalReviews: reviews.length,
      averageRating,
      topPositiveThemes: [summary],
      topNegativeThemes: [],
    };
  }
}
