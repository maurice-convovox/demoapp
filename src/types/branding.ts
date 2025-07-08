export interface BrandingConfig {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    logoUrl: string;
    companyName: string;
    fontFamily?: string;
    headerBackground?: string;
}

export interface BrandingTheme {
    [key: string]: BrandingConfig;
}
