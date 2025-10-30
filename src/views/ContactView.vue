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
          <h1 class="text-4xl sm:text-5xl font-bold text-foreground mb-6">Contact Us</h1>
          <p class="text-xl text-muted-foreground">
            Get in touch with our team to discuss how we can help your organization
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Information & Form -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Contact Information -->
          <div>
            <h2 class="text-3xl font-bold text-foreground mb-8">Get in Touch</h2>
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <MapPin class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-foreground mb-1">Office Address</h3>
                  <div class="text-muted-foreground">
                    <p>Gedung Vinilon lt 3, Suite 3-5</p>
                    <p>Jl. Raden Saleh No</p>
                    <p>13-17 Jakarta 10430</p>
                  </div>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <Phone class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-foreground mb-1">Phone</h3>
                  <p class="text-muted-foreground">+62-21-2957-8187</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <Mail class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-foreground mb-1">Email</h3>
                  <p class="text-muted-foreground">iradat@iradatkonsultan.com</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <Clock class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-foreground mb-1">Business Hours</h3>
                  <p class="text-muted-foreground">Monday - Friday: 09:00 - 18:00</p>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="mt-8">
              <h3 class="font-semibold text-foreground mb-4">Follow Us</h3>
              <div class="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  class="w-10 h-10 p-0"
                  @click="() => openUrl(linkedinUrl)"
                >
                  <Linkedin class="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="w-10 h-10 p-0"
                  @click="() => openUrl(instagramUrl)"
                >
                  <Instagram class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div>
            <div class="bg-card rounded-2xl p-8 shadow-sm">
              <h3 class="text-2xl font-bold text-foreground mb-6">Send us a Message</h3>
              <form @submit.prevent="submitForm" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">
                      First Name *
                    </label>
                    <Input v-model="form.firstName" type="text" placeholder="John" required />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">
                      Last Name *
                    </label>
                    <Input v-model="form.lastName" type="text" placeholder="Doe" required />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    v-model="form.email"
                    type="email"
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2"> Company </label>
                  <Input v-model="form.company" type="text" placeholder="Your Company Name" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2"> Subject * </label>
                  <select
                    v-model="form.subject"
                    class="w-full bg-background border border-border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="services">Services Information</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="support">Technical Support</option>
                    <option value="demo">Request Demo</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2"> Message * </label>
                  <Textarea
                    v-model="form.message"
                    placeholder="Tell us about your needs and how we can help..."
                    class="min-h-[120px]"
                    required
                  />
                </div>

                <div class="flex items-start space-x-2">
                  <Checkbox id="privacy" v-model:checked="form.agreeToPrivacy" />
                  <label for="privacy" class="text-sm text-muted-foreground">
                    I agree to the
                    <a href="#" class="text-primary hover:underline">Privacy Policy</a>
                    and
                    <a href="#" class="text-primary hover:underline">Terms of Service</a>
                  </label>
                </div>

                <Button type="submit" size="lg" class="w-full" :disabled="!form.agreeToPrivacy">
                  <Send class="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 bg-card/30">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p class="text-lg text-muted-foreground">Quick answers to common questions</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-background rounded-xl border border-border"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-card/50 transition-colors"
            >
              <span class="font-semibold text-foreground">{{ faq.question }}</span>
              <ChevronDown
                class="w-5 h-5 text-muted-foreground transition-transform"
                :class="{ 'rotate-180': openFaq === index }"
              />
            </button>
            <div v-if="openFaq === index" class="px-6 pb-4 text-muted-foreground">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { MapPin, Phone, Mail, Clock, Linkedin, Instagram, Send, ChevronDown } from 'lucide-vue-next'
import HeaderSection from '@/views/home/components/sections/HeaderSection.vue'
import FooterSection from '@/views/home/components/sections/FooterSection.vue'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  subject: '',
  message: '',
  agreeToPrivacy: false,
})

const openFaq = ref<number | null>(null)

const submitForm = () => {
  // Handle form submission
  console.log('Form submitted:', form.value)
  // Reset form or show success message
}

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const faqs = [
  {
    question: 'How long does a psychological assessment take?',
    answer:
      'Assessment duration varies depending on the type and complexity. Most individual assessments take 2-4 hours, while comprehensive organizational assessments may take several days to weeks.',
  },
  {
    question: 'Are your assessment tools scientifically validated?',
    answer:
      'Yes, all our assessment tools are scientifically validated and based on established psychological research. We regularly update our methodologies to reflect current best practices.',
  },
  {
    question: 'Can assessments be conducted remotely?',
    answer:
      'Many of our assessments can be conducted remotely through our secure digital platform. We offer both in-person and remote options to accommodate your needs.',
  },
  {
    question: 'How do you ensure data privacy and confidentiality?',
    answer:
      'We maintain strict confidentiality protocols and comply with data protection regulations. All personal information is encrypted and stored securely with limited access.',
  },
  {
    question: 'What is the cost of your services?',
    answer:
      'Pricing varies based on the type and scope of services required. We offer customized packages to fit different organizational needs and budgets. Contact us for a detailed quote.',
  },
]

const instagramUrl = 'https://www.instagram.com/iradat.konsultan/'
const linkedinUrl = 'https://id.linkedin.com/company/iradatkonsultan'

const openUrl = (url: string) => {
  window.open(url, '_blank')
}
</script>
