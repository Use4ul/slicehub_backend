import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export function setupSwagger(app: Express): void {
  // Минимальный CSS - только скрываем топбар
  const minimalCSS = '.swagger-ui .topbar { display: none; }';
  
  // Динамически изменяем спецификацию в зависимости от окружения
  const spec = { ...swaggerSpec };
  if (process.env.NODE_ENV === 'production') {
    // На production nginx перенаправляет /backend/* на бэкенд /api/*
    // Поэтому убираем /api/ из путей и добавляем production сервер
    const productionPaths: any = {};
    for (const [path, methods] of Object.entries(spec.paths)) {
      const newPath = path.replace(/^\/api/, '');
      productionPaths[newPath] = methods;
    }
    spec.paths = productionPaths;
    spec.servers = [
      {
        url: 'https://slicehub.ru/backend',
        description: 'Production server',
      },
    ];
  }
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec, {
    customCss: minimalCSS,
    customSiteTitle: 'SliceHub API Documentation',
    swaggerOptions: {
      displayRequestDuration: true,
      tryItOutEnabled: true,
      filter: true,
      persistAuthorization: true,
      validatorUrl: null,
      deepLinking: false,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      docExpansion: 'list',
    },
  }));
  
  console.log('📚 Swagger documentation available at /api-docs');
}
