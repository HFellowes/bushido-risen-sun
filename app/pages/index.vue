<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden" style="background: var(--color-ink); min-height: 340px;">
      <!-- Background decoration -->
      <div
        class="absolute inset-0 flex items-center justify-center opacity-5"
        style="font-family: var(--font-family-display); font-size: 28rem; color: var(--color-gold); line-height: 1; user-select: none; overflow: hidden;"
      >
        武
      </div>

      <!-- Gold border lines -->
      <div style="position: absolute; top: 16px; left: 16px; right: 16px; bottom: 16px; border: 1px solid rgba(200,146,42,0.2); pointer-events: none;" />

      <div class="relative z-10 max-w-4xl mx-auto px-8 py-16 text-center">
        <p style="font-family: var(--font-family-mono); font-size: 0.7rem; letter-spacing: 0.3em; color: rgba(200,146,42,0.6); text-transform: uppercase; margin-bottom: 1rem;">
          Companion App
        </p>
        <h1 style="font-family: var(--font-family-display); font-size: 3.5rem; color: var(--color-parchment); line-height: 1.1; margin-bottom: 0.5rem;">
          Bushido
        </h1>
        <h2 style="font-family: var(--font-family-heading); font-size: 1.5rem; color: var(--color-gold); letter-spacing: 0.1em; font-style: italic; margin-bottom: 2rem;">
          Risen Sun
        </h2>

        <!-- Join session input -->
        <div class="flex items-center justify-center gap-3 max-w-sm mx-auto">
          <input
            v-model="sessionCode"
            type="text"
            placeholder="Enter session code..."
            maxlength="4"
            class="flex-1 text-center uppercase tracking-widest"
            style="background: rgba(244,234,213,0.1); border: 1px solid rgba(200,146,42,0.3); color: var(--color-parchment); padding: 0.5rem 1rem; font-family: var(--font-family-mono); font-size: 1rem; letter-spacing: 0.2em; outline: none; border-radius: 1px;"
            @keyup.enter="joinSession"
          />
          <button class="btn" style="border-color: var(--color-gold); color: var(--color-gold);" @click="joinSession">
            Join
          </button>
        </div>
      </div>
    </section>

    <!-- Quick actions -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 class="heading-ruled mb-6" style="font-size: 1rem;">Quick Actions</h2>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <NuxtLink to="/game" class="block">
          <UiCard padding hoverable>
            <div class="text-center py-2">
              <div class="mb-3" style="color: var(--color-red-seal);">
                <Icon name="ph:sword" class="w-8 h-8" />
              </div>
              <p style="font-family: var(--font-family-heading); font-variant: small-caps; letter-spacing: 0.05em; color: var(--color-ink);">Start Game</p>
              <p style="font-size: 0.75rem; color: var(--color-ink-light); margin-top: 0.25rem;">Create or join a session</p>
            </div>
          </UiCard>
        </NuxtLink>

        <NuxtLink to="/roster/new" class="block">
          <UiCard padding hoverable>
            <div class="text-center py-2">
              <div class="mb-3" style="color: var(--color-gold);">
                <Icon name="ph:scroll" class="w-8 h-8" />
              </div>
              <p style="font-family: var(--font-family-heading); font-variant: small-caps; letter-spacing: 0.05em; color: var(--color-ink);">New Warband</p>
              <p style="font-size: 0.75rem; color: var(--color-ink-light); margin-top: 0.25rem;">Build a new roster</p>
            </div>
          </UiCard>
        </NuxtLink>

        <NuxtLink to="/cards" class="block">
          <UiCard padding hoverable>
            <div class="text-center py-2">
              <div class="mb-3" style="color: var(--color-ink-faded);">
                <Icon name="ph:cards" class="w-8 h-8" />
              </div>
              <p style="font-family: var(--font-family-heading); font-variant: small-caps; letter-spacing: 0.05em; color: var(--color-ink);">Browse Cards</p>
              <p style="font-size: 0.75rem; color: var(--color-ink-light); margin-top: 0.25rem;">All unit profiles</p>
            </div>
          </UiCard>
        </NuxtLink>

        <NuxtLink to="/rules" class="block">
          <UiCard padding hoverable>
            <div class="text-center py-2">
              <div class="mb-3" style="color: var(--color-ink-faded);">
                <Icon name="ph:book-open" class="w-8 h-8" />
              </div>
              <p style="font-family: var(--font-family-heading); font-variant: small-caps; letter-spacing: 0.05em; color: var(--color-ink);">Rules</p>
              <p style="font-size: 0.75rem; color: var(--color-ink-light); margin-top: 0.25rem;">Reference & search</p>
            </div>
          </UiCard>
        </NuxtLink>
      </div>
    </section>

    <!-- Recent warbands -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="heading-ruled flex-1" style="font-size: 1rem;">Recent Warbands</h2>
        <NuxtLink to="/roster" class="btn btn-sm ml-4" style="flex-shrink: 0;">
          View All
        </NuxtLink>
      </div>

      <div v-if="warbandStore.loading" class="text-center py-8">
        <Icon name="ph:circle-notch" class="w-6 h-6 animate-spin" style="color: var(--color-ink-light);" />
      </div>

      <div v-else-if="warbandStore.recentWarbands.length === 0" class="text-center py-12">
        <UiCard padding>
          <p style="color: var(--color-ink-light); font-style: italic;">No warbands yet.</p>
          <NuxtLink to="/roster/new" class="btn btn-primary btn-sm mt-4">
            <Icon name="ph:plus" class="w-3.5 h-3.5" />
            Create your first warband
          </NuxtLink>
        </UiCard>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NuxtLink
          v-for="wb in warbandStore.recentWarbands"
          :key="wb.id"
          :to="`/roster/${wb.id}`"
          class="block"
        >
          <UiCard padding hoverable>
            <div class="faction-watermark" :style="`color: ${factionColour(wb.faction)}`">
              {{ factionMon(wb.faction) }}
            </div>
            <div class="relative z-10">
              <div class="flex items-start justify-between mb-2">
                <h3 style="font-family: var(--font-family-heading); font-size: 1rem; color: var(--color-ink);">
                  {{ wb.name }}
                </h3>
                <span
                  class="rice-counter"
                  :class="wb.riceSpent > wb.riceLimit ? 'over-limit' : ''"
                  style="font-size: 0.7rem;"
                >
                  {{ wb.riceSpent }}/{{ wb.riceLimit }}
                </span>
              </div>
              <p style="font-size: 0.75rem; color: var(--color-ink-light);">
                {{ factionName(wb.faction) }} · {{ wb.modelCount }} models
              </p>
              <p style="font-size: 0.7rem; color: var(--color-ink-light); margin-top: 0.5rem; font-family: var(--font-family-mono);">
                {{ formatDate(wb.updatedAt) }}
              </p>
            </div>
          </UiCard>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { FACTIONS } from '~/types/unit'
import type { FactionSlug } from '~/types/unit'

const router = useRouter()
const warbandStore = useWarbandStore()

const sessionCode = ref('')

onMounted(() => warbandStore.fetchSummaries())

function joinSession() {
  const code = sessionCode.value.trim().toUpperCase()
  if (code.length === 4) {
    router.push(`/game/${code}`)
  }
}

function factionColour(slug: FactionSlug) {
  return FACTIONS[slug]?.colour ?? '#5a5a5a'
}

function factionMon(slug: FactionSlug) {
  return FACTIONS[slug]?.mon ?? '武'
}

function factionName(slug: FactionSlug) {
  return FACTIONS[slug]?.shortName ?? slug
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
