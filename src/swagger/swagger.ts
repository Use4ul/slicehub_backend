import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SliceHub Backend API',
      version: '1.0.0',
      description: 'API для управления 3D моделями и пользователями',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Validation errors',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Request body validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
                example: 'Missing required field: name',
              },
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        ServerError: {
          description: 'Server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Database unavailable',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/api/**/*.ts'], // Путь к файлам с JSDoc комментариями
};

const specs = swaggerJsdoc(options);

const darkThemeCSS = `
  .swagger-ui .topbar { display: none; }
  
  /* Основной фон */
  .swagger-ui { 
    background-color: #1a1a1a; 
    color: #e0e0e0;
  }
  
  /* Заголовки */
  .swagger-ui .info .title { 
    color: #ffffff; 
    font-weight: bold;
  }
  .swagger-ui .info .description, 
  .swagger-ui .info p { 
    color: #d0d0d0; 
  }
  
  /* Теги секций */
  .swagger-ui .opblock-tag { 
    color: #ffffff; 
    border-bottom: 1px solid #404040;
    font-weight: 600;
  }
  .swagger-ui .opblock-tag:hover {
    background: rgba(255,255,255,0.05);
  }
  
  /* Блоки эндпоинтов */
  .swagger-ui .opblock { 
    background: #252525; 
    border: 1px solid #404040;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  .swagger-ui .opblock .opblock-summary { 
    background: #2a2a2a; 
    border-color: #404040;
  }
  .swagger-ui .opblock.is-open .opblock-summary {
    border-bottom: 1px solid #404040;
  }
  .swagger-ui .opblock .opblock-summary-path { 
    color: #e0e0e0; 
    font-weight: 500;
  }
  .swagger-ui .opblock .opblock-summary-description { 
    color: #b0b0b0; 
  }
  
  /* Тело запроса/ответа */
  .swagger-ui .opblock-body { 
    background: #1f1f1f; 
    color: #e0e0e0;
  }
  .swagger-ui .opblock-description-wrapper p,
  .swagger-ui .opblock-section-header h4 { 
    color: #ffffff; 
  }
  
  /* Параметры */
  .swagger-ui .parameter__name { 
    color: #ffffff; 
    font-weight: 600;
  }
  .swagger-ui .parameter__type { 
    color: #4ec9b0; 
    font-weight: 500;
  }
  .swagger-ui .parameter__in { 
    color: #9cdcfe; 
  }
  
  /* Таблицы */
  .swagger-ui table thead tr td, 
  .swagger-ui table thead tr th { 
    background: #2a2a2a; 
    color: #ffffff; 
    border-color: #404040;
    font-weight: 600;
  }
  .swagger-ui table tbody tr td { 
    color: #d0d0d0; 
    border-color: #404040;
  }
  
  /* Модели/схемы */
  .swagger-ui .model-box { 
    background: #252525; 
    border: 1px solid #404040;
  }
  .swagger-ui .model { 
    color: #e0e0e0; 
  }
  .swagger-ui .model-title { 
    color: #ffffff; 
    font-weight: 600;
  }
  .swagger-ui .prop-type { 
    color: #4ec9b0; 
  }
  .swagger-ui .prop-format { 
    color: #9cdcfe; 
  }
  .swagger-ui .property.primitive { 
    color: #d0d0d0; 
  }
  
  /* Инпуты и контролы */
  .swagger-ui input, 
  .swagger-ui textarea, 
  .swagger-ui select { 
    background: #2a2a2a; 
    color: #e0e0e0; 
    border: 1px solid #404040;
  }
  .swagger-ui input:focus,
  .swagger-ui textarea:focus,
  .swagger-ui select:focus {
    border-color: #569cd6;
    background: #2f2f2f;
  }
  
  /* Кнопки */
  .swagger-ui .btn { 
    background: #404040; 
    color: #ffffff; 
    border: 1px solid #555555;
    font-weight: 500;
  }
  .swagger-ui .btn:hover { 
    background: #505050;
    border-color: #666666;
  }
  .swagger-ui .btn.execute { 
    background: #569cd6; 
    border-color: #569cd6;
  }
  .swagger-ui .btn.execute:hover { 
    background: #6aacdf;
  }
  
  /* Ответы */
  .swagger-ui .responses-inner h4,
  .swagger-ui .responses-inner h5 { 
    color: #ffffff; 
  }
  .swagger-ui .response-col_status { 
    color: #e0e0e0; 
  }
  .swagger-ui .response-col_description { 
    color: #d0d0d0; 
  }
  
  /* Код */
  .swagger-ui .highlight-code > .microlight { 
    background: #1e1e1e !important; 
    color: #d4d4d4 !important;
    border: 1px solid #404040;
  }
  
  /* Схема протокола */
  .swagger-ui .scheme-container { 
    background: #252525; 
    border: 1px solid #404040;
  }
  .swagger-ui .scheme-container .schemes > label { 
    color: #ffffff; 
  }
  
  /* Дополнительно */
  .swagger-ui .markdown p,
  .swagger-ui .markdown code { 
    color: #d0d0d0; 
  }
  .swagger-ui .model-toggle::after {
    background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23ffffff" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>') 50% no-repeat;
  }
`;

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: darkThemeCSS,
    customSiteTitle: 'SliceHub API Documentation',
  }));
}

export { specs };
