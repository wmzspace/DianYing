<template>
  <!-- Layout Footer -->
  <a-layout-footer>
    <a-row type="flex">
      <a-col :span="24" :md="12">
        <!-- Footer Copyright Notice -->
        <p class="copyright">
          © 2023, made with
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.17157 5.17157C4.73367 3.60948 7.26633 3.60948 8.82843 5.17157L10 6.34315L11.1716 5.17157C12.7337 3.60948 15.2663 3.60948 16.8284 5.17157C18.3905 6.73367 18.3905 9.26633 16.8284 10.8284L10 17.6569L3.17157 10.8284C1.60948 9.26633 1.60948 6.73367 3.17157 5.17157Z"
              fill="#111827"
            />
          </svg>
          by <a href="https://github.com/wmzspace">wmzspace</a> for a better
          web.
        </p>
        <!-- / Footer Copyright Notice -->
      </a-col>
      <a-col :span="24" :md="12" class="footer-control">
        <!-- Footer Navigation Menu -->
        <a-menu mode="horizontal" :selectable="false">
          <a-menu-item>
            <a-tooltip
              ><span>作者</span>
              <template #title>
                <div>作者：吴勉孜</div>
              </template>
            </a-tooltip>
          </a-menu-item>
          <a-menu-item>
            <a-tooltip
              ><span>邮箱</span>
              <template #title>
                <div>邮箱: sc21m2w@leeds.ac.uk</div>
              </template>
            </a-tooltip>
          </a-menu-item>
          <a-menu-item>
            <a-tooltip
              ><span>论坛</span>
              <template #title>
                <div>
                  <a
                    href="https://github.com/wmzspace"
                    class="text-white text-underline"
                    >点此访问 Github</a
                  >
                </div>
              </template>
            </a-tooltip>
          </a-menu-item>
        </a-menu>
        <!-- / Footer Navigation Menu -->
      </a-col>
    </a-row>
  </a-layout-footer>
  <!-- / Layout Footer -->
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
