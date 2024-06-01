import terser from '@rollup/plugin-terser';

export default {
  input: 'src/petite-router.js',
  output: [
    // CommonJS
    {
      file: 'dist/petite-router.js',
      format: 'commonjs',
      name: 'PetiteRouter',
      plugins: [terser()],
      sourcemap: true
    },
    // ES Module
    {
      file: 'dist/petite-router.es.js',
      format: 'es',
      name: 'PetiteRouter',
      plugins: [terser()],
      sourcemap: true
    },
    // Universal Module Definition
    {
      file: 'dist/petite-router.umd.js',
      format: 'umd',
      name: 'PetiteRouter',
      plugins: [terser()],
      sourcemap: true
    },
    // Add to example code
    {
      file: 'example/petite-router.es.js',
      format: 'es',
      name: 'PetiteRouter',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: []
};
