<template>
  <div>
    <!-- Setup phase: warband select + code share -->
    <div v-if="!gameStore.session || gameStore.session.phase === 'setup'" class="max-w-xl mx-auto p-8">
      <div class="text-center mb-8">
        <p style="font-family: var(--font-family-mono); font-size: 0.7rem; color: rgba(200,146,42,0.6); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.5rem;">
          Session Code
        </p>
        <div style="font-family: var(--font-family-display); font-size: 4rem; color: var(--color-gold); letter-spacing: 0.3em; line-height: 1;">
          {{ code }}
        </div>
        <p style="font-size: 0.75rem; color: rgba(244,234,213,0.5); margin-top: 0.5rem; font-family: var(--font-family-mono);">
          Share this code with your opponent
        </p>
      </div>

      <!-- Connection status -->
      <div class="space-y-3 mb-8">
        <div
          v-for="(player, i) in gameStore.session?.players ?? [null, null]"
          :key="i"
          class="flex items-center gap-3 px-4 py-3"
          style="border: 1px solid rgba(200,146,42,0.2); border-radius: 1px;"
        >
          <div
            class="w-2.5 h-2.5 rounded-full"
            :style="player ? 'background: #4ade80;' : 'background: rgba(244,234,213,0.2);'"
          />
          <span style="font-family: var(--font-family-mono); font-size: 0.8rem; color: var(--color-parchment);">
            {{ player ? `${player.playerName} (${FACTIONS[player.faction]?.shortName ?? player.faction})` : `Waiting for Player ${i + 1}...` }}
          </span>
          <span v-if="player?.playerId === gameStore.myPlayerId" style="font-size: 0.65rem; color: rgba(200,146,42,0.6); font-family: var(--font-family-mono); margin-left: auto;">
            You
          </span>
        </div>
      </div>

      <!-- Join with warband if not yet joined -->
      <div v-if="!hasJoined">
        <label class="field-label" style="color: rgba(244,234,213,0.5);">Choose your warband to join</label>
        <select
          v-model="pendingWarbandId"
          class="field-input mb-4"
          style="background: rgba(244,234,213,0.1); border-color: rgba(200,146,42,0.3); color: var(--color-parchment);"
        >
          <option value="" style="color: var(--color-ink);">Select...</option>
          <option
            v-for="wb in warbandStore.summaries"
            :key="wb.id"
            :value="wb.id"
            style="color: var(--color-ink);"
          >
            {{ wb.name }}
          </option>
        </select>
        <button
          class="btn w-full"
          style="border-color: var(--color-gold); color: var(--color-gold);"
          :disabled="!pendingWarbandId || joining"
          @click="joinAsPlayer"
        >
          <Icon v-if="joining" name="ph:circle-notch" class="w-4 h-4 animate-spin" />
          Join Game
        </button>
      </div>
    </div>

    <!-- Active game tracker -->
    <div v-else-if="gameStore.session.phase === 'active'" class="h-screen flex flex-col" style="background: #0f0c07;">
      <!-- Game bar -->
      <div class="flex items-center justify-between px-4 py-2" style="background: rgba(26,18,9,0.95); border-bottom: 1px solid rgba(200,146,42,0.15);">
        <div style="font-family: var(--font-family-mono); font-size: 0.75rem; color: var(--color-parchment);">
          Round <span style="color: var(--color-gold); font-size: 1rem; font-weight: 700;">{{ gameStore.session.round }}</span>
        </div>
        <div style="font-family: var(--font-family-display); font-size: 1rem; color: rgba(200,146,42,0.4);">武</div>
        <button class="btn btn-sm" style="border-color: rgba(200,146,42,0.3); color: var(--color-parchment-dark); font-size: 0.65rem;" @click="gameStore.advanceRound()">
          Next Round →
        </button>
      </div>

      <!-- Two-player panels -->
      <div class="flex-1 grid grid-cols-2 gap-0 overflow-hidden">
        <!-- My warband -->
        <div class="overflow-y-auto p-3" style="border-right: 1px solid rgba(200,146,42,0.1);">
          <div class="flex items-center gap-2 mb-3">
            <span style="font-size: 0.65rem; color: var(--color-gold); font-family: var(--font-family-mono); letter-spacing: 0.1em; text-transform: uppercase;">Your Forces</span>
            <div
              class="w-2 h-2 rounded-full"
              :style="gameStore.wsConnected ? 'background: #4ade80;' : 'background: #f87171;'"
            />
          </div>
          <div v-if="gameStore.myPlayer" class="space-y-2">
            <GameModelToken
              v-for="model in gameStore.myPlayer.models"
              :key="model.id"
              :model="model"
              :editable="true"
              @wound="(v) => gameStore.setWound(model.id, v)"
              @ki="(v) => gameStore.setKi(model.id, v)"
              @status="(s) => gameStore.toggleStatus(model.id, s)"
              @activated="() => gameStore.toggleActivated(model.id)"
            />
          </div>
        </div>

        <!-- Opponent warband (read-only) -->
        <div class="overflow-y-auto p-3">
          <div class="flex items-center gap-2 mb-3">
            <span style="font-size: 0.65rem; color: rgba(200,146,42,0.5); font-family: var(--font-family-mono); letter-spacing: 0.1em; text-transform: uppercase;">Opponent</span>
            <div
              class="w-2 h-2 rounded-full"
              :style="gameStore.opponentPlayer?.connected ? 'background: #4ade80;' : 'background: rgba(244,234,213,0.2);'"
            />
          </div>
          <div v-if="gameStore.opponentPlayer" class="space-y-2">
            <GameModelToken
              v-for="model in gameStore.opponentPlayer.models"
              :key="model.id"
              :model="model"
              :editable="false"
            />
          </div>
          <div v-else class="text-center py-8">
            <p style="font-size: 0.75rem; color: rgba(244,234,213,0.3); font-family: var(--font-family-mono);">
              Waiting for opponent...
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Game ended -->
    <div v-else class="max-w-xl mx-auto p-8 text-center">
      <h2 style="font-family: var(--font-family-display); font-size: 2rem; color: var(--color-gold);">Game Over</h2>
      <NuxtLink to="/" class="btn mt-6 inline-flex" style="border-color: var(--color-gold); color: var(--color-gold);">
        Return Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FACTIONS } from '~/types/unit'
