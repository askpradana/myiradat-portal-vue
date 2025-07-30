<template>
  <Card class="lg:col-span-2">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <span class="text-orange-600">🎮</span>
        Interactive Demo
      </CardTitle>
      <CardDescription> Test the components interactively </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Form Demo -->
        <div class="space-y-4">
          <h4 class="font-medium">Form Demo</h4>
          <div class="space-y-3">
            <div>
              <Label for="demo-name">Name</Label>
              <Input id="demo-name" placeholder="Enter your name" />
            </div>
            <div>
              <Label for="demo-role">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="demo-bio">Bio</Label>
              <Textarea id="demo-bio" placeholder="Tell us about yourself..." />
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox id="demo-newsletter" />
              <Label for="demo-newsletter">Subscribe to newsletter</Label>
            </div>
          </div>
        </div>

        <!-- Actions Demo -->
        <div class="space-y-4">
          <h4 class="font-medium">Actions Demo</h4>
          <div class="space-y-3">
            <div class="flex gap-2">
              <Button @click="notify">Show Toast</Button>
              <Button variant="outline" @click="showAlert">Show Alert</Button>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost">Help</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a help tooltip</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div class="flex items-center space-x-2">
              <Switch id="demo-mode" />
              <Label for="demo-mode">Demo Mode</Label>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const notify = () => {
  toast('This is a toast notification!', {
    description: 'You can customize the toast message and styling.',
  })
}

const showAlert = () => {
  toast('Alert triggered!', {
    description: 'This simulates an alert action.',
  })
}
</script>
