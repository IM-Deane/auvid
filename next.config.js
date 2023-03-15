module.exports = {
  staticPageGenerationTimeout: 300,
  images: {
    domains: ['tailwindui.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml'],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
}
