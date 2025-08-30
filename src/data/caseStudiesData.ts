import type { CaseStudy } from '@/types/caseStudies'

export const caseStudiesData: CaseStudy[] = [
  {
    id: '1',
    title: 'Transforming Healthcare User Management at Regional Medical Center',
    client: 'Regional Medical Center',
    industry: 'Healthcare',
    publishedAt: '2024-01-15',
    readTimeMinutes: 5,
    tags: ['Healthcare', 'User Management', 'Compliance'],
    excerpt: 'How MyIradat helped streamline user access management for 2,500+ healthcare professionals while maintaining HIPAA compliance and reducing administrative overhead by 60%.',
    challenge: 'Regional Medical Center struggled with managing access permissions for over 2,500 healthcare professionals across multiple departments. Manual user provisioning led to security gaps, compliance issues, and significant administrative overhead. The IT team spent 40+ hours weekly on user access requests.',
    solution: 'MyIradat\'s comprehensive user management system was implemented to automate user provisioning, role-based access controls, and compliance reporting. The platform integrated with existing LDAP systems and provided real-time monitoring of user activities across all departments.',
    results: [
      {
        metric: '60%',
        value: '60%',
        description: 'Reduction in administrative overhead'
      },
      {
        metric: '100%',
        value: '100%',
        description: 'HIPAA compliance maintained'
      },
      {
        metric: '2,500+',
        value: '2,500+',
        description: 'Users managed seamlessly'
      },
      {
        metric: '40 hours',
        value: '6 hours',
        description: 'Weekly admin time reduced from 40 to 6 hours'
      }
    ],
    testimonial: {
      quote: 'MyIradat transformed our user management completely. We went from spending entire days on access requests to having everything automated and compliant. The time savings alone justify the investment.',
      author: 'Dr. Sarah Johnson',
      position: 'Chief Information Officer'
    }
  },
  {
    id: '2',
    title: 'Scaling Organization Management for TechCorp\'s Global Expansion',
    client: 'TechCorp International',
    industry: 'Technology',
    publishedAt: '2024-02-10',
    readTimeMinutes: 6,
    tags: ['Enterprise', 'Organization Management', 'Global Scale'],
    excerpt: 'TechCorp used MyIradat to manage organizational structures across 15 countries, supporting rapid growth from 500 to 5,000 employees while maintaining operational efficiency.',
    challenge: 'TechCorp International was experiencing rapid global expansion, growing from 500 to 5,000 employees across 15 countries. Managing complex organizational hierarchies, reporting structures, and cross-departmental collaborations became increasingly difficult with traditional tools.',
    solution: 'MyIradat\'s advanced organization management module provided hierarchical organization charts, automated reporting structures, and real-time visibility into team compositions across all global offices. The platform supported multi-language interfaces and timezone-aware operations.',
    results: [
      {
        metric: '10x',
        value: '10x',
        description: 'Employee growth managed efficiently'
      },
      {
        metric: '15',
        value: '15',
        description: 'Countries with unified management'
      },
      {
        metric: '85%',
        value: '85%',
        description: 'Improvement in cross-team collaboration'
      },
      {
        metric: '3 weeks',
        value: '3 days',
        description: 'Time to onboard new regional offices reduced'
      }
    ],
    testimonial: {
      quote: 'MyIradat gave us the organizational visibility we needed during our rapid expansion. We can now manage our global team structure with confidence and make data-driven decisions about our organizational design.',
      author: 'Michael Chen',
      position: 'VP of Global Operations'
    }
  },
  {
    id: '3',
    title: 'Enhancing Educational Assessment at Metro University System',
    client: 'Metro University System',
    industry: 'Education',
    publishedAt: '2024-03-05',
    readTimeMinutes: 4,
    tags: ['Education', 'Assessment', 'Analytics'],
    excerpt: 'Metro University System implemented MyIradat\'s assessment tools to evaluate 50,000+ students across multiple campuses, improving academic outcomes and administrative efficiency.',
    challenge: 'Metro University System needed to standardize assessment processes across 8 campuses serving over 50,000 students. Inconsistent evaluation methods, manual grading processes, and lack of comprehensive analytics hindered academic quality and administrative decision-making.',
    solution: 'MyIradat\'s assessment module provided standardized evaluation frameworks, automated scoring systems, and comprehensive analytics dashboards. The platform integrated with existing student information systems and provided real-time insights into academic performance trends.',
    results: [
      {
        metric: '50,000+',
        value: '50,000+',
        description: 'Students assessed efficiently'
      },
      {
        metric: '75%',
        value: '75%',
        description: 'Reduction in grading time'
      },
      {
        metric: '8',
        value: '8',
        description: 'Campuses with unified assessment'
      },
      {
        metric: '95%',
        value: '95%',
        description: 'Faculty satisfaction with new system'
      }
    ],
    testimonial: {
      quote: 'The assessment analytics provided by MyIradat have revolutionized how we understand student performance. We can now identify at-risk students early and provide targeted support, significantly improving graduation rates.',
      author: 'Prof. Emily Rodriguez',
      position: 'Dean of Academic Affairs'
    }
  },
  {
    id: '4',
    title: 'Streamlining Service Management at GlobalTech Solutions',
    client: 'GlobalTech Solutions',
    industry: 'IT Services',
    publishedAt: '2024-03-20',
    readTimeMinutes: 5,
    tags: ['IT Services', 'Service Management', 'Automation'],
    excerpt: 'GlobalTech Solutions leveraged MyIradat to manage 200+ client services, reducing service delivery time by 50% and improving client satisfaction scores to 98%.',
    challenge: 'GlobalTech Solutions managed over 200 different services for enterprise clients but lacked centralized visibility and control. Service delivery was inconsistent, client communication was fragmented, and tracking service performance was nearly impossible across multiple teams.',
    solution: 'MyIradat\'s service management platform centralized all service operations, providing automated workflows, client communication portals, and comprehensive performance tracking. The system integrated with existing CRM and project management tools for seamless operations.',
    results: [
      {
        metric: '50%',
        value: '50%',
        description: 'Reduction in service delivery time'
      },
      {
        metric: '98%',
        value: '98%',
        description: 'Client satisfaction score achieved'
      },
      {
        metric: '200+',
        value: '200+',
        description: 'Services managed centrally'
      },
      {
        metric: '40%',
        value: '40%',
        description: 'Increase in operational efficiency'
      }
    ],
    testimonial: {
      quote: 'MyIradat brought order to our service chaos. We now have complete visibility into all our service delivery operations, and our clients love the improved communication and faster response times.',
      author: 'James Wilson',
      position: 'Director of Service Operations'
    }
  }
]