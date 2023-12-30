<template>
  <a-card
    class="general-card"
    :title="$t('workplace.quick.operation')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 0 20px' }"
  >
    <template #extra>
      <a-link disabled style="cursor: default">{{ $t('workplace.quickOperation.setup') }}</a-link>
    </template>
    <a-row :gutter="8">
      <a-col
        v-for="link in links"
        :key="link.text"
        :span="8"
        class="wrapper"
        :class="{ disabled: link.disabled }"
      >
        <a-link
          style="text-decoration: none; color: unset"
          :hoverable="false"
          :disabled="link.disabled"
          @click="$router.push({ name: link.routeName })"
        >
          <div class="icon" :class="{ disabled: link.disabled }">
            <component :is="link.icon" />
          </div>
          <a-typography-paragraph class="text" :class="{ disabled: link.disabled }">
            {{ $t(link.text) }}
          </a-typography-paragraph>
        </a-link>
      </a-col>
    </a-row>
    <a-divider class="split-line" style="margin: 0" />
  </a-card>
</template>

<script lang="ts" setup>
const links = [
  { text: 'workplace.contentManagement', icon: 'icon-file', routeName: 'searchVideo' },
  { text: 'workplace.userManagement', icon: 'icon-user', routeName: 'searchUser' },
  // { text: 'workplace.advanced', icon: 'icon-settings', routeName: 'dashboard' },
  { text: 'workplace.backup', icon: 'icon-settings', routeName: 'adminSetting' },
  { text: 'workplace.log', icon: 'icon-schedule', routeName: 'logView' },
  // { text: 'workplace.publish', icon: 'IconCalendar', routeName: 'postVideo' },
  { text: 'workplace.contentPutIn', icon: 'icon-fire', disabled: true }
]
</script>

<style scoped lang="less"></style>
