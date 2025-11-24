import "reflect-metadata";
import conf from "./conf.json";
import * as http from "http";
import express, { Express } from "express";
import cors from "cors";
import { mainLogger } from "./sys/logger";
import { monitoringRouter, setupCpuMonitoring } from "./src/routes/monitoring";
import apiRouter from "./src/routes/api";
import { setupSwagger } from "./src/swagger/swagger";
import initDB from "./db/init";
import { requestIdMiddleware } from "./src/middlewares";

interface Settings {
    port: number;
}

interface Configuration {
    settings: Settings;
}

const config: Configuration = conf as Configuration;

const app: Express = express();
const server = http.createServer(app);
const PORT = config.settings.port || parseInt(process.env.PORT || "3001", 10);

// Request ID middleware - should be first to track all requests
app.use(requestIdMiddleware);

// Enable CORS for all routes
app.use(cors({
    origin: '*', // В продакшене замените на конкретные домены
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging middleware for debugging
app.use((req, res, next) => {
    const startTime = Date.now();
    mainLogger.info(`→ ${req.method} ${req.path}`);
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        mainLogger.info(`← ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    
    next();
});

// Connect MWs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (swagger.json)
app.use(express.static('public'));

// Mount API router
app.use("/api", apiRouter);

// Monitoring routes
app.use("/monitoring", monitoringRouter);

// Setup Swagger documentation
setupSwagger(app);

// Global error handler to avoid app crash on async DB errors
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
	const message = err instanceof Error ? err.message : String(err);
	mainLogger.error("Unhandled error:", message);
	res.status(503).json({ message: "Service unavailable" });
});

const bootstrap = async (): Promise<void> => {
    try {
        mainLogger.info(`Starting bootstrap func...`);
        startApp();
        await initDB();

        setupCpuMonitoring(server);
        const swaggerPath = process.env.NODE_ENV === 'production' ? '/backend' : '/api-docs';
        mainLogger.info(
            "\n🏠 Monitoring:",
            `\nhttp://localhost:${PORT}/monitoring/ui`,
            `\nhttp://localhost:${PORT}/monitoring/healthcheck`,
            "\n📚 API Documentation:",
            `\nhttp://localhost:${PORT}${swaggerPath}`
        );
    } catch (error) {
        const err = error as Error;
        mainLogger.error("APP STARTING ERROR:", err?.message);
    }
};

function startApp(): void {
    server.listen(PORT, () => {
        mainLogger.info(`App port:: ${PORT}`);
    });
}

bootstrap().catch((e: Error) => {
    mainLogger.error(`SOME BOOTSTRAP ERROR: ${e?.message}`);
    process.exit(1);
});
