import type { Unit, FactionSlug } from '~/types/unit'
import { FACTIONS } from '~/types/unit'

// Lazy-loaded faction data cache
const factionCache = new Map<string, Unit[]>()
const indexCache = ref<any[] | null>(null)

export function useUnits() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getIndex() {
    if (indexCache.value) return indexCache.value
    loading.value = true
    try {
      const data = await $fetch<any[]>('/api/units/index')
      indexCache.value = data
      return data
    } catch (e: any) {
      error.value = e.message
      return []
    } finally {
      loading.value = false
    }
  }

  async function getFactionUnits(faction: FactionSlug): Promise<Unit[]> {
    if (factionCache.has(faction)) return factionCache.get(faction)!
    loading.value = true
    try {
      const data = await $fetch<Unit[]>(`/api/units/${faction}`)
      factionCache.set(faction, data)
      return data
    } catch (e: any) {
      error.value = e.message
      return []
    } finally {
      loading.value = false
    }
  }

  async function getUnit(faction: FactionSlug, unitSlug: string): Promise<Unit | null> {
    const units = await getFactionUnits(faction)
    return units.find(u => u.id === `${faction}/${unitSlug}`) ?? null
  }

  const allFactions = Object.values(FACTIONS)

  return {
    loading,
    error,
    allFactions,
    getIndex,
    getFactionUnits,
    getUnit,
  }
}
