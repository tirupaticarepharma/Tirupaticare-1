/**
 * ============================================================================
 *  SEED CATALOGUE  -  SAMPLE DATA ONLY
 * ============================================================================
 *  >>> REPLACE THIS WITH THE REAL CATALOGUE BEFORE GOING LIVE. <<<
 *
 *  Consumed by `npm run seed`, which inserts these rows into the `products`
 *  table. Once seeded, the live catalogue is the DATABASE - edit products in
 *  the admin panel at /admin/products, not in this file.
 *
 *  Prices are indicative INR figures invented for the sample data.
 *  Two rows are deliberately non-default so the admin panel has something to
 *  demonstrate on first run:
 *    - OI-4003 (Interlocking Intramedullary Nail) ... in_stock  = false
 *    - HF-5003 (Foldable Wheelchair) ............... is_visible = false
 * ============================================================================
 */

/** Category list. `id` is what is stored in products.category. */
export const seedCategories = [
  {
    "id": "surgical-instruments",
    "name": "Surgical Instruments",
    "blurb": "Forceps, scissors, scalpels, needle holders and retractors in surgical-grade stainless steel."
  },
  {
    "id": "disposables",
    "name": "Disposables & Consumables",
    "blurb": "Syringes, sutures, gauze, gloves and IV consumables supplied in bulk packs."
  },
  {
    "id": "diagnostic-equipment",
    "name": "Diagnostic Equipment",
    "blurb": "Stethoscopes, BP monitors, pulse oximeters and thermometers for OPD and ward."
  },
  {
    "id": "orthopedic-implants",
    "name": "Orthopedic Implants",
    "blurb": "Titanium and stainless steel plates, screws and nails, fully lot traceable."
  },
  {
    "id": "hospital-furniture",
    "name": "Hospital Furniture",
    "blurb": "Ward beds, instrument trolleys, wheelchairs and theatre furniture."
  },
  {
    "id": "ppe",
    "name": "PPE & Safety",
    "blurb": "Masks, respirators, gowns and protective wear for theatre and ward staff."
  }
];

