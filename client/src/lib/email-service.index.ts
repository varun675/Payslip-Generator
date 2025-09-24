// Conditional export for email service based on environment
// This allows us to use different implementations for development vs production

const isProduction = import.meta.env.PROD;
const isStaticBuild = import.meta.env.VITE_STATIC_BUILD === 'true';

if (isProduction || isStaticBuild) {
  // Use static version for production/GitHub Pages deployment
  export { sendEmailWithAttachment } from './email-service.static';
} else {
  // Use full version for development
  export { sendEmailWithAttachment } from './email-service';
}
