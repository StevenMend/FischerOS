// src/lib/utils/constants.ts
import { SITE_CONFIG } from '../../config/site';
/**
 * Application-wide constants
 */

export const APP_NAME = SITE_CONFIG.shortName;
export const APP_VERSION = '1.0.0';

// API
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_COUNT = 3;

// Cache
export const CACHE_TIME = 10 * 60 * 1000; // 10 minutes
export const STALE_TIME = 5 * 60 * 1000; // 5 minutes

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
