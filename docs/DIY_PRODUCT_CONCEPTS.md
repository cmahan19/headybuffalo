# Product concepts (20), including hand-made DIY products

> **CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE**
>
> These are ideas to validate, not products. None has a price, stock, supplier, or claim. Nothing here says a
> concept is profitable or in demand; that is what the validation scorecard is for.
> Source of truth: `src/lib/concepts.ts` (regenerate with `node scripts/export-concepts-doc.mjs`).

**Where they appear**
- **Private:** `/admin/product-concepts` shows status, readiness gate, supplier and material fields, owner
  decisions, the scorecard, approve/reject/archive controls, and the audit trail.
- **Public:** `/ideas` and the homepage "Ideas we're exploring" module. Both are `noindex` and show the
  "Concept Only / Not available for purchase / Under product research and sourcing review" labels. They have no price, cart,
  stock, rating, or Product schema. Public names drop words like "reusable" until materials are tested.
- **Interest list:** not shown, because no email capture exists. Cards say "Details coming after product validation."

**Excluded by design:** cosmetics, food, supplements, homemade cleaners, medical products, children's products,
and chemical formulations.

## Launch requirements (every concept)

- [ ] Supplier and material confirmation (documented)
- [ ] Product samples received and approved
- [ ] Cost of goods known
- [ ] Retail price set and owner-approved
- [ ] Packaging designed with accurate labeling
- [ ] Real product photography
- [ ] Fulfillment method (in-house, 3PL, or seller)
- [ ] Shipping weight and dimensions
- [ ] Return policy
- [ ] Safety and care instructions
- [ ] Claim review (no unsupported environmental or performance claims)
- [ ] Legal/label review where necessary

Plus the readiness gate in `src/lib/readiness.ts` (15 activation checks, and 8 more for DIY kits),
a real price, a real photo (never generated art), and copy that passes the claim validator.

## Validation questions (every concept)

- Who would buy it?
- What problem does it solve?
- What would it cost to source and ship?
- Is it durable enough for its intended use?
- What material claims can actually be proven?
- What bundle would make it more useful?

## Validation scorecard (tracked per concept in admin)

Customer interviews · supplier quotes · cost of goods · shipping cost · fulfillment feasibility · safety review ·
claim review · sample tested · MOQ known · contribution margin · return risk · product image ready · listing ready.

---

## 1. Colorful reusable produce-bag starter set

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Colorful produce-bag starter set |
| Description | A small set of colorful mesh and cloth bags sized for loose fruit and vegetables. |
| Category | Everyday Carry |
| Product type | physical kit, possible seller product, possible affiliate product |
| DIY kit (extra requirements) | No |
| Cross-sell | Fold-up shopping tote pouch; everyday-routine starter bundle |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | possible |
| Concept art | `concept-bg-01` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Which fabrics and closures hold up to repeated washing? Test before claiming anything about reuse.
- Tare weight printed on bags? Only if measured per bag.

**Owner decision needed:** Source in-house vs. list a maker's version vs. link to a partner.

---

## 2. Reusable shopping-tote fold-up pouch

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Fold-up shopping tote pouch |
| Description | A shopping tote that folds into its own small pouch for a bag or glovebox. |
| Category | Everyday Carry |
| Product type | accessory, possible seller product, possible affiliate product |
| DIY kit (extra requirements) | No |
| Cross-sell | Produce-bag starter set |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | possible |
| Concept art | `concept-bg-02` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Load rating must be tested, not estimated.
- Custom Heady Buffalo print feasible at low MOQ?

**Owner decision needed:** Is a Heady Buffalo print worth the MOQ, or should this be a curated maker product?

---

