import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { NewsletterFormSchema, NewsletterFormDefaults, type NewsletterFormType } from '@/lib/zod-schemas/NewsletterFormSchema'

export interface NewsletterFormState {
  isSubmitting: boolean
  isSuccess: boolean
  subscriberCount: number
  lastUpdated: Date
}

export function useNewsletterForm() {
  const isSubmitting = ref(false)
  const isSuccess = ref(false)
  const subscriberCount = ref(15247) // Mock subscriber count
  const lastUpdated = ref(new Date())

  const form = useForm<NewsletterFormType>({
    validationSchema: toTypedSchema(NewsletterFormSchema),
    initialValues: NewsletterFormDefaults
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      isSubmitting.value = true
      isSuccess.value = false

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock API call - in a real app, this would be an actual API endpoint
      console.log('Newsletter subscription:', values)

      // Simulate success
      isSuccess.value = true
      subscriberCount.value += 1
      lastUpdated.value = new Date()

      // Show success toast
      toast.success('Successfully subscribed!', {
        description: 'You\'ll receive our latest updates and insights in your inbox.',
        duration: 4000
      })

      // Reset form after successful submission
      form.resetForm()
      
      // Reset success state after animation
      setTimeout(() => {
        isSuccess.value = false
      }, 3000)

    } catch (error) {
      console.error('Newsletter subscription error:', error)
      
      toast.error('Subscription failed', {
        description: 'Please try again or contact support if the problem persists.',
        duration: 5000
      })
    } finally {
      isSubmitting.value = false
    }
  })

  const formatSubscriberCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K+`
    }
    return count.toString()
  }

  return {
    // Form
    form,
    onSubmit,
    
    // State
    isSubmitting,
    isSuccess,
    subscriberCount,
    lastUpdated,
    
    // Helpers
    formatSubscriberCount
  }
}