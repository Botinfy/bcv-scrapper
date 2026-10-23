# Usar una imagen base de Node.js con Alpine Linux (más ligera)
FROM node:22-alpine

# Node2Shell (CVE-2026-111497): el parche de la línea 22 es 22.23.4. Si el host
# de build tiene en caché un node:22-alpine anterior, el build falla aquí en vez
# de desplegar una versión vulnerable (arreglo: docker pull node:22-alpine).
RUN node -e "const [a,b,c]=process.versions.node.split('.').map(Number); \
  if (a < 22 || (a === 22 && (b < 23 || (b === 23 && c < 4)))) { \
    console.error('Node ' + process.version + ' es vulnerable a CVE-2026-111497: se requiere >= 22.23.4'); \
    process.exit(1); }"

# Instalar dependencias del sistema necesarias para Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Configurar Puppeteer para usar el Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar dependencias. pnpm fijado: sin versión se instala la última (12.x),
# que aborta con ERR_PNPM_IGNORED_BUILDS. Con pnpm 10 los build scripts de
# dependencias se ignoran (Puppeteer no descarga Chrome; usa el del sistema).
RUN npm install -g pnpm@10.34.7 && pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN pnpm run build

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["pnpm", "start"]
