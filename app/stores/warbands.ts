import { defineStore } from 'pinia'
import type { Warband, WarbandSummary } from '~/types/warband'
import type { FactionSlug } from '~/types/unit'
import { warbandRiceSpent } from '~/types/warband'

export const useWarbandStore = defineStore('warbands', () => {
  const summaries = ref<WarbandSummary[]>([])
  const current = ref<Warband | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSummaries() {
    loading.value = true
    error.value = null
    try {
      summaries.value = await $fetch<WarbandSummary[]>('/api/warbands')
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchWarband(id: string) {
    loading.value = true
    error.value = null
    try {
      current.value = await $fetch<Warband>(`/api/warbands/${id}`)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function createWarband(faction: FactionSlug, name: string, riceLimit: number = 35) {
    const warband = await $fetch<Warband>('/api/warbands', {
      method: 'POST',
      body: { faction, name, riceLimit },
    })
    await fetchSummaries()
    return warband
  }

  async function saveWarband(warband: Warband) {
    const saved = await $fetch<Warband>(`/api/warbands/${warband.id}`, {
      method: 'PUT',
      body: warband,
    })
    current.value = saved
    await fetchSummaries()
    return saved
  }

  async function deleteWarband(id: string) {
    await $fetch(`/api/warbands/${id}`, { method: 'DELETE' })
    if (current.value?.id === id) current.value = null
    await fetchSummaries()
  }

  const riceSpent = computed(() =>
    current.value ? warbandRiceSpent(current.value) : 0,
  )

  const riceRemaining = computed(() =>
    current.value ? current.value.riceLimit - riceSpent.value : 0,
  )

  const isOverLimit = computed(() => riceRemaining.value < 0)

  const recentWarbands = computed(() =>
    [...summaries.value]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3),
  )

  return {
    summaries,
    current,
    loading,
    error,
    riceSpent,
    riceRemaining,
    isOverLimit,
    recentWarbands,
    fetchSummaries,
    fetchWarband,
    createWarband,
    saveWarband,
    deleteWarband,
  }
})
