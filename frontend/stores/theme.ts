import { defineStore } from 'pinia';

export interface ThemeSettings {
  storeName: string;
  logoUrl: string;
  colorPrimary: string;
  colorSecondary: string;
  colorSurface: string;
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeSettings => ({
    storeName: 'biolabs',
    logoUrl: '',
    colorPrimary: '#d97757',
    colorSecondary: '#8b5cf6',
    colorSurface: '#fdf2ee',
  }),

  actions: {
    applyTheme(settings: Partial<ThemeSettings>) {
      if (settings.colorPrimary) this.colorPrimary = settings.colorPrimary;
      if (settings.colorSecondary) this.colorSecondary = settings.colorSecondary;
      if (settings.colorSurface) this.colorSurface = settings.colorSurface;
      if (settings.storeName !== undefined) this.storeName = settings.storeName;
      if (settings.logoUrl !== undefined) this.logoUrl = settings.logoUrl;

      if (process.client) {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', this.colorPrimary);
        root.style.setProperty('--color-secondary', this.colorSecondary);
        root.style.setProperty('--color-surface', this.colorSurface);

        // Cache in localStorage for immediate retrieval on refreshes
        try {
          localStorage.setItem('biolabs_theme_custom', JSON.stringify({
            storeName: this.storeName,
            logoUrl: this.logoUrl,
            colorPrimary: this.colorPrimary,
            colorSecondary: this.colorSecondary,
            colorSurface: this.colorSurface,
          }));
        } catch (e) {}
      }
    },

    loadCachedTheme() {
      if (process.client) {
        try {
          const cached = localStorage.getItem('biolabs_theme_custom');
          if (cached) {
            const parsed = JSON.parse(cached);
            this.applyTheme(parsed);
          }
        } catch (e) {}
      }
    },
  },
});
