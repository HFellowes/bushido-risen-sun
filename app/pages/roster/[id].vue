<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/roster" class="btn btn-sm">
        <Icon name="ph:arrow-left" class="w-3.5 h-3.5" />
        Warbands
      </NuxtLink>
    </div>

    <div v-if="store.loading" class="text-center py-24">
      <Icon name="ph:circle-notch" class="w-6 h-6 animate-spin" style="color: var(--color-ink-light);" />
    </div>

    <div v-else-if="!warband" class="text-center py-16">
      <p style="color: var(--color-ink-light); font-style: italic;">Warband not found.</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Warband summary -->
      <div class="lg:col-span-1">
        <UiCard padding class="mb-4">
          <div class="faction-watermark" :style="`color: ${factionInfo?.colour}`" style="font-size: 8rem;">
            {{ factionInfo?.mon }}
          </div>
          <div class="relative z-10">
            <!-- Editable name -->
            <input
              v-model="warband.name"
              class="field-input mb-1"
              style="font-family: var(--font-family-heading); font-size: 1.2rem; background: transparent; border-color: transparent; padding: 0; font-weight: normal;"
              @blur="saveWarband"
            />
            <p style="font-size: 0.75rem; color: var(--color-ink-light); font-family: var(--font-family-mono);">
              {{ factionInfo?.name }}
            </p>

            <hr class="divider-ink my-3" />

            <!-- Rice counter -->
            <div class="flex items-center justify-between">
              <span style="font-size: 0.75rem; color: var(--color-ink-light); font-family: var(--font-family-mono);">Rice</span>
              <div class="flex items-center gap-2">
                <div
                  class="rice-counter"
                  :class="store.isOverLimit ? 'over-limit' : ''"
                  style="font-size: 0.875rem;"
                >
                  {{ store.riceSpent }} / {{ warband.riceLimit }}
                </div>
              </div>
            </div>

            <!-- Rice limit editor -->
            <div class="mt-2 flex items-center gap-2">
              <span style="font-size: 0.7rem; color: var(--color-ink-light); font-family: var(--font-family-mono);">Limit:</span>
              <input
                v-model.number="warband.riceLimit"
                type="number"
                min="10"
                max="100"
                style="width: 4rem; text-align: center; background: var(--color-parchment-dark); border: 1px solid var(--color-parchment-deep); padding: 0.2rem 0.4rem; font-family: var(--font-family-mono); font-size: 0.8rem; border-radius: 1px; color: var(--color-ink);"
                @blur="saveWarband"
              />
            </div>

            <hr class="divider-ink my-3" />

            <!-- Notes -->
            <label class="field-label">Notes</label>
            <textarea
              v-model="warband.notes"
              class="field-input"
              rows="3"
              placeholder="Strategy notes, reminders..."
              style="resize: vertical; min-height: 5rem;"
              @blur="saveWarband"
            />
          </div>
        </UiCard>

        <!-- Actions -->
        <div class="flex flex-col gap-2">
          <NuxtLink :to="`/game?warband=${warband.id}`" class="btn btn-primary">
            <Icon name="ph:sword" class="w-4 h-4" />
            Start Game with This Warband
          </NuxtLink>
        </div>
      </div>

      <!-- Unit roster -->
      <div class="lg:col-span-2">
        <!-- Current slots -->
        <div class="mb-6">
          <h2 class="heading-ruled mb-4" style="font-size: 0.875rem;">
            Roster ({{ warband.slots.length }} model{{ warband.slots.length !== 1 ? 's' : '' }})
          </h2>

          <div v-if="warband.slots.length === 0" class="text-center py-8">
            <UiCard padding>
              <p style="color: var(--color-ink-light); font-style: italic; font-size: 0.875rem;">
                No units yet. Add from the list below.
              </p>
            </UiCard>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="(slot, idx) in warband.slots"
              :key="slot.id"
              class="flex items-center gap-3 px-3 py-2"
              style="background: var(--color-parchment); border: 1px solid var(--color-parchment-deep); border-radius: 1px;"
            >
              <span style="font-size: 0.65rem; color: var(--color-ink-light); font-family: var(--font-family-mono); min-width: 1.5rem;">
                {{ idx + 1 }}.
              </span>
              <span style="flex: 1; font-family: var(--font-family-heading); font-size: 0.9rem; color: var(--color-ink);">
                {{ slot.unitName }}
              </span>
              <span style="font-family: var(--font-family-mono); font-size: 0.8rem; color: var(--color-ink-faded);">
                {{ slot.riceCost }}R
              </span>
              <button
                style="color: var(--color-red-seal); opacity: 0.6;"
                @click="removeSlot(slot.id)"
              >
                <Icon name="ph:x" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Add units -->
        <div>
          <h2 class="heading-ruled mb-4" style="font-size: 0.875rem;">Add Units</h2>

          <div class="mb-3">
            <input
              v-model="unitSearch"
              type="text"
              placeholder="Search units..."
              class="field-input"
            />
          </div>

          <div v-if="unitsLoading" class="text-center py-8">
            <Icon name="ph:circle-notch" class="w-5 h-5 animate-spin" style="color: var(--color-ink-light);" />
          </div>

          <div v-else class="space-y-1 max-h-96 overflow-y-auto pr-1">
            <button
              v-for="unit in filteredAvailableUnits"
              :key="unit.id"
              class="w-full text-left flex items-center gap-3 px-3 py-2"
              style="background: var(--color-parchment); border: 1px solid var(--color-parchment-deep); border-radius: 1px; transition: all 0.1s; cursor: pointer;"
              :style="store.riceSpent + unit.riceCost > warband.riceLimit ? 'opacity: 0.5;' : ''"
              @click="addUnit(unit)"
            >
              <Icon name="ph:plus-circle" class="w-4 h-4 flex-shrink-0" style="color: var(--color-ink-light);" />
              <span style="flex: 1; font-family: var(--font-family-heading); font-size: 0.875rem; color: var(--color-ink);">
                {{ unit.name }}
              </span>
              <span style="font-family: var(--font-family-mono); font-size: 0.75rem; color: var(--color-ink-faded);">
                {{ unit.riceCost }}R
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FACTIONS } from '~/types/unit'
import type { Unit, FactionSlug } from '~/types/unit'
import { randomUUID } from 'crypto'

