export interface StackGroup {
  label: string
  items: string[]
}

export const stack: StackGroup[] = [
  {
    label: 'Core',
    items: ['Laravel', 'Filament (TALL stack)', 'Next.js', 'TypeScript'],
  },
  {
    label: 'Automation',
    items: ['n8n workflows', 'Google Sheets automations', 'GitHub Actions CI/CD'],
  },
  {
    label: 'Infrastructure',
    items: ['Docker', 'MySQL', 'Redis', 'Cloudflare', 'Nginx'],
  },
]