## 3. Colorful bulk-pantry label kit

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Colorful pantry label kit |
| Description | A set of colorful labels and a marker for naming jars and containers in the pantry. |
| Category | DIY & Craft |
| Product type | physical kit, digital product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Home organization digital kit; refill-station organizer kit |
| Subscription suitability | none |
| Marketplace suitability | possible |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-03` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Label material and adhesive: removable vs. permanent? Dishwasher-safe only if tested.
- Printable digital version as a lower-cost entry point?

**Owner decision needed:** Physical kit, printable download, or both?

---

## 4. Home refill-station organizer kit

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Home refill-station organizer kit |
| Description | An organizer kit for grouping the bottles and containers you top up at home. |
| Category | Home & Organization |
| Product type | physical kit, bundle |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Pantry label kit |
| Subscription suitability | refill only if a real consumable/refill is later created |
| Marketplace suitability | possible |
| Affiliate suitability | possible |
| Concept art | `concept-bg-04` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- What exactly is in the kit (tray, labels, funnel)? Each part needs a supplier.
- Must not include or imply any cleaning formula.

**Owner decision needed:** Which components are worth sourcing vs. recommending from partners?

---

## 5. Reusable utensil and straw travel pouch

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Utensil and straw travel pouch |
| Description | A roll-up pouch that keeps a fork, spoon, and straw together in a bag. |
| Category | Everyday Carry |
| Product type | accessory, possible seller product |
| DIY kit (extra requirements) | No |
| Cross-sell | Beverage-sleeve accessory set |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | possible |
| Concept art | `concept-bg-05` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Food-contact items need material documentation and possibly compliance review; start with the pouch only.

**Owner decision needed:** Sell the pouch alone, or include utensils (adds food-contact review)?

---

## 6. Cloth gift-wrap / reusable gift-bag starter set

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Cloth gift-wrap and gift-bag starter set |
| Description | Printed fabric squares and drawstring bags for wrapping gifts, with a folding guide. |
| Category | Gifts & Wrapping |
| Product type | physical kit, bundle, possible seller product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Everyday-routine starter bundle |
| Subscription suitability | seasonal |
| Marketplace suitability | good |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-06` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Folding guide must be original or licensed.
- Seasonal print runs vs. evergreen designs?

**Owner decision needed:** Commission original prints from a maker, or source blank fabric and print in-house?

---

## 7. Colorful plant-label and plant-care organizer kit

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Colorful plant-label and plant-care organizer kit |
| Description | Colorful plant markers and a small organizer card for tracking watering days. |
| Category | DIY & Craft |
| Product type | physical kit, digital product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Pantry label kit |
| Subscription suitability | seasonal |
| Marketplace suitability | possible |
| Affiliate suitability | possible |
| Concept art | `concept-bg-07` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Marker material outdoors vs. indoors: test fading before stating anything.
- No plant-health or growth claims.

**Owner decision needed:** Indoor-only kit first, or indoor + outdoor versions?

---

## 8. Reusable beverage-sleeve accessory set

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Beverage-sleeve accessory set |
| Description | Colorful fabric sleeves that slip around cups and cans for grip. |
| Category | Everyday Carry |
| Product type | accessory, possible seller product |
| DIY kit (extra requirements) | No |
| Cross-sell | Utensil and straw travel pouch |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | possible |
| Concept art | `concept-bg-08` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Heat insulation or comfort claims only if measured.
- Which cup sizes to fit?

**Owner decision needed:** Maker-made (handmade variety) or sourced blanks with a Heady Buffalo print?

---

## 9. Home organization label + storage planning digital kit

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Home organization label and storage planning kit (digital) |
| Description | Printable labels and planning worksheets for sorting a room, shelf by shelf. |
| Category | Home & Organization |
| Product type | digital product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Pantry label kit |
| Subscription suitability | digital membership |
| Marketplace suitability | unlikely |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-09` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- All designs must be original or licensed for resale.
- Needs a digital delivery method (none exists yet) and a refund policy for downloads.

**Owner decision needed:** Which delivery platform (Stripe + email link, or a digital-goods service)?

---

## 10. Giftable “Everyday Reuse Routine” starter bundle

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Giftable everyday-routine starter bundle |
| Description | A gift box idea combining a few of the everyday-carry and organizing items above. |
| Category | Gifts & Wrapping |
| Product type | bundle |
| DIY kit (extra requirements) | No |
| Cross-sell | Cloth gift-wrap and gift-bag starter set |
| Subscription suitability | seasonal |
| Marketplace suitability | possible |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-10` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Only possible once at least two component products are ACTIVE.
- Bundle price must be real: no 'save X%' unless the separate prices are real and current.

