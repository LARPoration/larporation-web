// Intentions, not promised delivery dates. Update status only against real evidence.
export const roadmap = [
  {
    id: 'foundation',
    status: 'Complete',
    title: 'Website foundation',
    description:
      'The v0.0.0 foundation brings together our mission, contact route, contribution inspector and the timeline for preserving future releases.',
  },
  {
    id: 'onboarding',
    status: 'Next',
    title: 'Contributor onboarding',
    description:
      'Make it easier to find a useful first task, agree its scope and understand what a good handover looks like.',
  },
  {
    id: 'migration',
    status: 'Next',
    title: 'Web infrastructure migration',
    description:
      'Add a database because apparently static sites without persistent storage are somehow still a thing. This will enable us to actually store data and make the site somewhat useful.',
  },
  {
    id: 'evidence',
    status: 'Next',
    title: 'Contribution evidence',
    description:
      'Connect delivered work to its authors, decisions and review history so people can explain what they contributed.',
  },
  {
    id: 'operations',
    status: 'Later',
    title: 'Tools for running the organisation',
    description:
      'Improve recruitment, communication and day-to-day coordination as real needs emerge.',
  },
] as const
