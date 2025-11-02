import { z } from "zod";
import { createCompletenessScorer } from "@mastra/evals/scorers/code";
import { createScorer } from "@mastra/core/scores";

/**
 * ✅ 1. Completeness — ensures the quiz has 10 questions + final score summary
 */
export const completenessScorer = createCompletenessScorer();

/**
 * ✅ 2. Answer Evaluation — checks if the agent correctly handles user answers and scoring
 */
export const answerJudgementScorer = createScorer({
	name: "Answer Judgement Accuracy",
	description:
		"Evaluates whether the OlympusAgent correctly identifies user answers, reveals the right ones, and calculates the final score accurately.",
	type: "agent",
	judge: {
		model: "google/gemini-2.5-flash",
		instructions: `
You are evaluating a mythology trivia agent called OlympusAgent.
You will review a full quiz conversation (10 questions).

Check the following:
1. Did OlympusAgent correctly identify right/wrong answers for each question?
2. Did it show the correct answer when the user was wrong?
3. Did it correctly calculate the final score out of 10?

Return ONLY a structured JSON object following the schema.`,
	},
})
	.preprocess(({ run }) => {
		const convo = `
USER:
${JSON.stringify(run.input?.inputMessages || "", null, 2)}

OLYMPUS AGENT:
${JSON.stringify(run.output || "", null, 2)}
    `;
		return { convo };
	})
	.analyze({
		description:
			"Checks correctness of answer marking, explanations, and final scoring.",
		outputSchema: z.object({
			correctMarkings: z.boolean(),
			correctAnswersRevealed: z.boolean(),
			finalScoreAccurate: z.boolean(),
			confidence: z.number().min(0).max(1).default(1),
			explanation: z.string().default(""),
		}),
		createPrompt: ({ results }) => `
You are reviewing a full mythology trivia quiz handled by OlympusAgent.

Conversation:
"""
${results.preprocessStepResult.convo}
"""

Evaluate:
- Were user answers marked correctly?
- Did the agent reveal the correct answers when needed?
- Was the final score out of 10 accurate?

Return JSON with:
{
  "correctMarkings": boolean,
  "correctAnswersRevealed": boolean,
  "finalScoreAccurate": boolean,
  "confidence": number, // 0-1
  "explanation": string
}
    `,
	})
	.generateScore(({ results }) => {
		const r = (results as any)?.analyzeStepResult || {};
		const base =
			(r.correctMarkings ? 0.4 : 0) +
			(r.correctAnswersRevealed ? 0.3 : 0) +
			(r.finalScoreAccurate ? 0.3 : 0);
		return Math.max(0, Math.min(1, base * (r.confidence ?? 1)));
	})
	.generateReason(({ results, score }) => {
		const r = (results as any)?.analyzeStepResult || {};
		return `Olympus scoring: markings=${r.correctMarkings}, answersShown=${r.correctAnswersRevealed}, finalScore=${r.finalScoreAccurate}, confidence=${r.confidence}. Score=${score}. ${r.explanation}`;
	});

/**
 * ✅ Export all scorers together
 */
export const scorers = {
	completenessScorer,
	answerJudgementScorer,
};