**Owner decision needed:** Which two or three components come first?

---

## 11. Hand-stamped canvas tote

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Hand-stamped canvas tote |
| Description | A canvas tote printed by hand with original stamp designs. |
| Category | Everyday Carry |
| Product type | physical kit, possible seller product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Fold-up shopping tote pouch; embroidered patch set |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-11` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Wash-test printed samples before saying anything about washing.
- Designs must be original or licensed.

**Owner decision needed:** Sell finished totes, a stamp-your-own kit, or both?

### Make it yourself (Beginner, internal planning only)

**Materials to source**
- Blank canvas tote bags (record fiber content from the supplier's spec sheet)
- Fabric ink or textile paint
- Hand-carved or purchased stamps of original designs
- Kraft hang tags

**Tools**
- Foam brush or brayer
- Cardboard insert
- Iron (for heat-setting, if the ink requires it)
- Drying rack

**Steps**
1. Prewash blanks if the ink manufacturer recommends it; press flat.
2. Slide cardboard inside the tote so ink can't bleed through.
3. Ink the stamp evenly, press firmly, and lift straight up. Repeat for the pattern.
4. Let dry fully, then heat-set exactly as the ink label directs.
5. Inspect for smudges; tag and bag.

**Safety and quality**
- Follow the ink manufacturer's ventilation and heat-setting directions.
- Only state care instructions you have tested on finished samples.

---

## 12. Macramé plant hanger

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Macramé plant hanger |
| Description | A knotted cord hanger for a small potted plant, with a wooden ring for hanging. |
| Category | Home & Organization |
| Product type | physical kit, possible seller product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Woven wall hanging; plant-label kit |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-12` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Load-test every design before listing a weight limit.
- Which pot sizes fit?

**Owner decision needed:** Finished hangers, a knot-it-yourself kit, or both?

### Make it yourself (Beginner, internal planning only)

**Materials to source**
- Macramé cord (record material and diameter from the supplier)
- Wooden ring
- Optional wooden beads

**Tools**
- Sharp scissors
- Tape measure
- Hook or rod to hang the work while knotting

**Steps**
1. Cut 8 cords to equal length (roughly 4x the finished length) and fold them over the ring.
2. Tie a gathering knot under the ring.
3. Split into groups of four and tie square knots or a spiral of half knots.
4. Leave a gap, then alternate cords between groups to form the basket.
5. Finish with a gathering knot at the bottom and trim the tassel evenly.

**Safety and quality**
- Test the finished hanger with a weighted pot; state only the tested limit.
- Include mounting guidance: the hook must be rated for the load.

---

## 13. Rope coil basket

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Rope coil basket |
| Description | A soft, sewn rope basket for blankets, toys, or odds and ends. |
| Category | Home & Organization |
| Product type | physical kit, possible seller product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Fabric storage bin |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-13` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- How long does one basket take? Time real builds before pricing.
- Which sizes sell best?

**Owner decision needed:** Which sizes and colorways first?

### Make it yourself (Intermediate, internal planning only)

**Materials to source**
- Rope or clothesline (record material from the supplier)
- Thread
- Optional fabric scraps or dyed rope for accent stripes

**Tools**
- Sewing machine with zigzag stitch
- Heavy-duty needle
- Clips
- Scissors

**Steps**
1. Coil the rope end into a tight spiral and zigzag across it to start the base.
2. Keep coiling and zigzagging until the base is the size you want.
3. Tilt the base up against the machine to start building the walls.
4. Form handles by leaving two rope loops unstitched on opposite sides.
5. Taper the rope end, stitch it down securely, and backstitch.

**Safety and quality**
- Keep fingers clear of the needle when feeding thick rope.
- Check that no loose threads or sharp ends remain.

---

## 14. Pressed-flower bookmark set

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Pressed-flower bookmark set |
| Description | Bookmarks made with pressed flowers sealed under a clear layer. |
| Category | Gifts & Wrapping |
| Product type | physical kit, bundle, possible seller product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Hand-bound notebook |
| Subscription suitability | seasonal |
| Marketplace suitability | good |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-14` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Where do the flowers come from? Home-grown, purchased, or legally foraged only.
- Do colors fade? Test over several weeks.

