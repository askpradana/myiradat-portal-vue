<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger class="">
      <Button variant="default" size="icon" class="rounded-md p-2 w-full">
        <UserPlus :size="18" /> Add member
      </Button>
    </AlertDialogTrigger>

    <AlertDialogPortal>
      <AlertDialogOverlay
        class="bg-white/80 dark:bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
      />
      <AlertDialogContent
        class="z-[100] text-sm data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Add Member to Organization</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the username or name of the member you want to add to
            <span class="font-semibold">{{ nameOfOrganization }}</span> .
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div class="space-y-4">
          <div class="relative">
            <Input
              v-model="searchTerm"
              placeholder="Search user by username..."
              class="w-full text-sm"
            />
            <div :class="searchTerm.length > 0 && selectedUser ? '' : 'hidden'" class="mt-4 ml-1">
              <p>
                <span class="font-semibold"> {{ selectedUser?.name }} ID:</span>
                <span class="text-green-500 ml-2"> {{ selectedUser?.id }}</span>
              </p>
              <p>
                <span class="font-semibold">{{ selectedUser?.name }} Email:</span>
                <span class="text-blue-500 ml-2"> {{ selectedUser?.email }}</span>
              </p>
            </div>
            <span
              v-if="isLoading"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground"
            >
              Loading...
            </span>
          </div>

          <div
            v-if="!isLoading && !error && usersResponse?.users?.length === 0"
            class="text-center text-sm text-muted-foreground"
          >
            No users found.
          </div>

          <div v-if="error" class="text-center text-sm text-destructive">Error loading users.</div>
          <ul
            v-if="usersResponse?.users?.length && !isLoading"
            class="max-h-60 overflow-y-auto border rounded-md"
          >
            <li
              v-for="user in usersResponse.users"
              :key="user.id"
              class="p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
              @click="selectUser(user)"
            >
              <div>
                <p class="font-medium">{{ user.name }}</p>
                <p class="text-sm text-muted-foreground">{{ user.email }}</p>
              </div>
              <Check v-if="selectedUser?.id === user.id" class="h-4 w-4 text-green-500" />
            </li>
          </ul>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel @click="resetForm">Cancel</AlertDialogCancel>
          <AlertDialogAction
            :disabled="!selectedUser || !organizationId || isAddingMember"
            @click="addMember"
          >
            <span v-if="isAddingMember">Adding...</span>
            <span v-else>Add Member</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, type Ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot } from 'reka-ui'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, UserPlus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { getListUser } from '@/api/users/getListUser'
import { addMemberOrganization } from '@/api/organizations/AddMember'
import type { UserListInterface } from '@/types/userListType'
import type { UserDataInterface } from '@/types/userType'

const props = defineProps<{
  nameOfOrganization: string | undefined
  organizationId: string
}>()

const searchTerm = ref('')
const debouncedSearchTerm = ref('')
const selectedUser = ref<UserDataInterface | null>(null)
const open = ref(false)

let debounceTimer: number | undefined

// Query untuk mendapatkan list users
const {
  data: usersResponse,
  isLoading,
  error,
} = useQuery({
  queryKey: ['users', debouncedSearchTerm],
  queryFn: () =>
    getListUser({
      page_size: 30,
      search_by: 'name',
      search_query: debouncedSearchTerm.value,
    }),
  enabled: true,
  staleTime: 30000,
}) as {
  data: Ref<UserListInterface>
  isLoading: Ref<boolean>
  error: Ref<boolean>
}

// Query client untuk invalidation
const queryClient = useQueryClient()

// Mutation untuk add member
const addMemberMutation = useMutation({
  mutationFn: ({ userId, orgId }: { userId: string; orgId: string }) =>
    addMemberOrganization(userId, orgId),
  onSuccess: (data) => {
    toast('Success', {
      description: data.message,
    })

    // Invalidate queries yang terkait untuk refresh data
    queryClient.invalidateQueries({ queryKey: ['organization-members'] })
    queryClient.invalidateQueries({ queryKey: ['organizations'] })

    resetForm()
    open.value = false
  },
  onError: (error) => {
    console.error('Failed to add member:', error)
  },
})

// Computed property untuk status loading
const isAddingMember = computed(() => addMemberMutation.isPending.value)

// Watch untuk debouncing search term
watch(searchTerm, (newValue) => {
  if (searchTerm.value.length === 0) {
    clearTimeout(debounceTimer)
    selectedUser.value = null
  } else {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedSearchTerm.value = newValue
    }, 500)
  }
})

// Fungsi untuk memilih user
const selectUser = (user: UserDataInterface) => {
  selectedUser.value = user
  searchTerm.value = user.name // Display selected user's name in input
}

// Fungsi utama untuk menambah member
const addMember = () => {
  if (!selectedUser.value || !props.organizationId) {
    toast('Error', {
      description: 'Please select a user and ensure organization ID is available',
    })
    return
  }

  // Jalankan mutation
  addMemberMutation.mutate({
    userId: selectedUser.value.id,
    orgId: props.organizationId,
  })
}

// Fungsi untuk reset form
const resetForm = () => {
  searchTerm.value = ''
  debouncedSearchTerm.value = ''
  selectedUser.value = null
}

// Lifecycle hook
onMounted(() => {
  // Initial fetch if there's a pre-filled search term (unlikely for this component)
  if (searchTerm.value.length > 2) {
    debouncedSearchTerm.value = searchTerm.value
  }
})
</script>
