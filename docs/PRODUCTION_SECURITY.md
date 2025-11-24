# Production Security Guide

## 🔒 Чеклист безопасности для Production

### 1. Изменить дефолтные credentials

#### PostgreSQL

```yaml
# docker-compose.yml
environment:
  POSTGRES_PASSWORD: "your-strong-password-min-16-chars"
```

```json
// conf.json
{
  "auth": {
    "slicehub_user": {
      "password": "your-strong-password-min-16-chars"
    }
  }
}
```

#### MinIO

```yaml
# docker-compose.yml
environment:
  MINIO_ROOT_USER: "your-custom-username"
  MINIO_ROOT_PASSWORD: "your-strong-password-min-16-chars"
```

```json
// conf.json
{
  "s3": {
    "accessKeyId": "your-custom-username",
    "secretAccessKey": "your-strong-password-min-16-chars"
  }
}
```

#### Redis

```yaml
# docker-compose.yml
redis:
  command: redis-server --appendonly yes --requirepass "your-redis-password"
```

### 2. Использовать переменные окружения

Создайте `.env` файл (не коммитить в git!):

```bash
# Генерация сильных паролей
openssl rand -base64 32 > postgres_password.txt
openssl rand -base64 32 > minio_password.txt
openssl rand -base64 32 > redis_password.txt
openssl rand -base64 32 > jwt_secret.txt
```

### 3. Настроить HTTPS

#### Вариант 1: Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name api.slicehub.com;

    ssl_certificate /etc/nginx/ssl/slicehub.crt;
    ssl_certificate_key /etc/nginx/ssl/slicehub.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Вариант 2: Traefik

```yaml
# docker-compose.yml
services:
  app:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`api.slicehub.com`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
```

### 4. Ограничить доступ к портам

#### Firewall (UFW)

```bash
# Разрешить только необходимые порты
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# НЕ открывать публично:
# 5432 - PostgreSQL
# 6379 - Redis
# 9000 - MinIO API
# 9001 - MinIO Console
```

#### Docker network isolation

```yaml
# docker-compose.yml
services:
  app:
    networks:
      - frontend
      - backend
  
  postgres:
    networks:
      - backend  # Только внутренняя сеть
  
  redis:
    networks:
      - backend
  
  minio:
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    internal: true  # Изолированная сеть
```

### 5. Настроить ограничения ресурсов

```yaml
# docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
    
    # Защита от OOM killer
    mem_limit: 2g
    memswap_limit: 2g
    
    # Ограничить PIDs
    pids_limit: 200
```

### 6. Безопасное хранение файлов конфигурации

```bash
# Права доступа
chmod 600 conf.json
chmod 600 .env

# Владелец
chown root:root conf.json
chown root:root .env

# Исключить из git
echo "conf.json" >> .gitignore
echo ".env" >> .gitignore
```

### 7. Docker secrets (для Swarm)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    external: true
```

```bash
# Создать secret
echo "my-secret-password" | docker secret create db_password -
```

### 8. Регулярные обновления

```bash
# Обновить образы
docker-compose pull

# Перезапустить с новыми образами
docker-compose up -d

# Удалить старые образы
docker image prune -a
```

### 9. Мониторинг и алерты

#### Docker health checks

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "node", "-e", "..."]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### Логирование

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "5"
        labels: "production"
```

### 10. Backup стратегия

#### Автоматический backup PostgreSQL

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"

docker-compose exec -T postgres pg_dump -U slicehub_user slicehub > "$BACKUP_DIR/slicehub_$DATE.sql"

# Удалить старые backup (старше 7 дней)
find $BACKUP_DIR -name "slicehub_*.sql" -mtime +7 -delete
```

#### Cron job

```bash
# Добавить в crontab
0 2 * * * /path/to/backup.sh
```

#### Автоматический backup MinIO

```bash
#!/bin/bash
# backup-minio.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/minio"

