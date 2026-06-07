<template>
  <button
    class="btn"
    :class="[
      variant === 'primary' && 'btn-primary',
      variant === 'danger'  && 'btn-danger',
      size === 'sm'         && 'btn-sm',
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <Icon v-if="loading" name="ph:circle-notch" class="animate-spin w-4 h-4" />
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'primary' | 'danger'
  size?: 'default' | 'sm'
  loading?: boolean
  disabled?: boolean
}>()
</script>
