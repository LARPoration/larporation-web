import { redirect } from 'next/navigation'
export default function LegacyHistoryPage() {
  if (process.env.NEXT_PUBLIC_BUILD_MODE !== 'pages') redirect('/')
  return (
    <main id="main-content">
      <h1>History travels with you.</h1>
      <p>Use the surrounding timeline to rewind changes on this website.</p>
    </main>
  )
}
