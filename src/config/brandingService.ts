
import { BrandingConfig } from '../types/branding';
import { brandingThemes, defaultBranding } from './branding';

export class BrandingService {
    private currentBranding: BrandingConfig = defaultBranding;
    private subscribers: ((branding: BrandingConfig) => void)[] = [];

    constructor() {
        this.updateBranding(this.getBrandIdFromUrl());
    }

    private getBrandIdFromUrl(): string | undefined {
        const params = new URLSearchParams(window.location.search);
        return params.get('client_id') || undefined;
    }

    public getCurrentBranding(): BrandingConfig {
        return this.currentBranding;
    }

    public updateBranding(brandId?: string): void {
        this.currentBranding = brandId ? (brandingThemes[brandId] || defaultBranding) : defaultBranding;
        this.notifySubscribers();
    }

    public subscribe(callback: (branding: BrandingConfig) => void): () => void {
        this.subscribers.push(callback);
        callback(this.currentBranding); // Initial call with current branding

        // Return unsubscribe function
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.currentBranding));
    }

    public applyBrandingToDOM(): void {
        const root = document.documentElement;

        // Apply colors and styles
        root.style.setProperty('--primary-color', this.currentBranding.primaryColor);
        root.style.setProperty('--secondary-color', this.currentBranding.secondaryColor);
        root.style.setProperty('--background-color', this.currentBranding.backgroundColor);

        if (this.currentBranding.headerBackground) {
            root.style.setProperty('--header-background', this.currentBranding.headerBackground);
        }

        if (this.currentBranding.fontFamily) {
            root.style.setProperty('--font-family', this.currentBranding.fontFamily);
        }

        // Update logo if exists
        const logoElements = document.querySelectorAll<HTMLImageElement>('.logo');
        logoElements.forEach(logo => {
            logo.src = this.currentBranding.logoUrl;
            logo.alt = `${this.currentBranding.companyName} logo`;
        });

        // Update company name if exists
        const companyNameElements = document.querySelectorAll<HTMLElement>('.company-name');
        companyNameElements.forEach(element => {
            element.textContent = this.currentBranding.companyName;
        });
    }

}

// Export a singleton instance
export const brandingService = new BrandingService();
