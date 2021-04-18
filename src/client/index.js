import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import App from 'components/App';

Vue.use(Vue2TouchEvents);

const root = new Vue({
  render: (h) => h(App),
});

root.$mount('#app');
