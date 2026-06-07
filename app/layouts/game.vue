<template>
  <div class="min-h-screen flex flex-col" style="background: var(--color-ink);">
    <!-- Minimal game header -->
    <header style="background: rgba(26,18,9,0.9); border-bottom: 1px solid rgba(200,146,42,0.2); padding: 0.5rem 1rem;">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2" style="color: var(--color-gold); font-family: var(--font-family-display); font-size: 1.1rem;">
          武
        </NuxtLink>

        <div class="flex items-center gap-3" style="color: var(--color-parchment); font-family: var(--font-family-mono); font-size: 0.75rem;">
          <slot name="game-info" />
        </div>

        <NuxtLink to="/" class="btn btn-sm" style="border-color: rgba(200,146,42,0.4); color: var(--color-parchment);">
          <Icon name="ph:x" class="w-3.5 h-3.5" />
          Exit
        </NuxtLink>
      </div>
    </header>

    <!-- Game content -->
    <main class="flex-1 overflow-hidden">
      <NuxtPage />
    </main>
  </div>
</template>
