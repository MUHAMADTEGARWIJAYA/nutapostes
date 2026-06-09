<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDiscount, type Discount } from "@/composable/useDiscount";
import UpdateDiscountDialog from "./DialogUpdate.vue";

const editDialogOpen = ref(false);
const selectedItem = ref<Discount | null>(null);

const props = defineProps<{
  discounts: Discount[];
}>();

const emit = defineEmits<{
  deleted: [name: string];
  saved: [name: string];
}>();

function handleEdit(item: any) {
  selectedItem.value = item;
  editDialogOpen.value = true;
}
const {
  discounts: storedDiscounts,
  selectedIds,
  sortField,
  sortDirection,
  loadDiscounts,
  toggleSort,
  toggleSelect,
  formatValue,
  isNew,
} = useDiscount();

const visibleDiscounts = computed(() => {
  return [...props.discounts].sort((a, b) => {
    const valA = sortField.value === "name" ? a.name : a.value;
    const valB = sortField.value === "name" ? b.name : b.value;

    if (valA < valB) {
      return sortDirection.value === "asc" ? -1 : 1;
    }

    if (valA > valB) {
      return sortDirection.value === "asc" ? 1 : -1;
    }

    return 0;
  });
});

const hasVisibleDiscounts = computed(() => visibleDiscounts.value.length > 0);
const hasStoredDiscounts = computed(() => storedDiscounts.value.length > 0);
const allVisibleSelected = computed(() => {
  return (
    hasVisibleDiscounts.value &&
    visibleDiscounts.value.every((discount) =>
      selectedIds.value.has(discount.id),
    )
  );
});

function toggleSelectAllVisible() {
  if (allVisibleSelected.value) {
    visibleDiscounts.value.forEach((discount) => {
      selectedIds.value.delete(discount.id);
    });
  } else {
    visibleDiscounts.value.forEach((discount) => {
      selectedIds.value.add(discount.id);
    });
  }

  selectedIds.value = new Set(selectedIds.value);
}

onMounted(() => {
  loadDiscounts();
});
</script>

<template>
  <div class="table-wrapper">
    <table class="discount-table">
      <thead>
        <tr>
          <th class="col-check">
            <input
              type="checkbox"
              :checked="allVisibleSelected"
              @change="toggleSelectAllVisible"
            />
          </th>
          <th class="col-name" @click="toggleSort('name')">
            Nama Diskon
            <span class="sort-icon">
              {{
                sortField === "name"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"
              }}
            </span>
          </th>
          <th class="col-value" @click="toggleSort('value')">
            Nilai Diskon
            <span class="sort-icon">
              {{
                sortField === "value"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"
              }}
            </span>
          </th>
          <th class="col-action"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in visibleDiscounts"
          :key="item.id"
          :class="{ selected: selectedIds.has(item.id) }"
        >
          <td class="col-check">
            <input
              type="checkbox"
              :checked="selectedIds.has(item.id)"
              @change="toggleSelect(item.id)"
            />
          </td>
          <td class="col-name">
            {{ item.name }}
            <span v-if="isNew(item.id)" class="badge-new">baru</span>
          </td>
          <td class="col-value">{{ formatValue(item) }}</td>
          <td class="col-action">
            <button class="btn-edit" @click="handleEdit(item)" title="Edit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#000000"
              >
                <path
                  d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"
                />
              </svg>
            </button>
            <!-- dialog update -->
            <UpdateDiscountDialog
              :open="editDialogOpen"
              :item="selectedItem"
              @close="editDialogOpen = false"
              @deleted="emit('deleted', $event)"
              @saved="emit('saved', $event)"
            />
          </td>
        </tr>

        <!-- Kosong -->
        <tr v-if="!hasVisibleDiscounts">
          <td colspan="4" class="empty-state">
            {{
              hasStoredDiscounts
                ? "Tidak ada diskon yang cocok."
                : "Belum ada diskon."
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  height: 516px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
}

.discount-table {
  width: 100%;

  font-size: 12px;
  font-family: "Segoe UI", sans-serif;
}

/* Header */
thead tr {
  background: #f9fafb;

  border-bottom: 1px solid #e5e7eb;
}

thead th {
  padding: 6px 6px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  user-select: none;
}

thead th.col-name,
thead th.col-value {
  cursor: pointer;
}

thead th.col-name:hover,
thead th.col-value:hover {
  color: #111827;
}

.sort-icon {
  margin-left: 4px;
  font-size: 12px;
  color: #9ca3af;
}

/* Body */
tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
}

tbody tr:hover {
  background: #f9fafb;
}

tbody tr.selected {
  background: #eff6ff;
}

tbody td {
  padding: 10px 12px;
  color: #374151;
}

/* Kolom */
.col-check {
  width: 40px;
  text-align: center;
}

.col-name {
  min-width: 200px;
}

.col-value {
  min-width: 120px;
  color: #111827;
  font-weight: 500;
}

.col-action {
  width: 48px;
  text-align: center;
}

/* Badge baru */
.badge-new {
  margin-left: 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 50px;
}

/* Tombol edit */
.btn-edit {
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
}

.btn-edit:hover {
  background: #f3f4f6;
}

/* Empty state */
.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 32px;
}
</style>
