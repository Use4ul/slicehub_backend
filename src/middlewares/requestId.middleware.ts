import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * Middleware для добавления уникального идентификатора к каждому запросу
 * Генерирует UUID и добавляет его в объект request и в заголовок ответа
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Генерируем UUID или используем существующий из заголовка X-Request-ID (для трассировки запросов мeжду сервисами)
    const requestId = (req.headers["x-request-id"] as string) || uuidv4();
    
    // Добавляем requestId в объект запроса
    req.requestId = requestId;
    
    // Добавляем requestId в заголовок ответа для отслеживания
    res.setHeader("X-Request-ID", requestId);
    
    next();
};

