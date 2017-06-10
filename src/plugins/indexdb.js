import moment from 'moment'

// fixed moment.js
moment.createFromInputFallback = config => { config._d = new Date(config._i) }

var vState = {}
// exposed global options
vState.config = {}
vState.install = Vue => {
  Vue.$state = (name, value) => {
    let getData = ''
    let valType = typeof value
    if (value === undefined) {
      let data = JSON.parse(window.localStorage.getItem(`session.user.${name}`))
      if (data) { getData = data.save }
    } else {
      let data = JSON.parse(window.localStorage.getItem(`session.user.${name}`))
      data = data || { type: valType, save: {} }
      data.save = value
      window.localStorage.setItem(`session.user.${name}`, JSON.stringify(data))
      getData = value
    }
    return getData
  }

  Vue.mixin({
    methods: {
      // $lock: function(department, permission){
      //   var user = {}
      //   permission.forEach(function(id){
      //     user[id] = true
      //   })
      //   this.State('session.department', department)
      //   this.State('session.permission', user)
      // },

    //   $remove: function(name){
    //     if(window.localStorage != undefined) window.localStorage.removeItem(`session.user.${name}`)
    //   },
    //   $indexdb: function(key, value){
    //     return value != undefined ? __.local.setItem(`db.data.${name}`, value) : __.local.getItem(`db.data.${name}`)
    //   },
    //   $global: function(key, value){
    //     return value != undefined ? __.local.setItem(`system.${key}`, value) : __.local.getItem(`system.${key}`)
    //   },
    //   // permission check
    //   permission: function(name){
    //     // Storage('Permission')
    //     // var ALLOW_ADMIN = 'ADMIN', ALLOW_SYSTEM = 'SYSTEM', department = this.State('session.department')
    //     if (name == undefined) {
    //       return true
    //     // } else if (name === ALLOW_SYSTEM || name === ALLOW_ADMIN) {
    //     //   var system_mode = department === ALLOW_SYSTEM
    //     //   var admin_mode = department === ALLOW_ADMIN || department === ALLOW_SYSTEM
    //     //   if (system_mode && name === ALLOW_SYSTEM) return true
    //     //   if (admin_mode && name === ALLOW_ADMIN) return true
    //     } else {
    //       (this.State('session.permission') || []).forEach(function(item){
    //       })
    //       return false
    //     }
    //   },
    //   parseDate: function(date, format) {
    //     if (!format) {
    //       if(date && typeof date == 'string' && /^\d{1,2}-\d{1,2}\-\d{4}$/g.test(date)) format = 'D-M-YYYY'
    //       if(date && typeof date == 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/g.test(date)) format = 'MM/DD/YYYY'
    //     }
    //     return (typeof date == 'number' ? moment(date) : moment(date, format))
    //   },
    //   toDate: function(date, lang){
    //     var getDate = moment.isMoment(date) ? date : this.parseDate(date, 'D-M-YYYY')
    //     return getDate.format('D') + ' ' + Flatpickr.l10ns[lang || 'en'].months.longhand[getDate.month()] + ' ' + getDate.add(543,'y').format('YYYY')
    //   },
    //   minNumber: function(a){
    //     var txt = function(n) {
    //       return n>900 ? (n/1000)>900 ? (n / 1000000).toFixed(n % 1000000 == 0 ? 0 : 1) + 'm' : (n / 1000).toFixed(n % 1000 == 0 ? 0 : 1) + 'k' : n
    //     }
    //     return txt(a)
    //   },
    },
    created: () => {
      // console.log('created `vue-mbos.js`mixin.')
    }
  })
}

export default vState