import type { FactionSlug } from '~/types/unit'
import type { ModelState } from '~/types/game'

definePageMeta({ layout: 'game' })

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const warbandStore = useWarbandStore()

const code = (route.params.code as string).toUpperCase()
const pendingWarbandId = ref('')
const joining = ref(false)
const hasJoined = ref(false)

// Retrieve or generate player ID for this session
const myPlayerId = sessionStorage.getItem(`game-player-${code}`) ?? crypto.randomUUID()
sessionStorage.setItem(`game-player-${code}`, myPlayerId)

const savedWarbandId = sessionStorage.getItem(`game-warband-${code}`) ?? ''
pendingWarbandId.value = savedWarbandId

onMounted(async () => {
  await warbandStore.fetchSummaries()
  gameStore.connect(code, myPlayerId)
})

onUnmounted(() => {
  gameStore.disconnect()
})

async function joinAsPlayer() {
  if (!pendingWarbandId.value) return
  joining.value = true

  try {
    // Load the warband to get model data
    await warbandStore.fetchWarband(pendingWarbandId.value)
    const warband = warbandStore.current
    if (!warband) return

    const wbSummary = warbandStore.summaries.find(s => s.id === pendingWarbandId.value)

    // Build model states from warband slots
    const models: ModelState[] = warband.slots.map(slot => {
      // We'd ideally fetch full unit stats here; using defaults for now
      return {
        id: crypto.randomUUID(),
        unitId: slot.unitId,
        name: slot.unitName,
        maxWounds: 3,
        currentWounds: 3,
        maxKi: 3,
        currentKi: 3,
        statuses: [],
        activated: false,
        dead: false,
      }
    })

    const playerState = {
      playerId: myPlayerId,
      playerName: 'Player',
      faction: warband.faction as FactionSlug,
      warbandId: pendingWarbandId.value,
      models,
      connected: true,
    }

    gameStore.send({ type: 'player_joined', player: playerState, slot: 0 })
    hasJoined.value = true
  } finally {
    joining.value = false
  }
}
</script>
