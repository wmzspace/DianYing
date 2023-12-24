<template>
  <div class="container">
    <Breadcrumb :addition-items="['日志']" />
    <a-card class="general-card" title="所有日志"> </a-card>
  </div>
</template>

<script lang="ts" setup></script>

<script lang="ts">
export default {
  name: 'logView'
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  overflow-y: scroll;
}
:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}
.action-icon {
  margin-left: 12px;
  cursor: pointer;
}
.active {
  color: #0960bd;
  background-color: #e3f4fc;
}
.setting {
  display: flex;
  align-items: center;
  width: 200px;
  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
