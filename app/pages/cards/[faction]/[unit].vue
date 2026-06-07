<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back -->
    <NuxtLink to="/cards" class="btn btn-sm mb-6 inline-flex">
      <Icon name="ph:arrow-left" class="w-3.5 h-3.5" />
      All Cards
    </NuxtLink>

    <div v-if="loading" class="text-center py-24">
      <Icon name="ph:circle-notch" class="w-8 h-8 animate-spin" style="color: var(--color-ink-light);" />
    </div>

    <div v-else-if="!unit" class="text-center py-24">
      <p style="color: var(--color-ink-light); font-style: italic;">Unit not found.</p>
    </div>

    <div v-else>
      <!-- Unit header card -->
      <UiCard class="mb-6">
        <!-- Faction stripe -->
        <div style="height: 4px;" :style="`background: ${factionInfo?.colour}`" />

        <div class="relative p-6">
          <div class="faction-watermark" :style="`color: ${factionInfo?.colour}; font-size: 12rem;`">
            {{ factionInfo?.mon }}
          </div>

          <div class="relative z-10 flex items-start justify-between">
            <div>
              <div style="font-size: 0.7rem; color: var(--color-ink-light); font-family: var(--font-family-mono); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.25rem;">
                {{ factionInfo?.name }}
              </div>
              <h1 style="font-family: var(--font-family-heading); font-size: 2rem; color: var(--color-ink);">
                {{ unit.name }}
              </h1>
              <div class="flex items-center gap-3 mt-1">
                <span style="font-size: 0.75rem; color: var(--color-ink-light); font-family: var(--font-family-mono); text-transform: capitalize;">
                  {{ unit.type }}
                </span>
                <span v-if="unit.unique" style="font-size: 0.65rem; font-family: var(--font-family-mono); color: var(--color-gold); border: 1px solid var(--color-gold); padding: 0.1rem 0.35rem; border-radius: 1px;">
                  Unique
                </span>
                <span v-if="unit.ronin" style="font-size: 0.65rem; font-family: var(--font-family-mono); color: var(--color-ink-faded); border: 1px solid var(--color-parchment-deep); padding: 0.1rem 0.35rem; border-radius: 1px;">
                  Ronin
                </span>
              </div>
            </div>

            <div class="text-right">
              <div style="font-family: var(--font-family-mono); font-size: 2.5rem; font-weight: 700; color: var(--color-ink); line-height: 1;">
                {{ unit.riceCost }}
              </div>
              <div style="font-size: 0.65rem; color: var(--color-ink-light); letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-family-mono);">Rice</div>
            </div>
          </div>

          <!-- Full stat block -->
          <div class="relative z-10 mt-6">
            <table class="stat-block w-full">
              <thead>
                <tr>
                  <th>Move</th>
                  <th>Str</th>
                  <th>Ki</th>
                  <th>Wounds</th>
                  <th>Def</th>
                  <th>Armour</th>
                  <th>Size</th>
                  <th>Base</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ unit.profile.move }}"</td>
                  <td>{{ unit.profile.strength }}</td>
                  <td>{{ unit.profile.kiPool }}</td>
                  <td>{{ unit.profile.wounds }}</td>
                  <td>{{ unit.profile.defence }}</td>
                  <td>{{ unit.profile.armour }}</td>
                  <td style="text-transform: capitalize;">{{ unit.profile.size }}</td>
                  <td>{{ unit.profile.base }}mm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </UiCard>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Traits -->
        <UiCard v-if="unit.traits.length" padding>
          <h2 class="heading-ruled mb-4" style="font-size: 0.875rem;">Traits</h2>
          <ul class="space-y-3">
            <li v-for="trait in unit.traits" :key="trait.id">
              <div style="font-family: var(--font-family-heading); font-size: 0.9rem; color: var(--color-ink);">
                {{ trait.name }}
              </div>
              <p v-if="trait.description" style="font-size: 0.8rem; color: var(--color-ink-faded); margin-top: 0.125rem; line-height: 1.5;">
                {{ trait.description }}
              </p>
            </li>
          </ul>
        </UiCard>

        <!-- Ki Feats -->
        <UiCard v-if="unit.kiFeats.length" padding>
          <h2 class="heading-ruled mb-4" style="font-size: 0.875rem;">Ki Feats</h2>
          <ul class="space-y-4">
            <li v-for="feat in unit.kiFeats" :key="feat.id">
              <div class="flex items-start justify-between gap-2">
                <span style="font-family: var(--font-family-heading); font-size: 0.9rem; color: var(--color-ink);">
                  {{ feat.name }}
                </span>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-ink-light);">
                    {{ feat.range }}
                  </span>
                  <UiBadge :colour="factionInfo?.colour">{{ feat.cost }}</UiBadge>
                </div>
              </div>
              <p v-if="feat.trigger" style="font-size: 0.75rem; color: var(--color-gold); margin-top: 0.125rem; font-style: italic;">
                {{ feat.trigger }}
              </p>
              <p v-if="feat.description" style="font-size: 0.8rem; color: var(--color-ink-faded); margin-top: 0.25rem; line-height: 1.5;">
                {{ feat.description }}
              </p>
            </li>
          </ul>
        </UiCard>
      </div>

      <!-- Special rules -->
      <UiCard v-if="unit.special" padding class="mt-6">
        <h2 class="heading-ruled mb-4" style="font-size: 0.875rem;">Special Rules</h2>
        <div class="prose-bushido" v-html="unit.special" />
      </UiCard>

      <!-- Add to warband -->
      <div class="mt-6 flex justify-end">
        <NuxtLink to="/roster/new" class="btn btn-primary">
          <Icon name="ph:plus" class="w-4 h-4" />
          Add to Warband
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FACTIONS } from '~/types/unit'
import type { FactionSlug } from '~/types/unit'

const route = useRoute()
const { getUnit, loading } = useUnits()

const faction = route.params.faction as FactionSlug
const unitSlug = route.params.unit as string

const unit = ref<any>(null)

onMounted(async () => {
  unit.value = await getUnit(faction, unitSlug)
})

const factionInfo = computed(() => FACTIONS[faction])

useHead({
  title: computed(() => unit.value ? `${unit.value.name} — Bushido` : 'Unit — Bushido'),
})
</script>

<style>
.prose-bushido {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-ink-faded);
}
.prose-bushido p { margin-bottom: 0.75rem; }
.prose-bushido strong { color: var(--color-ink); font-weight: 600; }
.prose-bushido em { font-style: italic; }
</style>
