<!-- eslint-disable-->
<!--404 Page-->
<template>
  <a-result status="404" title="404" sub-title="" style="color: white">
    <template #title>
      <span class="white">404</span>
    </template>
    <template #subtitle>
      <span class="white">啊噢，当前页面走丢了</span>
    </template>
    <template #extra>
      <router-link class="ant-btn" to="/discover" style="color: white">返回主页</router-link>
    </template>
  </a-result>
</template>

<style scoped lang="scss">
.white {
  color: white;
}
</style>
