<script setup lang="ts">
import { computed, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useField, useForm } from 'vee-validate'
import { updateOrganization } from '@/api/organizations/editOrganization'
import { getOrganizationDetail } from '@/api/organizations/getOrganizationDetail'
import { type OrganizationInterface } from '@/types/organizationType'
import { toast } from 'vue-sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  EditOrganizationSchema,
  type EditOrganizationFormType,
} from '@/lib/zod-schemas/CreateOrganizationFormSchema'

const route = useRoute()
const organizationID = route.params.id

const validationSchema = EditOrganizationSchema
const { handleSubmit, errors, setValues } = useForm<EditOrganizationFormType>({
  validationSchema,
  initialValues: {
    name: '',
    description: '',
    industry: '',
    size_category: undefined,
    email: '',
    phone: '',
    website_url: '',
    logo_url: '',
    status: undefined,
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
    },
  },
})

// Form fields
const { value: name } = useField<string>('name')
const { value: description } = useField<string>('description')
const { value: industry } = useField<string>('industry')
const { value: size_category } = useField<string>('size_category')
const { value: email } = useField<string>('email')
const { value: phone } = useField<string>('phone')
const { value: website_url } = useField<string>('website_url')
const { value: logo_url } = useField<string>('logo_url')
const { value: status } = useField<string>('status')

// Address fields
const { value: street } = useField<string>('address.street')
const { value: city } = useField<string>('address.city')
const { value: state } = useField<string>('address.state')
const { value: country } = useField<string>('address.country')
const { value: postal_code } = useField<string>('address.postal_code')

// Fetch organization data
const { data: organizationData, isLoading: isLoadingOrganization } = useQuery({
  queryKey: ['organization', organizationID],
  queryFn: () => getOrganizationDetail(organizationID as string),
}) as {
  isLoading: Ref<boolean>
  data: Ref<OrganizationInterface | undefined>
}

// Populate form when data is loaded
watch(
  organizationData,
  (data) => {
    if (data) {
      // Parse address if it's a JSON string
      let parsedAddress = data.address
      if (typeof data.address === 'string') {
        try {
          parsedAddress = JSON.parse(data.address)
        } catch (e) {
          console.error('Failed to parse address JSON:', e)
          parsedAddress = {
            street: '',
            city: '',
            state: '',
            country: '',
            postal_code: '',
          }
        }
      }

      setValues({
        name: data.name || '',
        description: data.description || '',
        industry: data.industry || '',
        size_category: data.size_category,
        email: data.email || '',
        phone: data.phone || '',
        website_url: data.website_url || '',
        logo_url: data.logo_url || '',
        status: data.status === 'active' || data.status === 'inactive' ? data.status : undefined,
        address:
          typeof parsedAddress === 'object' && parsedAddress !== null
            ? parsedAddress
            : {
                street: '',
                city: '',
                state: '',
                country: '',
                postal_code: '',
              },
      })
    }
  },
  { immediate: true },
)

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: async (values: EditOrganizationFormType) => {
    // Convert address object to JSON string for API
    const formattedValues = {
      ...values,
      address: JSON.stringify(values.address),
    }
    return await updateOrganization(formattedValues, organizationID as string)
  },

  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: ` ${response?.message || 'Organization has been updated'}`,
      })
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      queryClient.invalidateQueries({ queryKey: ['organization', organizationID] })
    }
  },
  onError: (error) => {
    toast('Error', {
      description: `Failed to update organization: ${error.message}`,
    })
  },
})

const onSubmit = handleSubmit(async (values) => {
  mutate(values)
})

const sizeCategories = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const isLoading = computed(() => isLoadingOrganization.value || isPending.value)
</script>

