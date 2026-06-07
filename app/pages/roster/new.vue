<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <NuxtLink to="/roster" class="btn btn-sm mb-6 inline-flex">
      <Icon name="ph:arrow-left" class="w-3.5 h-3.5" />
      Warbands
    </NuxtLink>

    <UiCard padding>
      <h1 class="heading-ruled mb-6" style="font-size: 1.25rem;">New Warband</h1>

      <form @submit.prevent="create">
        <!-- Name -->
        <div class="mb-5">
          <label class="field-label">Warband Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="e.g. Temple Defenders"
            required
            class="field-input"
          />
        </div>

        <!-- Faction -->
        <div class="mb-5">
          <label class="field-label">Faction</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            <button
              v-for="faction in allFactions"
              :key="faction.slug"
              type="button"
              class="faction-btn"
              :class="selectedFaction === faction.slug ? 'selected' : ''"
              :style="selectedFaction === faction.slug ? `background: ${faction.colour}; border-color: ${faction.colour}; color: var(--color-parchment);` : ''"
              @click="selectedFaction = faction.slug"
            >
              <span style="font-size: 1rem;">{{ faction.mon }}</span>
              <span style="font-size: 0.75rem;">{{ faction.shortName }}</span>
            </button>
          </div>
        </div>

        <!-- Rice limit -->
        <div class="mb-6">
          <label class="field-label">Rice Limit</label>
          <div class="flex items-center gap-3 mt-2">
            <button
              v-for="preset in ricePresets"
              :key="preset.value"
              type="button"
              class="btn btn-sm"
              :class="riceLimit === preset.value ? 'btn-primary' : ''"
              @click="riceLimit = preset.value"
            >
              {{ preset.label }}
            </button>
            <div class="flex items-center gap-2 ml-auto">
              <span style="font-size: 0.75rem; color: var(--color-ink-light); font-family: var(--font-family-mono);">Custom:</span>
              <input
                v-model.number="riceLimit"
                type="number"
                min="10"
                max="100"
                style="width: 4rem; text-align: center; background: var(--color-parchment-dark); border: 1px solid var(--color-parchment-deep); padding: 0.25rem 0.5rem; font-family: var(--font-family-mono); font-size: 0.875rem; border-radius: 1px; color: var(--color-ink);"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <NuxtLink to="/roster" class="btn btn-sm">Cancel</NuxtLink>
          <button type="submit" class="btn btn-primary" :disabled="!selectedFaction || !name.trim() || creating">
            <Icon v-if="creating" name="ph:circle-notch" class="w-4 h-4 animate-spin" />
            <Icon v-else name="ph:scroll" class="w-4 h-4" />
            Create Warband
          </button>
        </div>
      </form>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import type { FactionSlug } from '~/types/unit'

const { allFactions } = useUnits()
const store = useWarbandStore()
const router = useRouter()

const name = ref('')
const selectedFaction = ref<FactionSlug | null>(null)
const riceLimit = ref(35)
const creating = ref(false)

const ricePresets = [
  { label: '35 (Standard)',    value: 35 },
  { label: '50 (Tournament)',  value: 50 },
  { label: '20 (Skirmish)',    value: 20 },
]

async function create() {
  if (!selectedFaction.value || !name.value.trim()) return
  creating.value = true
  try {
    const wb = await store.createWarband(selectedFaction.value, name.value.trim(), riceLimit.value)
    router.push(`/roster/${wb.id}`)
  } finally {
    creating.value = false
  }
}
</script>

<style>
.field-label {
  display: block;
  font-size: 0.7rem;
  color: var(--color-ink-light);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: var(--font-family-mono);
  margin-bottom: 0.375rem;
}

.field-input {
  width: 100%;
  background: var(--color-parchment-dark);
  border: 1px solid var(--color-parchment-deep);
  padding: 0.5rem 0.75rem;
  font-family: var(--font-family-body);
  font-size: 0.9rem;
  color: var(--color-ink);
  outline: none;
  border-radius: 1px;
  transition: border-color 0.15s;
}
.field-input:focus {
  border-color: var(--color-gold);
}

.faction-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-parchment-deep);
  background: var(--color-parchment-dark);
  color: var(--color-ink-faded);
  cursor: pointer;
  transition: all 0.1s;
  border-radius: 1px;
  font-family: var(--font-family-mono);
  text-align: left;
}
.faction-btn:hover {
  border-color: var(--color-ink-light);
  color: var(--color-ink);
}
.faction-btn.selected {
  font-weight: 600;
}
</style>
