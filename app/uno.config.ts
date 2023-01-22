import {
  defineConfig, presetTypography, presetUno, transformerDirectives,
} from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
});
