<template>
  <span
    class="badge-seal"
    :style="colour ? `color: ${colour}; border-color: ${colour}` : ''"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{
  colour?: string
}>()
</script>