docker run --rm \
  --network slicehub_backend_default \
  -v $BACKUP_DIR:/backup \
  minio/mc mirror slicehub /backup/$DATE

# Удалить старые backup
find $BACKUP_DIR -name "*" -mtime +7 -type d -exec rm -rf {} \;
```

## 🛡️ Best Practices

### 1. Минимальные привилегии

```yaml
# docker-compose.yml
services:
  app:
    user: "1001:1001"  # Не root
    read_only: true     # Read-only filesystem
    tmpfs:
      - /tmp
    volumes:
      - ./conf.json:/app/conf.json:ro  # Read-only
```

### 2. Сканирование уязвимостей

```bash
# Установить Trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Сканировать образы
trivy image node:22-alpine
trivy image postgres:18-alpine
trivy image minio/minio:latest
```

### 3. Rate limiting

Используйте Nginx для rate limiting:

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        location /api {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://localhost:3001;
        }
    }
}
```

### 4. CORS настройки

```typescript
// app.ts
import cors from 'cors';

app.use(cors({
  origin: ['https://slicehub.com', 'https://www.slicehub.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 5. Helmet.js для безопасности заголовков

```bash
npm install helmet
```

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 6. Валидация входных данных

```typescript
import { IsString, IsEmail, Length } from 'class-validator';

class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(3, 50)
  username: string;
}
```

### 7. SQL injection защита

✅ Sequelize автоматически защищает от SQL injection  
✅ Всегда используйте parameterized queries  
❌ Никогда не конкатенируйте пользовательский ввод в SQL

```typescript
// ✅ Правильно
await User.findOne({ where: { email: userEmail } });

// ❌ Неправильно
await sequelize.query(`SELECT * FROM users WHERE email = '${userEmail}'`);
```

### 8. XSS защита

```typescript
import xss from 'xss';

// Очистка HTML
const clean = xss(userInput);

// Или используйте библиотеку sanitize-html
import sanitizeHtml from 'sanitize-html';
const clean = sanitizeHtml(userInput);
```

## 🔍 Аудит безопасности

### npm audit

```bash
# Проверить уязвимости
npm audit

# Автоматическое исправление
npm audit fix

# Принудительное обновление
npm audit fix --force
```

### Docker Bench Security

```bash
# Скачать и запустить
docker run -it --net host --pid host --userns host --cap-add audit_control \
    -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
    -v /var/lib:/var/lib \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /usr/lib/systemd:/usr/lib/systemd \
    -v /etc:/etc --label docker_bench_security \
    docker/docker-bench-security
```

## 📊 Мониторинг безопасности

### Fail2ban для защиты от brute force

```bash
# Установить
apt install fail2ban

# Настроить для nginx
cat > /etc/fail2ban/jail.local << EOF
[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 5
findtime = 600
bantime = 3600
EOF

systemctl restart fail2ban
```

### Logrotate

```bash
cat > /etc/logrotate.d/slicehub << EOF
/var/log/slicehub/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
}
EOF
```

## ✅ Production Deployment Checklist

- [ ] Изменены все дефолтные пароли
- [ ] Настроен HTTPS/SSL
- [ ] Настроен firewall
- [ ] Ограничен доступ к внутренним портам
- [ ] Настроены ограничения ресурсов
- [ ] Настроено логирование
- [ ] Настроен мониторинг
- [ ] Настроен автоматический backup
- [ ] Проведен security audit (npm audit, Trivy)
- [ ] Настроен rate limiting
- [ ] Настроен CORS
- [ ] Добавлен Helmet.js
- [ ] Настроена валидация данных
- [ ] Документированы процедуры восстановления
- [ ] Настроены алерты
- [ ] Проведено тестирование в production-подобном окружении

---

**Безопасность - это процесс, а не одноразовое действие!**

Регулярно обновляйте зависимости, проводите аудиты, и следите за новостями безопасности.

