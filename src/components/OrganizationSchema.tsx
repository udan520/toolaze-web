export default function OrganizationSchema() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Toolaze',
    url: 'https://toolaze.com',
    logo: 'https://toolaze.com/web-app-manifest-192x192.png',
    sameAs: [],
    description: 'AI image tools and creative utilities for creators, with one-time credits and clear usage policies.',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  )
}
