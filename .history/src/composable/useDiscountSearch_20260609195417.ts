import { computed, ref, type Ref } from "vue";
import type { Discount } from "../types/discount";

export function useDiscountSearch(discounts: Ref<Discount[]>) {
  const searchQuery = ref("");

  const filteredDiscounts = computed(() => {
    return discounts.value.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  });

  return {
    searchQuery,
    filteredDiscounts,
  };
}