**Owner decision needed:** Seasonal flower sets or a year-round collection?

### Make it yourself (Beginner, internal planning only)

**Materials to source**
- Flowers and leaves (grown, purchased, or legally foraged)
- Cardstock
- Laminating pouches or clear sleeves
- Cotton cord or ribbon

**Tools**
- Flower press or heavy books with blotting paper
- Laminator
- Corner rounder
- Hole punch

**Steps**
1. Press flowers between blotting paper for 1 to 3 weeks until fully dry.
2. Arrange them on cardstock strips.
3. Seal in a laminating pouch and run it through the laminator.
4. Trim, round the corners, punch a hole, and add cord.

**Safety and quality**
- Never use protected or endangered species.
- Make no allergen or 'natural' claims; just name the flowers used.

---

## 15. Hand-bound notebook

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Hand-bound notebook |
| Description | A small notebook with hand-sewn pages and a fabric or paper cover. |
| Category | DIY & Craft |
| Product type | physical kit, possible seller product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Pressed-flower bookmark set |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-15` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Paper weight and type from the supplier's spec sheet.
- Blank, lined, or dot grid?

**Owner decision needed:** Which binding style: pamphlet (fast) or coptic (premium)?

### Make it yourself (Intermediate, internal planning only)

**Materials to source**
- Text paper
- Cover board or heavy cardstock
- Waxed linen thread
- Bookcloth or decorative paper
- PVA glue

**Tools**
- Bone folder
- Awl
- Bookbinding needle
- Cutting mat, craft knife, metal ruler

**Steps**
1. Fold paper into signatures and crease with the bone folder.
2. Mark and punch sewing stations through each signature with the awl.
3. Sew the signatures together (pamphlet or coptic stitch).
4. Cover the boards and attach them; press overnight under weight.

**Safety and quality**
- Cut away from your body with a sharp blade and a metal ruler.
- Let glue cure fully before packing.

---

## 16. Woven wall hanging

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Woven wall hanging |
| Description | A small loom-woven wall piece in neutral and accent-color yarns. |
| Category | Home & Organization |
| Product type | physical kit, possible seller product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Macramé plant hanger |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-16` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Each piece is one-of-a-kind; photograph each listing individually.
- Kit version: is the loom included?

**Owner decision needed:** One-of-a-kind finished pieces or a beginner weaving kit?

### Make it yourself (Beginner, internal planning only)

**Materials to source**
- Warp string
- Yarns in neutral and accent colors
- Wooden dowel
- Hanging cord

**Tools**
- Frame loom
- Tapestry needle
- Weaving comb or fork
- Scissors

**Steps**
1. Warp the loom with even tension.
2. Weave a plain header, then build texture with rya knots and soumak.
3. Beat each row down with the comb.
4. Weave a closing header, cut it off the loom, and tie off the warps.
5. Fold the top over the dowel, stitch it, and add the hanging cord.

**Safety and quality**
- List the yarn contents exactly as the supplier labels them.

---

## 17. Embroidered patch set

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Embroidered patch set |
| Description | Original embroidered designs finished as sew-on or iron-on patches. |
| Category | DIY & Craft |
| Product type | physical kit, possible seller product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Hand-stamped canvas tote |
| Subscription suitability | seasonal |
| Marketplace suitability | good |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-17` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Test iron-on adhesion and washing before stating care instructions.
- Original designs only (could include the buffalo mark).

**Owner decision needed:** Hand-stitched (slow, premium) or digitized machine embroidery?

### Make it yourself (Intermediate, internal planning only)

**Materials to source**
- Twill fabric
- Embroidery floss
- Fusible adhesive backing or plain backing for sew-on
- Water-soluble stabilizer

**Tools**
- Embroidery hoop
- Needles
- Small sharp scissors
- Iron

**Steps**
1. Transfer the design onto stabilizer and baste it to the twill.
2. Fill areas with long-and-short or satin stitch.
3. Outline the edge with a tight satin border.
4. Rinse out the stabilizer, dry, and apply the backing per the adhesive's directions.
5. Cut out just outside the border.

**Safety and quality**
- Follow the adhesive manufacturer's heat directions.
- Only state washability you have tested.

---

## 18. Painted wooden coaster set

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Painted wooden coaster set |
| Description | A set of wood coasters with hand-painted designs and a clear finish. |
| Category | Gifts & Wrapping |
| Product type | physical kit, bundle, possible seller product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Giftable everyday-routine starter bundle |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-18` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Test finished coasters with hot mugs and condensation before stating any resistance.
- Which wood species? Record it from the supplier.

