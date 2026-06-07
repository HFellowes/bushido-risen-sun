<template>
  <div class="card-parchment" :class="[padding && 'p-4', hoverable && 'hover-card', $attrs.class]">
    <div class="corner-ornament tl" />
    <div class="corner-ornament tr" />
    <div class="corner-ornament bl" />
    <div class="corner-ornament br" />
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  padding?: boolean
  hoverable?: boolean
}>()
</script>

<style scoped>
.hover-card {
  transition: transform 0.15s, box-shadow 0.15s;
  cursor: pointer;
}
.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(26, 18, 9, 0.16), 0 2px 4px rgba(26, 18, 9, 0.1);
}
</style>
