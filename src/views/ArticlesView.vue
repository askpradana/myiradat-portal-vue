<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderSection />

    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-background via-card/30 to-background py-20 mt-8"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl sm:text-5xl font-bold text-foreground mb-6">Articles & Insights</h1>
          <p class="text-xl text-muted-foreground">
            Explore the latest insights on psychology, human resources, and organizational
            development
          </p>
        </div>
      </div>
    </section>

    <!-- Featured Article -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-foreground mb-8">Featured Article</h2>

          <!-- Loading state for featured article -->
          <div v-if="loading" class="bg-card rounded-2xl overflow-hidden shadow-lg">
            <div class="grid lg:grid-cols-2 gap-0">
              <div
                class="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center"
              >
                <div class="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <Loader2 class="w-16 h-16 text-primary animate-spin" />
                </div>
              </div>
              <div class="p-8">
                <div class="flex items-center space-x-2 mb-4">
                  <div class="h-6 bg-muted rounded w-20 animate-pulse"></div>
                  <div class="h-4 bg-muted rounded w-16 animate-pulse"></div>
                </div>
                <div class="h-8 bg-muted rounded w-3/4 mb-4 animate-pulse"></div>
                <div class="space-y-2 mb-6">
                  <div class="h-4 bg-muted rounded animate-pulse"></div>
                  <div class="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                </div>
                <div class="h-10 bg-muted rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>

          <!-- Featured article content -->
          <div
            v-else-if="featuredArticle"
            class="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            @click="viewArticle(featuredArticle.slug)"
          >
            <div class="grid lg:grid-cols-2 gap-0">
              <div v-if="featuredArticle.featuredImage" class="lg:h-80">
                <img
                  :src="featuredArticle.featuredImage"
                  :alt="featuredArticle.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center"
              >
                <div class="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <component
                    :is="getCategoryIcon(featuredArticle.category)"
                    class="w-16 h-16 text-primary"
                  />
                </div>
              </div>
              <div class="p-8">
                <div class="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary">{{ featuredArticle.category }}</Badge>
                  <span class="text-sm text-muted-foreground"
                    >• {{ featuredArticle.readTime }}</span
                  >
                </div>
                <h3 class="text-2xl font-bold text-foreground mb-4">
                  {{ featuredArticle.title }}
                </h3>
                <p class="text-muted-foreground mb-6">
                  {{ featuredArticle.excerpt }}
                </p>
                <Button>Read More</Button>
              </div>
            </div>
          </div>

          <!-- No featured article -->
          <div v-else-if="!loading" class="bg-card/50 rounded-2xl p-8 text-center border-2 border-dashed border-border">
            <div class="w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain class="w-16 h-16 text-muted-foreground/50" />
            </div>
            <h3 class="text-xl font-semibold text-muted-foreground mb-2">No Featured Article</h3>
            <p class="text-muted-foreground/70">Check back soon for featured content</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="py-20 bg-card/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl font-bold text-foreground">Latest Articles</h2>
        </div>

        <!-- Loading state for articles grid -->
        <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="bg-background rounded-2xl overflow-hidden shadow-sm">
            <div
              class="bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex items-center justify-center h-48"
            >
              <div class="w-12 h-12 bg-primary/10 rounded-full animate-pulse"></div>
            </div>
            <div class="p-6">
              <div class="flex items-center space-x-2 mb-3">
                <div class="h-6 bg-muted rounded w-20 animate-pulse"></div>
                <div class="h-4 bg-muted rounded w-16 animate-pulse"></div>
              </div>
              <div class="h-6 bg-muted rounded w-3/4 mb-3 animate-pulse"></div>
              <div class="space-y-2 mb-4">
                <div class="h-4 bg-muted rounded animate-pulse"></div>
                <div class="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                <div class="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-muted rounded-full animate-pulse"></div>
                  <div class="h-4 bg-muted rounded w-20 animate-pulse"></div>
                </div>
                <div class="h-8 bg-muted rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-muted-foreground mb-4">{{ error }}</p>
          <Button @click="loadArticles(1)" variant="outline"> Try Again </Button>
        </div>

        <!-- No articles available -->
        <div v-else-if="!loading && articles.length === 0" class="text-center py-16">
          <div class="w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain class="w-16 h-16 text-muted-foreground/50" />
          </div>
          <h3 class="text-2xl font-semibold text-muted-foreground mb-4">No Articles Available</h3>
          <p class="text-muted-foreground mb-6 max-w-md mx-auto">
            We're working on bringing you fresh insights and articles. Check back soon for new content!
          </p>
          <Button @click="loadArticles(1)" variant="outline">
            Refresh
          </Button>
        </div>

        <!-- Articles grid -->
        <div v-else-if="articles.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="article in articles"
            :key="article.id"
            class="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            @click="viewArticle(article.slug)"
          >
            <div v-if="article.featuredImage" class="h-48 overflow-hidden">
              <img
                :src="article.featuredImage"
                :alt="article.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex items-center justify-center h-48"
            >
              <component :is="getCategoryIcon(article.category)" class="w-12 h-12 text-primary" />
            </div>
            <div class="p-6">
              <div class="flex items-center space-x-2 mb-3">
                <Badge :variant="article.category === 'Psychology' ? 'default' : 'secondary'">
                  {{ article.category }}
                </Badge>
                <span class="text-sm text-muted-foreground">• {{ article.readTime }}</span>
              </div>
              <h3 class="text-xl font-semibold text-foreground mb-3">
                {{ article.title }}
              </h3>
              <p class="text-muted-foreground mb-4 line-clamp-3">
                {{ article.excerpt }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <User class="w-3 h-3 text-primary" />
                  </div>
                  <span class="text-sm text-muted-foreground">{{ article.author }}</span>
                </div>
                <Button variant="ghost" size="sm">
                  Read More
                  <ArrowRight class="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </article>
        </div>

        <!-- Load More -->
        <div v-if="!loading && articles.length > 0" class="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            @click="loadMoreArticles"
            :disabled="loadingMore || !hasMoreArticles"
          >
            <Loader2 v-if="loadingMore" class="w-4 h-4 mr-2 animate-spin" />
            {{
              loadingMore
                ? 'Loading...'
                : hasMoreArticles
                  ? 'Load More Articles'
                  : 'No More Articles'
            }}
          </Button>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-primary-foreground"
        >
          <div
            class="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Mail class="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
          <p class="text-xl mb-8 opacity-90">
            Subscribe to our newsletter for the latest insights and articles
          </p>
          <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              class="bg-primary-foreground text-foreground placeholder:text-muted-foreground"
            />
            <Button variant="secondary" class="whitespace-nowrap"> Subscribe </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Brain, Filter, User, ArrowRight, Mail, Loader2 } from 'lucide-vue-next'
