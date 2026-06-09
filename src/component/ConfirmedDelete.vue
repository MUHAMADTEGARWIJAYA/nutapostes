<script setup lang="ts">
defineProps<{
  open: boolean;
  count: number;
  discountName?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();
</script>

<template>
  <div v-if="open" class="confirm-overlay" @click="emit('cancel')">
    <div class="confirm-dialog" @click.stop>
      <div class="confirm-header">
        <h2>Hapus Diskon?</h2>
        <button class="btn-close" type="button" @click="emit('cancel')">
          x
        </button>
      </div>

      <p class="confirm-message">
        Apakah Anda yakin ingin menghapus diskon
        {{ discountName || count }}? <br />Diskon yang dihapus tidak bisa
        dikembalikan lagi.
      </p>

      <div class="confirm-actions">
        <button class="btn-cancel" type="button" @click="emit('cancel')">
          Batal
        </button>
        <button class="btn-delete" type="button" @click="emit('confirm')">
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.confirm-dialog {
  height: 212px;
  width: 480px;
  padding: 24px;
  background: #fff;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
}

.confirm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.confirm-header h2 {
  color: #111827;
  font-size: 20px;
  font-weight: 700;
}

.btn-close {
  background: transparent;
  border: none;
  color: #374151;
  cursor: pointer;
  font-size: 20px;
}

.confirm-message {
  margin-top: 12px;
  color: #4b5563;
  text-align: center;
  font-size: 16px;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel,
.btn-delete {
  height: 40px;
  min-width: 96px;
  border-radius: 50px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 12px;
}

.btn-cancel {
  background: #fff;
  border: 1px solid #d1d5db;
  color: #111827;
}

.btn-delete {
  background: #f44336;
  border: 1px solid #f44336;
  color: #fff;
}

.btn-delete:hover {
  background: #d32f2f;
  border-color: #d32f2f;
}
</style>
