// Configuración de Puppeteer para diferentes entornos
export const getPuppeteerConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDocker = process.env.DOCKER === 'true';

  const baseConfig = {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-features=TranslateUI",
      "--disable-ipc-flooding-protection",
    ],
  };

  // Configuración específica para Docker
  if (isDocker) {
    return {
      ...baseConfig,
      executablePath: '/usr/bin/chromium-browser',
      args: [
        ...baseConfig.args,
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    };
  }

  // Configuración para producción
  if (isProduction) {
    return {
      ...baseConfig,
      args: [
        ...baseConfig.args,
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-plugins",
        "--disable-images",
        "--disable-javascript",
      ],
    };
  }

  // Configuración para desarrollo
  return {
    ...baseConfig,
    headless: true, // Para desarrollo, puedes ver el navegador
    devtools: true,
  };
};
