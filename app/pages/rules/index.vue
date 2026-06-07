<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="heading-ruled mb-6" style="font-size: 1.25rem;">Rules Reference</h1>

    <!-- Search -->
    <div class="mb-8 max-w-xl">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search rules..."
        class="field-input"
        style="font-size: 0.9rem;"
        @input="doSearch"
      />
    </div>

    <!-- Search results -->
    <div v-if="searchQuery.trim() && searchResults.length > 0" class="mb-10">
      <h2 class="heading-ruled mb-4" style="font-size: 0.875rem;">
        Results ({{ searchResults.length }})
      </h2>
      <div class="space-y-2">
        <NuxtLink
          v-for="result in searchResults"
          :key="result.item.slug"
          :to="`/rules/${result.item.slug}`"
          class="block"
        >
          <UiCard padding hoverable>
            <h3 style="font-family: var(--font-family-heading); font-size: 0.95rem; color: var(--color-ink);">{{ result.item.title }}</h3>
            <p style="font-size: 0.75rem; color: var(--color-ink-light); font-family: var(--font-family-mono); margin-top: 0.25rem;">{{ result.item.slug }}</p>
          </UiCard>
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="searchQuery.trim() && searchResults.length === 0" class="mb-10">
      <p style="color: var(--color-ink-light); font-style: italic; font-size: 0.875rem;">No rules matching "{{ searchQuery }}".</p>
    </div>

    <!-- Chapter index -->
    <div v-if="!searchQuery.trim()">
      <div v-if="loading" class="text-center py-16">
        <Icon name="ph:circle-notch" class="w-6 h-6 animate-spin" style="color: var(--color-ink-light);" />
      </div>

      <div v-else-if="!rulesIndex.length" class="text-center py-12">
        <UiCard padding>
          <p style="color: var(--color-ink-light); font-style: italic; margin-bottom: 1rem; font-size: 0.875rem;">
            Rules data not loaded. Run <code style="font-family: var(--font-family-mono); background: var(--color-parchment-dark); padding: 0.1rem 0.35rem; border-radius: 1px;">npm run fetch-data</code> to import from JwarRef.
          </p>
          <a href="https://gctstudios.com/pages/rules-resources" target="_blank" class="btn btn-sm">
            <Icon name="ph:arrow-square-out" class="w-3.5 h-3.5" />
            Official Rules PDF
          </a>
        </UiCard>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="chapter in rulesIndex" :key="chapter.slug">
          <UiCard padding>
            <h2 class="heading-ruled mb-4" style="font-size: 0.875rem;">{{ chapter.title }}</h2>
            <ul class="space-y-1">
              <li v-for="page in chapter.children" :key="page.slug">
                <NuxtLink
                  :to="`/rules/${page.slug}`"
                  style="font-size: 0.8rem; color: var(--color-red-seal); display: block; padding: 0.2rem 0;"
                >
                  {{ page.title }}
                </NuxtLink>
              </li>
            </ul>
          </UiCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Fuse from 'fuse.js'

const loading = ref(true)
const rulesIndex = ref<any[]>([])
const searchQuery = ref('')
const searchResults = ref<any[]>([])
let fuse: Fuse<any> | null = null

onMounted(async () => {
  try {
    rulesIndex.value = await $fetch<any[]>('/api/rules/index')
    // Flatten all pages for search
    const allPages = rulesIndex.value.flatMap(ch => ch.children)
    fuse = new Fuse(allPages, {
      keys: ['title', 'slug'],
      threshold: 0.35,
    })
  } catch {
    // No rules data yet
  } finally {
    loading.value = false
  }
})

function doSearch() {
  if (!fuse || !searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  searchResults.value = fuse.search(searchQuery.value)
}
</script>
