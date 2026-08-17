/**
 * Logger — powered by winston.
 * - Terminal       : colorized output
 * - logs/app.log   : all levels (success / info / error)
 * - logs/error.log : errors only
 */

const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs   = require("fs");

const LOGS_DIR  = path.resolve(__dirname, "../../../logs");
const APP_LOG   = path.join(LOGS_DIR, "app.log");
const ERROR_LOG = path.join(LOGS_DIR, "error.log");

// Ensure logs/ directory exists before transports try to open files
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Custom levels: lower number = higher priority
const customLevels = {
    levels: { error: 0, success: 1, info: 2 },
    colors: { error: "red",  success: "green", info: "cyan" },
};

require("winston").addColors(customLevels.colors);

// Shared log-line format (used by file transports)
const fileFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? " | " + JSON.stringify(meta) : "";
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
    })
);

// Colorized format for the console transport
const consoleFormat = format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? " | " + JSON.stringify(meta) : "";
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
    })
);

const winstonLogger = createLogger({
    levels: customLevels.levels,
    level: "info", // "info" (2) is the lowest priority → log everything
    transports: [
        // Colorized terminal
        new transports.Console({ format: consoleFormat }),
        // All levels → app.log  (must pass levels so 'success' isn't filtered)
        new transports.File({ filename: APP_LOG,   level: "info",  levels: customLevels.levels, format: fileFormat }),
        // Errors only → error.log
        new transports.File({ filename: ERROR_LOG, level: "error", levels: customLevels.levels, format: fileFormat }),
    ],
});

const logger = {
    /** Log a successful operation */
    success: (message, meta = {}) => winstonLogger.success(message, meta),

    /** Log an error — pass the Error object as second arg */
    error: (message, err, meta = {}) => {
        const errorMeta = err instanceof Error
            ? { ...meta, errorMessage: err.message, stack: err.stack }
            : meta;
        winstonLogger.error(message, errorMeta);
    },

    /** General info log */
    info: (message, meta = {}) => winstonLogger.info(message, meta),
};

module.exports = logger;
