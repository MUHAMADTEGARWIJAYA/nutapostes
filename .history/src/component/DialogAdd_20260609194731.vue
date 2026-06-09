<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Discount {
  id: string;
  name: string;
  value: number;
  type: "%" | "Rp";
}

const discount = ref<Discount[]>([]);

onMounted(() => {
  const data = localStorage.getItem("discounts");
  if (data) {
    discount.value = JSON.parse(data);
  }
});

const errorMessage = ref({ name: "", value: "" });
const discountName = ref("");
const discountValue = ref<number | null>(null);
const discountType = ref<"Rp" | "%">("%");

// Error hanya tampil setelah user klik Simpan
const submitted = ref(false);

defineProps<{ open: boolean }>();
const emit = defineEmits<{
  close: [];
  saved: [name: string];
}>();

function validateForm() {
  errorMessage.value.name = "";
  errorMessage.value.value = "";

  if (!discountName.value.trim()) {
    errorMessage.value.name = "Nama diskon harus diisi.";
  } else if (discount.value.some((item) => item.name === discountName.value)) {
    errorMessage.value.name = "Diskon dengan nama tersebut sudah ada.";
  }

  if (discountValue.value === null || discountValue.value === undefined) {
    errorMessage.value.value = "Nilai diskon tidak boleh kosong.";
  } else if (discountValue.value <= 0) {
    errorMessage.value.value = "Nilai diskon harus lebih besar dari 0.";
  }

  return !errorMessage.value.name && !errorMessage.value.value;
}

function tambahDiskon() {
  submitted.value = true;

  if (!validateForm()) return;

  const diskonBaru: Discount = {
    id: Date.now().toString(),
    name: discountName.value,
    value: Number(discountValue.value),
    type: discountType.value,
  };

  discount.value.push(diskonBaru);
  localStorage.setItem("discounts", JSON.stringify(discount.value));
  emit("saved", diskonBaru.name);

  // Reset form setelah berhasil simpan
  discountName.value = "";
  discountValue.value = null;
  discountType.value = "%";
  submitted.value = false;
  emit("close");
}
</script>

<template>
  <div v-if="open" class="dialog-overlay" @click="emit('close')">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <div class="dialog-header-content">
          <h1>Tambah Diskon</h1>
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
        <button @click="tambahDiskon" class="btn-primary">Simpan</button>
      </div>
    </div>
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
  justify-content: center;
  align-items: center;
}

.btn-cancel {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.btn-primary {
  padding: 8px 16px;
  background-color: #34db47;
  color: white;
  width: 100%;
  height: 40px;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
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
