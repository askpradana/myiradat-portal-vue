<template>
  <section id="faq" class="py-20 bg-background">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Everything you need to know
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about IRADAT's features, security, and implementation.
        </p>
      </div>

      <!-- FAQ Categories -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          v-for="category in categories"
          :key="category"
          :variant="selectedCategory === category ? 'default' : 'outline'"
          size="sm"
          @click="selectedCategory = category"
          class="capitalize"
        >
          {{ category }}
        </Button>
      </div>

      <!-- FAQ Accordion -->
      <Accordion class="space-y-4">
        <AccordionItem
          v-for="faq in filteredFAQs"
          :key="faq.id"
          :title="faq.question"
          class="border border-border rounded-lg px-6"
        >
          <div class="flex items-start gap-3 mb-4">
            <div
              class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            >
              <svg
                class="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <span class="font-semibold text-foreground">{{ faq.question }}</span>
          </div>
          <div class="text-muted-foreground pb-6 pl-9" v-html="faq.answer"></div>
        </AccordionItem>
      </Accordion>

      <!-- Contact Support CTA -->
      <div class="text-center mt-16">
        <div class="bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl p-8">
          <div
            class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <MessageCircle class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-xl font-bold text-foreground mb-2">Still have questions?</h3>
          <p class="text-muted-foreground mb-6">
            Our support team is here to help. Get in touch and we'll get back to you as soon as
            possible.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button @click="contactSupport">
              Contact Support
              <Headphones class="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" @click="scheduleCall">
              Schedule a Call
              <Phone class="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { useRouter } from 'vue-router'
import { MessageCircle, Headphones, Phone } from 'lucide-vue-next'

const router = useRouter()
// const homepageStore = useHomepageStore()

const selectedCategory = ref('general')

const categories = ['general', 'security', 'integration', 'pricing', 'support']

