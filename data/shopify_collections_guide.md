# TapGreetings Shopify Collections & Tagging Architecture

This guide details the exact collection structure, automated smart rules, and subcollection categorization for TapGreetings Series 1.

## 1. Master Collection: Series 1
* **Title**: TapGreetings Series 1: The Clay & Needle-Felt Holiday Collection
* **Handle**: `tapgreetings-series-1`
* **Type**: Automated (Smart Collection)
* **Conditions**:
  * Product tag **equals** `Series 1`
* **Contains**: All 16 cards (#001 through #016)

---

## 2. Series 1 Subcollections

### A. Classic Icons
* **Handle**: `series-1-classic-icons`
* **Condition**: Product tag **equals** `Classic Icons`
* **Cards**:
  1. #001 Santa (*The Master Artisan*)
  2. #002 Frosty (*The Snowbound Joy*)
  3. #003 Rudolph (*The Beacon of Light*)
  4. #010 Mrs. Claus (*The Hearth Matron*)

### B. Winter Magic
* **Handle**: `series-1-winter-magic`
* **Condition**: Product tag **equals** `Winter Magic`
* **Cards**:
  1. #004 Jack Frost (*The Frost Sprite*)
  2. #007 Snowflake (*The Celestial Crystal*)
  3. #014 Sugar Plum Fairy (*The Twilight Sprite*)
  4. #015 Snow Monster / Yeti (*The Frost Guardian*)

### C. Hearth & Holiday
* **Handle**: `series-1-hearth-holiday`
* **Condition**: Product tag **equals** `Hearth & Holiday`
* **Cards**:
  1. #005 Nutcracker (*The Hearth Sentry*)
  2. #006 The Tree (*The Evergreen Hearth*)
  3. #008 Gift (*The Surprise Box*)
  4. #009 Gingerbread Man (*The Sweet Reveler*)

### D. Festive Friends
* **Handle**: `series-1-festive-friends`
* **Condition**: Product tag **equals** `Festive Friends`
* **Cards**:
  1. #011 Workshop Elf (*The Little Toymaker*)
  2. #012 Polar Bear (*The Gentle Lantern-Bearer*)
  3. #013 Penguin (*The Festive Ice Dancer*)
  4. #016 Stocking Puppy (*The Little Holiday Surprise*)

---

## 3. Product Specifications & Taxonomies
* **Standard Category**: `Arts & Entertainment > Party & Celebration > Gift Giving > Greeting Cards`
* **Product Type**: `Smart NFC Greeting Card`
* **Vendor**: `TapGreetings`
* **Retail Price**: $14.99 USD
* **Compare At Price**: $24.99 USD
* **Hardware**: CR80 30mil Waterproof PVC with NTAG215 microchip
* **Digital Integration**: Dual-image product listings (Front + Back) with live links to 1080p stop-motion video streaming.
