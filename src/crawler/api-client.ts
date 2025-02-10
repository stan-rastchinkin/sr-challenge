import * as http from 'node:http';

const SOURCE_BASE_URL = 'http://localhost:3000'; // todo: Replace with env variable
const REQUEST_TIMEOUT = 950;

export const getState = (): Promise<{ odds: string }> => {
    return new Promise((resolve, reject) => {
        const request = http.get(`${SOURCE_BASE_URL}/api/state`, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                if (response.statusCode === 200) {
                    try {
                        // todo: validate data
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error('Failed to parse odds'));
                    }
                } else {
                    reject(new Error(`HTTP Error: ${response.statusCode}`));
                }
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.setTimeout(REQUEST_TIMEOUT, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

export const getMapping = (): Promise<{ mappings: string }> => {
  return new Promise((resolve, reject) => {
    const request = http.get(`${SOURCE_BASE_URL}/api/mappings`, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            // todo: validate data
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error('Failed to parse mappings'));
          }
        } else {
          reject(new Error(`HTTP Error: ${response.statusCode}`));
        }
      });
    });

    request.on('error', (error) => {
        reject(error);
    });

    request.setTimeout(REQUEST_TIMEOUT, () => {
        request.destroy();
        reject(new Error('Request timeout'));
    });
  });
}