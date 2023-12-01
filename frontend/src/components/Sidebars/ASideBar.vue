<script setup lang="ts">
// import { Icon } from '@arco-design/web-vue'
//
// const IconFont = Icon.addFromIconFontCn({
//   src: 'https://at.alicdn.com/t/font_180975_ue66sq60vyd.js'
// })
</script>

<template>
  <div id="a-side-bar">
    <div class="logo">
      <div><a class="logo-img"></a></div>
    </div>
    <a-menu
      mode="pop"
      :default-selected-keys="['1']"
      class="nav-menu hide-scroll-bar"
      :theme="'dark'"
    >
      <a-menu-item key="1">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>首页</span></div>
        </a>
      </a-menu-item>
      <a-menu-item key="2">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>推荐</span></div>
        </a>
      </a-menu-item>
      <a-menu-item key="3">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>关注</span></div>
        </a></a-menu-item
      >
      <a-menu-item key="4">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text">
            <span>朋友</span>
          </div>
          <div style="position: absolute; transform: translate(75px, 12%)">
            <a-badge
              :count="1"
              :max-count="99"
              :dot-style="{
                backgroundColor: '#fe2c55',
                'box-shadow': 'none',
                opacity: 1
              }"
            />
          </div>
        </a>
      </a-menu-item>
      <a-menu-item key="5">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>我的</span></div>
        </a></a-menu-item
      >
      <a-menu-item disabled>
        <a-divider class="divider" />
      </a-menu-item>

      <a-menu-item key="6">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>直播</span></div>
        </a></a-menu-item
      >
      <a-menu-item key="7">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>放映厅</span></div>
        </a></a-menu-item
      >
      <a-menu-item key="8">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>知识</span></div>
        </a></a-menu-item
      >
      <a-menu-item key="9">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>热点</span></div>
        </a></a-menu-item
      >
      <a-menu-item key="10">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>游戏</span></div>
        </a></a-menu-item
      >
      <a-menu-item key="11">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>娱乐</span></div>
        </a>
      </a-menu-item>
      <a-menu-item key="12">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>二次元</span></div>
        </a>
      </a-menu-item>
      <a-menu-item key="13">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>音乐</span></div>
        </a>
      </a-menu-item>
      <a-menu-item key="14">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>美食</span></div>
        </a>
      </a-menu-item>
      <a-menu-item key="15">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>体育</span></div>
        </a>
      </a-menu-item>
      <a-menu-item key="16">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>时尚</span></div>
        </a>
      </a-menu-item>
      <a-menu-item disabled>
        <a-divider class="divider" />
      </a-menu-item>
      <a-sub-menu key="17" class="hide-scroll-bar" :selectable="false">
        <template #icon>
          <div class="nav-icon" style="margin-left: -2px"></div>
        </template>
        <template #title>
          <div class="nav-text"><span>业务合作</span></div>
        </template>
        <a-menu-item key="17_1">规则中心</a-menu-item>
        <a-menu-item key="17_2">关于抖音</a-menu-item>
      </a-sub-menu>
      <a-menu-item disabled>
        <a-divider class="divider" />
      </a-menu-item>
    </a-menu>
    <!-- Footer Copyright Notice -->

    <!-- / Footer Copyright Notice -->
  </div>
</template>
