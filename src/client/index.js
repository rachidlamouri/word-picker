import Vue from 'vue';
import App from 'components/App';

const root = new Vue({
  render: (h) => h(App),
});

root.$mount('#app');
