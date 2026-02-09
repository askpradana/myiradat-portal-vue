<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderSection />

    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background py-20 mt-8"
    >
      <!-- Subtle background elements for visual interest -->
      <div class="absolute inset-0 opacity-40">
        <div class="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-xl"></div>
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/3 rounded-full blur-lg"
        ></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6"
          >
            <Mail class="w-8 h-8 text-primary" />
          </div>
          <h1
            class="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
          >
            Contact Us
          </h1>
          <p class="text-xl text-muted-foreground">
            Get in touch with our team to discuss how we can help your organization
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Information & Form -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Contact Information Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <!-- Address Card -->
          <div
            class="bg-card rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group hover:scale-[1.02] border border-transparent hover:border-primary/10"
          >
            <div
              class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <MapPin class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="font-semibold text-foreground mb-2">Office Address</h3>
            <div class="text-muted-foreground text-sm">
              <p>Gedung Vinilon lt 3, Suite 3-5</p>
              <p>Jl. Raden Saleh No 13-17</p>
              <p>Jakarta 10430</p>
            </div>
          </div>

          <!-- Phone Card -->
          <div
            class="bg-card rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group hover:scale-[1.02] border border-transparent hover:border-primary/10"
          >
            <div
              class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Phone class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="font-semibold text-foreground mb-2">Phone</h3>
            <a
              href="tel:+622129578187"
              class="text-muted-foreground text-sm hover:text-primary transition-colors"
            >
              +62-21-2957-8187
            </a>
          </div>

          <!-- Email Card -->
          <div
            class="bg-card rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group hover:scale-[1.02] border border-transparent hover:border-primary/10"
          >
            <div
              class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Mail class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="font-semibold text-foreground mb-2">Email</h3>
            <a
              href="mailto:iradat@iradatkonsultan.com"
              class="text-muted-foreground text-sm hover:text-primary transition-colors"
            >
              iradat@iradatkonsultan.com
            </a>
          </div>

          <!-- Business Hours Card -->
          <div
            class="bg-card rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group hover:scale-[1.02] border border-transparent hover:border-primary/10"
          >
            <div
              class="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Clock class="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 class="font-semibold text-foreground mb-2">Business Hours</h3>
            <p class="text-muted-foreground text-sm">Monday - Friday</p>
            <p class="text-muted-foreground text-sm">09:00 - 18:00</p>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Social Media & Additional Info -->
          <div>
            <h2 class="text-3xl font-bold text-foreground mb-8">Connect With Us</h2>

            <!-- Social Media -->
            <div class="bg-card rounded-2xl p-6 mb-6">
              <h3 class="font-semibold text-foreground mb-4 flex items-center">
                <Users class="w-5 h-5 mr-2 text-primary" />
                Follow Us
              </h3>
              <div class="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  class="w-12 h-12 p-0 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20"
                  @click="() => openUrl(linkedinUrl)"
                >
                  <Linkedin class="w-5 h-5 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="w-12 h-12 p-0 hover:bg-pink-50 hover:border-pink-200 dark:hover:bg-pink-950/20"
                  @click="() => openUrl(instagramUrl)"
                >
                  <Instagram class="w-5 h-5 text-pink-600" />
                </Button>
              </div>
            </div>

            <!-- Quick Contact Info -->
            <div class="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6">
              <h3 class="font-semibold text-foreground mb-4">Quick Contact</h3>
              <p class="text-muted-foreground text-sm mb-4">
                For immediate assistance or urgent inquiries, feel free to contact us directly.
              </p>
              <div class="space-y-2 text-sm">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-muted-foreground">Available during business hours</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span class="text-muted-foreground">Email responses within 24 hours</span>
                </div>
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
import { MapPin, Phone, Mail, Clock, Linkedin, Instagram, Send, ChevronDown, Users } from 'lucide-vue-next'
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
