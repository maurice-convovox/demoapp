
import { BrandingConfig, BrandingTheme } from '../types/branding';

export const defaultBranding: BrandingConfig = {
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    backgroundColor: '#ffffff',
    logoUrl: '/default-logo.png',
    companyName: 'Default Company'
};

export const brandingThemes: BrandingTheme = {
    default: defaultBranding,
    // Add more branded themes here
    uEBeWCTPAhSezTSMTzQkd: {
        primaryColor: '#012169', // Admiral navy blue
        secondaryColor: '#ffffff',
        backgroundColor: '#f5f6f7', // Light gray background
        headerBackground: '#ffffff',
        logoUrl: '/admiral.svg',
        companyName: 'Admiral',
        fontFamily: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    company2: {
        primaryColor: '#ff0000',
        secondaryColor: '#000000',
        logoUrl: '/company1-logo.png',
        companyName: 'Company two',
        backgroundColor: ''
    }
};

export function getBrandingConfig(brandId?: string): BrandingConfig {
    if (!brandId) return defaultBranding;
    return brandingThemes[brandId] || defaultBranding;
}