const route = useRoute()
const store = useWarbandStore()
const { getFactionUnits, loading: unitsLoading } = useUnits()

const warband = computed(() => store.current)
const factionInfo = computed(() => warband.value ? FACTIONS[warband.value.faction as FactionSlug] : null)

const availableUnits = ref<Unit[]>([])
const unitSearch = ref('')

onMounted(async () => {
  await store.fetchWarband(route.params.id as string)
  if (warband.value) {
    availableUnits.value = await getFactionUnits(warband.value.faction as FactionSlug)
    // Also load ronin
    const ronin = await getFactionUnits('ronin')
    availableUnits.value.push(...ronin)
  }
})

const filteredAvailableUnits = computed(() => {
  let units = availableUnits.value
  if (unitSearch.value.trim()) {
    const q = unitSearch.value.toLowerCase()
    units = units.filter(u => u.name.toLowerCase().includes(q))
  }
  return units.sort((a, b) => a.name.localeCompare(b.name))
})

function addUnit(unit: Unit) {
  if (!warband.value) return
  warband.value.slots.push({
    id: Math.random().toString(36).slice(2),
    unitId: unit.id,
    unitName: unit.name,
    riceCost: unit.riceCost,
    upgrades: [],
  })
  saveWarband()
}

function removeSlot(slotId: string) {
  if (!warband.value) return
  warband.value.slots = warband.value.slots.filter(s => s.id !== slotId)
  saveWarband()
}

async function saveWarband() {
  if (!warband.value) return
  await store.saveWarband(warband.value)
}
</script>