<template>
  <Card
    class="w-full max-w-2xl mx-auto shadow-2xl shadow-primary/25 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm"
  >
    <CardHeader class="space-y-1">
      <CardTitle class="text-xl font-semibold text-center text-foreground"
        >Update Organization Data</CardTitle
      >
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- Loading state -->
      <div v-if="isLoadingOrganization" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span class="ml-2 text-sm text-muted-foreground">Loading organization data...</span>
      </div>

      <!-- Form -->
      <form v-else @submit="onSubmit" class="space-y-4">
        <!-- Organization Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="name" class="text-sm font-medium text-foreground">Organization Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter organization name"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="name"
            />
            <span class="text-xs text-red-400">{{ errors.name }}</span>
          </div>

          <div class="space-y-2">
            <Label for="industry" class="text-sm font-medium text-foreground">Industry</Label>
            <Input
              id="industry"
              type="text"
              placeholder="e.g. Technology, Healthcare"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="industry"
            />
            <span class="text-xs text-red-400">{{ errors.industry }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="description" class="text-sm font-medium text-foreground">Description</Label>
          <textarea
            id="description"
            placeholder="Describe your organization"
            class="min-h-[80px] w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
            required
            v-model="description"
          />
          <span class="text-xs text-red-400">{{ errors.description }}</span>
        </div>

        <!-- Size Category and Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="size_category">Organization Size</Label>
            <Select v-model="size_category">
              <SelectTrigger class="w-full h-11">
                <SelectValue placeholder="Select organization size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="size in sizeCategories" :key="size.value" :value="size.value">
                  {{ size.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <span class="text-xs text-red-400">{{ errors.size_category }}</span>
          </div>

          <div class="space-y-2">
            <Label for="status">Status</Label>
            <Select v-model="status">
              <SelectTrigger class="w-full h-11">
                <SelectValue placeholder="Select organization status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="statusOption in statusOptions"
                  :key="statusOption.value"
                  :value="statusOption.value"
                >
                  <div class="flex items-center gap-2">
                    <div
                      :class="{
                        'w-2 h-2 rounded-full': true,
                        'bg-green-500': statusOption.value === 'active',
                        'bg-red-500': statusOption.value === 'inactive',
                      }"
                    ></div>
                    {{ statusOption.label }}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <span class="text-xs text-red-400">{{ errors.status }}</span>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="email" class="text-sm font-medium text-foreground">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@organization.com"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="email"
            />
            <span class="text-xs text-red-400">{{ errors.email }}</span>
          </div>

          <div class="space-y-2">
            <Label for="phone" class="text-sm font-medium text-foreground">Phone Number</Label>
            <Input
              id="phone"
              type="text"
              placeholder="+1234567890"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="phone"
            />
            <span class="text-xs text-red-400">{{ errors.phone }}</span>
          </div>
        </div>

        <!-- Website and Logo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="website_url" class="text-sm font-medium text-foreground">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              placeholder="https://organization.com"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              v-model="website_url"
            />
            <span class="text-xs text-red-400">{{ errors.website_url }}</span>
          </div>

          <div class="space-y-2">
            <Label for="logo_url" class="text-sm font-medium text-foreground">Logo URL</Label>
            <Input
              id="logo_url"
              type="url"
              placeholder="https://organization.com/logo.png"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              v-model="logo_url"
            />
            <span class="text-xs text-red-400">{{ errors.logo_url }}</span>
          </div>
        </div>

        <!-- Address Information -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-foreground border-b pb-2">Address Information</h3>

          <div class="space-y-2">
            <Label for="street" class="text-sm font-medium text-foreground">Street Address</Label>
            <Input
              id="street"
              type="text"
              placeholder="123 Business Street"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="street"
            />
            <span class="text-xs text-red-400">{{ errors['address.street'] }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="city" class="text-sm font-medium text-foreground">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="San Francisco"
                class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                v-model="city"
              />
              <span class="text-xs text-red-400">{{ errors['address.city'] }}</span>
            </div>

            <div class="space-y-2">
              <Label for="state" class="text-sm font-medium text-foreground">State/Province</Label>
              <Input
                id="state"
                type="text"
                placeholder="CA"
                class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                v-model="state"
              />
              <span class="text-xs text-red-400">{{ errors['address.state'] }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="country" class="text-sm font-medium text-foreground">Country</Label>
              <Input
                id="country"
                type="text"
                placeholder="Indonesia"
                class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                v-model="country"
              />
              <span class="text-xs text-red-400">{{ errors['address.country'] }}</span>
            </div>

            <div class="space-y-2">
              <Label for="postal_code" class="text-sm font-medium text-foreground"
                >Postal Code</Label
              >
              <Input
                id="postal_code"
                type="text"
                placeholder="94105"
                class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                v-model="postal_code"
              />
              <span class="text-xs text-red-400">{{ errors['address.postal_code'] }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <Button
            size="sm"
            type="submit"
            class="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            :disabled="isLoading"
            :class="isLoading && 'bg-gray-500 pointer-events-none'"
          >
            {{ isPending ? 'Updating Organization...' : 'Update Organization' }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