export const seedProducts = [
  {
    "slug": "adson-tissue-forceps",
    "name": "Adson Tissue Forceps 12cm",
    "sku": "SI-1001",
    "category": "surgical-instruments",
    "summary": "1x2 teeth, serrated grip, AISI 410 stainless steel.",
    "description": "A precision tissue forceps for delicate handling of skin and subcutaneous tissue during suturing and minor surgery. Forged from AISI 410 surgical stainless steel with a satin finish that resists glare under theatre lights, and fully autoclavable for repeat sterilisation.",
    "price": 320,
    "image_url": null,
    "unit": "Per piece",
    "art": "forceps",
    "is_featured": true,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Length",
        "value": "12 cm (4.75 in)"
      },
      {
        "label": "Tip",
        "value": "1x2 teeth"
      },
      {
        "label": "Material",
        "value": "AISI 410 stainless steel"
      },
      {
        "label": "Finish",
        "value": "Satin, non-reflective"
      },
      {
        "label": "Sterilisation",
        "value": "Autoclavable up to 134 C"
      }
    ],
    "features": [
      "Cross-serrated handle for a secure, slip-free grip",
      "Precision-aligned teeth for atraumatic tissue handling",
      "Passivated surface resists corrosion and staining"
    ]
  },
  {
    "slug": "mayo-scissors-curved",
    "name": "Mayo Dissecting Scissors, Curved 17cm",
    "sku": "SI-1002",
    "category": "surgical-instruments",
    "summary": "Heavy-duty curved blades for cutting fascia and dense tissue.",
    "description": "Curved Mayo scissors with robust blades designed for cutting fascia, muscle and other dense tissue. The blunt-blunt tips reduce the risk of accidental puncture, and the ring handles are balanced for extended use in theatre.",
    "price": 480,
    "image_url": null,
    "unit": "Per piece",
    "art": "scissors",
    "is_featured": true,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Length",
        "value": "17 cm (6.75 in)"
      },
      {
        "label": "Blade",
        "value": "Curved, blunt / blunt"
      },
      {
        "label": "Material",
        "value": "AISI 420 stainless steel"
      },
      {
        "label": "Finish",
        "value": "Mirror polish"
      },
      {
        "label": "Sterilisation",
        "value": "Autoclavable up to 134 C"
      }
    ],
    "features": [
      "Hardened cutting edges hold sharpness through repeat sterilisation",
      "Balanced ring handles reduce hand fatigue",
      "Straight-blade profile available on request"
    ]
  },
  {
    "slug": "scalpel-handle-no-4",
    "name": "Scalpel Handle No. 4",
    "sku": "SI-1003",
    "category": "surgical-instruments",
    "summary": "Fits blades 20-25, centimetre scale along the shaft.",
    "description": "A standard No. 4 scalpel handle accepting blade sizes 20 to 25. The flat shaft carries a centimetre scale for quick intra-operative measurement, and the knurled grip stays secure when gloves are wet.",
    "price": 210,
    "image_url": null,
    "unit": "Per piece",
    "art": "scalpel",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Length",
        "value": "13.5 cm"
      },
      {
        "label": "Blade fitment",
        "value": "Sizes 20-25"
      },
      {
        "label": "Material",
        "value": "Stainless steel"
      },
      {
        "label": "Graduation",
        "value": "Centimetre scale on shaft"
      },
      {
        "label": "Sterilisation",
        "value": "Autoclavable up to 134 C"
      }
    ],
    "features": [
      "Knurled grip pattern for control with wet gloves",
      "Also stocked as No. 3 (blades 10-15)",
      "Sterile disposable blades sold separately"
    ]
  },
  {
    "slug": "mayo-hegar-needle-holder",
    "name": "Mayo-Hegar Needle Holder 18cm",
    "sku": "SI-1004",
    "category": "surgical-instruments",
    "summary": "Tungsten carbide inserts, ratchet lock, gold-plated rings.",
    "description": "A tungsten carbide needle holder for general suturing. The replaceable TC jaw inserts grip needles without slipping and last significantly longer than plain steel jaws. Gold ring handles identify the TC version at a glance on the tray.",
    "price": 1250,
    "image_url": null,
    "unit": "Per piece",
    "art": "needle-holder",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Length",
        "value": "18 cm (7 in)"
      },
      {
        "label": "Jaw",
        "value": "Tungsten carbide insert"
      },
      {
        "label": "Lock",
        "value": "3-position ratchet"
      },
      {
        "label": "Material",
        "value": "AISI 420 stainless steel"
      },
      {
        "label": "Sterilisation",
        "value": "Autoclavable up to 134 C"
      }
    ],
    "features": [
      "TC inserts can be re-serviced rather than replaced",
      "Gold-plated rings for instant identification",
      "Suits 3-0 to 6-0 suture needles"
    ]
  },
  {
    "slug": "czerny-retractor",
    "name": "Czerny Self-Retaining Retractor 21cm",
    "sku": "SI-1005",
    "category": "surgical-instruments",
    "summary": "Double-ended abdominal retractor, fork and solid blade.",
    "description": "A double-ended retractor with a fork end and a solid blade end, used to hold the incision open during abdominal procedures. Smooth, rounded edges minimise trauma to the wound margin.",
    "price": 890,
    "image_url": null,
    "unit": "Per piece",
    "art": "retractor",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Length",
        "value": "21 cm"
      },
      {
        "label": "Ends",
        "value": "Fork / solid blade"
      },
      {
        "label": "Material",
        "value": "AISI 304 stainless steel"
      },
      {
        "label": "Finish",
        "value": "Satin"
      },
      {
        "label": "Sterilisation",
        "value": "Autoclavable up to 134 C"
      }
    ],
    "features": [
      "Rounded, polished edges protect the wound margin",
      "Single-piece construction with no welded joints",
      "Balfour and Deaver patterns available to order"
    ]
  },
  {
    "slug": "instrument-sterilisation-tray",
    "name": "Perforated Instrument Sterilisation Tray",
    "sku": "SI-1006",
    "category": "surgical-instruments",
    "summary": "Stackable, supplied with lid and silicone finger mat.",
    "description": "A perforated stainless steel tray for organising instruments through the autoclave cycle. Perforations on all faces allow full steam penetration and rapid drying, and the trays stack securely for storage in CSSD.",
    "price": 1650,
    "image_url": null,
    "unit": "Per piece",
    "art": "tray",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Size",
        "value": "285 x 180 x 50 mm"
      },
      {
        "label": "Material",
        "value": "AISI 304 stainless steel"
      },
      {
        "label": "Includes",
        "value": "Lid + silicone finger mat"
      },
      {
        "label": "Sterilisation",
        "value": "Autoclavable up to 134 C"
      }
    ],
    "features": [
      "Full perforation for steam penetration and fast drying",
      "Stackable design with reinforced rim",
      "Available in small, medium and large"
    ]
  },
  {
    "slug": "disposable-syringe-5ml",
    "name": "Disposable Syringe 5ml (Box of 100)",
    "sku": "DC-2001",
    "category": "disposables",
    "summary": "Sterile, single-use, luer slip, supplied with 23G needle.",
    "description": "Sterile single-use 5ml syringes supplied with a 23G needle. Individually blister-packed with clear graduation markings that stay legible in use. Latex-free and ethylene-oxide sterilised.",
    "price": 420,
    "image_url": null,
    "unit": "Box of 100",
    "art": "syringe",
    "is_featured": true,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Capacity",
        "value": "5 ml"
      },
      {
        "label": "Needle",
        "value": "23G x 1 in (included)"
      },
      {
        "label": "Tip",
        "value": "Luer slip"
      },
      {
        "label": "Sterilisation",
        "value": "Ethylene oxide"
      },
      {
        "label": "Pack",
        "value": "100 pieces per box"
      }
    ],
    "features": [
      "Latex-free, non-toxic, non-pyrogenic",
      "Clear, permanent graduation printing",
      "Also stocked in 1ml, 2ml, 10ml and 20ml"
    ]
  },
  {
    "slug": "sterile-surgical-gloves",
    "name": "Sterile Surgical Gloves, Powder-Free",
    "sku": "DC-2002",
    "category": "disposables",
    "summary": "Natural latex, anatomical fit, sizes 6.0 to 8.5.",
    "description": "Powder-free sterile latex surgical gloves with an anatomical shape and textured fingertips for tactile sensitivity. Individually wrapped in pairs and supplied in a dispenser box of 50 pairs.",
    "price": 980,
    "image_url": null,
    "unit": "Box of 50 pairs",
    "art": "glove",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Material",
        "value": "Natural rubber latex"
      },
      {
        "label": "Sizes",
        "value": "6.0, 6.5, 7.0, 7.5, 8.0, 8.5"
      },
      {
        "label": "Powder",
        "value": "Powder-free"
      },
      {
        "label": "Cuff",
        "value": "Beaded, rolled"
      },
      {
        "label": "Pack",
        "value": "50 pairs per box"
      }
    ],
    "features": [
      "Textured fingertips for wet and dry grip",
      "Anatomically shaped to reduce hand fatigue",
      "Nitrile (latex-free) version available on request"
    ]
  },
  {
    "slug": "cotton-gauze-swabs",
    "name": "Absorbent Gauze Swabs 10x10cm (Pack of 100)",
    "sku": "DC-2003",
    "category": "disposables",
    "summary": "8-ply, 100% cotton, sterile or non-sterile.",
    "description": "Highly absorbent 8-ply cotton gauze swabs for wound cleaning and dressing. Edges are folded inward to prevent loose threads entering the wound. Available sterile or non-sterile, with an optional X-ray detectable thread.",
    "price": 260,
    "image_url": null,
    "unit": "Pack of 100",
    "art": "gauze",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Size",
        "value": "10 x 10 cm"
      },
      {
        "label": "Ply",
        "value": "8-ply"
      },
      {
        "label": "Material",
        "value": "100% bleached cotton"
      },
      {
        "label": "Options",
        "value": "Sterile / non-sterile, X-ray detectable"
      },
      {
        "label": "Pack",
        "value": "100 pieces"
      }
    ],
    "features": [
      "Inward-folded edges prevent loose fibres in the wound",
      "High absorbency with low linting",
      "Also stocked in 5x5 cm and 7.5x7.5 cm"
    ]
  },
  {
    "slug": "silk-suture-3-0",
    "name": "Braided Silk Suture 3-0 with Needle",
    "sku": "DC-2004",
    "category": "disposables",
    "summary": "Non-absorbable, 76cm, 3/8 circle reverse cutting needle.",
    "description": "Sterile braided black silk suture, non-absorbable, swaged to a 3/8 circle reverse cutting needle. The braided construction gives excellent knot security and predictable handling for skin closure.",
    "price": 640,
    "image_url": null,
    "unit": "Box of 12 foils",
    "art": "suture",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Gauge",
        "value": "3-0 (USP)"
      },
      {
        "label": "Length",
        "value": "76 cm"
      },
      {
        "label": "Needle",
        "value": "3/8 circle, reverse cutting, 24 mm"
      },
      {
        "label": "Type",
        "value": "Non-absorbable, braided"
      },
      {
        "label": "Pack",
        "value": "12 foils per box"
      }
    ],
    "features": [
      "Excellent knot security and smooth tie-down",
      "Sterile, individually foil-packed",
      "Catgut, polyglactin and nylon also stocked"
    ]
  },
  {
    "slug": "iv-cannula-20g",
    "name": "IV Cannula 20G with Injection Port",
    "sku": "DC-2005",
    "category": "disposables",
    "summary": "Radio-opaque FEP catheter, colour-coded wings, single-use.",
    "description": "A sterile 20G intravenous cannula with an injection port and radio-opaque FEP catheter. Colour-coded wings follow ISO gauge conventions so the size is identifiable at a glance during an emergency.",
    "price": 1150,
    "image_url": null,
    "unit": "Box of 100",
    "art": "iv",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Gauge",
        "value": "20G (pink)"
      },
      {
        "label": "Flow rate",
        "value": "61 ml/min"
      },
      {
        "label": "Catheter",
        "value": "Radio-opaque FEP"
      },
      {
        "label": "Sterilisation",
        "value": "Ethylene oxide"
      },
      {
        "label": "Pack",
        "value": "100 pieces per box"
      }
    ],
    "features": [
      "Sharp back-cut needle for smooth first-attempt insertion",
      "Injection port with self-sealing valve",
      "Stocked in 14G through 24G"
    ]
  },
  {
    "slug": "cardiology-stethoscope",
    "name": "Dual-Head Cardiology Stethoscope",
    "sku": "DE-3001",
    "category": "diagnostic-equipment",
    "summary": "Stainless steel chestpiece, tunable diaphragm, 68cm tubing.",
    "description": "A dual-head cardiology stethoscope with a machined stainless steel chestpiece and tunable diaphragm - light pressure picks up low frequencies, firmer pressure isolates high frequencies without turning the head. Supplied with spare eartips and a diaphragm.",
    "price": 2450,
    "image_url": null,
    "unit": "Per piece",
    "art": "stethoscope",
    "is_featured": true,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Chestpiece",
        "value": "Machined stainless steel, dual head"
      },
      {
        "label": "Diaphragm",
        "value": "Tunable"
      },
      {
        "label": "Tubing",
        "value": "68 cm, latex-free PVC"
      },
      {
        "label": "Includes",
        "value": "Spare eartips + diaphragm"
      },
      {
        "label": "Warranty",
        "value": "2 years"
      }
    ],
    "features": [
      "Tunable diaphragm switches frequency range by pressure",
      "Anatomically angled headset seals comfortably",
      "Latex-free tubing in six colours"
    ]
  },
  {
    "slug": "aneroid-bp-monitor",
    "name": "Aneroid BP Monitor with Adult Cuff",
    "sku": "DE-3002",
    "category": "diagnostic-equipment",
    "summary": "Calibrated manometer, latex-free nylon cuff, zip carry case.",
    "description": "A professional aneroid sphygmomanometer with a shock-resistant calibrated manometer and a latex-free nylon adult cuff. Supplied in a zip carry case with an inflation bulb and air-release valve.",
    "price": 1890,
    "image_url": null,
    "unit": "Per set",
    "art": "bp-monitor",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Range",
        "value": "0-300 mmHg"
      },
      {
        "label": "Accuracy",
        "value": "+/- 3 mmHg"
      },
      {
        "label": "Cuff",
        "value": "Adult, 22-36 cm, latex-free"
      },
      {
        "label": "Includes",
        "value": "Bulb, valve, zip case"
      },
      {
        "label": "Warranty",
        "value": "1 year on manometer"
      }
    ],
    "features": [
      "Shock-resistant movement holds calibration",
      "Paediatric and large-adult cuffs available",
      "Air-release valve with fine control"
    ]
  },
  {
    "slug": "fingertip-pulse-oximeter",
    "name": "Fingertip Pulse Oximeter",
    "sku": "DE-3003",
    "category": "diagnostic-equipment",
    "summary": "SpO2 and pulse rate, OLED display, auto power-off.",
    "description": "A compact fingertip pulse oximeter measuring blood oxygen saturation and pulse rate on a bright multi-directional OLED display. Reads in under eight seconds and powers off automatically when removed.",
    "price": 1150,
    "image_url": null,
    "unit": "Per piece",
    "art": "oximeter",
    "is_featured": true,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "SpO2 range",
        "value": "70-100%, +/- 2%"
      },
      {
        "label": "Pulse range",
        "value": "30-250 bpm, +/- 2 bpm"
      },
      {
        "label": "Display",
        "value": "Multi-directional OLED"
      },
      {
        "label": "Power",
        "value": "2 x AAA (included)"
      },
      {
        "label": "Warranty",
        "value": "1 year"
      }
    ],
    "features": [
      "Reading in under 8 seconds",
      "Auto power-off after 8 seconds idle",
      "Fits paediatric to adult fingers"
    ]
  },
  {
    "slug": "infrared-thermometer",
    "name": "Non-Contact Infrared Thermometer",
    "sku": "DE-3004",
    "category": "diagnostic-equipment",
    "summary": "Forehead reading in one second, fever alarm, 32-reading memory.",
    "description": "A non-contact infrared forehead thermometer giving a reading in one second from 3-5 cm. Includes a colour-coded fever alarm, a silent mode for night rounds and recall of the last 32 readings.",
    "price": 1350,
    "image_url": null,
    "unit": "Per piece",
    "art": "thermometer",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Range",
        "value": "32.0-43.0 C"
      },
      {
        "label": "Accuracy",
        "value": "+/- 0.2 C"
      },
      {
        "label": "Distance",
        "value": "3-5 cm"
      },
      {
        "label": "Memory",
        "value": "32 readings"
      },
      {
        "label": "Power",
        "value": "2 x AAA (included)"
      }
    ],
    "features": [
      "One-second non-contact reading",
      "Colour-coded fever alert with silent mode",
      "Switchable Celsius / Fahrenheit"
    ]
  },
  {
    "slug": "titanium-locking-plate",
    "name": "Titanium Locking Compression Plate",
    "sku": "OI-4001",
    "category": "orthopedic-implants",
    "summary": "Ti-6Al-4V ELI, 4 to 12 hole, anodised, lot traceable.",
    "description": "A locking compression plate manufactured from Ti-6Al-4V ELI medical grade titanium alloy. The combi-holes accept both locking and cortical screws, allowing compression and locked fixation in one plate. Every plate is laser-marked and lot traceable.",
    "price": 3200,
    "image_url": null,
    "unit": "Per piece",
    "art": "plate",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Material",
        "value": "Ti-6Al-4V ELI (ASTM F136)"
      },
      {
        "label": "Holes",
        "value": "4, 6, 8, 10, 12"
      },
      {
        "label": "System",
        "value": "3.5 mm / 4.5 mm"
      },
      {
        "label": "Finish",
        "value": "Type II anodised"
      },
      {
        "label": "Traceability",
        "value": "Laser-marked lot number"
      }
    ],
    "features": [
      "Combi-holes accept locking and cortical screws",
      "Limited-contact underside preserves periosteal blood supply",
      "Supplied non-sterile for hospital autoclave"
    ]
  },
  {
    "slug": "cortical-bone-screw",
    "name": "Cortical Bone Screw, Self-Tapping",
    "sku": "OI-4002",
    "category": "orthopedic-implants",
    "summary": "3.5mm and 4.5mm, hex drive, 10-60mm lengths.",
    "description": "Self-tapping cortical bone screws in surgical stainless steel or titanium, with a hexagonal recess drive. Available across the full length range for the 3.5 mm and 4.5 mm systems, individually marked and lot traceable.",
    "price": 145,
    "image_url": null,
    "unit": "Per piece",
    "art": "screw",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Diameter",
        "value": "3.5 mm / 4.5 mm"
      },
      {
        "label": "Lengths",
        "value": "10-60 mm (2 mm increments)"
      },
      {
        "label": "Material",
        "value": "AISI 316L / Ti-6Al-4V"
      },
      {
        "label": "Drive",
        "value": "Hexagonal recess"
      },
      {
        "label": "Thread",
        "value": "Self-tapping"
      }
    ],
    "features": [
      "Self-tapping flutes reduce insertion torque",
      "Matching taps, drill bits and depth gauges stocked",
      "Individually pouched and lot traceable"
    ]
  },
  {
    "slug": "intramedullary-nail",
    "name": "Interlocking Intramedullary Nail",
    "sku": "OI-4003",
    "category": "orthopedic-implants",
    "summary": "Cannulated tibial / femoral nail with locking screws.",
    "description": "A cannulated interlocking intramedullary nail for tibial and femoral shaft fractures, supplied with proximal and distal locking screws. The anatomically contoured design follows the medullary canal to simplify insertion.",
    "price": 4800,
    "image_url": null,
    "unit": "Per piece",
    "art": "nail",
    "is_featured": false,
    "is_visible": true,
    "in_stock": false,
    "specs": [
      {
        "label": "Material",
        "value": "AISI 316L stainless steel"
      },
      {
        "label": "Diameter",
        "value": "8-12 mm"
      },
      {
        "label": "Lengths",
        "value": "240-420 mm"
      },
      {
        "label": "Type",
        "value": "Cannulated, interlocking"
      },
      {
        "label": "Traceability",
        "value": "Laser-marked lot number"
      }
    ],
    "features": [
      "Anatomically contoured for the medullary canal",
      "Cannulated for guide-wire insertion",
      "Instrument set available on loan for surgery"
    ]
  },
  {
    "slug": "semi-fowler-hospital-bed",
    "name": "Semi-Fowler Hospital Bed (2-Function, Manual)",
    "sku": "HF-5001",
    "category": "hospital-furniture",
    "summary": "Manual backrest and knee rest, ABS panels, braked castors.",
    "description": "A manually operated two-function ward bed with independent backrest and knee-rest adjustment via crank handles. The frame is epoxy powder-coated mild steel with moulded ABS head and foot panels, mounted on 125 mm castors with diagonal brakes.",
    "price": 18500,
    "image_url": null,
    "unit": "Per unit",
    "art": "bed",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Size",
        "value": "2020 x 900 x 600 mm"
      },
      {
        "label": "Functions",
        "value": "Backrest + knee rest (manual crank)"
      },
      {
        "label": "Frame",
        "value": "Epoxy powder-coated mild steel"
      },
      {
        "label": "Panels",
        "value": "Moulded ABS, detachable"
      },
      {
        "label": "Castors",
        "value": "125 mm, two with brakes"
      },
      {
        "label": "Load",
        "value": "200 kg safe working load"
      }
    ],
    "features": [
      "Collapsible side railings included",
      "Mattress and IV rod available as add-ons",
      "Electric 3-function and 5-function versions available"
    ]
  },
  {
    "slug": "instrument-trolley",
    "name": "Stainless Steel Instrument Trolley",
    "sku": "HF-5002",
    "category": "hospital-furniture",
    "summary": "Two shelves, AISI 304, 75mm castors with brakes.",
    "description": "A two-shelf instrument trolley in AISI 304 stainless steel with a raised guard rail on the top shelf. Fully welded and polished construction with no crevices, so it wipes down easily between cases.",
    "price": 7200,
    "image_url": null,
    "unit": "Per unit",
    "art": "trolley",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Size",
        "value": "760 x 460 x 840 mm"
      },
      {
        "label": "Shelves",
        "value": "2, with top guard rail"
      },
      {
        "label": "Material",
        "value": "AISI 304 stainless steel"
      },
      {
        "label": "Castors",
        "value": "75 mm, two with brakes"
      },
      {
        "label": "Load",
        "value": "50 kg per shelf"
      }
    ],
    "features": [
      "Fully welded, crevice-free construction",
      "Three-shelf and drawer versions available",
      "Ships flat-packed for easy delivery"
    ]
  },
  {
    "slug": "foldable-wheelchair",
    "name": "Foldable Wheelchair with Fixed Armrest",
    "sku": "HF-5003",
    "category": "hospital-furniture",
    "summary": "Chrome-plated frame, 24in rear wheels, folds flat.",
    "description": "A standard attendant- or self-propelled folding wheelchair with a chrome-plated steel frame, 24 inch rear wheels with hand rims and solid 8 inch front castors. Folds flat for transport and storage.",
    "price": 8900,
    "image_url": null,
    "unit": "Per unit",
    "art": "wheelchair",
    "is_featured": false,
    "is_visible": false,
    "in_stock": true,
    "specs": [
      {
        "label": "Seat width",
        "value": "460 mm"
      },
      {
        "label": "Rear wheels",
        "value": "24 in with hand rims"
      },
      {
        "label": "Front castors",
        "value": "8 in solid"
      },
      {
        "label": "Frame",
        "value": "Chrome-plated steel"
      },
      {
        "label": "Load",
        "value": "100 kg safe working load"
      },
      {
        "label": "Weight",
        "value": "16 kg"
      }
    ],
    "features": [
      "Cross-brace folding frame stores flat",
      "Swing-away footrests with heel loops",
      "Attendant hand brakes included"
    ]
  },
  {
    "slug": "3-ply-surgical-mask",
    "name": "3-Ply Surgical Face Mask (Box of 100)",
    "sku": "PP-6001",
    "category": "ppe",
    "summary": "Meltblown filter core, ear-loop, adjustable nose clip.",
    "description": "Three-layer surgical face masks with a meltblown filter core, non-woven outer layer and a soft skin-facing inner layer. The adjustable aluminium nose clip seals the bridge to reduce fogging of eyewear.",
    "price": 180,
    "image_url": null,
    "unit": "Box of 100",
    "art": "mask",
    "is_featured": true,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Layers",
        "value": "3-ply, meltblown core"
      },
      {
        "label": "Filtration",
        "value": "95% or higher BFE"
      },
      {
        "label": "Fitting",
        "value": "Elastic ear-loop"
      },
      {
        "label": "Nose clip",
        "value": "Adjustable aluminium"
      },
      {
        "label": "Pack",
        "value": "100 pieces per box"
      }
    ],
    "features": [
      "Adjustable nose clip reduces eyewear fogging",
      "Soft inner layer for all-day wear",
      "Tie-on version available for theatre"
    ]
  },
  {
    "slug": "n95-respirator",
    "name": "N95 Respirator, Cup Style (Box of 20)",
    "sku": "PP-6002",
    "category": "ppe",
    "summary": "5-layer filtration, moulded shell, dual head straps.",
    "description": "A cup-style N95 respirator with five filtration layers and a moulded shell that holds its shape through a long shift. Dual head straps give a tighter seal than ear loops for aerosol-generating procedures.",
    "price": 560,
    "image_url": null,
    "unit": "Box of 20",
    "art": "n95",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Layers",
        "value": "5-ply"
      },
      {
        "label": "Filtration",
        "value": "95% or higher of 0.3 micron particles"
      },
      {
        "label": "Fitting",
        "value": "Dual head straps"
      },
      {
        "label": "Style",
        "value": "Moulded cup with nose foam"
      },
      {
        "label": "Pack",
        "value": "20 pieces per box"
      }
    ],
    "features": [
      "Moulded shell keeps its shape through a full shift",
      "Nose foam improves seal and comfort",
      "Valved version available on request"
    ]
  },
  {
    "slug": "disposable-surgical-gown",
    "name": "Disposable Surgical Gown, SMS Non-Woven",
    "sku": "PP-6003",
    "category": "ppe",
    "summary": "35 GSM SMS fabric, knitted cuffs, sterile or non-sterile.",
    "description": "A single-use SMS non-woven surgical gown with knitted cuffs and rear tie closure. Breathable yet fluid-resistant, supplied sterile in individual peel-open pouches or non-sterile in bulk bags.",
    "price": 1450,
    "image_url": null,
    "unit": "Pack of 50",
    "art": "gown",
    "is_featured": false,
    "is_visible": true,
    "in_stock": true,
    "specs": [
      {
        "label": "Material",
        "value": "SMS non-woven, 35 GSM"
      },
      {
        "label": "Sizes",
        "value": "M, L, XL, XXL"
      },
      {
        "label": "Cuffs",
        "value": "Knitted"
      },
      {
        "label": "Options",
        "value": "Sterile / non-sterile"
      },
      {
        "label": "Pack",
        "value": "50 pieces per bag"
      }
    ],
    "features": [
      "Fluid-resistant yet breathable SMS fabric",
      "Rear tie closure with neck fastening",
      "Reinforced front and sleeve version available"
    ]
  }
];
