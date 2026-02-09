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
          <h1
            class="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
          >
            Privacy Policy
          </h1>
          <p class="text-xl text-muted-foreground">
            How we collect, use, and protect your personal information
          </p>
          <p class="text-sm text-muted-foreground mt-4">
            <span class="inline-flex items-center">
              <Calendar class="w-4 h-4 mr-2" />
              Last updated: {{ lastUpdated }}
            </span>
          </p>
        </div>
      </div>
    </section>

    <!-- Content Sections -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Disclaimer Notice -->
        <div
          class="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-12"
        >
          <div class="flex items-start">
            <AlertTriangle class="w-6 h-6 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 class="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Template Notice
              </h3>
              <p class="text-amber-700 dark:text-amber-300 text-sm">
                This is a template privacy policy for demonstration purposes only. This document
                should not be used for actual legal purposes without proper legal review and
                customization for your specific business needs.
              </p>
            </div>
          </div>
        </div>

        <div class="prose prose-lg max-w-none dark:prose-invert">
          <!-- Introduction -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Info class="w-6 h-6 mr-3 text-primary" />
              Introduction
            </h2>
            <p class="text-muted-foreground leading-relaxed">
              At Iradat ("we," "our," or "us"), we respect your privacy and are committed to
              protecting your personal data. This privacy policy explains how we collect, use,
              disclose, and safeguard your information when you visit our website and use our
              psychological assessment services.
            </p>
            <p class="text-muted-foreground leading-relaxed mt-4">
              Please read this privacy policy carefully. If you do not agree with the terms of this
              privacy policy, please do not access our services.
            </p>
          </section>

          <!-- Information We Collect -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Database class="w-6 h-6 mr-3 text-primary" />
              Information We Collect
            </h2>

            <h3 class="text-xl font-semibold mb-4">Personal Information</h3>
            <p class="text-muted-foreground mb-4">
              We may collect personal information that you voluntarily provide, including:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Name, email address, and contact information</li>
              <li>Demographic information such as age, gender, and occupation</li>
              <li>Assessment responses and psychological evaluation data</li>
              <li>Account credentials and preferences</li>
              <li>Communication history and support interactions</li>
            </ul>

            <h3 class="text-xl font-semibold mb-4 mt-8">Automatically Collected Information</h3>
            <p class="text-muted-foreground mb-4">
              When you use our services, we may automatically collect:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage data and interaction patterns</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <!-- How We Use Information -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Settings class="w-6 h-6 mr-3 text-primary" />
              How We Use Your Information
            </h2>
            <p class="text-muted-foreground mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Providing and maintaining our psychological assessment services</li>
              <li>Processing and analyzing assessment results</li>
              <li>Improving our services and user experience</li>
              <li>Communicating with you about your account and services</li>
              <li>Ensuring the security and integrity of our platform</li>
              <li>Complying with legal obligations and professional standards</li>
              <li>Conducting research and analytics (in aggregated, anonymized form)</li>
            </ul>
          </section>

          <!-- Information Sharing -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Share class="w-6 h-6 mr-3 text-primary" />
              Information Sharing and Disclosure
            </h2>
            <p class="text-muted-foreground mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third
              parties, except in the following circumstances:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>With your explicit consent</li>
              <li>To authorized personnel within your organization (for corporate assessments)</li>
              <li>To comply with legal obligations or protect our rights</li>
              <li>
                To trusted service providers who assist in our operations (under strict
                confidentiality agreements)
              </li>
              <li>
                In case of business transfers or mergers (with continued protection commitments)
              </li>
            </ul>
          </section>

          <!-- Data Security -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Shield class="w-6 h-6 mr-3 text-primary" />
              Data Security
            </h2>
            <p class="text-muted-foreground mb-4">
              We implement appropriate technical and organizational security measures to protect
              your personal information against unauthorized access, alteration, disclosure, or
              destruction. These measures include:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Staff training on privacy and security practices</li>
              <li>Secure data centers and hosting infrastructure</li>
            </ul>
            <p class="text-muted-foreground mt-4">
              However, no method of transmission over the internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <!-- Your Rights -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Users class="w-6 h-6 mr-3 text-primary" />
              Your Privacy Rights
            </h2>
            <p class="text-muted-foreground mb-4">
              You have certain rights regarding your personal information, including:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate or incomplete information</li>
              <li>The right to delete your personal data (subject to certain limitations)</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent where applicable</li>
            </ul>
            <p class="text-muted-foreground mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <!-- Cookies -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Cookie class="w-6 h-6 mr-3 text-primary" />
              Cookies and Tracking Technologies
            </h2>
            <p class="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our
              website. These technologies help us:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve website functionality and performance</li>
              <li>Provide personalized content and recommendations</li>
            </ul>
            <p class="text-muted-foreground mt-4">
              You can control cookies through your browser settings, but disabling cookies may
              affect the functionality of our services.
            </p>
          </section>

          <!-- Data Retention -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Clock class="w-6 h-6 mr-3 text-primary" />
              Data Retention
            </h2>
            <p class="text-muted-foreground mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes
              outlined in this privacy policy, unless a longer retention period is required or
              permitted by law. Assessment data may be retained for professional and legal
              compliance purposes.
            </p>
          </section>

          <!-- Contact Information -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Mail class="w-6 h-6 mr-3 text-primary" />
              Contact Us
            </h2>
            <p class="text-muted-foreground mb-4">
              If you have any questions about this privacy policy or our data practices, please
              contact us:
            </p>
            <div class="bg-card rounded-lg p-6 border">
              <div class="space-y-3">
                <div class="flex items-center">
                  <Building class="w-5 h-5 mr-3 text-primary" />
                  <span class="text-muted-foreground">PT Iradat Konsultan Psikologi</span>
                </div>
                <div class="flex items-center">
                  <Mail class="w-5 h-5 mr-3 text-primary" />
                  <span class="text-muted-foreground">privacy@iradat.co.id</span>
                </div>
                <div class="flex items-center">
                  <Phone class="w-5 h-5 mr-3 text-primary" />
                  <span class="text-muted-foreground">+62 (21) 1234-5678</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Updates -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <RefreshCw class="w-6 h-6 mr-3 text-primary" />
              Policy Updates
            </h2>
            <p class="text-muted-foreground">
              We may update this privacy policy from time to time to reflect changes in our
              practices or applicable laws. We will notify you of any material changes by posting
              the updated policy on our website and updating the "Last updated" date. We encourage
              you to review this policy periodically.
            </p>
          </section>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import {
  Calendar,
  AlertTriangle,
  Info,
  Database,
  Settings,
  Share,
  Shield,
  Users,
  Cookie,
  Clock,
  Mail,
  Building,
  Phone,
  RefreshCw,
} from 'lucide-vue-next'
import HeaderSection from '@/views/home/components/sections/HeaderSection.vue'
import FooterSection from '@/views/home/components/sections/FooterSection.vue'

// Last updated date
const lastUpdated = 'January 2026'
</script>
