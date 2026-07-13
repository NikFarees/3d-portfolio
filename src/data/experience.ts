export interface ExperienceEntry {
  role: string
  company: string
  period: string
  description: string
}

export const experience: ExperienceEntry[] = [
  {
    role: 'Software Developer',
    company: 'Latitude Innovation Sdn. Bhd.',
    period: 'Mar 2026 – Present',
    description:
      'Built and shipped backend features across 6+ production systems with Laravel, Filament, Docker, and MySQL. Set up GitHub Actions CI/CD across 3+ repositories, which took manual deployment steps to zero.',
  },
  {
    role: 'Web Developer (Intern)',
    company: 'Latitude Innovation Sdn. Bhd.',
    period: 'Sep 2025 – Feb 2026',
    description:
      'Built the real-time auction backend that held up for 100+ concurrent users and cut post-launch issues by 30%. Configured DNS, server environments, and SMTP for 10+ client websites.',
  },
  {
    role: 'Lecturer Assistant',
    company: 'Universiti Kuala Lumpur (MIIT)',
    period: 'Oct 2023 – Mar 2024',
    description:
      'Supported weekly lectures and labs for 50+ students with 1-on-1 debugging and programming help. Prepared lab exercises and graded assignments over 6 months.',
  },
]

export const devopsHighlights = [
  'Docker & Docker Compose for every deployable project',
  'GitHub Actions CI/CD — staging + production auto-deploys',
  'Cloudflare DNS, TLS origin certificates, and proxying',
  'Linux server management, Nginx, and SMTP configuration',
]
