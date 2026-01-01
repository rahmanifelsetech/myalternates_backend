import { registerAs } from '@nestjs/config';
import { transports, format } from 'winston';
import { WinstonConfig } from '@app/shared/interfaces/core/winston';
// side-effect import to register the DailyRotateFile transport
import 'winston-daily-rotate-file';

export default registerAs(
  'winston',
  (): WinstonConfig => ({
    level: process.env.WINSTON_LEVEL || 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = Object.keys(meta).length
          ? JSON.stringify(meta, null, 4)
          : '';

        return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}`;
      }),
      format.colorize({ all: true }),
    ),
    transports: [
      new transports.Console(),

      // rotate error logs daily, compress, limit size and retention
      new (transports as any).DailyRotateFile({
        filename:
          process.env.WINSTON_ERROR_LOG_FILENAME || 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: process.env.WINSTON_MAX_SIZE || '20m',
        maxFiles: process.env.WINSTON_ERROR_MAX_FILES || '30d',
        level: 'error',
        format: format.combine(format.timestamp(), format.json()),
      }),

      // rotate combined logs daily, compress, limit size and retention
      new (transports as any).DailyRotateFile({
        filename:
          process.env.WINSTON_COMBINED_LOG_FILENAME || 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: process.env.WINSTON_MAX_SIZE || '20m',
        maxFiles: process.env.WINSTON_COMBINED_MAX_FILES || '14d',
        format: format.combine(format.timestamp(), format.json()),
      }),
    ],
  }),
);