**Owner decision needed:** Painted designs, wood-burned designs, or both?

### Make it yourself (Beginner, internal planning only)

**Materials to source**
- Unfinished wood rounds
- Acrylic paints
- Clear finish labeled for the intended use
- Cork or felt dots for the base

**Tools**
- Sandpaper (120 and 220 grit)
- Detail brushes
- Painter's tape
- Drying rack

**Steps**
1. Sand faces and edges smooth; wipe off dust.
2. Paint the designs; let dry completely.
3. Apply the clear finish in thin coats, sanding lightly between coats as the label directs.
4. Let it cure for the full time on the label, then add the base dots.

**Safety and quality**
- Apply finishes in a ventilated area and follow the label exactly.
- Make no heat-proof or waterproof claims without testing.

---

## 19. Fabric storage bin

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Fabric storage bin |
| Description | A soft-sided fabric bin for shelves and closets. |
| Category | Home & Organization |
| Product type | physical kit, possible seller product |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Rope coil basket; home organization planning kit |
| Subscription suitability | none |
| Marketplace suitability | good |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-19` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Size to common shelf cubes: measure real units.
- Does it hold its shape when full?

**Owner decision needed:** Which sizes and fabrics first?

### Make it yourself (Intermediate, internal planning only)

**Materials to source**
- Outer fabric
- Lining fabric
- Fusible interfacing or foam stabilizer
- Webbing for handles

**Tools**
- Sewing machine
- Iron
- Rotary cutter and mat
- Pins or clips

**Steps**
1. Cut outer, lining, and interfacing panels to size; fuse the interfacing.
2. Sew the outer side seams and box the corners; repeat for the lining.
3. Baste the handles to the outer piece.
4. Nest the lining inside, fold the top edges in, and topstitch the rim.

**Safety and quality**
- List fabric contents exactly as the supplier labels them.

---

## 20. Glass jar display kit (no live plants)

**CONCEPT ONLY — NOT AVAILABLE FOR PURCHASE** · Status: `CONCEPT_ONLY`

| | |
| --- | --- |
| Public name | Glass jar display kit |
| Description | A kit for arranging pebbles, sand, and small decorations in a glass jar. No live plants. |
| Category | DIY & Craft |
| Product type | physical kit, bundle |
| DIY kit (extra requirements) | Yes |
| Cross-sell | Plant-label kit |
| Subscription suitability | seasonal |
| Marketplace suitability | possible |
| Affiliate suitability | unlikely |
| Concept art | `concept-bg-20` (abstract pedestal, no product shown) |

**Concept-specific validation notes**
- Glass breakage in shipping: test packaging.
- Decide whether filler is artificial or preserved, and document how it was treated.

**Owner decision needed:** Ship the jar, or sell a refill pack for the customer's own jar?

### Make it yourself (Beginner, internal planning only)

**Materials to source**
- Glass jar with lid
- Decorative pebbles and sand
- Decorative filler (artificial or documented preserved)
- Small decorative pieces
- Instruction card

**Tools**
- Funnel
- Long tweezers or chopsticks
- Small scoop

**Steps**
1. Layer the pebbles, then sand, using the funnel for clean lines.
2. Place the filler and decorations with tweezers.
3. Wipe the glass, close the lid, and add the instruction card.

**Safety and quality**
- Small parts and glass: not intended for children. Label accordingly.
- Pack glass with tested protective packaging.
