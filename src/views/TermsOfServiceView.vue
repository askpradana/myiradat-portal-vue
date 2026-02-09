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
            Terms of Service
          </h1>
          <p class="text-xl text-muted-foreground">
            Terms and conditions for using our psychological assessment services
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
                This is a template terms of service for demonstration purposes only. This document
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
              <FileText class="w-6 h-6 mr-3 text-primary" />
              Agreement to Terms
            </h2>
            <p class="text-muted-foreground leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you
              ("User," "you," or "your") and PT Iradat Konsultan Psikologi ("Company," "we," "our,"
              or "us") regarding your use of our psychological assessment services and website.
            </p>
            <p class="text-muted-foreground leading-relaxed mt-4">
              By accessing or using our services, you agree to be bound by these Terms. If you do
              not agree to these Terms, you may not access or use our services.
            </p>
          </section>

          <!-- Service Description -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Brain class="w-6 h-6 mr-3 text-primary" />
              Service Description
            </h2>
            <p class="text-muted-foreground mb-4">
              Iradat provides psychological assessment and human resource consulting services,
              including but not limited to:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Psychological evaluations and assessments</li>
              <li>Personality and aptitude testing</li>
              <li>Employee assistance programs</li>
              <li>Human resource consulting</li>
              <li>Training and development services</li>
              <li>Online assessment platforms and tools</li>
            </ul>
          </section>

          <!-- User Obligations -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Users class="w-6 h-6 mr-3 text-primary" />
              User Obligations and Conduct
            </h2>
            <p class="text-muted-foreground mb-4">By using our services, you agree to:</p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide accurate and truthful information during assessments</li>
              <li>Use the services only for their intended purposes</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Not share assessment materials or results without authorization</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not interfere with or disrupt the operation of our services</li>
              <li>Not use our services for any unlawful or unauthorized purposes</li>
            </ul>

            <h3 class="text-xl font-semibold mb-4 mt-8">Prohibited Activities</h3>
            <p class="text-muted-foreground mb-4">You may not:</p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Reverse engineer or copy our assessment methodologies</li>
              <li>Use automated tools to interact with our services</li>
              <li>Distribute, sell, or commercially exploit any content from our services</li>
              <li>Create false identities or impersonate others</li>
            </ul>
          </section>

          <!-- Professional Standards -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Award class="w-6 h-6 mr-3 text-primary" />
              Professional Standards and Ethics
            </h2>
            <p class="text-muted-foreground mb-4">
              Our services are provided in accordance with professional psychological standards and
              ethical guidelines. We maintain:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Strict confidentiality of assessment results</li>
              <li>Professional competence in psychological evaluation</li>
              <li>Adherence to Indonesian psychological association standards</li>
              <li>Proper use of validated assessment instruments</li>
              <li>Appropriate interpretation and reporting of results</li>
            </ul>
          </section>

          <!-- Intellectual Property -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Copyright class="w-6 h-6 mr-3 text-primary" />
              Intellectual Property Rights
            </h2>
            <p class="text-muted-foreground mb-4">
              All content, materials, assessments, and intellectual property associated with our
              services are owned by or licensed to Iradat. This includes:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Assessment instruments and methodologies</li>
              <li>Software and technological solutions</li>
              <li>Proprietary analysis and reporting systems</li>
              <li>Training materials and documentation</li>
              <li>Website content and design elements</li>
            </ul>
            <p class="text-muted-foreground mt-4">
              Users are granted a limited, non-exclusive license to use our services for their
              intended purposes only.
            </p>
          </section>

          <!-- Privacy and Data Protection -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Shield class="w-6 h-6 mr-3 text-primary" />
              Privacy and Data Protection
            </h2>
            <p class="text-muted-foreground mb-4">
              We are committed to protecting your privacy and maintaining the confidentiality of
              your personal and assessment data. Our data protection practices include:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Secure storage and transmission of all data</li>
              <li>Limited access to authorized personnel only</li>
              <li>Compliance with applicable data protection regulations</li>
              <li>Regular security assessments and updates</li>
              <li>Transparent data handling practices</li>
            </ul>
            <p class="text-muted-foreground mt-4">
              For detailed information about our data practices, please refer to our Privacy Policy.
            </p>
          </section>

          <!-- Disclaimers -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <AlertCircle class="w-6 h-6 mr-3 text-primary" />
              Disclaimers and Limitations
            </h2>
            <p class="text-muted-foreground mb-4">
              Our services are provided "as is" without warranties of any kind. We disclaim all
              warranties, express or implied, including but not limited to:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Fitness for a particular purpose</li>
              <li>Accuracy or completeness of assessment results</li>
              <li>Uninterrupted or error-free service availability</li>
              <li>Specific outcomes from using our services</li>
            </ul>
            <p class="text-muted-foreground mt-4">
              Assessment results should be interpreted by qualified professionals and used as part
              of a comprehensive evaluation process.
            </p>
          </section>

          <!-- Liability Limitation -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Scale class="w-6 h-6 mr-3 text-primary" />
              Limitation of Liability
            </h2>
            <p class="text-muted-foreground mb-4">
              To the maximum extent permitted by law, Iradat shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Loss of profits or business opportunities</li>
              <li>Data loss or corruption</li>
              <li>Service interruptions or delays</li>
              <li>Employment or personnel decisions based on assessments</li>
            </ul>
            <p class="text-muted-foreground mt-4">
              Our total liability shall not exceed the amount paid for the specific service that
              gave rise to the claim.
            </p>
          </section>

          <!-- Payment and Billing -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <CreditCard class="w-6 h-6 mr-3 text-primary" />
              Payment Terms
            </h2>
            <p class="text-muted-foreground mb-4">Payment terms for our services are as follows:</p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Fees are due as specified in service agreements</li>
              <li>All prices are in Indonesian Rupiah unless otherwise stated</li>
              <li>Late payments may result in service suspension</li>
              <li>Refunds are subject to our refund policy</li>
              <li>Taxes and additional fees may apply</li>
            </ul>
          </section>

          <!-- Termination -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <XCircle class="w-6 h-6 mr-3 text-primary" />
              Termination
            </h2>
            <p class="text-muted-foreground mb-4">
              Either party may terminate access to our services at any time. We reserve the right to
              suspend or terminate your access for:
            </p>
            <ul class="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Violation of these Terms of Service</li>
              <li>Non-payment of fees</li>
              <li>Misuse of our services or systems</li>
              <li>Legal or regulatory requirements</li>
            </ul>
            <p class="text-muted-foreground mt-4">
              Upon termination, your right to access and use our services will cease immediately.
            </p>
          </section>

          <!-- Governing Law -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Gavel class="w-6 h-6 mr-3 text-primary" />
              Governing Law and Jurisdiction
            </h2>
            <p class="text-muted-foreground">
              These Terms are governed by and construed in accordance with the laws of the Republic
              of Indonesia. Any disputes arising from these Terms or the use of our services shall
              be subject to the exclusive jurisdiction of the courts in Jakarta, Indonesia.
            </p>
          </section>

          <!-- Contact Information -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <Mail class="w-6 h-6 mr-3 text-primary" />
              Contact Information
            </h2>
            <p class="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div class="bg-card rounded-lg p-6 border">
              <div class="space-y-3">
                <div class="flex items-center">
                  <Building class="w-5 h-5 mr-3 text-primary" />
                  <span class="text-muted-foreground">PT Iradat Konsultan Psikologi</span>
                </div>
                <div class="flex items-center">
                  <Mail class="w-5 h-5 mr-3 text-primary" />
                  <span class="text-muted-foreground">legal@iradat.co.id</span>
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
              Changes to Terms
            </h2>
            <p class="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify users of
              material changes by posting the updated Terms on our website and updating the "Last
              updated" date. Your continued use of our services after such changes constitutes
              acceptance of the new Terms.
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
  FileText,
  Brain,
  Users,
  Award,
  Copyright,
  Shield,
  AlertCircle,
  Scale,
  CreditCard,
  XCircle,
  Gavel,
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
