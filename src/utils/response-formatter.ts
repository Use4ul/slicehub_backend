/**
 * Форматирование списковых ответов API с пагинацией
 */
export interface PaginatedResponse<T> {
  count: number;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
  data: T[];
}

/**
 * Форматировать ответ со списком данных и пагинацией
 */
export function formatListResponse<T>(
  data: T[],
  options?: {
    limit?: number;
    offset?: number;
    total?: number;
  }
): PaginatedResponse<T> {
  const response: any = {
    count: data.length,
  };

  // Если переданы параметры пагинации, добавляем объект pagination
  if (options && typeof options.total === 'number') {
    response.pagination = {
      limit: options.limit || data.length,
      offset: options.offset || 0,
      total: options.total,
      hasMore: (options.offset || 0) + data.length < options.total,
    };
  }

  // data идет последним для удобства просмотра
  response.data = data;

  return response;
}

