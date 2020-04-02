<template>
  <div>
    <table class="table">
      <strong>multiple router</strong>
      <tr>
        <router-view name="myHeader"></router-view>
      </tr>
      <tr>
        <router-view name="mySidebar"></router-view>
      </tr>
    </table>
  </div>
</template>