import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { a2aAgentRoute } from "./routes/a2a-agent-route";
import { olympusAgent } from "./agents/olympus-agent";
import { olympusWorkflow } from "./workflows/olympus-workflow"; // ✅ add this

export const mastra = new Mastra({
	workflows: { olympusWorkflow }, // ✅ register it here
	agents: { olympusAgent },
	storage: new LibSQLStore({
		url: ":memory:",
	}),
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	telemetry: {
		enabled: false,
	},
	observability: {
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
