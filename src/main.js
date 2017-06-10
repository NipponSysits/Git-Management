// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Head from 'vue-head'
import Router from 'vue-router'
import App from './App'
import router from './router'
import Language from './plugins/language/'
import Indexdb from './plugins/indexdb'

import 'jquery'
import 'bootstrap-loader'

Vue.use(Head)
Vue.use(Router)
Vue.use(Indexdb)
Vue.use(Language)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  head: {
    title: {
      inner: 'deBUGerr.io',
      separator: '-',
      complement: 'Project Management Software and Source Control'
    },
    // Meta tags
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'application-name', content: 'deBUGerr.io' },
      { name: 'description', content: 'Project Management Software and Source Control', id: 'desc' },
      // Twitter
      { name: 'twitter:title', content: 'deBUGerr.io' },
      { name: 'twitter:description', content: 'Project Management Software and Source Control' },
      // Google+ / Schema.org
      { itemprop: 'name', content: 'Content Title' },
      { itemprop: 'description', content: 'Content Title' },
      // Facebook / Open Graph
      { property: 'fb:app_id', content: '123456789' },
      { property: 'og:title', content: 'Content Title' },
      { itemprop: 'og:description', content: 'Content Title' },
      { itemprop: 'og:type', content: 'website' },
      { itemprop: 'og:url', content: 'https://debugerr.io/' },
      { property: 'og:image', content: require('./assets/facebook-image.png') }
    ],
    link: [
      { rel: 'author', href: 'Kananek Thongkam' },
      { rel: 'manifest', href: '/static/app.manifest' },
      { rel: 'canonical', href: 'http://example.com/#!/contact/', id: 'canonical' },
      { rel: 'icon', href: require('./assets/icon/debugger-16.png'), sizes: '16x16', type: 'image/png' },
      { rel: 'shortcut icon', href: require('./assets/icon/debugger-16.png'), sizes: '16x16', type: 'image/png' },
      { rel: 'apple-touch-icon', href: require('./assets/icon/debugger-57.png'), sizes: '57x57', type: 'image/png' },
      { rel: 'apple-touch-icon', href: require('./assets/icon/debugger-72.png'), sizes: '72x72', type: 'image/png' },
      { rel: 'apple-touch-icon', href: require('./assets/icon/debugger-144.png'), sizes: '144x144', type: 'image/png' }
    ]
  }
})
