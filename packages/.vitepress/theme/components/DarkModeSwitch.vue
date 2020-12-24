<template>
  <button @click="toggleDarkMode" class="dark-mode-switch">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="dark-mode-switch__sun"
    >
      <path
        fill="currentColor"
        d="M20.3542 15.3542L21.2821 15.7271C21.4314 15.3554 21.3446 14.9304 21.0613 14.6471C20.778 14.3639 20.353 14.277 19.9813 14.4264L20.3542 15.3542ZM8.64581 3.64587L9.57369 4.01876C9.72307 3.64704 9.6362 3.22204 9.35292 2.93877C9.06964 2.65549 8.64465 2.56861 8.27293 2.718L8.64581 3.64587ZM19.9813 14.4264C19.0613 14.7961 18.0557 15.0001 17 15.0001V17.0001C18.3155 17.0001 19.5739 16.7455 20.7271 16.2821L19.9813 14.4264ZM17 15.0001C12.5817 15.0001 9 11.4183 9 7.00006H7C7 12.5229 11.4772 17.0001 17 17.0001V15.0001ZM9 7.00006C9 5.94438 9.20396 4.93879 9.57369 4.01876L7.71794 3.27299C7.25452 4.42612 7 5.6846 7 7.00006H9ZM4 12.0001C4 8.6372 6.07526 5.75664 9.0187 4.57375L8.27293 2.718C4.59771 4.19496 2 7.79294 2 12.0001H4ZM12 20.0001C7.58172 20.0001 4 16.4183 4 12.0001H2C2 17.5229 6.47715 22.0001 12 22.0001V20.0001ZM19.4263 14.9814C18.2434 17.9248 15.3629 20.0001 12 20.0001V22.0001C16.2071 22.0001 19.8051 19.4024 21.2821 15.7271L19.4263 14.9814Z"
      ></path>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="dark-mode-switch__moon"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 18.364L17.6569 17.6569M6.34315 6.34315L5.63604 5.63604M18.364 5.63609L17.6569 6.3432M6.3432 17.6569L5.63609 18.364M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
      ></path>
    </svg>
  </button>
</template>

<script>
export default {
  mounted() {
    if (this.isDarkmode()) {
      document.body.classList.add("dark-mode");
    }
  },
  methods: {
    toggleDarkMode() {
      if (this.isDarkmode()) {
        localStorage.removeItem("dark-mode");
      } else {
        localStorage.setItem("dark-mode", "true");
      }

      document.body.classList.toggle("dark-mode");
    },
    isDarkmode() {
      return !!localStorage.getItem("dark-mode");
    },
  },
};
</script>

<style>
body.dark-mode {
  --c-bg: #2c3e50;
  --c-text: #f5f7fa;
  --c-text-light: #f9f9f9;
}

.dark-mode-switch {
  height: 2.25rem;
  width: 2.25rem;
  margin-left: 2rem;
  border: 0;
  outline: none;
  background: none;
  color: var(--c-text);
}

.dark-mode-switch__moon {
  display: none;
}
.dark-mode-switch__sun {
  display: block;
}

body.dark-mode .dark-mode-switch__moon {
  display: block;
}
body.dark-mode .dark-mode-switch__sun {
  display: none;
}
</style>
