import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export function setupSwagger(app: Express): void {
  // Минимальный CSS - только скрываем топбар
  const minimalCSS = '.swagger-ui .topbar { display: none; }';
  
  // Путь к Swagger UI зависит от окружения
  const swaggerPath = process.env.NODE_ENV === 'production' ? '/backend' : '/api-docs';
  
  app.use(swaggerPath, swaggerUi.serve, swaggerUi.setup(null, {
    customCss: minimalCSS,
    customSiteTitle: 'SliceHub API Documentation',
    swaggerOptions: {
      url: '/swagger.json', // Загружаем статический JSON файл
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
  
  console.log(`📚 Swagger documentation available at ${swaggerPath}`);
}
