import localization from 'counterpart'

let counterpart = new localization.Instance()
let vLanguage = {}
// exposed global options
vLanguage.config = {}
vLanguage.install = Vue => {
  Vue.mixin({
    methods: {
      translate: (obj, route) => {
        route = route || ''
        switch (Vue.$state('language') || 'en-EN') {
          case 'en-EN':
            counterpart.registerTranslations('en', require('./en-EN.js'))
            break
        }
        let text = counterpart.translate((typeof obj === 'string') ? [route, obj] : (typeof obj === 'object') ? ([route]).concat(obj) : obj)
        return text.indexOf('missing translation') !== 0 ? text : (typeof obj === 'object') ? obj.join(' ') : obj
      }
    },
    created: () => {
      // console.log('created `vue-mbos.js`mixin.')
    }
  })
}

export default vLanguage
