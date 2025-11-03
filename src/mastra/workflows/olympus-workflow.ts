import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const olympusStep = createStep({
	id: "olympus-quiz-step",
	description: "Handles messages and runs the Olympus mythology quiz agent",
	inputSchema: z.object({
		message: z.string().describe("The user's message or quiz response"),
	}),
	outputSchema: z.object({
		reply: z.string().describe("The agent's reply to the user"),
	}),
	execute: async ({ inputData, mastra }) => {
		if (!inputData?.message) {
			throw new Error("No user message received");
		}

		const agent = mastra?.getAgent("olympusAgent");
		if (!agent) {
			throw new Error("Olympus Agent not found");
		}

		const result = await agent.generate([
			{
				role: "user",
				content: inputData.message,
			},
		]);

		return {
			reply:
				result?.text || "The Muses are silent — please try again in a moment.",
		};
	},
});

export const olympusWorkflow = createWorkflow({
	id: "olympus-workflow",
	description: "Olympus Mythology Quiz Workflow — triggered by a Telex event.",
	inputSchema: z.object({
		message: z.string().describe("The user's input or quiz command"),
	}),
	outputSchema: z.object({
		reply: z.string().describe("The agent's response"),
	}),
}).then(olympusStep);

olympusWorkflow.commit();
