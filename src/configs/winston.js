import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = winston.format;
const logDir = process.env.LOG_DIR;

const infoTransport = new WinstonDaily({
    filename: 'inflab_pretest-%DATE%-info.log',
    dirname: logDir,
    level: 'info',
    levelOnly: true,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '1d',
});
const errorDetailTransport = new WinstonDaily({
    filename: 'inflab_pretest-%DATE%-error.log',
    dirname: logDir,
    level: 'error',
    levelOnly: true,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '1d',
});

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        printf((info) => `${JSON.stringify({ timestamp: info.timestamp, level: info.level, message: info.message })}`),
    ),
    transports: [infoTransport, errorDetailTransport],
});

const stream = {
    write: (message) => {
        logger.info(message);
    },
};

const customError = (req, error) => {

    const userId = req.body.user_id;

    const errorObj = {
        url: `[${req.method}] ${req.headers.host}${req.originalUrl}`,
        userId,
        error: {
            message: error.message,
            stack: error.stack,
            status: error.status,
        },
        req: {
            headers: req.headers,
            query: req.query,
            body: req.body,
            // route: req.route
        },
    };

    logger.error(errorObj);
};

const sqlError = (error) => {
    const errorObj = {
        code: error.code,
        errorNo: error.errno,
        sql: error.sql,
        state: error.sqlState,
        message: error.message,
    };

    logger.error(errorObj);

    return { success: false, message: errorObj };
};
// Production 환경이 아닌 경우(dev 등)
if (process.env.SERVER_ENV === 'dev') {
    logger.add(new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.prettyPrint({ colorize: 'true' }),
            winston.format.align(),
            // winston.format.cli(),
        ),
    }));
}
export {
    logger, stream, customError, sqlError,
};
