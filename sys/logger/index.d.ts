import * as log4js from 'log4js';

// Просто расширяем оригинальный интерфейс
export interface Logger extends log4js.Logger {}

export const mainLogger: Logger;
export const loggerDB: Logger;
export const syncLogger: Logger;
