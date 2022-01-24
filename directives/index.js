// import dialogDrag from './dialog-drag';
const directives = {
  // dialogDrag,
};

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  }
};
