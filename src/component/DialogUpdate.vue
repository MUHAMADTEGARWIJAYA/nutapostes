<script setup lang="ts">
import { ref, watch } from "vue";
import { useDiscount } from "@/composable/useDiscount"; // sesuaikan path-nya
import ConfirmedDelete from "./ConfirmedDelete.vue";

interface Discount {
  id: string;
  name: string;
  value: number;
  type: "%" | "Rp";
}

const props = defineProps<{
  open: boolean;
  item: Discount | null;
}>();

const emit = defineEmits<{
  close: [];
  deleted: [name: string];
  saved: [name: string];
}>();

const { deleteDiscount, updateDiscount } = useDiscount();

const errorMessage = ref({ name: "", value: "" });
const discountName = ref("");
const discountValue = ref<number | null>(null);
const discountType = ref<"Rp" | "%">("%");
const submitted = ref(false);
const confirmDeleteOpen = ref(false);

watch(
  () => props.item,
  (newItem: Discount | null) => {
    if (newItem) {
      discountName.value = newItem.name;
      discountValue.value = newItem.value;
      discountType.value = newItem.type;
    }
  },
  { immediate: true },
);

function validateForm() {
  errorMessage.value.name = "";
  errorMessage.value.value = "";

  if (!discountName.value.trim()) {
    errorMessage.value.name = "Nama diskon harus diisi.";
  }

  if (discountValue.value === null || discountValue.value === undefined) {
    errorMessage.value.value = "Nilai diskon tidak boleh kosong.";
  } else if (discountValue.value <= 0) {
    errorMessage.value.value = "Nilai diskon harus lebih besar dari 0.";
  }

  return !errorMessage.value.name && !errorMessage.value.value;
}

function simpanPerubahan() {
  submitted.value = true;

  if (!validateForm() || !props.item) return;

  const updatedName = discountName.value;

  updateDiscount({
    id: props.item.id,
    name: updatedName,
    value: Number(discountValue.value),
    type: discountType.value,
  });

  emit("saved", updatedName);
  submitted.value = false;
  emit("close");
}

function openDeleteConfirmation() {
  confirmDeleteOpen.value = true;
}

function hapusDiskon() {
  if (!props.item) return;

  const deletedName = props.item.name;
  deleteDiscount(props.item.id);
  emit("deleted", deletedName);
  submitted.value = false;
  confirmDeleteOpen.value = false;
  emit("close");
}
</script>

<template>
  <div v-if="open" class="dialog-overlay" @click="emit('close')">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <div class="dialog-header-content">
          <h1>Edit Diskon</h1>
          <button @click="emit('close')" class="btn-cancel">x</button>
        </div>
      </div>

      <form class="dialog-form">
        <md-outlined-text-field
          label="Nama Diskon"
          :value="discountName"
          @input="discountName = ($event.target as HTMLInputElement).value"
          placeholder="Misal: Diskon Akhir Tahun/Promo Opening"
          :error="submitted && !!errorMessage.name"
          :error-text="errorMessage.name"
        />

        <div class="discount-group">
          <md-outlined-text-field
            :prefix-text="discountType === 'Rp' ? 'Rp' : ''"
            :suffix-text="discountType === '%' ? '%' : ''"
            label="Diskon"
            type="number"
            :value="discountValue ?? ''"
            @input="
              discountValue =
                ($event.target as HTMLInputElement).value === ''
                  ? null
                  : Number(($event.target as HTMLInputElement).value)
            "
            :error="submitted && !!errorMessage.value"
            :error-text="errorMessage.value"
            class="discount-input"
          />

          <div class="discount-type">
            <button
              type="button"
              :class="{ active: discountType === '%' }"
              @click="discountType = '%'"
            >
              {{ discountType === "%" ? "✓ " : "" }}%
            </button>
            <button
              type="button"
              :class="{ active: discountType === 'Rp' }"
              @click="discountType = 'Rp'"
            >
              {{ discountType === "Rp" ? "✓ " : "" }}Rp
            </button>
          </div>
        </div>
      </form>

      <div class="dialog-footer">
        <button @click="openDeleteConfirmation" class="btn-delete">Hapus</button>
        <button @click="simpanPerubahan" class="btn-primary">Simpan</button>
      </div>
    </div>

    <ConfirmedDelete
      :open="confirmDeleteOpen"
      :count="1"
      :discount-name="props.item?.name || ''"
      @cancel="confirmDeleteOpen = false"
      @confirm="hapusDiskon"
    />
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.dialog-content {
  width: 480px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.dialog-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header-content h1 {
  font-size: 24px;
  font-weight: 600;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-form md-outlined-text-field {
  width: 100%;
}

.dialog-footer {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 140px;
}

.btn-cancel {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.btn-primary {
  padding: 8px 8px;
  background-color: #34db47;
  color: white;
  flex: 1;
  width: 100px;
  height: 40px;
  font-size: 12px;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
}

.btn-delete {
  padding: 8px 16px;
  background-color: #fff;
  color: #d32f2f;
  width: 100px;
  height: 40px;
  font-size: 12px;
  border: 1px solid #ffff;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
}

.btn-delete:hover {
  background-color: #fff1f1;
}

.discount-input {
  width: 284px;
}

.discount-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.discount-type {
  display: inline-flex;
  border: 1px solid #d0d0d0;
  border-radius: 50px;
  overflow: hidden;
  width: 185px;
  height: 40px;
}

.discount-type button {
  border: none;
  background: white;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 600;
}

.discount-type button.active {
  background: #e8f5e9;
  color: #2e7d32;
}
</style>
