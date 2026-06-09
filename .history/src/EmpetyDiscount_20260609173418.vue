<script setup lang="ts">
import ButtonMain from "./ButtonMian.vue";
import DialogAdd from "../src/component/DialogAdd.vue";
import { ref } from "vue";
const dialogOpen = ref(false);

const emit = defineEmits<{
  saved: [name: string];
}>();
</script>

<template>
  <div class="discount-empty">
    <img src="../src/image/empety.png" alt="Empty Discount" />
    <h1>Belum Ada Diskon</h1>
    <p>
      Silahkan tambah diskon untuk menarik pelanggan dan meningkatakan
      penjualan.
    </p>
    <ButtonMain @click="dialogOpen = true" />
    <DialogAdd
      :open="dialogOpen"
      @close="dialogOpen = false"
      @saved="emit('saved', $event)"
    />
  </div>
</template>

<style scoped>
.discount-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 291px;
  width: 420px;
  justify-content: center;
  gap: 12px;
  text-align: center;
}
</style>
