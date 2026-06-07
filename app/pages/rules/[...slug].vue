<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <NuxtLink to="/rules" class="btn btn-sm mb-6 inline-flex">
      <Icon name="ph:arrow-left" class="w-3.5 h-3.5" />
      Rules Index
    </NuxtLink>

    <div v-if="loading" class="text-center py-24">
      <Icon name="ph:circle-notch" class="w-6 h-6 animate-spin" style="color: var(--color-ink-light);" />
    </div>

    <div v-else-if="!page" class="text-center py-16">
      <UiCard padding>
        <p style="color: var(--color-ink-light); font-style: italic;">Rule page not found.</p>
      </UiCard>
    </div>

    <div v-else>
      <UiCard padding>
        <h1 class="heading-ruled mb-6" style="font-size: 1.5rem;">{{ page.title }}</h1>
        <div class="prose-bushido" v-html="renderedContent" />
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug

const loading = ref(true)
const page = ref<{ title: string; content: string } | null>(null)

// Very basic markdown → HTML renderer (no extra deps)
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hH\d]|<ul|<li)(.+)$/gm, '<p>$1</p>')
}

const renderedContent = computed(() =>
  page.value ? renderMarkdown(page.value.content) : '',
)

onMounted(async () => {
  try {
    page.value = await $fetch<any>(`/api/rules/${slug}`)
  } catch {
    page.value = null
  } finally {
    loading.value = false
  }
})

useHead({
  title: computed(() => page.value ? `${page.value.title} — Bushido Rules` : 'Rules'),
})
</script>
