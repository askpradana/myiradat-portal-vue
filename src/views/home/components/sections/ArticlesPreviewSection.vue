<template>
  <section id="articles-preview" class="py-20 bg-card/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between gap-4 mb-10">
        <div>
          <p class="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Insights</p>
          <h2 class="text-3xl md:text-4xl font-bold text-foreground mt-2">Artikel Terbaru</h2>
        </div>
        <router-link
          to="/articles"
          class="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Lihat Semua
        </router-link>
      </div>

      <div v-if="featuredArticle" class="mb-8">
        <article
          class="rounded-2xl border border-border/70 bg-background overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="grid lg:grid-cols-[1.25fr_1fr]">
            <div v-if="featuredArticle.featuredImage" class="h-56 lg:h-full overflow-hidden">
              <img
                :src="featuredArticle.featuredImage"
                :alt="featuredArticle.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div v-else class="h-56 lg:h-full bg-primary/10" />

            <div class="p-6 md:p-8">
              <div class="flex items-center gap-2 mb-3">
                <Badge variant="secondary">Highlighted</Badge>
                <Badge variant="outline">{{ featuredArticle.category }}</Badge>
              </div>
              <h3 class="text-2xl font-semibold text-foreground mb-3">
                {{ featuredArticle.title }}
              </h3>
              <p class="text-muted-foreground mb-5 line-clamp-3">
                {{ featuredArticle.excerpt }}
              </p>
              <div class="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                <span>{{ formatDate(featuredArticle.publishedAt) }}</span>
                <span>{{ featuredArticle.readTime }}</span>
              </div>
              <Button @click="goToArticle(featuredArticle.slug)">Baca Artikel</Button>
            </div>
          </div>
        </article>
      </div>

      <div v-if="latestArticles.length > 0" class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <article
          v-for="article in latestArticles"
          :key="article.id"
          class="rounded-xl border border-border/70 bg-background p-5 hover:shadow-sm transition-shadow"
        >
          <div class="flex items-center justify-between gap-2 mb-3">
            <Badge variant="outline" class="max-w-[70%] truncate">{{ article.category }}</Badge>
            <span class="text-xs text-muted-foreground">{{ article.readTime }}</span>
          </div>
          <h4 class="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {{ article.title }}
          </h4>
          <p class="text-sm text-muted-foreground mb-4 line-clamp-3">
            {{ article.excerpt }}
          </p>
          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <span>{{ formatDate(article.publishedAt) }}</span>
            <button
              type="button"
              class="text-primary font-medium hover:text-primary/80"
              @click="goToArticle(article.slug)"
            >
              Detail
            </button>
          </div>
        </article>
      </div>

      <div
        v-else-if="!loading"
        class="rounded-xl border border-dashed border-border p-8 text-center"
      >
        <p class="text-muted-foreground">Belum ada artikel untuk ditampilkan.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ghostApi } from '@/api/articles/ghostApi'
import type { ArticleCardData } from '@/types/articles'

const router = useRouter()

const featuredArticle = ref<ArticleCardData | null>(null)
const latestArticles = ref<ArticleCardData[]>([])
const loading = ref(true)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const goToArticle = (slug: string) => {
  router.push(`/articles/${slug}`)
}

const loadArticlesPreview = async () => {
  loading.value = true

  try {
    const [featuredPosts, latestPostsResponse] = await Promise.all([
      ghostApi.getFeaturedPosts(1),
      ghostApi.getPosts({
        limit: 6,
        filter: 'visibility:public',
      }),
    ])

    featuredArticle.value = featuredPosts[0]
      ? ghostApi.transformToArticleCard(featuredPosts[0])
      : null

    const latest = (latestPostsResponse?.posts || []).map((post) =>
      ghostApi.transformToArticleCard(post),
    )

    latestArticles.value = latest
      .filter((article) => article.id !== featuredArticle.value?.id)
      .slice(0, 6)

    if (!featuredArticle.value && latest.length > 0) {
      featuredArticle.value = latest[0]
      latestArticles.value = latest.slice(1, 6)
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadArticlesPreview)
</script>
