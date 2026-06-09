<script setup lang="ts">
defineProps<{
  open: boolean;
  message: string;
}>();
</script>

<template>
  <div v-if="open" class="toast-notification">
    {{ message }}
  </div>
</template>

<style scoped>
.toast-notification {
  position: fixed;
  top: 24px;
  right: 50%;
  z-index: 1100;
  max-width: 360px;
  padding: 12px 18px;
  background: #046b5f;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  font-size: 14px;
  font-weight: 600;
}
</style>
