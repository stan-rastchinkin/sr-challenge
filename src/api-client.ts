import { config } from './config';

const REQUEST_TIMEOUT = config.maxPollInterval;

const fetchFromAPI = async <T>(path: string, timeout: number): Promise<T> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${config.sourceBaseUrl}${path}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            if (error instanceof SyntaxError) {
                throw new Error('Failed to parse response');
            }
            throw error;
        }
        throw new Error('Unknown error occurred');
    }
}

export const getMapping = async (): Promise<{ mappings: string }> => {
    return fetchFromAPI<{ mappings: string }>('/api/mappings', REQUEST_TIMEOUT);
}

export const getState = async (): Promise<{ odds: string }> => {
    return fetchFromAPI<{ odds: string }>('/api/state', REQUEST_TIMEOUT);
}