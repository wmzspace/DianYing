<template>
  <div class="container">
    <Breadcrumb :addition-items="['日志']" />
    <a-card class="general-card" title="所有日志">
      <a-list>
        <a-list-item v-for="idx in 4" :key="idx">
          <a-list-item-meta
            title="Beijing Bytedance Technology Co., Ltd."
            description="Beijing ByteDance Technology Co., Ltd. is an enterprise located in China."
          >
            <template #avatar>
              <a-avatar shape="square">
                <img
                  alt="avatar"
                  src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                />
              </a-avatar>
            </template>
          </a-list-item-meta>
        </a-list-item> </a-list
    ></a-card>
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
