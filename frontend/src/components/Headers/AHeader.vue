<script setup lang="ts"></script>

<template>
  <div id="a-header">
    <header>
      <a-input-search class="search-bar" placeholder="Please enter something" search-button>
        <template #button-icon>
          <icon-search />
        </template>
        <template #button-default> Search</template>
      </a-input-search>
      <a-menu
        mode="horizontal"
        :default-selected-keys="['1']"
        style="background-color: transparent"
        class="nav-menu"
      >
        <!--        <a-menu-item key="0" style="padding: 0; margin-right: 38px" disabled>-->
        <!--          <div-->
        <!--            :style="{-->
        <!--              width: '80px',-->
        <!--              height: '30px',-->
        <!--              borderRadius: '2px',-->
        <!--              background: 'var(&#45;&#45;color-fill-3)',-->
        <!--              cursor: 'text'-->
        <!--            }"-->
        <!--          ></div>-->
        <!--        </a-menu-item>-->
        <a-menu-item key="1">Home</a-menu-item>
        <!--        <a-menu-item key="2">Solution</a-menu-item>-->
        <!--        <a-menu-item key="3">Cloud Service</a-menu-item>-->
        <!--        <a-menu-item key="4">Cooperation</a-menu-item>-->
      </a-menu>
    </header>
  </div>
</template>

<style scoped></style>