import HeaderSection from '@/views/home/components/sections/HeaderSection.vue'
import FooterSection from '@/views/home/components/sections/FooterSection.vue'
import { ghostApi } from '@/api/articles/ghostApi'
import type { ArticleCardData, GhostPost } from '@/types/articles'

const router = useRouter()

const articles = ref<ArticleCardData[]>([])
const featuredArticle = ref<ArticleCardData | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const hasMoreArticles = ref(true)
const loadingMore = ref(false)

const getCategoryIcon = (category: string) => {
  const icons: Record<string, any> = {
    Psychology: Brain,
    'HR Tech': Brain,
    Leadership: Brain,
    'Career Development': Brain,
    Organization: Brain,
    default: Brain,
  }
  return icons[category] || icons.default
}

const loadArticles = async (page = 1, append = false) => {
  try {
    if (page === 1) {
      loading.value = true
    } else {
      loadingMore.value = true
    }

    const response = await ghostApi.getPosts({
      limit: 6,
      page,
      filter: 'visibility:public',
    })

    if (response) {
      const transformedArticles = response.posts.map((post) =>
        ghostApi.transformToArticleCard(post),
      )

      if (append) {
        articles.value.push(...transformedArticles)
      } else {
        articles.value = transformedArticles
      }

      hasMoreArticles.value = response.meta.pagination.pages > page
    }
  } catch (err) {
    error.value = 'Failed to load articles. Please try again later.'
    console.error('Error loading articles:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadFeaturedArticle = async () => {
  try {
    const featured = await ghostApi.getFeaturedPosts(1)
    if (featured.length > 0) {
      featuredArticle.value = ghostApi.transformToArticleCard(featured[0])
    }
  } catch (err) {
    console.error('Error loading featured article:', err)
  }
}

const loadMoreArticles = () => {
  if (!loadingMore.value && hasMoreArticles.value) {
    currentPage.value += 1
    loadArticles(currentPage.value, true)
  }
}

const viewArticle = (slug: string) => {
  router.push(`/articles/${slug}`)
}

onMounted(async () => {
  await Promise.all([loadFeaturedArticle(), loadArticles()])
})
</script>
