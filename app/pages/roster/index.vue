<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="heading-ruled flex-1" style="font-size: 1.25rem;">Your Warbands</h1>
      <NuxtLink to="/roster/new" class="btn btn-primary btn-sm ml-4">
        <Icon name="ph:plus" class="w-3.5 h-3.5" />
        New Warband
      </NuxtLink>
    </div>

    <div v-if="store.loading" class="text-center py-16">
      <Icon name="ph:circle-notch" class="w-6 h-6 animate-spin" style="color: var(--color-ink-light);" />
    </div>

    <div v-else-if="store.summaries.length === 0" class="text-center py-16">
      <UiCard padding>
        <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.2; font-family: var(--font-family-display);">武</div>
        <p style="color: var(--color-ink-light); font-style: italic; margin-bottom: 1.5rem;">
          No warbands yet. Build your first roster to begin.
        </p>
        <NuxtLink to="/roster/new" class="btn btn-primary">
          <Icon name="ph:plus" class="w-4 h-4" />
          Create a Warband
        </NuxtLink>
      </UiCard>
    </div>

    <div v-else class="space-y-3">
      <NuxtLink
        v-for="wb in store.summaries"
        :key="wb.id"
        :to="`/roster/${wb.id}`"
        class="block"
      >
        <UiCard padding hoverable>
          <div class="faction-watermark" :style="`color: ${factionColour(wb.faction)}`">
            {{ factionMon(wb.faction) }}
          </div>
          <div class="relative z-10 flex items-center gap-4">
            <!-- Faction stripe -->
            <div
              class="w-1 self-stretch flex-shrink-0 rounded-full"
              :style="`background: ${factionColour(wb.faction)}`"
            />

            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-3">
                <h2 style="font-family: var(--font-family-heading); font-size: 1.05rem; color: var(--color-ink);">
                  {{ wb.name }}
                </h2>
                <span style="font-size: 0.7rem; color: var(--color-ink-light); font-family: var(--font-family-mono);">
                  {{ factionName(wb.faction) }}
                </span>
              </div>
              <p style="font-size: 0.75rem; color: var(--color-ink-light); margin-top: 0.125rem;">
                {{ wb.modelCount }} model{{ wb.modelCount !== 1 ? 's' : '' }}
                · Updated {{ formatDate(wb.updatedAt) }}
              </p>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-right">
                <span
                  class="rice-counter"
                  :class="wb.riceSpent > wb.riceLimit ? 'over-limit' : ''"
                >
                  {{ wb.riceSpent }} / {{ wb.riceLimit }}
                </span>
                <div style="font-size: 0.6rem; color: var(--color-ink-light); margin-top: 0.25rem; text-align: right; font-family: var(--font-family-mono);">Rice</div>
              </div>
              <button
                class="btn btn-danger btn-sm"
                @click.prevent="confirmDelete(wb.id, wb.name)"
              >
                <Icon name="ph:trash" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </UiCard>
      </NuxtLink>
    </div>

    <!-- Delete confirm modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(26,18,9,0.5);" @click.self="deleteTarget = null">
        <UiCard padding style="max-width: 360px; width: 90%; margin: 1rem;">
          <h2 class="heading-ruled mb-4" style="font-size: 1rem;">Delete Warband</h2>
          <p style="color: var(--color-ink-faded); font-size: 0.875rem; margin-bottom: 1.5rem;">
            Are you sure you want to delete <strong>{{ deleteTarget.name }}</strong>? This cannot be undone.
          </p>
          <div class="flex gap-3 justify-end">
            <button class="btn btn-sm" @click="deleteTarget = null">Cancel</button>
            <button class="btn btn-danger btn-sm" @click="doDelete">
              <Icon name="ph:trash" class="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </UiCard>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { FACTIONS } from '~/types/unit'
import type { FactionSlug } from '~/types/unit'

const store = useWarbandStore()
const deleteTarget = ref<{ id: string; name: string } | null>(null)

onMounted(() => store.fetchSummaries())

function confirmDelete(id: string, name: string) {
  deleteTarget.value = { id, name }
}

async function doDelete() {
  if (!deleteTarget.value) return
  await store.deleteWarband(deleteTarget.value.id)
  deleteTarget.value = null
}

function factionColour(slug: string) {
  return FACTIONS[slug as FactionSlug]?.colour ?? '#5a5a5a'
}

function factionMon(slug: string) {
  return FACTIONS[slug as FactionSlug]?.mon ?? '武'
}

function factionName(slug: string) {
  return FACTIONS[slug as FactionSlug]?.shortName ?? slug
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
</script>
