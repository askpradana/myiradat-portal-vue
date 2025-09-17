<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="text-foreground font-semibold">Avatar</TableHead>
        <TableHead class="text-foreground font-semibold">Name</TableHead>
        <TableHead class="text-foreground font-semibold">Email</TableHead>
        <TableHead class="text-foreground font-semibold">Role</TableHead>
        <TableHead class="text-foreground font-semibold">Join Date</TableHead>
        <!-- <TableHead class="text-right text-foreground">Actions</TableHead> -->
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="isPending">
        <ListUserTableSkeleton />
      </template>

      <template v-else-if="data?.data.members && data?.data.members.length > 0">
        <TableRow v-for="member in data.data.members" :key="member.id">
          <TableCell class="font-medium text-foreground">
            <div
              class="flex items-center justify-center h-10 w-10 bg-gradient-to-br from-blue-500 via-blue-800 to-violet-800 rounded-full text-white text-xs font-semibold"
            >
              {{ getInitialName(member.name) }}
            </div>
          </TableCell>

          <TableCell class="font-medium text-foreground">
            <div class="flex items-center space-x-3">
              {{ member.name }}
            </div>
          </TableCell>
          <TableCell class="text-foreground">{{ member.email }}</TableCell>

          <TableCell>
            <span :class="getRoleBadgeClass(member.role_name)">
              {{ member.role_name }}
            </span>
          </TableCell>

          <TableCell>
            {{ formatDate(member.joined_at) }}
          </TableCell>
          <!-- <TableCell class="text-right">
            <div class="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="icon"
                class="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                @click="goToLinks(member.id)"
              >
                <Link2 :size="18" />
              </Button>
            </div>
          </TableCell> -->
        </TableRow>
      </template>

      <!-- No Results -->
      <template v-else>
        <TableRow>
          <TableCell :colspan="6" class="h-24 text-center text-muted-foreground">
            <div class="flex flex-col items-center justify-center py-8">
              <SearchIcon :size="48" class="mb-4 opacity-50" />
              <p class="text-lg font-medium">No users found</p>
            </div>
          </TableCell>
        </TableRow>
      </template>
    </TableBody>
  </Table>

  <!-- Pagination -->
  <div class="mt-6" v-if="data && data?.data.members?.length > 0">
    <Pagination
      v-model:page="currentPage"
      :items-per-page="data.data.page_size"
      :total="data.data.total"
      :sibling-count="1"
    >
      <PaginationContent>
        <PaginationFirst @click="goToPage(1)" :disabled="currentPage === 1" />
        <PaginationPrevious @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" />
        <PaginationItem
          v-for="page in visiblePages"
          :key="page"
          :value="page"
          :is-active="page === currentPage"
          @click="goToPage(page)"
        >
          {{ page }}
        </PaginationItem>
        <PaginationNext
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === data.data.total_pages"
        />
        <PaginationLast
          @click="goToPage(data.data.total_pages)"
          :disabled="currentPage === data.data.total_pages"
        />
      </PaginationContent>
    </Pagination>

    <!-- Pagination Info -->
    <div class="mt-4 text-sm text-muted-foreground text-center">
      Showing {{ (currentPage - 1) * data.data.page_size + 1 }} to
      {{ Math.min(currentPage * data.data.page_size, data.data.total) }} of
      {{ data.data.total }} results
      <!-- <span v-if="hasActiveFilters" class="text-primary"> (filtered from {{ data.total }}) </span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { getMembersOrganization, type ResponseAPIGETMember } from '@/api/organizations/getMembers'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import ListUserTableSkeleton from '@/components/custom/skeletons/ListUserTableSkeleton.vue'
import { useQuery } from '@tanstack/vue-query'
import { formatDate } from '@/lib/dateFromate'
import { getInitialName } from '@/lib/getInitialName'

// import { useRouter } from 'vue-router'
// import Button from '@/components/ui/button/Button.vue'
import { SearchIcon } from 'lucide-vue-next'

const props = defineProps<{
  organizationID: string
}>()

// const router = useRouter()

const currentPage = ref(1)

// Reactive query with all filters
const { isPending, data } = useQuery({
  queryKey: ['members', props.organizationID],
  queryFn: () => getMembersOrganization(props.organizationID),
  staleTime: 1000 * 60 * 2, // 2 minutes
}) as {
  isPending: Ref<boolean>
  data: Ref<ResponseAPIGETMember | undefined>
  refetch: () => void
}

// Pagination functions
const goToPage = (page: number) => {
  if (page >= 1 && page <= (data.value?.data.total_pages || 1)) {
    currentPage.value = page
  }
}

// Computed for visible pages
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const totalPages = data.value?.data.total_pages || 1
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages, start + maxVisible - 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// const goToLinks = (user_id: string) => {
//   router.push(`/dashboard/${user_id}/services`)
// }

const getRoleBadgeClass = (role: string) => {
  const classes = {
    admin:
      'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700',
    cs: 'inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700',
    user: 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700',
  }
  return classes[role as keyof typeof classes] || classes['user']
}
</script>
