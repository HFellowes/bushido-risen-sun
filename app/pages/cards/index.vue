<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-start gap-8">
      <!-- Sidebar filters -->
      <aside class="w-56 flex-shrink-0 sticky top-20">
        <UiCard padding>
          <h2 class="heading-ruled mb-4" style="font-size: 0.875rem;">Filter</h2>

          <!-- Search -->
          <div class="mb-4">
            <label style="font-size: 0.7rem; color: var(--color-ink-light); letter-spacing: 0.05em; text-transform: uppercase; font-family: var(--font-family-mono);">Search</label>
            <input
              v-model="search"
              type="text"
              placeholder="Unit name..."
              style="width: 100%; margin-top: 0.375rem; background: var(--color-parchment-dark); border: 1px solid var(--color-parchment-deep); padding: 0.375rem 0.5rem; font-family: var(--font-family-mono); font-size: 0.8rem; color: var(--color-ink); outline: none; border-radius: 1px;"
            />
          </div>

          <!-- Faction -->
          <div class="mb-4">
            <label style="font-size: 0.7rem; color: var(--color-ink-light); letter-spacing: 0.05em; text-transform: uppercase; font-family: var(--font-family-mono);">Faction</label>
            <div class="mt-2 space-y-1">
              <button
                class="w-full text-left px-2 py-1 rounded-sm flex items-center gap-2"
                :style="!selectedFaction ? 'background: var(--color-ink); color: var(--color-parchment);' : 'color: var(--color-ink-faded);'"
                style="font-size: 0.75rem; font-family: var(--font-family-mono); border-radius: 1px; transition: all 0.1s;"
                @click="selectedFaction = null"
              >
                All Factions
              </button>
              <button
                v-for="faction in allFactions"
                :key="faction.slug"
                class="w-full text-left px-2 py-1 flex items-center gap-2"
                :style="selectedFaction === faction.slug
                  ? `background: ${faction.colour}; color: var(--color-parchment);`
                  : 'color: var(--color-ink-faded);'"
                style="font-size: 0.72rem; font-family: var(--font-family-mono); border-radius: 1px; transition: all 0.1s;"
                @click="selectedFaction = faction.slug"
              >
                <span style="font-size: 0.9em;">{{ faction.mon }}</span>
                {{ faction.shortName }}
              </button>
            </div>
          </div>

          <!-- Rice cost range -->
          <div class="mb-4">
            <label style="font-size: 0.7rem; color: var(--color-ink-light); letter-spacing: 0.05em; text-transform: uppercase; font-family: var(--font-family-mono);">Max Rice</label>
            <div class="flex items-center gap-2 mt-2">
              <input
                v-model.number="maxRice"
                type="range"
                min="1"
                max="20"
                step="1"
                style="flex: 1; accent-color: var(--color-ink);"
              />
              <span style="font-family: var(--font-family-mono); font-size: 0.8rem; min-width: 1.5rem; text-align: right;">{{ maxRice }}</span>
            </div>
          </div>

          <!-- Type -->
          <div>
            <label style="font-size: 0.7rem; color: var(--color-ink-light); letter-spacing: 0.05em; text-transform: uppercase; font-family: var(--font-family-mono);">Type</label>
            <div class="flex flex-wrap gap-1 mt-2">
              <button
                v-for="t in types"
                :key="t"
                class="btn btn-sm"
                :class="selectedType === t ? 'btn-primary' : ''"
                @click="selectedType = selectedType === t ? null : t"
              >
                {{ t }}
              </button>
            </div>
          </div>
        </UiCard>
      </aside>

      <!-- Main content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-6">
          <h1 class="heading-ruled flex-1" style="font-size: 1.125rem;">
            Unit Cards
          </h1>
          <span style="font-family: var(--font-family-mono); font-size: 0.75rem; color: var(--color-ink-light); margin-left: 1rem;">
            {{ filteredUnits.length }} units
          </span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-24">
          <div class="text-center">
            <Icon name="ph:circle-notch" class="w-8 h-8 animate-spin mb-3" style="color: var(--color-ink-light);" />
            <p style="color: var(--color-ink-light); font-style: italic; font-size: 0.875rem;">Consulting the scrolls...</p>
          </div>
        </div>

        <!-- No results -->
        <div v-else-if="filteredUnits.length === 0" class="text-center py-16">
          <p style="color: var(--color-ink-light); font-style: italic;">No units match your filters.</p>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <UnitCard v-for="unit in filteredUnits" :key="unit.id" :unit="unit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Unit, FactionSlug } from '~/types/unit'

const { allFactions, getFactionUnits, loading } = useUnits()

const search = ref('')
const selectedFaction = ref<FactionSlug | null>(null)
const selectedType = ref<string | null>(null)
const maxRice = ref(20)
const types = ['model', 'upgrade', 'profile']

const allUnits = ref<Unit[]>([])

// Load units — if faction selected, load just that; otherwise load all
watch(selectedFaction, async (faction) => {
  if (faction) {
    allUnits.value = await getFactionUnits(faction)
  } else {
    await loadAll()
  }
}, { immediate: true })

async function loadAll() {
  const results: Unit[] = []
  for (const faction of allFactions) {
    const units = await getFactionUnits(faction.slug)
    results.push(...units)
  }
  allUnits.value = results
}

const filteredUnits = computed(() => {
  let units = allUnits.value

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    units = units.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.traits.some(t => t.name.toLowerCase().includes(q))
    )
  }

  if (selectedType.value) {
    units = units.filter(u => u.type === selectedType.value)
  }

  units = units.filter(u => u.riceCost <= maxRice.value)

  return units.sort((a, b) => a.name.localeCompare(b.name))
})
</script>
