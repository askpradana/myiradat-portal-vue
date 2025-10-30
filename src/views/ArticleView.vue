<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderSection />

    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="animate-pulse">
        <div class="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div class="h-12 bg-muted rounded w-3/4 mb-6"></div>
        <div class="flex items-center space-x-4 mb-8">
          <div class="w-12 h-12 bg-muted rounded-full"></div>
          <div class="space-y-2">
            <div class="h-4 bg-muted rounded w-32"></div>
            <div class="h-3 bg-muted rounded w-24"></div>
          </div>
        </div>
        <div class="h-64 bg-muted rounded mb-8"></div>
        <div class="space-y-4">
          <div class="h-4 bg-muted rounded"></div>
          <div class="h-4 bg-muted rounded w-5/6"></div>
          <div class="h-4 bg-muted rounded w-4/5"></div>
          <div class="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 class="text-3xl font-bold mb-4">Article Not Found</h1>
      <p class="text-muted-foreground mb-8">{{ error }}</p>
      <div class="space-x-4">
        <Button @click="router.push('/articles')" variant="outline">
          Back to Articles
        </Button>
        <Button @click="loadArticle" variant="default">
          Try Again
        </Button>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else-if="article" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <div class="flex items-center space-x-2 text-sm text-muted-foreground">
          <button @click="router.push('/articles')" class="hover:text-primary transition-colors">
            Articles
          </button>
          <span>•</span>
          <span class="text-primary">{{ article.title }}</span>
        </div>
      </nav>

      <!-- Article Header -->
      <header class="mb-12">
        <!-- Category Badge -->
        <div class="mb-4">
          <Badge variant="secondary">{{ article.primary_tag?.name || 'Article' }}</Badge>
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
          {{ article.title }}
        </h1>

        <!-- Meta Information -->
        <div class="flex items-center space-x-6 text-muted-foreground mb-8">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User class="w-6 h-6 text-primary" />
            </div>
            <div>
              <p class="font-medium">{{ article.primary_author.name }}</p>
              <p class="text-sm">{{ formatDate(article.published_at || article.created_at) }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <Clock class="w-4 h-4" />
            <span class="text-sm">{{ article.reading_time }} min read</span>
          </div>
        </div>

        <!-- Featured Image -->
        <div v-if="article.feature_image" class="mb-12">
          <img
            :src="article.feature_image"
            :alt="article.title"
            class="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>
      </header>

      <!-- Article Content -->
      <div class="prose prose-lg max-w-none">
        <div v-html="article.html" class="article-content"></div>
      </div>

      <!-- Article Footer -->
      <footer class="mt-16 pt-8 border-t border-border">
        <!-- Tags -->
        <div v-if="article.tags && article.tags.length > 0" class="mb-8">
          <h3 class="text-lg font-semibold mb-4">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="tag in article.tags" :key="tag.id" variant="outline">
              {{ tag.name }}
            </Badge>
          </div>
        </div>

        <!-- Author Info -->
        <div class="bg-card rounded-2xl p-6">
          <div class="flex items-start space-x-4">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User class="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">{{ article.primary_author.name }}</h3>
              <p v-if="article.primary_author.bio" class="text-muted-foreground mb-4">
                {{ article.primary_author.bio }}
              </p>
              <div v-if="article.primary_author.website" class="flex items-center space-x-2">
                <ExternalLink class="w-4 h-4 text-muted-foreground" />
                <a
                  :href="article.primary_author.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline"
                >
                  Visit Website
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Back to Articles -->
        <div class="mt-12 text-center">
          <Button @click="router.push('/articles')" variant="outline" size="lg">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </div>
      </footer>
    </article>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Clock,
  ArrowLeft,
  ExternalLink
} from 'lucide-vue-next'
import HeaderSection from '@/views/home/components/sections/HeaderSection.vue'
import FooterSection from '@/views/home/components/sections/FooterSection.vue'
import { ghostApi } from '@/api/articles/ghostApi'
import type { GhostPost } from '@/types/articles'

const route = useRoute()
const router = useRouter()

const article = ref<GhostPost | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadArticle = async () => {
  const slug = route.params.slug as string

  if (!slug) {
    error.value = 'Article slug is required'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null

    const fetchedArticle = await ghostApi.getPostBySlug(slug)

    if (fetchedArticle) {
      article.value = fetchedArticle
    } else {
      error.value = 'Article not found'
    }
  } catch (err) {
    error.value = 'Failed to load article. Please try again later.'
    console.error('Error loading article:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.article-content :deep(h1) {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.article-content :deep(h2) {
  font-size: 1.5rem;
  line-height: 2rem;
}

.article-content :deep(h3) {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.article-content :deep(p) {
  color: oklch(var(--muted-foreground));
  line-height: 1.625;
  margin-bottom: 1rem;
}

.article-content :deep(a) {
  color: oklch(var(--primary));
}

.article-content :deep(a:hover) {
  text-decoration-line: underline;
}

.article-content :deep(blockquote) {
  border-left-width: 4px;
  border-left-color: oklch(var(--primary));
  padding-left: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: oklch(var(--card));
  border-radius: 0 0.5rem 0.5rem 0;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.article-content :deep(ul) > :deep(li),
.article-content :deep(ol) > :deep(li) {
  margin-top: 0.5rem;
}

.article-content :deep(li) {
  color: oklch(var(--muted-foreground));
}

.article-content :deep(code) {
  background-color: oklch(var(--card));
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.article-content :deep(pre) {
  background-color: oklch(var(--card));
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.article-content :deep(img) {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  max-width: 100%;
  height: auto;
}

.article-content :deep(hr) {
  border-color: oklch(var(--border));
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  border-width: 1px;
  border-color: oklch(var(--border));
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.article-content :deep(th),
.article-content :deep(td) {
  border-width: 1px;
  border-color: oklch(var(--border));
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: left;
}

.article-content :deep(th) {
  background-color: oklch(var(--card));
  font-weight: 600;
}

.article-content :deep(td) {
  color: oklch(var(--muted-foreground));
}
</style>