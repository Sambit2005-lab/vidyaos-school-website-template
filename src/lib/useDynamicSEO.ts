import { useEffect } from "react";

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  themeColor?: string;
}

export function useDynamicSEO(config: SEOConfig) {
  useEffect(() => {
    if (!config.title) return;

    // 1. Update Title
    document.title = config.title;

    // Helper to dynamically set or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Update Description
    if (config.description) {
      updateMetaTag("description", config.description);
      updateMetaTag("og:description", config.description, true);
    }

    // 3. Update Keywords
    if (config.keywords) {
      updateMetaTag("keywords", config.keywords);
    }

    // 4. Update OpenGraph Tags for Social Link Previews
    updateMetaTag("og:title", config.title, true);
    updateMetaTag("og:type", "website", true);
    
    if (config.ogImage) {
      updateMetaTag("og:image", config.ogImage, true);
    }

    // 5. Update Theme Color for mobile browsers
    if (config.themeColor) {
      updateMetaTag("theme-color", config.themeColor);
    }
  }, [config.title, config.description, config.keywords, config.ogImage, config.themeColor]);
}
