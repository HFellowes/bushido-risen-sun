<template>
  <div
    class="relative overflow-hidden"
    style="background: rgba(244,234,213,0.05); border: 1px solid rgba(200,146,42,0.15); border-radius: 2px; padding: 0.625rem;"
    :style="model.dead ? 'opacity: 0.4;' : model.activated ? 'border-color: rgba(200,146,42,0.4);' : ''"
  >
    <!-- Model name + activated toggle -->
    <div class="flex items-center justify-between mb-2">
      <button
        v-if="editable"
        class="flex items-center gap-2 group"
        @click="$emit('activated')"
      >
        <div
          class="w-4 h-4 border rounded-sm flex items-center justify-center transition-all"
          :style="model.activated
            ? 'background: var(--color-gold); border-color: var(--color-gold);'
            : 'border-color: rgba(200,146,42,0.3);'"
        >
          <Icon v-if="model.activated" name="ph:check" class="w-2.5 h-2.5" style="color: var(--color-ink);" />
        </div>
        <span style="font-family: var(--font-family-heading); font-size: 0.8rem; color: var(--color-parchment);">
          {{ model.name }}
        </span>
      </button>
      <span v-else style="font-family: var(--font-family-heading); font-size: 0.8rem; color: var(--color-parchment);">
        {{ model.name }}
        <span v-if="model.activated" style="font-size: 0.6rem; color: var(--color-gold); margin-left: 0.25rem;">✓</span>
      </span>
    </div>

    <!-- Wounds + Ki -->
    <div class="flex items-center gap-4 mb-2">
      <!-- Wounds -->
      <div class="flex items-center gap-1.5">
        <span style="font-size: 0.55rem; color: rgba(244,234,213,0.4); font-family: var(--font-family-mono); letter-spacing: 0.05em;">WO</span>
        <div class="flex gap-0.5">
          <button
            v-for="i in model.maxWounds"
            :key="i"
            class="wound-pip"
            :class="i <= (model.maxWounds - model.currentWounds) ? 'taken' : ''"
            :disabled="!editable"
            @click="editable && $emit('wound', i <= (model.maxWounds - model.currentWounds) ? model.maxWounds - i + 1 : model.currentWounds - 1)"
          />
        </div>
        <span style="font-size: 0.65rem; color: rgba(244,234,213,0.5); font-family: var(--font-family-mono);">
          {{ model.currentWounds }}/{{ model.maxWounds }}
        </span>
      </div>

      <!-- Ki tokens -->
      <div class="flex items-center gap-1.5">
        <span style="font-size: 0.55rem; color: rgba(244,234,213,0.4); font-family: var(--font-family-mono); letter-spacing: 0.05em;">KI</span>
        <div class="flex gap-0.5">
          <button
            v-for="i in model.maxKi"
            :key="i"
            class="ki-token"
            :class="i <= model.currentKi ? 'filled' : ''"
            :disabled="!editable"
            @click="editable && $emit('ki', i <= model.currentKi ? model.currentKi - 1 : model.currentKi + 1)"
          />
        </div>
      </div>
    </div>

    <!-- Status effects -->
    <div class="flex flex-wrap gap-1">
      <button
        v-for="[key, info] in Object.entries(STATUS_EFFECTS)"
        :key="key"
        class="status-badge"
        :class="model.statuses.includes(key as any) ? 'active' : ''"
        :style="model.statuses.includes(key as any) ? `color: ${info.colour}; border-color: ${info.colour};` : 'border-color: rgba(244,234,213,0.1); color: rgba(244,234,213,0.3);'"
        :disabled="!editable"
        @click="editable && $emit('status', key)"
      >
        {{ info.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { STATUS_EFFECTS } from '~/types/game'
import type { ModelState, StatusEffect } from '~/types/game'

defineProps<{
  model: ModelState
  editable: boolean
}>()

defineEmits<{
  wound:     [value: number]
  ki:        [value: number]
  status:    [status: StatusEffect]
  activated: []
}>()
</script>
