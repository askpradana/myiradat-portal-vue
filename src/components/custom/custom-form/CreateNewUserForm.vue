<script setup lang="ts">
import Button from '../../ui/button/Button.vue'
import Input from '../../ui/input/Input.vue'
import Label from '../../ui/label/Label.vue'
import { Card, CardTitle, CardHeader, CardContent } from '../../ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useField, useForm } from 'vee-validate'
import { registerNewUser, type NewUserInterface } from '@/api/register'
import { toast } from 'vue-sonner'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { CreateNewUserSchema } from '@/lib/zod-schemas/registerFormSchema'

const validationSchema = CreateNewUserSchema
const { handleSubmit, errors, resetForm } = useForm({
  validationSchema,
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: name } = useField<string>('name')
const { value: phone } = useField<string>('phone')
const { value: role } = useField<string>('role')

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: async ({ values, roleId }: { values: NewUserInterface; roleId: number }) => {
    return await registerNewUser(values, roleId)
  },

  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.message}`,
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      resetForm()
    }
  },
  onError: (error) => {
    toast('Error', {
      description: `Failed to add user: ${error.message}`,
    })
  },
})

const onSubmit = handleSubmit(async (values) => {
  mutate({ values, roleId: 1 })
})
</script>

<template>
  <Card
    class="w-full max-w-md mx-auto shadow-2xl shadow-primary/25 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm"
  >
    <CardHeader class="space-y-1">
      <CardTitle class="text-xl font-semibold text-center text-foreground">Add new user</CardTitle>
      <!-- <CardDescription class="text-center text-muted-foreground"> Add new user </CardDescription> -->
    </CardHeader>

    <CardContent class="space-y-6">
      <form @submit="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name" class="text-sm font-medium text-foreground">Username</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your username"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="name"
          />
          <span class="text-xs text-red-400">{{ errors.name }}</span>
        </div>

        <div class="space-y-2">
          <Label for="phone" class="text-sm font-medium text-foreground">Phone number</Label>
          <Input
            id="phone"
            type="text"
            placeholder="Enter your phone number"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="phone"
          />
          <span class="text-xs text-red-400">{{ errors.phone }}</span>
        </div>

        <div class="space-y-2">
          <Label for="email" class="text-sm font-medium text-foreground">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="email"
          />
          <span class="text-xs text-red-400">{{ errors.email }}</span>
        </div>

        <div class="space-y-2">
          <Label for="password" class="text-sm font-medium text-foreground">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="password"
          />
          <span class="text-xs text-red-400">{{ errors.password }}</span>
        </div>
        <div class="space-y-2 w-full">
          <Label for="plan">Select Role</Label>
          <Select v-model="role">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Admin</SelectItem>
              <SelectItem value="2">User</SelectItem>
            </SelectContent>
          </Select>
          <span class="text-xs text-red-400">{{ errors.role }}</span>
        </div>
        <Button
          size="sm"
          type="submit"
          class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          :disabled="isPending"
          :class="isPending && 'bg-gray-500 pointer-events-none'"
        >
          {{ isPending ? 'Please wait...' : 'Add User' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
