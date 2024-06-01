import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/petite-router.ts',
  output: [
    {
      file: 'dist/petite-router.js',
      format: 'es',
      name: 'PetiteRouter',
      banner: '???'
    },
    {
      file: 'dist/petite-router.min.js',
      format: 'es',
      name: 'PetiteRouter',
      plugins: [terser()]
    },
    {
      file: 'example/petite-router.es.min.js',
      format: 'es',
      name: 'PetiteRouter',
      plugins: [terser()]
    },
    {
      file: 'dist/petite-router.d.js',
      format: 'es'
    }
  ],
  plugins: [typescript()]
};
