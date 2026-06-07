import type { FactionSlug } from './unit'

export type StatusEffect =
  | 'prone'
  | 'blind'
  | 'burning'
  | 'stunned'
  | 'poisoned'
  | 'slow'
  | 'fast'
  | 'brace'
  | 'webbed'
  | 'fear'
  | 'terrifying'

export const STATUS_EFFECTS: Record<StatusEffect, { label: string; colour: string; icon: string }> = {
  prone:      { label: 'Prone',      colour: '#6b5a1a', icon: 'ph:arrow-down'       },
  blind:      { label: 'Blind',      colour: '#3a3a4a', icon: 'ph:eye-closed'        },
  burning:    { label: 'Burning',    colour: '#8b3a00', icon: 'ph:fire'              },
  stunned:    { label: 'Stunned',    colour: '#4a2a6b', icon: 'ph:star'              },
  poisoned:   { label: 'Poisoned',   colour: '#2a5e3f', icon: 'ph:skull'             },
  slow:       { label: 'Slow',       colour: '#4a4a4a', icon: 'ph:hourglass'         },
  fast:       { label: 'Fast',       colour: '#1a5a5a', icon: 'ph:lightning'         },
  brace:      { label: 'Brace',      colour: '#3d6b3d', icon: 'ph:shield'            },
  webbed:     { label: 'Webbed',     colour: '#5a5a2a', icon: 'ph:x-circle'          },
  fear:       { label: 'Fear',       colour: '#1a2a4a', icon: 'ph:warning'           },
  terrifying: { label: 'Terrifying', colour: '#1a1209', icon: 'ph:ghost'             },
}

export interface ModelState {
  id: string
  unitId: string
  name: string
  maxWounds: number
  currentWounds: number
  maxKi: number
  currentKi: number
  statuses: StatusEffect[]
  activated: boolean
  dead: boolean
}

export interface PlayerState {
  playerId: string
  playerName: string
  faction: FactionSlug
  warbandId: string
  models: ModelState[]
  connected: boolean
}

export type GamePhase = 'setup' | 'active' | 'ended'

export interface GameSession {
  code: string
  phase: GamePhase
  round: number
  turn: number // 1 or 2 (within round)
  players: [PlayerState | null, PlayerState | null]
  createdAt: string
  hostPlayerId: string
}

// WebSocket message types
export type WsMessage =
  | { type: 'session_state'; session: GameSession }
  | { type: 'player_joined'; player: PlayerState; slot: 0 | 1 }
  | { type: 'wound_change'; playerId: string; modelId: string; currentWounds: number }
  | { type: 'ki_change'; playerId: string; modelId: string; currentKi: number }
  | { type: 'status_toggle'; playerId: string; modelId: string; status: StatusEffect; active: boolean }
  | { type: 'activated_toggle'; playerId: string; modelId: string; activated: boolean }
  | { type: 'round_advance'; round: number }
  | { type: 'round_reset_activations' }
  | { type: 'game_end'; winnerId: string }
  | { type: 'player_disconnected'; playerId: string }
  | { type: 'error'; message: string }
