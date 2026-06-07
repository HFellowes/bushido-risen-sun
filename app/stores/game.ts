import { defineStore } from 'pinia'
import type { GameSession, ModelState, StatusEffect, WsMessage } from '~/types/game'

export const useGameStore = defineStore('game', () => {
  const session = ref<GameSession | null>(null)
  const myPlayerId = ref<string | null>(null)
  const mySlot = ref<0 | 1 | null>(null)
  const wsConnected = ref(false)
  const error = ref<string | null>(null)

  let ws: WebSocket | null = null

  function connect(code: string, playerId: string) {
    myPlayerId.value = playerId
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    ws = new WebSocket(`${protocol}//${window.location.host}/_ws/game/${code}?playerId=${playerId}`)

    ws.onopen = () => { wsConnected.value = true }

    ws.onmessage = (event) => {
      const msg: WsMessage = JSON.parse(event.data)
      handleMessage(msg)
    }

    ws.onclose = () => {
      wsConnected.value = false
    }

    ws.onerror = () => {
      error.value = 'WebSocket connection failed'
      wsConnected.value = false
    }
  }

  function disconnect() {
    ws?.close()
    ws = null
    session.value = null
    myPlayerId.value = null
    mySlot.value = null
    wsConnected.value = false
  }

  function send(msg: WsMessage) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg))
    }
  }

  function handleMessage(msg: WsMessage) {
    switch (msg.type) {
      case 'session_state':
        session.value = msg.session
        // Determine my slot
        if (myPlayerId.value) {
          const idx = msg.session.players.findIndex(p => p?.playerId === myPlayerId.value)
          if (idx !== -1) mySlot.value = idx as 0 | 1
        }
        break

      case 'player_joined':
        if (session.value) {
          session.value.players[msg.slot] = msg.player
        }
        break

      case 'wound_change':
        updateModel(msg.playerId, msg.modelId, m => { m.currentWounds = msg.currentWounds })
        break

      case 'ki_change':
        updateModel(msg.playerId, msg.modelId, m => { m.currentKi = msg.currentKi })
        break

      case 'status_toggle':
        updateModel(msg.playerId, msg.modelId, m => {
          if (msg.active) {
            if (!m.statuses.includes(msg.status)) m.statuses.push(msg.status)
          } else {
            m.statuses = m.statuses.filter(s => s !== msg.status)
          }
        })
        break

      case 'activated_toggle':
        updateModel(msg.playerId, msg.modelId, m => { m.activated = msg.activated })
        break

      case 'round_advance':
        if (session.value) session.value.round = msg.round
        break

      case 'round_reset_activations':
        if (session.value) {
          session.value.players.forEach(player => {
            player?.models.forEach(m => { m.activated = false })
          })
        }
        break

      case 'player_disconnected':
        if (session.value) {
          const player = session.value.players.find(p => p?.playerId === msg.playerId)
          if (player) player.connected = false
        }
        break

      case 'error':
        error.value = msg.message
        break
    }
  }

  function updateModel(playerId: string, modelId: string, updater: (m: ModelState) => void) {
    if (!session.value) return
    const player = session.value.players.find(p => p?.playerId === playerId)
    if (!player) return
    const model = player.models.find(m => m.id === modelId)
    if (model) updater(model)
  }

  // Actions that send + optimistically update
  function setWound(modelId: string, currentWounds: number) {
    if (!myPlayerId.value) return
    updateModel(myPlayerId.value, modelId, m => { m.currentWounds = currentWounds })
    send({ type: 'wound_change', playerId: myPlayerId.value, modelId, currentWounds })
  }

  function setKi(modelId: string, currentKi: number) {
    if (!myPlayerId.value) return
    updateModel(myPlayerId.value, modelId, m => { m.currentKi = currentKi })
    send({ type: 'ki_change', playerId: myPlayerId.value, modelId, currentKi })
  }

  function toggleStatus(modelId: string, status: StatusEffect) {
    if (!myPlayerId.value) return
    const player = session.value?.players.find(p => p?.playerId === myPlayerId.value)
    const model = player?.models.find(m => m.id === modelId)
    if (!model) return
    const active = !model.statuses.includes(status)
    updateModel(myPlayerId.value, modelId, m => {
      if (active) { if (!m.statuses.includes(status)) m.statuses.push(status) }
      else m.statuses = m.statuses.filter(s => s !== status)
    })
    send({ type: 'status_toggle', playerId: myPlayerId.value, modelId, status, active })
  }

  function toggleActivated(modelId: string) {
    if (!myPlayerId.value) return
    const player = session.value?.players.find(p => p?.playerId === myPlayerId.value)
    const model = player?.models.find(m => m.id === modelId)
    if (!model) return
    const activated = !model.activated
    updateModel(myPlayerId.value, modelId, m => { m.activated = activated })
    send({ type: 'activated_toggle', playerId: myPlayerId.value, modelId, activated })
  }

  function advanceRound() {
    if (!session.value) return
    send({ type: 'round_advance', round: session.value.round + 1 })
    send({ type: 'round_reset_activations' })
  }

  const myPlayer = computed(() =>
    mySlot.value !== null ? session.value?.players[mySlot.value] : null,
  )

  const opponentPlayer = computed(() =>
    mySlot.value !== null ? session.value?.players[mySlot.value === 0 ? 1 : 0] : null,
  )

  return {
    session,
    myPlayerId,
    mySlot,
    wsConnected,
    error,
    myPlayer,
    opponentPlayer,
    connect,
    disconnect,
    setWound,
    setKi,
    toggleStatus,
    toggleActivated,
    advanceRound,
  }
})
