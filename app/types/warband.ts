import type { FactionSlug } from './unit'

export interface WarbandSlot {
  id: string
  unitId: string
  unitName: string
  riceCost: number
  // Per-slot overrides (e.g. upgrades applied)
  upgrades: string[]
}

export interface Warband {
  id: string
  name: string
  faction: FactionSlug
  riceLimit: number
  slots: WarbandSlot[]
  notes: string
  createdAt: string
  updatedAt: string
}

export interface WarbandSummary {
  id: string
  name: string
  faction: FactionSlug
  riceSpent: number
  riceLimit: number
  modelCount: number
  updatedAt: string
}

export function warbandRiceSpent(warband: Warband): number {
  return warband.slots.reduce((sum, slot) => sum + slot.riceCost, 0)
}

export function warbandIsValid(warband: Warband): boolean {
  return warbandRiceSpent(warband) <= warband.riceLimit
}
