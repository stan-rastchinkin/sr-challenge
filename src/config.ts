export const config = {
  port: parseInt(process.env.PORT || '8000'),
  maxPollInterval: parseInt(process.env.MAX_POLL_INTERVAL || '950'),
  sourceBaseUrl: process.env.SOURCE_BASE_URL,
}

if (!config.sourceBaseUrl) {
  console.error('SOURCE_BASE_URL env variable is not set');
}
