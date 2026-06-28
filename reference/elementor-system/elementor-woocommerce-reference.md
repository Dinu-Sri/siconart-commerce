# Elementor + WooCommerce Templates Reference (Single, Shop/Archives, Filters, Cart, Checkout, Notices)

This reference is for building WooCommerce pages with **Elementor Pro (Theme Builder / WooCommerce Builder)** and giving an AI “deep understanding” of the **elements (widgets/blocks) + their properties (controls/settings)**.

---

## 0) The core approach (recommended)
### Use Elementor Pro Theme Builder for:
- **Single Product template**
- **Product Archive (Shop / Category / Tag) template**
- **Cart page**
- **Checkout page**
- **My Account page**
…and set **Display Conditions** so each template applies to the correct WooCommerce pages automatically.

**Primary entry points**
- Elementor WooCommerce Builder overview:  
  https://elementor.com/features/woocommerce-builder/
- Elementor Developer Docs (how widgets + controls work):  
  https://developers.elementor.com/  
  https://developers.elementor.com/docs/widgets/

---

## 1) Single Product Page (Template + widgets + properties)
### Build the single product template
- Create a Single Product template (Theme Builder workflow + conditions):  
  https://elementor.com/help/woocommerce-single-product-builder/
- (Alternative doc style) Single product “site part”:  
  https://elementor.com/help/single-product-site-part/

### Key Single Product widgets (each link explains settings + style controls)
- Product Title:  
  https://elementor.com/help/woocommerce-single-product-title-pro/
- Product Images / Gallery:  
  https://elementor.com/help/woocommerce-single-product-images-pro/
- Add to Cart:  
  https://elementor.com/help/woocommerce-single-add-to-cart-pro/

### WooCommerce-side product images basics (useful for AI to know what data exists)
- Product images & galleries:  
  https://woocommerce.com/document/adding-product-images-and-galleries/

---

## 2) Shop Page / Product Archives (layout + columns + pagination)
### Build the Product Archive template
- Create a WooCommerce archive template (Theme Builder workflow):  
  https://elementor.com/help/creating-a-woocommerce-archive-template/
- Archive Products widget (what it is + styling controls):  
  https://elementor.com/help/woocommerce-archive-products-pro/
- Archive Description widget (show category/shop descriptions):  
  https://elementor.com/help/woocommerce-archive-description-pro/

### Control columns + products per page (important for “multiple columns” archives)
- Elementor method (Customizer → WooCommerce → Archives → Shop Columns / Posts per Page):  
  https://elementor.com/help/how-do-i-limit-the-number-of-products-displayed-in-an-archive/
- WooCommerce official: change products per row (includes **loop_shop_columns** filter, blocks, shortcodes):  
  https://woocommerce.com/document/change-number-of-products-per-row/

### If you need precise grid controls inside Elementor (not only archives)
- Elementor “Products” widget (Columns, Rows, Pagination, Allow Order, Result Count):  
  https://elementor.com/help/woocommerce-products-pro/

---

## 3) Shop Filters (price slider, categories, attributes) + Sidebars
There are 3 common ways to do Shop filters with Elementor sites:

### Approach A (Elementor-centric + sidebar widgets) — simplest
**Goal:** Build an Elementor archive template with a sidebar, then put filters into that sidebar (widgets/blocks).

#### A1) Create/insert a sidebar area in Elementor
- Elementor Sidebar widget (how to insert a WP sidebar into a template):  
  https://elementor.com/help/sidebar-widget/
- If you use **Hello theme**, you’ll likely need this guide to properly enable/use sidebar templates:  
  https://elementor.com/help/how-to-create-sidebar-templates-with-hello-theme/

#### A2) Add the actual filters (price slider, attributes, etc.)
**WooCommerce core “Product Filters” blocks** (works well in widget areas too):
- Product Filters blocks (Active Filters, Filter by Price, Filter by Attribute, Filter by Stock Status, Filter by Rating):  
  https://woocommerce.com/document/woocommerce-store-editing/blocks/product-filters-blocks/
