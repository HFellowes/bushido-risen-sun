<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top navigation -->
    <header class="sticky top-0 z-50" style="background: var(--color-parchment); border-bottom: 1px solid var(--color-parchment-deep); box-shadow: 0 1px 4px rgba(26,18,9,0.1);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background: var(--color-ink);">
              <span style="font-family: var(--font-family-display); color: var(--color-gold); font-size: 1rem; line-height: 1;">武</span>
            </div>
            <span class="hidden sm:block" style="font-family: var(--font-family-heading); font-variant: small-caps; letter-spacing: 0.05em; font-size: 1.1rem; color: var(--color-ink);">
              Bushido: Risen Sun
            </span>
          </NuxtLink>

          <!-- Nav links -->
          <nav class="flex items-center gap-1">
            <NuxtLink to="/cards" class="nav-link" :class="{ active: route.path.startsWith('/cards') }">
              Cards
            </NuxtLink>
            <NuxtLink to="/roster" class="nav-link" :class="{ active: route.path.startsWith('/roster') }">
              Warbands
            </NuxtLink>
            <NuxtLink to="/rules" class="nav-link" :class="{ active: route.path.startsWith('/rules') }">
              Rules
            </NuxtLink>
            <div style="width: 1px; height: 20px; background: var(--color-parchment-deep); margin: 0 0.25rem;" />
            <NuxtLink to="/game" class="btn btn-primary btn-sm">
              <Icon name="ph:sword" class="w-3.5 h-3.5" />
              Play
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer style="border-top: 1px solid var(--color-parchment-deep); padding: 1rem 0; text-align: center;">
      <p style="font-size: 0.75rem; color: var(--color-ink-light); font-family: var(--font-family-mono);">
        Bushido &amp; all game content © GCT Studios. This is an unofficial companion app.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
