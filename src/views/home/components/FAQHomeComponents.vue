<template>
  <section id="faq" class="py-24 bg-muted/30">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <p class="text-xl text-muted-foreground">
          Find answers to common questions about our platform and services.
        </p>
      </div>

      <Accordion class="space-y-4">
        <AccordionItem title="How secure is my data on your platform?">
          <p>
            We take security seriously. Your data is encrypted both in transit and at rest using
            industry-standard protocols. We implement multiple layers of security measures including
            regular security audits, access controls, and compliance with data protection
            regulations to ensure your information remains secure.
          </p>
        </AccordionItem>

        <AccordionItem title="Can I integrate with my existing tools?">
          <p>
            Yes! Our platform offers extensive API capabilities that allow seamless integration with
            most popular business tools and services. We provide detailed documentation and support
            to help you connect with CRMs, analytics platforms, communication tools, and more. If
            you need help with a specific integration, our support team is ready to assist.
          </p>
        </AccordionItem>

        <AccordionItem title="What kind of support do you offer?">
          <p>
            We provide multi-tiered support options depending on your plan. All customers receive
            access to our comprehensive knowledge base and community forums. Premium plans include
            email support with guaranteed response times, while enterprise customers enjoy dedicated
            account managers and 24/7 phone support for critical issues.
          </p>
        </AccordionItem>

        <AccordionItem title="How does the pricing work?">
          <p>
            Our pricing is transparent and scalable based on your needs. We offer monthly and annual
            subscription plans with discounts for yearly commitments. Each tier includes a specific
            set of features and usage limits. You can start with our free trial to evaluate the
            platform before committing to a paid plan, and upgrade or downgrade at any time as your
            requirements change.
          </p>
        </AccordionItem>

        <AccordionItem title="Is there a free trial available?">
          <p>
            Yes, we offer a 14-day free trial with full access to all features in our Pro plan. No
            credit card is required to start your trial. This gives you ample time to explore the
            platform, test integrations, and determine if it meets your needs before making a
            purchase decision.
          </p>
        </AccordionItem>

        <AccordionItem title="How do I get started?">
          <p>
            Getting started is easy! Simply click the "Start Free Trial" button at the top of the
            page to create your account. You'll be guided through a simple onboarding process to set
            up your workspace. Our intuitive interface and helpful tutorials will have you up and
            running in minutes. If you need additional assistance, our support team is always
            available to help.
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Accordion, AccordionItem } from '@/components/ui/accordion'
</script>
