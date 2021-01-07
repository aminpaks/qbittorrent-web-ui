export const WEB_UI_VERSION = '0.0.1';
export const PUBLIC_URL = process.env.PUBLIC_URL || '';
export const DEV_SERVER_BASE_URL = process.env.QBT_DEV_SERVER_BASE_URL;
export const API_BASE_URL = DEV_SERVER_BASE_URL ?? process.env.QBT_API_BASE_URL ?? '';
