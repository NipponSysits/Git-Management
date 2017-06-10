<template>
  <div class="row">
    <div class="hidden-xs hidden-sm col-md-20 login-image"></div>
    <div class="col-xs-offset-1 col-xs-34 col-sm-offset-8 col-sm-20 col-md-offset-1 col-md-14 col-lg-offset-2 col-lg-12" style="padding:15px 30px 0 30px;">
      <h2 class="ui header">{{translate('sign.signin')}}</h2>
      <form>
        <div class="form-group">
          <div class="ui sign-image centered grid" style="position:relative;">
            <div class="column" style="text-align:center;">
              <div class="ui circular image sign-avartar"  style="background-color: #ECECEC; background-size:cover;width:128px;height:128px;"></div>
              <h3 class="ui sign-email" style="margin-top: 5px;"></h3>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="email">{{translate('sign.signid')}}</label>
          <input class="form-control" type="text" id="email" name="email" tabindex="1" :placeholder="translate('sign.email')">
        </div>
        <div class="checkbox">
          <label>
            <input type="checkbox" id="remember-id" tabindex="0" name="remember-id">
            {{translate('sign.remember')}}
          </label>
        </div>
        <div class="form-group">
          <label for="password">{{translate('sign.password')}}</label>
          <input class="form-control" type="password" id="password" tabindex="2" name="password" :placeholder="translate('sign.password')">
        </div>
        <div class="ui buttons column" style="width:100%">
          <div class="ui sign-back button large" style="max-width:83px;">{{translate('sign.back')}}</div>
          <div class="or sign-or"></div>
          <div class="ui positive sign-in large submit button">{{translate('sign.login')}}</div>
        </div>
        <div class="ui column sign-deined" style="margin:1rem 0rem;text-transform: uppercase;text-align:center;">
          <h2>{{translate('sign.deined')}}</h2>
        </div>
        <div class="ui column sign-trouble" style="padding-top:10px;">
          <b>{{translate('sign.or')}} </b><a class="link" id="sign-trouble">{{translate('sign.trouble')}}</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingIn',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('../stylesheets/sign.scss');

.login-image {
  height: calc(100vh - 90px);
  background-image: url('../assets/login.jpg'); 
  background-position: 0px 0px; 
  background-repeat: no-repeat; 
  background-size: cover; 
  background-position: left center;
} 
</style>
