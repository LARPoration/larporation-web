'use client'
import { useState } from 'react'
import { pitch } from '../../content/home'
import { Button } from '../../components/ui/Button'
import styles from './home.module.css'
export function Pitch() {
  const [mode, setMode] = useState<'jargon' | 'plain'>('jargon')
  return (
    <>
      <div className={styles.controls} aria-label="Copy style">
        <Button
          aria-pressed={mode === 'jargon'}
          onClick={() => setMode('jargon')}
          contentContributionId="home.pitch"
        >
          Corporate jargon: ON
        </Button>
        <Button
          aria-pressed={mode === 'plain'}
          onClick={() => setMode('plain')}
          contentContributionId="home.pitch"
        >
          Translate to human
        </Button>
      </div>
      <div className={styles.specs} aria-live="polite">
        {pitch.map((item) => (
          <article key={item.id}>
            <span className={styles.small}>{item.label}</span>
            <h3>{item[mode][0]}</h3>
            <p>{item[mode][1]}</p>
          </article>
        ))}
      </div>
    </>
  )
}
