import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { a2aAgentRoute } from "./routes/a2a-agent-route";

import {
	completenessScorer,
	answerJudgementScorer,
} from "./scorers/olympus-scorer";
import { olympusAgent } from "./agents/olympus-agent";

export const mastra = new Mastra({
	workflows: {},
	agents: { olympusAgent },
	scorers: {
		completenessScorer,
		answerJudgementScorer,
	},
	storage: new LibSQLStore({
		// stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: ":memory:",
	}),
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	telemetry: {
		// Telemetry is deprecated and will be removed in the Nov 4th release
		enabled: false,
	},
	observability: {
		// Enables DefaultExporter and CloudExporter for AI tracing
		default: { enabled: true },
	},
	server: {
		build: {
			openAPIDocs: true,
			swaggerUI: true,
		},
		apiRoutes: [a2aAgentRoute],
	},
});
