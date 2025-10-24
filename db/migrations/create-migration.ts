import * as fs from 'fs';
import * as path from 'path';
import { syncLogger } from '../../sys/logger';
import { EMOJI } from '../../src/utils/emojis';

const migrationName = process.argv[2];

if (!migrationName) {
    console.error(`${EMOJI.ERROR} Usage: npm run migration:create <migration-name>`);
    console.error('Example: npm run migration:create "add user avatar"');
    process.exit(1);
}

// Шаблон миграции
const template = `import { QueryInterface } from 'sequelize';
import { syncLogger } from '../../../sys/logger';
import { EMOJI } from '../../../src/utils/emojis';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(\`\${EMOJI.MIGRATION} Running migration: {{MIGRATION_NAME}}\`);
    
    // TODO: Добавьте код миграции здесь
    
    syncLogger.info(\`\${EMOJI.SUCCESS} {{MIGRATION_NAME}} migration completed successfully\`);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    syncLogger.info(\`\${EMOJI.ROLLBACK} Reverting migration: {{MIGRATION_NAME}}\`);
    
    // TODO: Добавьте код отката здесь
    
    syncLogger.info(\`\${EMOJI.SUCCESS} {{MIGRATION_NAME}} migration reverted successfully\`);
};

export default { up, down };
`;

// Получаем следующий ID миграции
const migrationsDir = path.join(__dirname, 'migrationsFiles');
const existingFiles = fs.readdirSync(migrationsDir);
const migrationNumbers = existingFiles
    .filter(f => f.match(/^\d{3}-/))
    .map(f => parseInt(f.split('-')[0]));

const nextId = migrationNumbers.length > 0 ? Math.max(...migrationNumbers) + 1 : 1;

// Форматируем имя файла
const slugifiedName = migrationName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const fileName = `${nextId.toString().padStart(3, '0')}-${slugifiedName}.ts`;
const filePath = path.join(migrationsDir, fileName);

// Заменяем плейсхолдеры в шаблоне
const fileContent = template.replace(/{{MIGRATION_NAME}}/g, migrationName);

// Создаем файл
fs.writeFileSync(filePath, fileContent, 'utf-8');

console.log(`${EMOJI.SUCCESS} Migration created: ${fileName}`);
console.log(`${EMOJI.INFO} File path: db/migrations/migrationsFiles/${fileName}`);
console.log(`\n${EMOJI.INFO} Don't forget to:`);
console.log(`  1. Add the migration to db/migrations/index.ts:`);
console.log(`     import migration${nextId.toString().padStart(3, '0')} from "./migrationsFiles/${fileName.replace('.ts', '')}";`);
console.log(`  2. Register it in migrationsRegistry:`);
console.log(`     ${nextId}: migration${nextId.toString().padStart(3, '0')},`);

