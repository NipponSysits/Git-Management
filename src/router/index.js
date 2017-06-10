import Router from 'vue-router'
import SignIn from '@/components/SignIn'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SignIn',
      component: SignIn
    }
  ]
})
