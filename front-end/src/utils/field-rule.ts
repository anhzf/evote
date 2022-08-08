/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { ValidationRule } from 'quasar';

export const required: ValidationRule = (v) => v || 'Isian ini wajib diisi';
