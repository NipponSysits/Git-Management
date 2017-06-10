<template>
<div class="page-main">
  <nav class="navbar navbar-default navbar-fixed-top page-header">
    <div class="container-fluid">
      <div class="container-fluid navbar-header"><a class="navbar-brand logo-pgm" href="/"></a></div>
    </div>
  </nav>
  <div class="container-fluid page-content">
    <router-view></router-view>
  </div>
  <div class="page-footer">
    <i class="icon copyright"></i>{{translate('app.copyright')}}<strong>{{translate('app.author')}}</strong>
  </div>
</div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import url('./stylesheets/app.scss');
@import url('./stylesheets/fonts.scss');

body {
  padding: 0px;
  background-color: #ececec;
  overflow: hidden !important;
  overflow-y: visible !important;
}

.page-main { 
  min-height: 100vh; 
  max-height: 100vh;
  position: relative; 
  z-index: 0; 

  > .page-header.navbar.navbar-default {
    background-color: #171d2c;
    border:none !important;
    margin: 0px;
  }
  > .page-content {
    margin: 0px !important;
    padding: 60px 0 0 0;
  }
  > .page-footer { 
    color: #5c5c5c; 
    font-size: .85em; 
    position: absolute;
    bottom: 0; 
    width: 100%; 
    height: 35px;
    background-color:#e7e7e7;
    padding: 10px 15px;
    margin:0px; 
  }


}

</style> 
