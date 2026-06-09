<script setup lang="ts">
import ButtonMain from "./ButtonMian.vue";
import EmpetyDiscount from "./EmpetyDiscount.vue";
import DialogAdd from "../src/component/DialogAdd.vue";
import ConfirmedDelete from "./component/ConfirmedDelete.vue";
import TabelDiskon from "./component/TabelDiskon.vue";
import ToastNotification from "./component/ToastNotification.vue";
import { useDiscount } from "./composable/useDiscount.ts";
import { computed, ref, onMounted } from "vue";

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const {
  discounts,
  loadDiscounts,
  selectedIds,
  deleteSelected,
  cancelSelection,
} = useDiscount();

const hasSelected = computed(() => selectedIds.value.size > 0);
const selectedDeleteName = computed(() => {
  if (selectedIds.value.size !== 1) {
    return "";
  }

  return (
    discounts.value.find((discount) => selectedIds.value.has(discount.id))
      ?.name || ""
  );
});
const confirmDeleteOpen = ref(false);
const toastOpen = ref(false);
const toastMessage = ref("");
let toastTimeout: ReturnType<typeof setTimeout> | undefined;

function showToast(message: string) {
  toastMessage.value = message;
  toastOpen.value = true;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toastOpen.value = false;
  }, 2500);
}

function openDeleteConfirmation() {
  confirmDeleteOpen.value = true;
}

function confirmDeleteSelected() {
  const selectedDiscounts = discounts.value.filter((discount) =>
    selectedIds.value.has(discount.id),
  );
  const selectedCount = selectedDiscounts.length;
  const deletedName = selectedDiscounts[0]?.name;

  deleteSelected();
  confirmDeleteOpen.value = false;

  if (selectedCount === 1 && deletedName) {
    showToast(`${deletedName} berhasil di hapus`);
  } else if (selectedCount > 1) {
    showToast(`${selectedCount} diskon berhasil di hapus`);
  }
}

function handleAddSuccess(name: string) {
  loadDiscounts();
  showToast(`${name} berhasil di tambahkan`);
}

function handleDeleteSuccess(name: string) {
  showToast(`${name} berhasil di hapus`);
}

function handleEditSuccess(name: string) {
  showToast(`${name} berhasil disimpan`);
}

onMounted(() => {
  loadDiscounts();
});
const searchQuery = ref("");

const filteredDiscounts = computed(() => {
  return discounts.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const dialogOpen = ref(false);
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <h1>Daftar Diskon</h1>
        <p v-if="discounts.length > 0">
          Total jumlah diskon: {{ discounts.length }}
        </p>
      </div>
      <div v-if="discounts.length > 0" class="button-container">
        <template v-if="hasSelected">
          <button class="btn-cancel" @click="cancelSelection">Batal</button>

          <button class="btn-delete" @click="openDeleteConfirmation">
            Hapus
          </button>
        </template>

        <template v-else>
          <ButtonMain @click="dialogOpen = true" />
          <DialogAdd
            :open="dialogOpen"
            @close="dialogOpen = false"
            @saved="handleAddSuccess"
          />
        </template>
      </div>
    </div>
    <div class="top-section">
      <div v-if="discounts.length > 0" class="filter-section">
        <input
          v-model="searchQuery"
          type="text"
          name="search"
          placeholder="Cari nama diskon..."
          class="filter-input"
        />
      </div>
      <div class="api-dropdown">
        <button
          @click="toggleDropdown"
          class="dropdown-button"
          :class="{ active: isOpen }"
        >
          <span class="store-icon" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              viewBox="0 -960 960 960"
              width="16"
              fill="currentColor"
            >
              <path
                d="M160-120v-480h-40v-80l40-200h640l40 200v80h-40v480H160Zm80-80h120v-240h240v240h120v-400H240v400Zm200 0h120v-160H440v160ZM240-680h480l-24-120H264l-24 120Zm0 0h480-480Z"
              />
            </svg>
          </span>
          <span class="dropdown-label">Kopi Anak Bangsa</span>
          <span class="chevron-icon" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              viewBox="0 -960 960 960"
              width="16"
              fill="currentColor"
            >
              <path d="M480-360 280-560h400L480-360Z" />
            </svg>
          </span>
        </button>

        <div v-if="isOpen" class="dropdown-menu">
          <md-outlined-text-field
            placeholder="test url api"
            label="Api url crudcrud.com"
          >
          </md-outlined-text-field>
        </div>
      </div>
    </div>

    <div class="content-section">
      <EmpetyDiscount v-if="discounts.length === 0" @saved="handleAddSuccess" />
      <TabelDiskon
        :discounts="filteredDiscounts"
        v-else
        @deleted="handleDeleteSuccess"
        @saved="handleEditSuccess"
      />
    </div>

    <ConfirmedDelete
      :open="confirmDeleteOpen"
      :count="selectedIds.size"
      :discount-name="selectedDeleteName"
      @cancel="confirmDeleteOpen = false"
      @confirm="confirmDeleteSelected"
    />

    <ToastNotification :open="toastOpen" :message="toastMessage" />
  </div>
</template>

<style scoped>
.container {
  width: 1, 296px;
  gap: 24px;
  height: 682px;

  display: flex;
  flex-direction: column;

  background-color: #ffffff;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 8px 16px;
  margin-left: 8px;
  cursor: pointer;
  width: 102px;
  height: 40px;
}

.btn-cancel {
  background-color: #ffff;
  color: black;
  border: 1px solid #f44336;
  border-radius: 50px;
  padding: 8px 16px;
  margin-left: 8px;
  cursor: pointer;
  width: 102px;
  height: 40px;
}
.top-section {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  height: 40px;
}
.content-section {
  height: 516px;
  width: 1, 080px;
  border: 1px solid #e0e0e0;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
}
.filter-section {
  height: 40px;
  width: 1, 248px;
}

.filter-input {
  width: 264px;
  height: 40px;
  padding: 4px 4px;
  border: 1px solid #e0e0e0;
  border-radius: 50px;
}

.header-content {
  display: flex;
  height: fit-content;
  flex-direction: column;
  padding: 0px;
}

.header {
  display: flex;
  flex-direction: row;

  justify-content: space-between;
  height: fit-content;
  width: 100%;
  border-radius: 50px;
}
.button-container {
  display: flex;
  align-items: center;
}

.api-dropdown {
  position: relative;
  width: fit-content;
}

.dropdown-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  min-width: 176px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  color: #4b5563;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.dropdown-button.active,
.dropdown-button:hover {
  border-color: #bdbdbd;
}

.store-icon,
.chevron-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.dropdown-label {
  flex: 1;
  text-align: left;
  white-space: nowrap;
}

.chevron-icon {
  transition: transform 0.2s;
}

.dropdown-button.active .chevron-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 20;
  width: 280px;
  padding: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.14);
}

.api-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #374151;
  font-size: 12px;
  font-weight: 700;
}

.api-field input {
  width: 100%;
  height: 40px;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #111827;
  font-size: 14px;
  outline: none;
}

.api-field input:focus {
  border-color: #34db47;
  box-shadow: 0 0 0 3px rgba(52, 219, 71, 0.14);
}
</style>
