import terser from '@rollup/plugin-terser';

export default {
  input: 'src/petite-router.js',
  output: [
    // CommonJS
    {
      file: 'dist/petite-router.js',
      format: 'commonjs',
      name: 'PetiteRouter',
      plugins: [terser()]
    },
    // ES Module
    {
      file: 'dist/petite-router.es.js',
      format: 'es',
      name: 'PetiteRouter',
      plugins: [terser()]
    },
    // Universal Module Definition
    {
      file: 'dist/petite-router.umd.js',
      format: 'umd',
      name: 'PetiteRouter',
      plugins: [terser()]
    },
    // Add to example code
    {
      file: 'example/petite-router.es.js',
      format: 'es',
      name: 'PetiteRouter',
      plugins: [terser()]
    }
  ],
  plugins: []
};
