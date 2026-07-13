export type ProjectCategory = 'Client Project' | 'Personal Project'

export interface Project {
  slug: string
  category: ProjectCategory
  title: string
  subtitle?: string
  description: string
  role: string
  stack: string[]
  links?: { github?: string; live?: string }
}

export const projects: Project[] = [
  {
    slug: 'online-auction-platform',
    category: 'Client Project',
    title: 'Online Auction Platform',
    description:
      'A real-time vehicle auction platform. Live bidding runs over WebSockets so 100+ bidders can compete on the same lot at once without the price going stale.',
    role: 'Backend Software Developer',
    stack: ['Laravel', 'Sanctum', 'Socket.IO', 'Next.js', 'MySQL', 'Docker'],
  },
  {
    slug: 'school-donation-system',
    category: 'Client Project',
    title: 'School Donation Management System',
    description:
      'A school donation (Sumbangan) system built from an empty repo to production. Schools post needs, sponsors donate, and admins allocate donations against requests.',
    role: 'Backend Software Developer',
    stack: ['Laravel', 'Filament', 'GitHub Actions', 'MySQL', 'Redis', 'Docker'],
  },
  {
    slug: 'air-conditioning-service-system',
    category: 'Client Project',
    title: 'Air-Conditioning Service Management System',
    description:
      'A multi-vendor air-conditioning service platform. Each vendor sees only its own data, and a service job moves from quotation to approval to a scheduled technician on site.',
    role: 'Backend Software Developer',
    stack: ['Laravel', 'Filament', 'Filament Shield', 'MySQL', 'Redis', 'Docker'],
  },
  {
    slug: 'gym-management-system',
    category: 'Client Project',
    title: 'Gym Management System',
    description:
      "A gym management system wired to HIKVision door hardware. Members' faces and cards sync to the access controllers, so membership status decides who actually gets through the door.",
    role: 'Backend Software Developer',
    stack: ['Laravel', 'Filament', 'HIKVision API', 'Razorpay', 'MySQL', 'Docker'],
  },
  {
    slug: 'car-service-warranty-system',
    category: 'Client Project',
    title: 'Car Service & Warranty Management System',
    description:
      'A car service and warranty system for a dealer network, synced both ways with Autocount ERP so sales orders, stock, and outstanding balances stay in step.',
    role: 'Backend Software Developer',
    stack: ['Laravel', 'Filament', 'Livewire', 'MySQL', 'Docker', 'GitHub Actions'],
  },
  {
    slug: 'nfe-productivity-module',
    category: 'Client Project',
    title: 'Pembangunan Modul Productivity NFE',
    description:
      'A real-time NFE curriculum builder. Companies build training modules together, fields auto-save as they type, and a live presence bar shows who else is in the same module.',
    role: 'Software Developer',
    stack: ['HTML', 'CSS', 'JavaScript', 'Supabase', 'Vercel'],
  },
  {
    slug: 'fareeslab-portfolio',
    category: 'Personal Project',
    title: 'FareesLab',
    subtitle: 'Developer Portfolio',
    description:
      'A developer portfolio with an interactive in-browser terminal. Visitors can navigate a simulated filesystem and run commands to find their way around the site.',
    role: 'Full-Stack Developer',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Docker'],
    links: {
      github: 'https://github.com/NikFarees/fareeslab-portfolio',
      live: 'https://fareeslab.dev',
    },
  },
  {
    slug: 'pennywise',
    category: 'Personal Project',
    title: 'PennyWise',
    subtitle: 'Personal Finance Tracker',
    description:
      'A personal daily finance tracker. Log income, recurring bills, expenses, debts, and investments against a running daily balance, with an AI assistant for natural-language entry.',
    role: 'Full-Stack Developer',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Gemini AI'],
    links: {
      github: 'https://github.com/NikFarees/pocket-balance',
      live: 'https://pennywise.fareeslab.dev',
    },
  },
  {
    slug: 'driving-school-management-system',
    category: 'Personal Project',
    title: 'DriveFlow',
    subtitle: 'Driving School Management System',
    description:
      'Final-year project: a management system for a real driving school in Kelantan, built solo in plain PHP. It runs the whole student journey across three roles, from license booking and lesson scheduling to a four-stage driving test and payments.',
    role: 'Full-Stack Developer',
    stack: ['PHP', 'MariaDB', 'Bootstrap', 'Chart.js', 'Docker'],
  },
]
