<template>
  <div class="container">
    <div>
      <b-tabs content-class="mt-3" fill>
        <b-tab title="分析管理" active>
          <router-view name="analysis"></router-view>
        </b-tab>
        <b-tab title="回饋管理">
          <router-view name="appraise"></router-view>
        </b-tab>
        <b-tab title="帳號管理">
          <router-view name="account"></router-view>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>