const faqs = [
  // General
  {
    id: '1',
    question: 'What is IRADAT and how does it work?',
    answer: `IRADAT is an all-in-one portal solution that helps businesses streamline their operations, enhance security, and accelerate growth. It provides a unified platform for data management, integrations, analytics, and more. <br><br>The platform works by connecting all your existing systems and data sources into one secure, compliant environment where you can manage workflows, analyze performance, and automate processes.`,
    category: 'general',
  },
  {
    id: '2',
    question: 'How long does implementation typically take?',
    answer: `Implementation time varies based on your specific requirements and complexity: <br><br>• <strong>Starter plans:</strong> 1-2 weeks <br>• <strong>Professional plans:</strong> 2-4 weeks <br>• <strong>Enterprise implementations:</strong> 4-12 weeks <br><br>Our dedicated onboarding team works with you throughout the process to ensure a smooth transition.`,
    category: 'general',
  },

  // Security
  {
    id: '3',
    question: 'How secure is my data on IRADAT?',
    answer: `Security is our top priority. IRADAT implements enterprise-grade security measures: <br><br>• <strong>SOC 2 Type II compliance</strong> with annual audits <br>• <strong>ISO 27001 certification</strong> for information security <br>• <strong>End-to-end encryption</strong> for data in transit and at rest <br>• <strong>Multi-factor authentication</strong> and role-based access controls <br>• <strong>Regular penetration testing</strong> and vulnerability assessments <br>• <strong>24/7 security monitoring</strong> with threat detection`,
    category: 'security',
  },
  {
    id: '4',
    question: 'Is IRADAT compliant with industry regulations?',
    answer: `Yes, IRADAT meets strict compliance requirements across industries: <br><br>• <strong>HIPAA</strong> for healthcare data <br>• <strong>GDPR</strong> for European data protection <br>• <strong>SOX</strong> for financial reporting <br>• <strong>PCI DSS</strong> for payment processing <br>• <strong>FERPA</strong> for educational records <br><br>We maintain compliance documentation and can provide audit reports as needed.`,
    category: 'security',
  },

  // Integration
  {
    id: '5',
    question: 'Can IRADAT integrate with my existing tools?',
    answer: `Absolutely! IRADAT supports 500+ integrations with popular business tools: <br><br>• <strong>CRM systems:</strong> Salesforce, HubSpot, Pipedrive <br>• <strong>ERP solutions:</strong> SAP, Oracle, NetSuite <br>• <strong>Analytics:</strong> Tableau, Power BI, Google Analytics <br>• <strong>Communication:</strong> Slack, Microsoft Teams, Zoom <br>• <strong>Custom APIs:</strong> RESTful and GraphQL integration support <br><br>If you need a custom integration, our team can help build it.`,
    category: 'integration',
  },
  {
    id: '6',
    question: 'What if I need a custom integration?',
    answer: `Our professional services team specializes in custom integrations: <br><br>• <strong>API development:</strong> Custom REST and GraphQL endpoints <br>• <strong>Data mapping:</strong> Complex field transformations <br>• <strong>Real-time sync:</strong> Webhook and event-based integration <br>• <strong>Legacy systems:</strong> Connecting older systems safely <br><br>Custom integrations typically take 2-6 weeks depending on complexity.`,
    category: 'integration',
  },

  // Pricing
  {
    id: '7',
    question: 'How does IRADAT pricing work?',
    answer: `Our pricing is transparent and scales with your business: <br><br>• <strong>No hidden fees:</strong> What you see is what you pay <br>• <strong>Flexible billing:</strong> Monthly or annual options <br>• <strong>Annual savings:</strong> 20% discount for yearly plans <br>• <strong>Free trial:</strong> 14 days with full feature access <br>• <strong>No lock-in:</strong> Cancel or change plans anytime <br><br>Enterprise plans include custom pricing based on your specific needs.`,
    category: 'pricing',
  },
  {
    id: '8',
    question: 'Do you offer discounts for nonprofits or educational institutions?',
    answer: `Yes! We support organizations making a positive impact: <br><br>• <strong>Nonprofit discount:</strong> Up to 50% off for qualified organizations <br>• <strong>Educational pricing:</strong> Special rates for schools and universities <br>• <strong>Startup program:</strong> Reduced pricing for early-stage companies <br><br>Contact our sales team to learn about eligibility and apply for discounts.`,
    category: 'pricing',
  },

  // Support
  {
    id: '9',
    question: 'What kind of support does IRADAT provide?',
    answer: `We offer comprehensive support across all plans: <br><br>• <strong>Knowledge base:</strong> Extensive documentation and tutorials <br>• <strong>Community forum:</strong> Peer support and best practices <br>• <strong>Email support:</strong> Technical assistance (Pro+ plans) <br>• <strong>Priority support:</strong> Faster response times (Enterprise) <br>• <strong>24/7 phone support:</strong> Critical issue assistance (Enterprise) <br>• <strong>Dedicated success manager:</strong> Strategic guidance (Enterprise)`,
    category: 'support',
  },
  {
    id: '10',
    question: 'What are your support response times?',
    answer: `Support response times vary by plan and issue severity: <br><br><strong>Starter Plan:</strong> <br>• General questions: 48 hours <br><br><strong>Professional Plan:</strong> <br>• General questions: 24 hours <br>• Technical issues: 12 hours <br><br><strong>Enterprise Plan:</strong> <br>• Critical issues: 1 hour <br>• High priority: 4 hours <br>• Standard issues: 8 hours`,
    category: 'support',
  },
]

const filteredFAQs = computed(() => {
  if (selectedCategory.value === 'general') {
    return faqs.slice(0, 6) // Show mix for general view
  }
  return faqs.filter((faq) => faq.category === selectedCategory.value)
})

const contactSupport = () => {
  router.push('/contact-us')
}

const scheduleCall = () => {
  router.push('/contact-us')
}
</script>