- WooCommerce blocks overview (how blocks behave + where settings are):  
  https://woocommerce.com/document/woocommerce-store-editing/blocks/

**Notes your AI should know (practical):**
- Use **two columns** in the archive template:
  - Left: sidebar (filters)
  - Right: archive products grid
- For responsive:
  - Desktop: sidebar + grid
  - Mobile: stack (filters above or in a collapsible section)

---

### Approach B (WooCommerce Blocks shop page) — best “native” filtering UX
If you’re okay building the **Shop** with WooCommerce blocks (and using Elementor for other pages), you can get strong filtering + layout control.

- Product Collection block (product listing control, columns, etc.):  
  https://woocommerce.com/document/woocommerce-store-editing/customizing-shop-page-catalog/product-collection-block/
- Cart/Checkout blocks customization overview (if you go block route):  
  https://woocommerce.com/document/woocommerce-store-editing/customizing-cart-and-checkout/

---

### Approach C (Live/AJAX filters) — best when you want instant filtering
If you specifically want **live filters** (no page reload), use an extension built for that.

#### Option C1) WooCommerce Product Search extension (official docs)
- Widgets overview (live search + live filter widgets):  
  https://woocommerce.com/document/woocommerce-product-search/widgets/
- Live category filter block (Product Filter – Categories):  
  https://woocommerce.com/document/woocommerce-product-search/blocks/product-filter-categories/

#### Option C2) Product Filters for WooCommerce (official extension docs)
- Product Filters for WooCommerce documentation:  
  https://woocommerce.com/document/product-filters-for-woocommerce/

#### Categories/Attributes knowledge your AI should understand
- Managing categories, tags, and attributes (taxonomy fundamentals):  
  https://woocommerce.com/document/managing-product-taxonomies/

---

## 4) Cart Page (Elementor template)
- Elementor WooCommerce Cart widget:  
  https://elementor.com/help/woocommerce-cart-widget/
- (Extra tutorial) Using the Cart widget:  
  https://elementor.com/blog/how-to-use-woocommerce-cart-widget/

---

## 5) Checkout Page (Elementor template)
- Elementor WooCommerce Checkout widget:  
  https://elementor.com/help/woocommerce-checkout-widget/
- (Extra tutorial) Customize checkout using Elementor:  
  https://elementor.com/blog/customize-woocommerce-checkout-page/

---

## 6) WooCommerce Messages / Notices (errors, success, info)
### Style notices globally in Elementor
- WooCommerce notice settings (Site Settings → WooCommerce → Notices):  
  https://elementor.com/help/woocommerce-notice-settings/
- WooCommerce Notice widget (to place notices in templates):  
  https://elementor.com/help/woocommerce-notice-widget/

### Developer reference (if you or your AI touches code/plugins)
- WooCommerce notices API (wc_add_notice, wc_get_notices, etc.):  
  https://woocommerce.github.io/code-reference/files/woocommerce-includes-wc-notice-functions.html

---

## 7) “Element properties” cheat-sheet for your AI (how Elementor controls are organized)
Most Elementor widgets expose controls in:
- **Content**: data source/query + toggles (show/hide), layout basics
- **Style**: colors, typography, spacing, borders, hover states
- **Advanced**: responsive, motion effects, custom positioning, custom CSS classes, conditions

Best reference for “what is a widget + what is a control”:
- Elementor Widgets (developer docs):  
  https://developers.elementor.com/docs/widgets/

---

## Quick “what to use when” (practical picks)
- **Shop page grid + sidebar filters (classic Elementor way):** Approach A  
- **Best native filter UX without extra plugins:** Approach B  
- **Live/AJAX filtering (instant results):** Approach C (Product Search / Product Filters extension)  
- **Columns + products per page on archives:** Elementor Customizer + WooCommerce columns docs
