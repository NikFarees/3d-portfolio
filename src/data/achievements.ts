export interface Achievement {
  title: string
  detail?: string
}

export const awards: Achievement[] = [
  { title: "Dean's List Award", detail: 'Semesters 1–6' },
  { title: 'Best Student Award', detail: 'Foundation in Information Technology' },
  {
    title: 'GreenCity AR Competition — Silver Award',
    detail: 'Augmented Reality green-city prototype',
  },
]

export const certifications: Achievement[] = [
  { title: 'Google Project Management', detail: 'Coursera' },
  { title: 'Azure AI Fundamentals', detail: 'Microsoft Certified' },
  { title: 'CompTIA Cloud+', detail: 'CompTIA' },
  { title: 'IT Essentials', detail: 'Cisco' },
  { title: 'Top Coders 2024: Python Programming', detail: 'Competition' },
  { title: 'SwiftUI / iOS', detail: 'Certification' },
]
