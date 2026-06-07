import type { Peer } from 'crossws'
import type { GameSession, WsMessage, PlayerState } from '~/types/game'

// In-memory session store — swap to Durable Objects on Cloudflare
const sessions = new Map<string, GameSession>()
const sessionPeers = new Map<string, Map<string, Peer>>() // code → playerId → peer
const SESSION_TTL = 2 * 60 * 60 * 1000 // 2 hours

function broadcast(code: string, msg: WsMessage, excludePlayerId?: string) {
  const peers = sessionPeers.get(code)
  if (!peers) return
  const payload = JSON.stringify(msg)
  for (const [pid, peer] of peers.entries()) {
    if (pid !== excludePlayerId) {
      try { peer.send(payload) } catch {}
    }
  }
}

function sendTo(code: string, playerId: string, msg: WsMessage) {
  const peer = sessionPeers.get(code)?.get(playerId)
  if (peer) {
    try { peer.send(JSON.stringify(msg)) } catch {}
  }
}

export default defineWebSocketHandler({
  open(peer) {
    const url = new URL(peer.request?.url ?? '', 'http://localhost')
    const code = url.pathname.split('/').pop()?.toUpperCase() ?? ''
    const playerId = url.searchParams.get('playerId') ?? peer.id

    if (!code || code.length !== 4) {
      peer.send(JSON.stringify({ type: 'error', message: 'Invalid session code' }))
      peer.close()
      return
    }

    // Store peer
    if (!sessionPeers.has(code)) sessionPeers.set(code, new Map())
    sessionPeers.get(code)!.set(playerId, peer)

    // Attach metadata to peer for close handler
    ;(peer as any)._gameCode = code
    ;(peer as any)._playerId = playerId

    let session = sessions.get(code)

    if (!session) {
      // First player — create session
      session = {
        code,
        phase: 'setup',
        round: 1,
        turn: 1,
        players: [null, null],
        createdAt: new Date().toISOString(),
        hostPlayerId: playerId,
      }
      sessions.set(code, session)
    }

    // Send current state to joining player
    peer.send(JSON.stringify({ type: 'session_state', session }))
  },

  message(peer, message) {
    const code: string = (peer as any)._gameCode
    const playerId: string = (peer as any)._playerId
    const session = sessions.get(code)
    if (!session) return

    let msg: WsMessage
    try {
      msg = JSON.parse(message.text())
    } catch {
      return
    }

    switch (msg.type) {
      case 'player_joined': {
        // Assign to first open slot
        const slot = session.players[0] === null ? 0 : (session.players[1] === null ? 1 : null)
        if (slot === null) {
          peer.send(JSON.stringify({ type: 'error', message: 'Game is full' }))
          return
        }
        const player: PlayerState = { ...msg.player, playerId, connected: true }
        session.players[slot] = player
        session.phase = session.players[0] && session.players[1] ? 'active' : 'setup'

        // Tell everyone
        broadcast(code, { type: 'player_joined', player, slot: slot as 0 | 1 })
        // Send updated full state
        broadcast(code, { type: 'session_state', session })
        break
      }

      case 'wound_change':
      case 'ki_change':
      case 'status_toggle':
      case 'activated_toggle': {
        // Apply to session state
        applyModelChange(session, msg)
        // Broadcast to opponent only (sender already applied optimistically)
        broadcast(code, msg, playerId)
        break
      }

      case 'round_advance': {
        session.round = msg.round
        broadcast(code, msg)
        break
      }

      case 'round_reset_activations': {
        session.players.forEach(p => p?.models.forEach(m => { m.activated = false }))
        broadcast(code, msg)
        break
      }

      case 'game_end': {
        session.phase = 'ended'
        broadcast(code, msg)
        break
      }
    }
  },

  close(peer) {
    const code: string = (peer as any)._gameCode
    const playerId: string = (peer as any)._playerId
    if (!code || !playerId) return

    // Remove peer
    const peers = sessionPeers.get(code)
    if (peers) {
      peers.delete(playerId)
      if (peers.size === 0) {
        sessionPeers.delete(code)
        // Schedule session cleanup
        setTimeout(() => {
          if (!sessionPeers.has(code)) sessions.delete(code)
        }, SESSION_TTL)
      }
    }

    // Mark player disconnected in session
    const session = sessions.get(code)
    if (session) {
      const player = session.players.find(p => p?.playerId === playerId)
      if (player) player.connected = false
      broadcast(code, { type: 'player_disconnected', playerId })
    }
  },

  error(peer, error) {
    console.error('WebSocket error:', error)
  },
})

function applyModelChange(session: GameSession, msg: WsMessage) {
  if (msg.type === 'wound_change') {
    const player = session.players.find(p => p?.playerId === msg.playerId)
    const model = player?.models.find(m => m.id === msg.modelId)
    if (model) model.currentWounds = msg.currentWounds
  } else if (msg.type === 'ki_change') {
    const player = session.players.find(p => p?.playerId === msg.playerId)
    const model = player?.models.find(m => m.id === msg.modelId)
    if (model) model.currentKi = msg.currentKi
  } else if (msg.type === 'status_toggle') {
    const player = session.players.find(p => p?.playerId === msg.playerId)
    const model = player?.models.find(m => m.id === msg.modelId)
    if (model) {
      if (msg.active) { if (!model.statuses.includes(msg.status)) model.statuses.push(msg.status) }
      else model.statuses = model.statuses.filter(s => s !== msg.status)
    }
  } else if (msg.type === 'activated_toggle') {
    const player = session.players.find(p => p?.playerId === msg.playerId)
    const model = player?.models.find(m => m.id === msg.modelId)
    if (model) model.activated = msg.activated
  }
}
