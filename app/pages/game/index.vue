<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="heading-ruled mb-8" style="font-size: 1.25rem;">Start a Game</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
      <!-- Create new session -->
      <UiCard padding>
        <h2 class="heading-ruled mb-4" style="font-size: 0.875rem;">Host a Game</h2>
        <p style="font-size: 0.8rem; color: var(--color-ink-faded); margin-bottom: 1rem; line-height: 1.6;">
          Create a new game session and share the code with your opponent.
        </p>

        <!-- Pick warband -->
        <div class="mb-4">
          <label class="field-label">Your Warband</label>
          <select
            v-model="selectedWarbandId"
            class="field-input"
            style="cursor: pointer;"
          >
            <option value="">Select a warband...</option>
            <option v-for="wb in warbandStore.summaries" :key="wb.id" :value="wb.id">
              {{ wb.name }} ({{ wb.riceSpent }}R, {{ wb.modelCount }} models)
            </option>
          </select>
        </div>

        <button
          class="btn btn-primary w-full"
          :disabled="!selectedWarbandId || creating"
          @click="createSession"
        >
          <Icon v-if="creating" name="ph:circle-notch" class="w-4 h-4 animate-spin" />
          <Icon v-else name="ph:sword" class="w-4 h-4" />
          Create Session
        </button>
      </UiCard>

      <!-- Join existing session -->
      <UiCard padding>
        <h2 class="heading-ruled mb-4" style="font-size: 0.875rem;">Join a Game</h2>
        <p style="font-size: 0.8rem; color: var(--color-ink-faded); margin-bottom: 1rem; line-height: 1.6;">
          Enter the 4-character code your opponent shared with you.
        </p>

        <div class="mb-4">
          <label class="field-label">Session Code</label>
          <input
            v-model="joinCode"
            type="text"
            placeholder="e.g. KA3X"
            maxlength="4"
            class="field-input text-center tracking-widest uppercase"
            style="font-size: 1.25rem; letter-spacing: 0.3em;"
            @keyup.enter="joinSession"
          />
        </div>

        <div class="mb-4">
          <label class="field-label">Your Warband</label>
          <select v-model="joinWarbandId" class="field-input" style="cursor: pointer;">
            <option value="">Select a warband...</option>
            <option v-for="wb in warbandStore.summaries" :key="wb.id" :value="wb.id">
              {{ wb.name }} ({{ wb.riceSpent }}R, {{ wb.modelCount }} models)
            </option>
          </select>
        </div>

        <button
          class="btn w-full"
          :disabled="joinCode.length !== 4 || !joinWarbandId"
          @click="joinSession"
        >
          <Icon name="ph:sign-in" class="w-4 h-4" />
          Join Session
        </button>
      </UiCard>
    </div>

    <!-- No warbands warning -->
    <div v-if="warbandStore.summaries.length === 0" class="text-center">
      <UiCard padding>
        <p style="color: var(--color-ink-light); font-size: 0.875rem; font-style: italic; margin-bottom: 1rem;">
          You'll need a warband before you can play.
        </p>
        <NuxtLink to="/roster/new" class="btn btn-primary btn-sm">
          <Icon name="ph:plus" class="w-3.5 h-3.5" />
          Create a Warband
        </NuxtLink>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const warbandStore = useWarbandStore()

const selectedWarbandId = ref(route.query.warband as string ?? '')
const joinWarbandId = ref('')
const joinCode = ref('')
const creating = ref(false)

onMounted(() => warbandStore.fetchSummaries())

async function createSession() {
  if (!selectedWarbandId.value) return
  creating.value = true
  try {
    const { code, playerId } = await $fetch<{ code: string; playerId: string }>('/api/game/sessions', {
      method: 'POST',
      body: { warbandId: selectedWarbandId.value },
    })
    // Store our player ID for this session
    sessionStorage.setItem(`game-player-${code}`, playerId)
    sessionStorage.setItem(`game-warband-${code}`, selectedWarbandId.value)
    router.push(`/game/${code}`)
  } finally {
    creating.value = false
  }
}

function joinSession() {
  const code = joinCode.value.trim().toUpperCase()
  if (code.length !== 4 || !joinWarbandId.value) return
  sessionStorage.setItem(`game-warband-${code}`, joinWarbandId.value)
  router.push(`/game/${code}`)
}
</script>
