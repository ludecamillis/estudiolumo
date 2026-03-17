import LandingPage from './landing/page'

export default function Home() {
  // Landing page is public - no authentication required
  // All users can view the landing page without logging in
  return <LandingPage />
}
