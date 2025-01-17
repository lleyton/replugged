const JsxCompiler = require('powercord/compilers/jsx').default;

module.exports = () => {
  // noinspection JSDeprecatedSymbols
  require.extensions['.jsx'] = (module, filename) => {
    const compiler = new JsxCompiler(filename);
    const compiled = compiler.compile();
    module._compile(compiled, filename);
  };
};
