import { ref, computed } from "vue";

export interface Discount {
  id: string;
  name: string;
  value: number;
  type: "%" | "Rp";
}

const discounts = ref<Discount[]>([]);
const selectedIds = ref<Set<string>>(new Set());

const sortField = ref<"name" | "value">("name");
const sortDirection = ref<"asc" | "desc">("asc");

export function useDiscount() {
  const loadDiscounts = () => {
    const data = localStorage.getItem("discounts");

    if (data) {
      discounts.value = JSON.parse(data);
    }
  };

  const sortedDiscounts = computed(() => {
    return [...discounts.value].sort((a, b) => {
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

  const toggleSort = (field: "name" | "value") => {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    } else {
      sortField.value = field;
      sortDirection.value = "asc";
    }
  };

  const allSelected = computed(() => {
    return (
      discounts.value.length > 0 &&
      selectedIds.value.size === discounts.value.length
    );
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id);
    } else {
      selectedIds.value.add(id);
    }

    selectedIds.value = new Set(selectedIds.value);
  };

  const toggleSelectAll = () => {
    if (allSelected.value) {
      selectedIds.value.clear();
    } else {
      discounts.value.forEach((d) => {
        selectedIds.value.add(d.id);
      });
    }

    selectedIds.value = new Set(selectedIds.value);
  };

  const formatValue = (discount: Discount) => {
    if (discount.type === "Rp") {
      return `Rp ${discount.value.toLocaleString("id-ID")}`;
    }

    return `${discount.value}%`;
  };

  const isNew = (id: string) => {
    const now = Date.now();
    const created = Number(id);

    return now - created < 10 * 60 * 1000;
  };
  const saveDiscounts = () => {
    localStorage.setItem("discounts", JSON.stringify(discounts.value));
  };

  const deleteSelected = () => {
    discounts.value = discounts.value.filter(
      (discount) => !selectedIds.value.has(discount.id),
    );

    selectedIds.value.clear();

    saveDiscounts();
  };

  const deleteDiscount = (id: string) => {
    discounts.value = discounts.value.filter((discount) => discount.id !== id);
    selectedIds.value.delete(id);
    selectedIds.value = new Set(selectedIds.value);

    saveDiscounts();
  };

  const cancelSelection = () => {
    selectedIds.value.clear();

    // trigger reactivity
    selectedIds.value = new Set();
  };

  const updateDiscount = (updatedDiscount: Discount) => {
    const index = discounts.value.findIndex(
      (discount) => discount.id === updatedDiscount.id,
    );

    if (index !== -1) {
      discounts.value[index] = updatedDiscount;

      saveDiscounts();
    }
  };

  return {
    discounts,
    selectedIds,
    sortField,
    sortDirection,
    sortedDiscounts,
    allSelected,
    loadDiscounts,
    toggleSort,
    toggleSelect,
    toggleSelectAll,
    formatValue,
    isNew,

    deleteSelected,
    deleteDiscount,
    cancelSelection,

    updateDiscount,
  };
}
