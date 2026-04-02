INSERT INTO workshops (id, name, address, city, phone, email, website, priority_surcharge_pct, emergency_surcharge_pct, warranty_years, accepts_wet_suits, accepts_viking_hd) VALUES
('draktverkstan', 'Dräktverkstan (Marine Gear)', 'Sven Rinmans Gata 6, 112 37 Stockholm', 'Stockholm', '08-652 06 11', 'service@draktverkstan.se', 'https://www.draktverkstan.se', 50, 100, 5, false, true),
('subnautica', 'Subnautica', 'Örkroken 8, 138 40 Älta', 'Älta', '08-656 19 00', 'info@subnautica.se', 'https://www.subnautica.se', 40, 100, 1, true, true);

INSERT INTO service_items (id, workshop_id, category, name, name_sv, base_price, notes) VALUES
-- Pressure tests
('dv-pressure-test', 'draktverkstan', 'pressure_test', 'Pressure test', 'Trycktest av torrdräkt', 395, 'inkl moms'),
('sn-pressure-test', 'subnautica', 'pressure_test', 'Pressure test', 'Trycktest av torrdräkt', 395, ''),
-- Seals
('dv-seal-neck-latex', 'draktverkstan', 'seal', 'Neck seal latex', 'Byte halstätning latex', 1039, 'inkl moms'),
('sn-seal-neck-latex', 'subnautica', 'seal', 'Neck seal latex', 'Byte halstätning latex', 895, ''),
('dv-seal-neck-neoprene', 'draktverkstan', 'seal', 'Neck seal neoprene', 'Byte halstätning neoprene glideskin', 1270, 'inkl moms'),
('sn-seal-neck-neoprene', 'subnautica', 'seal', 'Neck seal neoprene', 'Byte halstätning neoprene', 1204, ''),
('dv-seal-wrist-latex', 'draktverkstan', 'seal', 'Wrist seal latex', 'Byte handledstätning latex', 639, 'per styck, inkl moms'),
('sn-seal-wrist-latex', 'subnautica', 'seal', 'Wrist seal latex', 'Byte handledstätning latex', 495, 'per styck'),
('dv-seal-wrist-latex-hd', 'draktverkstan', 'seal', 'Wrist seal latex HD', 'Byte handledstätning latex HD', 690, 'per styck, inkl moms'),
('sn-seal-wrist-latex-hd', 'subnautica', 'seal', 'Wrist seal latex HD', 'Byte handledstätning latex heavy duty', 545, 'per styck'),
('dv-seal-wrist-neoprene', 'draktverkstan', 'seal', 'Wrist seal neoprene', 'Byte handledstätning neoprene', 870, 'per styck, inkl moms'),
('sn-seal-wrist-neoprene', 'subnautica', 'seal', 'Wrist seal neoprene', 'Byte handledstätning neoprene', 756, 'per styck'),
('dv-seal-ankle-latex', 'draktverkstan', 'seal', 'Ankle seal latex', 'Byte fotledstätning latex', 806, 'per styck, inkl moms'),
('sn-seal-ankle-latex', 'subnautica', 'seal', 'Ankle seal latex', 'Byte fotledstätning latex', 645, 'per styck'),
-- Zippers
('dv-zipper-main', 'draktverkstan', 'zipper', 'Dry zipper steel', 'Byte torrkedja YKK/BDM RS08 stål', 4400, 'inkl moms'),
('sn-zipper-main', 'subnautica', 'zipper', 'Dry zipper steel/plastic', 'Byte torrdräktskedja stål/plast', 4350, ''),
('dv-zipper-plastic', 'draktverkstan', 'zipper', 'Dry zipper plastic', 'Byte torrkedja YKK Aquaseal (plast)', 4060, 'inkl moms'),
('sn-zipper-fly', 'subnautica', 'zipper', 'Fly zipper', 'Byte gylfkedja stål/plast', 3695, ''),
('dv-zipper-fly', 'draktverkstan', 'zipper', 'Fly zipper install', 'Installation gylfkedja YKK/BDM RS08 stål', 4204, 'inkl moms'),
('sn-zipper-fly-install', 'subnautica', 'zipper', 'Fly zipper install', 'Installation gylfkedja stål/plast', 3895, ''),
-- Boots
('dv-boots-teccna', 'draktverkstan', 'boots', 'Teccna dry boots', 'Teccna Dryboots (techboots)', 3359, 'inkl moms'),
('sn-boots-teccna', 'subnautica', 'boots', 'Teccna dry boots', 'Byte boots, Teccna dry boots', 3495, 'byts endast i par'),
('dv-boots-ursuit', 'draktverkstan', 'boots', 'Ursuit std boots', 'Ursuit Std Boots', 3474, 'inkl moms'),
('sn-boots-ursuit', 'subnautica', 'boots', 'Ursuit std boots', 'Byte boots, Ursuit standard neoprene', 3495, 'byts endast i par'),
('dv-latex-socks', 'draktverkstan', 'boots', 'Latex socks', 'Byte latexsockor', 1734, 'inkl moms'),
('sn-latex-socks', 'subnautica', 'boots', 'Latex socks', 'Byte latexsockor', 1395, ''),
-- Ring systems
('dv-ring-orust-no-hood', 'draktverkstan', 'ring_system', 'Orust without hood', 'Si Tech Orust (utan huva/WN)', 2430, 'inkl moms'),
('sn-ring-orust-no-hood', 'subnautica', 'ring_system', 'Orust without hood', 'Installation Orust/Quick neck, utan huva', 2050, ''),
('dv-ring-orust-hood', 'draktverkstan', 'ring_system', 'Orust with hood', 'Si Tech Orust (med huva/WN)', 3359, 'inkl moms'),
('sn-ring-orust-hood', 'subnautica', 'ring_system', 'Orust with hood', 'Installation Orust/Quick neck, med huva', 2795, ''),
('dv-ring-quick-cuff', 'draktverkstan', 'ring_system', 'Quick cuffs / QCS', 'Si Tech Quick Cuff / QCS Oval', 2083, 'inkl moms'),
('sn-ring-quick-cuff', 'subnautica', 'ring_system', 'Quick cuffs / QCS', 'Installation Quick cuffs eller QCS oval inkl. tätningar', 1695, ''),
-- P-valve
('dv-pvalve', 'draktverkstan', 'valve', 'P-valve install', 'Installation Agir P-ventil', 2546, 'inkl moms'),
('sn-pvalve', 'subnautica', 'valve', 'P-valve install', 'Installation p-ventil Si Tech Trigon', 1645, 'inkl ventiltallrik'),
-- Hood
('dv-hood-fixed', 'draktverkstan', 'hood', 'Fixed hood', 'Byte / installation fast huva', 2083, 'inkl moms'),
('sn-hood-fixed', 'subnautica', 'hood', 'Fixed hood', 'Installation/byte fast huva, ursuit 5mm', 1785, ''),
('dv-latex-hood', 'draktverkstan', 'hood', 'Latex hood', 'Byte latexhuva', 1450, 'inkl moms'),
('sn-latex-hood', 'subnautica', 'hood', 'Latex hood', 'Byte latexhuva', 1160, ''),
-- Other
('dv-pinhole', 'draktverkstan', 'other', 'Pinhole repair', 'Stickhålsreparation', 94, 'per styck, inkl moms'),
('sn-pinhole', 'subnautica', 'other', 'Pinhole repair', 'Stickhålsreparation', 95, 'per styck'),
('dv-pinhole-patch', 'draktverkstan', 'other', 'Pinhole patch', 'Stickhålsreparation gummipatch', 188, 'per styck, inkl moms'),
('sn-pinhole-patch', 'subnautica', 'other', 'Pinhole patch', 'Stickhålsreparation gummipatch', 160, 'per styck'),
('dv-wash', 'draktverkstan', 'other', 'Suit wash', 'Tvätt av torrdräkt', 395, 'inkl moms'),
('dv-crotch-retape', 'draktverkstan', 'other', 'Crotch re-tape', 'Omtejpning av grenparti', 870, 'inkl moms'),
('sn-crotch-retape', 'subnautica', 'other', 'Crotch re-tape', 'Omtejpning av grenparti', 795, 'från'),
('dv-warm-neck-install', 'draktverkstan', 'other', 'Warm neck replace', 'Byte Warm Neck Collar', 1734, 'inkl moms'),
('sn-warm-neck-install', 'subnautica', 'other', 'Warm neck install', 'Installation ursuit warm neck', 995, ''),
('sn-warm-neck-replace', 'subnautica', 'other', 'Warm neck replace', 'Byte ursuit warm neck', 1195, ''),
('dv-move-valve', 'draktverkstan', 'other', 'Move valve', 'Flyttning av ventil', 1299, 'inkl moms'),
('dv-kneepads', 'draktverkstan', 'other', 'Kevlar kneepads', 'Installation Kneepads Kevlarneoprene', 1734, 'inkl moms'),
('dv-suspenders', 'draktverkstan', 'other', 'Suspenders', 'Byte / installation hängslen', 2083, 'inkl moms');
