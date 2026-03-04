import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from '../../core/utils/logger';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = SUPABASE_URL 
      ? `${SUPABASE_URL}/rest/v1`
      : 'http://localhost:3000';

    logger.info('API', 'API Client initialized', { baseURL, supabaseKeyPresent: !!SUPABASE_KEY });

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY || '',
        'Authorization': `Bearer ${SUPABASE_KEY || ''}`
      },
      timeout: 10000
    });

    this.client.interceptors.request.use(
      (config) => {
        logger.debug('API', `Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('API', 'Request Error', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug('API', `Response: ${response.config.url}`, { status: response.status });
        return response;
      },
      (error: AxiosError) => {
        logger.error('API', `Error [${error.config?.url}]: ${error.message}`);
        if (error.response) {
          logger.error('API', 'Response details', { data: error.response.data, status: error.response.status });
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any) {
    const response = await this.client.get<T>(url, config);
    return response;
  }

  async post<T>(url: string, data?: any, config?: any) {
    const response = await this.client.post<T>(url, data, config);
    return response;
  }

  async patch<T>(url: string, data?: any, config?: any) {
    const response = await this.client.patch<T>(url, data, config);
    return response;
  }

  async delete(url: string, config?: any) {
    const response = await this.client.delete(url, config);
    return response;
  }
}

export const apiClient = new ApiClient();
