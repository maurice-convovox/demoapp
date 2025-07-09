
import { BrandingConfig, BrandingTheme } from '../types/branding';

export const defaultBranding: BrandingConfig = {
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    backgroundColor: '#ffffff',
    logoUrl: '/default-logo.png',
    companyName: 'Default Company',
    styles: undefined
};

export const brandingThemes: BrandingTheme = {
    default: defaultBranding,
    // Add more branded themes here
    uEBeWCTPAhSezTSMTzQkd: {
        primaryColor: '#012169', // Admiral navy blue for primary brand color and forms
        secondaryColor: '#0A8A19', // Admiral green for buttons
        backgroundColor: '#f5f6f7', // Light gray background
        headerBackground: '#ffffff',
        logoUrl: '/admiral.svg',
        companyName: 'For Car, Home and Van customers, login below to manage your cover',
        fontFamily: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        styles: {
            companyName: {
                fontSize: '20px',
                color: '#0045A0'
            }
        }
    },
    confused: {
        primaryColor: '#00adef', // Confused.com's primary blue
        secondaryColor: '#000000', // Confused.com's orange accent
        backgroundColor: '#ffffff', // White background
        headerBackground: '#000000',
        logoUrl: '/confused.svg', // Make sure to add the actual logo file
        companyName: 'Sign in or create an account',
        fontFamily: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        styles: {
            companyName: {
                fontSize: '20px',
                color: '#FFFFFF'
            }
        }

    }
};

export function getBrandingConfig(brandId?: string): BrandingConfig {
    if (!brandId) return defaultBranding;
    return brandingThemes[brandId] || defaultBranding;
}