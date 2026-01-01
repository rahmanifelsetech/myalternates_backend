import { z } from 'zod';

/**
 * Preprocesses a string to a number for Zod validation.
 * Useful for multipart/form-data where all values are strings.
 */
export const numberPreprocess = z.preprocess((val) => {
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? val : parsed; // Return original string if not a number
  }
  return val;
}, z.number().optional());

/**
 * Preprocesses a string ("true" or "false") to a boolean for Zod validation.
 * Useful for multipart/form-data where all values are strings.
 */
export const booleanPreprocess = z.preprocess((val) => {
  if (typeof val === 'string') return val === 'true';
  return val;
}, z.boolean().optional());


/**
 * Preprocesses a string to a Date object for Zod validation.
 * Useful for multipart/form-data where all values are strings.
 */
export const datePreprocess = z.preprocess((val) => {
  if (val === '' || val === undefined || val === null) {
    return undefined;
  }
  const date = new Date(val as string | number);
  if (isNaN(date.getTime())) {
    return val;
  }
  return date.toISOString().split('T')[0];
}, z.string().optional());