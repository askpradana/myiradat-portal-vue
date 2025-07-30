<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-card border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-foreground">UI Components Showcase</h1>
            <p class="text-muted-foreground mt-1">
              Development reference for all available components
            </p>
          </div>
          <div class="flex items-center gap-2">
            <ThemeToggle />
            <Button @click="notify" variant="outline"> Test Toast </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Form Components Section -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span class="text-blue-600">📝</span>
              Form Components
            </CardTitle>
            <CardDescription>
              Input fields, selects, checkboxes, and other form elements
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Input -->
            <div class="space-y-2">
              <Label for="email">Email Input</Label>
              <Input id="email" placeholder="you@example.com" />
              <p class="text-destructive text-sm">Error message example</p>
            </div>

            <!-- Select -->
            <div class="space-y-2">
              <Label for="plan">Select Dropdown</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Plan</SelectItem>
                  <SelectItem value="pro">Pro Plan</SelectItem>
                  <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Textarea -->
            <div class="space-y-2">
              <Label for="message">Textarea</Label>
              <Textarea id="message" placeholder="Type your message here..." />
            </div>

            <!-- Checkbox and Switch -->
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label for="terms">Accept terms and conditions</Label>
              </div>

              <div class="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label for="airplane-mode">Airplane Mode</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Action Components Section -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span class="text-green-600">⚡</span>
              Action Components
            </CardTitle>
            <CardDescription> Buttons, toasts, and interactive elements </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Buttons -->
            <div class="space-y-4">
              <div class="space-y-2">
                <Label class="text-sm font-medium">Button Variants</Label>
                <div class="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <div class="space-y-2">
                <Label class="text-sm font-medium">Button Sizes</Label>
                <div class="flex flex-wrap items-center gap-2">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
            </div>

            <!-- Tooltip -->
            <div class="space-y-2">
              <Label class="text-sm font-medium">Tooltip</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline">Hover for tooltip</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a helpful tooltip message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <!-- Feedback Components Section -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span class="text-yellow-600">💬</span>
              Feedback Components
            </CardTitle>
            <CardDescription> Alerts, notifications, and status messages </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Alerts -->
            <div class="space-y-3">
              <Alert>
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>
                  This is a default alert message for general information.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertTitle>Error Alert</AlertTitle>
                <AlertDescription>
                  This is a destructive alert for error messages.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <!-- Layout Components Section -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span class="text-purple-600">📦</span>
              Layout Components
            </CardTitle>
            <CardDescription> Cards and container components </CardDescription>
          </CardHeader>
          <CardContent>
            <Card>
              <CardHeader>
                <CardTitle>Nested Card Example</CardTitle>
                <CardDescription>
                  This shows how cards can be nested and used for content organization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p class="text-sm text-muted-foreground">
                  Cards are perfect for grouping related content and creating visual hierarchy.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Take Action</Button>
              </CardFooter>
            </Card>
          </CardContent>
        </Card>

        <!-- Dark Mode Section -->
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span class="text-purple-600">🌙</span>
              Dark Mode Toggle
            </CardTitle>
            <CardDescription> Switch between light and dark themes </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="space-y-2">
                <p class="text-sm text-muted-foreground">
                  Current theme:
                  <span class="font-medium text-foreground">{{
                    themeStore.isDark ? 'Dark' : 'Light'
                  }}</span>
                </p>
                <p class="text-xs text-muted-foreground">
                  The theme preference is saved in localStorage and will persist across sessions.
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <!-- Interactive Demo Section -->
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

        <!-- New Components Section -->
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span class="text-indigo-600">🆕</span>
              New Components
            </CardTitle>
            <CardDescription>
              Table, custom cards, pagination, pin input, progress, skeleton, separator, and stepper
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-8">
              <!-- Table Section -->
              <div class="space-y-4">
                <h4 class="font-medium">Data Table</h4>
                <div class="border rounded-lg">
                  <Table>
                    <TableCaption>A list of recent orders.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead class="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell class="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell class="text-right">$250.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell class="font-medium">INV002</TableCell>
                        <TableCell>Pending</TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell class="text-right">$150.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell class="font-medium">INV003</TableCell>
                        <TableCell>Unpaid</TableCell>
                        <TableCell>Bank Transfer</TableCell>
                        <TableCell class="text-right">$350.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <!-- Custom Cards Section -->
              <div class="space-y-4">
                <h4 class="font-medium">Custom Cards</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomCard
                    variant="classic"
                    title="Classic Card"
                    description="This is a classic card with standard styling."
                  >
                    <p class="text-sm">Perfect for general content display.</p>
                  </CustomCard>

                  <CustomCard
                    variant="warning"
                    title="Warning Card"
                    description="This card indicates a warning or important notice."
                  >
                    <p class="text-sm">Use this for important alerts and warnings.</p>
                  </CustomCard>

                  <CustomCard
                    variant="reminder"
                    title="Reminder Card"
                    description="This card is perfect for reminders and notifications."
                  >
                    <p class="text-sm">Great for scheduled reminders and updates.</p>
                  </CustomCard>
                </div>
              </div>

              <!-- Pagination Section -->
              <div class="space-y-4">
                <h4 class="font-medium">Pagination</h4>
                <Pagination v-slot="{ page }" :items-per-page="10" :total="30" :default-page="2">
                  <PaginationContent v-slot="{ items }">
                    <PaginationPrevious />

                    <template v-for="(item, index) in items" :key="index">
                      <PaginationItem
                        v-if="item.type === 'page'"
                        :value="item.value"
                        :is-active="item.value === page"
                      >
                        {{ item.value }}
                      </PaginationItem>
                    </template>

                    <PaginationEllipsis :index="4" />

                    <PaginationNext />
                  </PaginationContent>
                </Pagination>
              </div>

              <!-- Pin Input Section -->
              <div class="space-y-4">
                <h4 class="font-medium">Pin Input</h4>
                <div class="space-y-2">
                  <Label>Enter verification code</Label>
                  <PinInput v-model="pinValue" :length="6" @complete="handlePinComplete" />
                  <p class="text-sm text-muted-foreground">
                    Entered: {{ pinValue || 'No code entered' }}
                  </p>
                </div>
              </div>

              <!-- Progress Section -->
              <div class="space-y-4">
                <h4 class="font-medium">Progress</h4>
                <div class="space-y-4">
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span>Upload Progress</span>
                      <span>{{ progressValue }}%</span>
                    </div>
                    <Progress :value="progressValue" />
                  </div>
                  <div class="flex gap-2">
                    <Button @click="progressValue = Math.max(0, progressValue - 10)" size="sm">
                      Decrease
                    </Button>
                    <Button @click="progressValue = Math.min(100, progressValue + 10)" size="sm">
                      Increase
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Skeleton Section -->
              <div class="space-y-4">
                <h4 class="font-medium">Skeleton Loading</h4>
                <div class="space-y-3">
                  <div class="flex items-center space-x-4">
                    <Skeleton class="h-12 w-12 rounded-full" />
                    <div class="space-y-2">
                      <Skeleton class="h-4 w-[250px]" />
                      <Skeleton class="h-4 w-[200px]" />
                    </div>
                  </div>
                  <Skeleton class="h-4 w-full" />
                  <Skeleton class="h-4 w-[80%]" />
                </div>
              </div>

              <!-- Separator Section -->
              <div class="space-y-4">
                <h4 class="font-medium">Separator</h4>
                <div class="space-y-4">
                  <div>
                    <p>Content above separator</p>
                    <Separator class="my-4" />
                    <p>Content below separator</p>
                  </div>
                  <Separator orientation="vertical" class="h-6" />
                </div>
              </div>

              <!-- Stepper Section -->
              <div class="space-y-4">
                <h4 class="font-medium">Stepper</h4>
                <Stepper :steps="stepperSteps" :current-step="currentStep">
                  <template #default="{ currentStep: step }">
                    <div class="space-y-4">
                      <div v-if="step === 0">
                        <h5 class="font-medium mb-2">Step 1: Personal Information</h5>
                        <p class="text-sm text-muted-foreground mb-4">
                          Please provide your basic information.
                        </p>
                        <div class="space-y-3">
                          <div>
                            <Label for="stepper-name">Name</Label>
                            <Input id="stepper-name" placeholder="Enter your name" />
                          </div>
                          <div>
                            <Label for="stepper-email">Email</Label>
                            <Input id="stepper-email" type="email" placeholder="Enter your email" />
                          </div>
                        </div>
                      </div>
                      <div v-else-if="step === 1">
                        <h5 class="font-medium mb-2">Step 2: Preferences</h5>
                        <p class="text-sm text-muted-foreground mb-4">Choose your preferences.</p>
                        <div class="space-y-3">
                          <div class="flex items-center space-x-2">
                            <Checkbox id="stepper-newsletter" />
                            <Label for="stepper-newsletter">Subscribe to newsletter</Label>
                          </div>
                          <div class="flex items-center space-x-2">
                            <Switch id="stepper-notifications" />
                            <Label for="stepper-notifications">Enable notifications</Label>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="step === 2">
                        <h5 class="font-medium mb-2">Step 3: Confirmation</h5>
                        <p class="text-sm text-muted-foreground mb-4">
                          Review your information and confirm.
                        </p>
                        <Alert>
                          <AlertTitle>Ready to complete!</AlertTitle>
                          <AlertDescription>
                            All information has been collected. Click finish to complete the
                            process.
                          </AlertDescription>
                        </Alert>
                      </div>
                      <div class="flex justify-between">
                        <Button
                          v-if="currentStep > 0"
                          @click="currentStep = Math.max(0, currentStep - 1)"
                          variant="outline"
                        >
                          Previous
                        </Button>
                        <Button
                          v-if="currentStep < stepperSteps.length - 1"
                          @click="currentStep = Math.min(stepperSteps.length - 1, currentStep + 1)"
                        >
                          Next
                        </Button>
                        <Button
                          v-if="currentStep === stepperSteps.length - 1"
                          @click="handleStepperComplete"
                        >
                          Finish
                        </Button>
                      </div>
                    </div>
                  </template>
                </Stepper>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { CustomCard } from '@/components/ui/custom-card'
import { PinInput } from '@/components/ui/pin-input'
import { Stepper } from '@/components/ui/stepper'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Reactive variables for new components
const pinValue = ref('')
const progressValue = ref(30)
const currentStep = ref(0)

const stepperSteps = [
  {
    title: 'Personal Info',
    description: 'Basic information',
  },
  {
    title: 'Preferences',
    description: 'Your preferences',
  },
  {
    title: 'Confirmation',
    description: 'Review and confirm',
  },
]

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

const handlePinComplete = (value: string) => {
  toast('Pin completed!', {
    description: `Verification code: ${value}`,
  })
}

const handleStepperComplete = () => {
  toast('Stepper completed!', {
    description: 'All steps have been completed successfully.',
  })
  currentStep.value = 0
}
</script>

<style scoped></style>
