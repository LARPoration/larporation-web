import { TimelineRegion } from '../features/history/TimelineRegion'
import type { Metadata } from 'next'
import Link from '../components/ui/SiteLink'
import { ActionLink } from '../components/ui/ActionLink'
import { Pitch } from '../features/home/Pitch'
import { faqs } from '../content/home'
import { attribution } from '../content/contributions'
import styles from '../features/home/home.module.css'
import { site } from '../config/site'
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: 'Larporation | Own Your Output',
  description: 'Corporate cosplay. Real output. Build LARPoration with us.',
}
export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={styles.home}
      {...attribution({ contributionId: 'page.home' })}
    >
      <TimelineRegion
        as="section"
        region="home.hero"
        className={styles.hero}
        {...attribution({ contributionId: 'home.hero' })}
      >
        <div className={styles.kicker}>
          <span>Corporate cosplay. Real output.</span>
          <span>{site.releaseLabel}</span>
        </div>
        <TimelineRegion as="h1" region="home.title">
          We're LARPing
          <br />a company.
          <br />
          <em>Come make it real.</em>
        </TimelineRegion>
        <div className={styles.intro}>
          <div>
            <p>
              A real organisation where people without experience build real
              things, own their output and leave with work they can prove.
            </p>
            <div className={styles.actions}>
              <ActionLink href="/join" contentContributionId="home.hero">
                Join the LARPoration <span aria-hidden="true">↗</span>
              </ActionLink>
              <Link className={styles.textLink} href="/projects">
                See what we're building →
              </Link>
            </div>
            <div className={styles.note}>
              0 years of experience required. Obviously.
            </div>
          </div>
          <aside className={styles.ticket}>
            <div className={styles.small}>Introducing our operating model</div>
            <strong>
              IaaS<span>*</span>
            </strong>
            <div className={styles.ticketTitle}>Intern as a Service.</div>
            <p>
              *Yes, we made it an acronym.
              <br />
              That makes it a business model, right?
            </p>
            <div className={styles.ticketBottom}>
              <span>Human-powered infrastructure.</span>
              <span>Built together.</span>
            </div>
          </aside>
        </div>
      </TimelineRegion>
      <TimelineRegion
        region="home.strip"
        className={styles.strip}
        {...attribution({ contributionId: 'home.hero' })}
      >
        <span>THE COMPANY IS THE PROJECT.</span>
        <span>OWN YOUR OUTPUT. ↗</span>
      </TimelineRegion>
      <TimelineRegion
        as="section"
        region="home.pitch"
        className={styles.pitch}
        {...attribution({ contributionId: 'home.pitch' })}
      >
        <div className={styles.small}>
          IaaS / The extremely serious product pitch
        </div>
        <div className={styles.pitchHeading}>
          <h2>
            Enterprise-grade ambition.
            <br />
            Entry-level experience.
          </h2>
          <p>
            Some companies run on cloud infrastructure. We're trying to run one
            on people who were told they needed experience first.
          </p>
        </div>
        <Pitch />
        <div className={styles.release}>
          <span>Dependencies: each other.</span>
          <span>Known issue: experience required to get experience.</span>
        </div>
        <Link className={styles.textLink} href="/projects">
          Inspect the actual work →
        </Link>
      </TimelineRegion>
      <TimelineRegion
        as="section"
        region="home.faq"
        className={styles.section}
        {...attribution({ contributionId: 'home.faq' })}
      >
        <div className={styles.sectionHeading}>
          <h2>
            The acronym is a joke.
            <br />
            The responsibility is real.
          </h2>
          <span className={styles.small}>Own Your Output.</span>
        </div>
        <p>
          LARPoration gives people without professional experience a real
          organisation to build, operate and improve. The website, recruitment
          process, marketing and operations are things contributors can
          genuinely own.
        </p>
        {faqs.map((faq) => (
          <details className={styles.faq} key={faq.id}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </TimelineRegion>
      <TimelineRegion
        as="section"
        region="home.challenge"
        className={`${styles.section} ${styles.challenge}`}
        {...attribution({ contributionId: 'home.challenge' })}
      >
        <div>
          <h2>Help write the next version.</h2>
          <p>
            This founder-built website is a starting point. Bring your ideas,
            improve something useful and put your name to the work.
          </p>
        </div>
        <Link className={styles.textLink} href="/projects">
          Explore the roadmap ↗
        </Link>
      </TimelineRegion>
    </main>
  )
}
