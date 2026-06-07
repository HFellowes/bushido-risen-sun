<template>
  <NuxtLink :to="`/cards/${unit.faction}/${unitSlug}`" class="block">
    <UiCard hoverable>
      <!-- Faction colour stripe -->
      <div
        style="height: 3px; margin: 0;"
        :style="`background: ${factionInfo?.colour ?? '#5a5a5a'}`"
      />

      <div class="relative p-3">
        <!-- Faction watermark -->
        <div
          class="faction-watermark"
          :style="`color: ${factionInfo?.colour ?? '#5a5a5a'}`"
          style="font-size: 5rem;"
        >
          {{ factionInfo?.mon ?? '武' }}
        </div>

        <!-- Header -->
        <div class="relative z-10 flex items-start justify-between mb-3">
          <div>
            <h3 style="font-family: var(--font-family-heading); font-size: 0.95rem; line-height: 1.2; color: var(--color-ink);">
              {{ unit.name }}
            </h3>
            <p style="font-size: 0.65rem; color: var(--color-ink-light); margin-top: 0.125rem; font-family: var(--font-family-mono);">
              {{ factionInfo?.shortName ?? unit.faction }}
            </p>
          </div>
          <div class="text-right">
            <div style="font-family: var(--font-family-mono); font-size: 1rem; font-weight: 700; color: var(--color-ink);">
              {{ unit.riceCost }}
            </div>
            <div style="font-size: 0.55rem; color: var(--color-ink-light); letter-spacing: 0.05em; text-transform: uppercase;">Rice</div>
          </div>
        </div>

        <!-- Mini stat bar -->
        <div class="relative z-10 grid grid-cols-6 gap-0" style="border: 1px solid var(--color-parchment-deep); border-radius: 1px; overflow: hidden;">
          <div
            v-for="stat in miniStats"
            :key="stat.label"
            class="text-center py-1"
            style="border-right: 1px solid var(--color-parchment-deep);"
          >
            <div style="font-size: 0.55rem; color: var(--color-ink-light); letter-spacing: 0.05em; text-transform: uppercase; font-family: var(--font-family-mono);">
              {{ stat.label }}
            </div>
            <div style="font-family: var(--font-family-mono); font-size: 0.8rem; font-weight: 700; color: var(--color-ink);">
              {{ stat.value }}
            </div>
          </div>
        </div>

        <!-- Traits (first 3) -->
        <div v-if="unit.traits.length" class="relative z-10 mt-2 flex flex-wrap gap-1">
          <span
            v-for="trait in unit.traits.slice(0, 3)"
            :key="trait.id"
            style="font-size: 0.6rem; background: var(--color-parchment-dark); padding: 0.1rem 0.35rem; border-radius: 1px; color: var(--color-ink-faded); font-family: var(--font-family-mono);"
          >
            {{ trait.name }}
          </span>
          <span
            v-if="unit.traits.length > 3"
            style="font-size: 0.6rem; color: var(--color-ink-light); padding: 0.1rem 0;"
          >
            +{{ unit.traits.length - 3 }}
          </span>
        </div>
      </div>
    </UiCard>
  </NuxtLink>
</template>

<script setup lang="ts">
import { FACTIONS } from '~/types/unit'
import type { Unit } from '~/types/unit'

const props = defineProps<{ unit: Unit }>()

const factionInfo = computed(() => FACTIONS[props.unit.faction])
const unitSlug = computed(() => props.unit.id.split('/')[1])

const miniStats = computed(() => [
  { label: 'Mv',  value: props.unit.profile.move },
  { label: 'St',  value: props.unit.profile.strength },
  { label: 'Ki',  value: props.unit.profile.kiPool },
  { label: 'Wo',  value: props.unit.profile.wounds },
  { label: 'Df',  value: props.unit.profile.defence },
  { label: 'Ar',  value: props.unit.profile.armour },
])
</script>
