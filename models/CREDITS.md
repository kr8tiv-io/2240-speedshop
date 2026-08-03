# 2240 Speed Shop — 3D asset credits and licence record

**105 `.glb` files, ~140 MB total.** Every file in this folder was downloaded, and verified to be a real binary glTF: ASCII magic `glTF` in bytes 0–3, a valid JSON chunk, a header length matching the true file size, at least one mesh, and **no external references** (all buffers and textures are embedded, so nothing can load half-broken).

Every asset is **CC0** or **CC BY**. Nothing here is "free for personal use only", and nothing required a login to download. Authors and licences below were read off the actual asset pages — none are guessed.

- **73 files CC0 1.0** — public domain, no attribution obligation.
- **32 files CC BY 3.0** — attribution required. See "Attribution block" at the bottom; paste it into the site credits/colophon.

---

## SHOP LAYOUT REFERENCE

Research summary for composing the scene authentically rather than guessing. Sources listed at the end of this section.

### Bay layout
- Small independent shops are a rectangular box with bays side by side along the front wall, each with its own roll-up door. A bay module is typically **12 ft wide × 24 ft deep**; 24 ft is the practical minimum for a car, 24–36 ft for pickups. A 3-bay shop reads as roughly **36–40 ft wide × 40–60 ft deep**.
- A **two-post lift** needs **12 ft minimum bay width**, floor width across the columns of **132–139 in (11–11.6 ft)**, and **12 ft minimum ceiling** (14–16 ft preferred). Baseplate/floor-plate models work at **~9.5 ft** — use that variant for a low, cramped, older-building feel.
- The lift sits centred in the bay with the columns roughly **10–12 ft back from the roll-up door**, so a car drives straight in and stops between the posts. Leave ~3 ft walking clearance from posts to the side wall.

### Zones (workflow loop — dirty work furthest from the doors)
Roll-up doors on the front wall → lift/teardown bays immediately inside → workbench and parts storage along **one side wall** (reachable without walking around the car) → **welding/fab** and **media blast** pushed to a back corner behind a partition or heavy curtain, with their own ventilation → paint/body partitioned at one end → a small glassed-in office in a front corner so customers never cross the bays.

### Bench and tool placement
- Benches are wall-mounted along a side wall, **34–36 in tall, 24–30 in deep**, with a pegboard or French-cleat tool wall above and a vice at one end.
- The **roll cab is mobile and lives beside the car** — usually at the driver's front fender or by the lift post, top tray open with tools scattered on it. It moves with the job; it is not parked against the wall.
- The **air compressor** goes in a back corner or its own closet — loud, hot, vibrates — hard-piped overhead to drops. **Hose reels hang from the ceiling** over each bay with the hose dangling.
- Tall steel parts racks line the back wall and any dead wall, holding a customer's disassembled parts boxed and labelled per car.

### Engine build area
Off to the side of the main bays, out of the drive path, usually a back corner near a clean bench. Contains an engine on a rotating **engine stand**, a folding **shop crane / cherry picker** parked nearby with legs folded, an engine leveller chain, a **parts washer** with a solvent tank, and a clean assembly bench with torque wrenches and trays of bolts. Cylinder heads and an intake manifold sit on the bench or the floor. A drop light is aimed at the block.

### Floor clutter mid-job
Four wheels/tyres stacked in a leaning pile just outside the bay; jack stands (some in use, some empty); a low-profile floor jack shoved under the front; a creeper on its side; an oil drain pan under the transmission; a wheeled oil drum with a pump; a welding cart with **oxy/acetylene bottles chained upright**; a MIG welder with its ground clamp trailing; extension cords and air hoses snaking across the floor; red shop rags; a rolling stool; a bumper and a door leaning against the wall; cardboard under the engine; a coffee cup on the fender cover.

> Safety note that also reads as authentic: oxygen and fuel-gas bottles are stored **20 ft apart or split by a 5 ft noncombustible barrier**, and always chained upright.

### Lighting and atmosphere
- 4 ft or 8 ft strip fixtures suspended on chain, hung at **10–12 ft**, spaced **≈12–14 ft apart** (1.0–1.2 × mounting height), in rows running the long axis, one row per bay. Target **50–70 fc** at the work plane — use more low-wattage fixtures rather than fewer bright ones, to kill glare.
- Floor: sealed grey concrete with oil stains and tyre marks, or grey/black epoxy. Walls: white or cream painted block / corrugated steel, with a grimy band at hand height.
- **Night shot:** pools of cool white light under each fixture, deep shadow in the corners and up in the trusses, chrome and windshield glass catching the strips, neon the only real colour, black glass in the roll-up door windows reflecting the interior, and one drop light glowing hot under the raised car.

### Signature hot rod details
A wall of vintage tin signs (gas & oil, Route 66, speed shop — black borders, cream panels, red pinstriping); a real-glass neon sign; a pin-up calendar; stacked steel wheels and a set of chrome reverse rims; a bare block on a stand under a hanging light; a fender cover draped over a quarter panel; dusty trophies; a hood stored up in the rafters; a checkered accent stripe; license plates nailed above the door; and a project under a car cover in the back bay.

**Sources:** [mechanicsvault.com](https://mechanicsvault.com/pages/2-post-car-lift-space-requirements) · [autoleap.com](https://autoleap.com/blog/2-post-car-lift-space-requirements-for-your-30x40-garage/) · [primeweld.com](https://primeweld.com/blogs/news/garage-and-workshop-layouts) · [hi-hyperlite.com](https://hi-hyperlite.com/blogs/comprehensive-guides/avoid-glare-garage-shop-lighting) · [ledlightingsupply.com](https://www.ledlightingsupply.com/photometric-plan/led-high-bay-lighting-calculator) · [OSHA 1910.253](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.253)

---

## GAPS — what could NOT be sourced, and what to do about it

Four things on the brief do **not** exist as a licence-clean, no-login download anywhere I could reach. I checked Poly Pizza (exhaustively — ~30 search terms), Poly Haven, Khronos glTF-Sample-Assets, the three.js example models, Kenney, Quaternius, OpenGameArt, opensource3dassets.com / the ToxSam CC0 registry, Sketchfab and Meshy.

| Missing | Status | Recommended substitute |
|---|---|---|
| **Two-post car lift** | Does not exist CC0/CC-BY. Only hits are Sketchfab (login required), TurboSquid/CGTrader (paid, not CC0) and GrabCAD (login, non-CC0). | **Build from primitives** — it is two columns, two baseplates and four swing arms, all box/cylinder geometry. Use the dimensions in the layout section above. Every car below is a real model and will sit on it. |
| **V8 / engine block** | No automotive engine exists on any CC0 source reached. Poly Pizza has only "Sci Fi Engine" and "Space engine"; Poly Haven has no engine. Meshy has a CC0 "Red-Block V8 Race Engine" but **requires an account** to download, so it was not taken. | No honest substitute shipped. Closest dressing already here: `prop-generator-portable.glb` (a real petrol engine on a frame) reads convincingly as a motor on a stand in shadow. Otherwise this needs modelling or a paid asset. |
| **Engine stand / cherry picker** | Same as above — none available. | `prop-hoist-hook-chain.glb` and `prop-hoist-hook-cable.glb` are real hook-and-chain assemblies. Hang them from a primitive-built gantry/crane arm and the read is correct. |
| **Floor jack, jack stands, creeper, parts washer** | None found CC0/CC-BY. | `prop-pallet-jack.glb` is a wheeled hydraulic jack and reads acceptably at floor level; `prop-service-ramp.glb` covers the "car up on ramps" alternative to a lift. |

**Also worth knowing:** the vehicles and the props are **not the same art style** — see the honesty note at the end of this file.

---


## 1. Vehicles

| File | What it is | Author | Licence | Size | Source |
|---|---|---|---|---|---|
| `car-camaro-primer-shell.glb` | Camaro SS LP | Mihail Burduja | CC BY 3.0 | 159 KB | [Poly Pizza](https://poly.pizza/m/e01OsIsKEt-) |
| `car-camaro.glb` | Chevrolet Camaro | PuKkBuMXDD | CC BY 3.0 | 231 KB | [Poly Pizza](https://poly.pizza/m/kVcKsd2dEk) |
| `car-convertible-50s.glb` | Convertible | Poly by Google | CC BY 3.0 | 1.68 MB | [Poly Pizza](https://poly.pizza/m/dggOiBLYyuR) |
| `car-covered-project.glb` | Covered Car | MP | CC0 1.0 | 2.24 MB | [Poly Haven](https://polyhaven.com/a/covered_car) |
| `car-dodge-charger.glb` | Dodge Charger | David Sirera | CC BY 3.0 | 498 KB | [Poly Pizza](https://poly.pizza/m/4b80hRVxqvv) |
| `car-muscle-challenger.glb` | 2015 Dodge Challenger | Grzybek | CC BY 3.0 | 804 KB | [Poly Pizza](https://poly.pizza/m/1jB8I4t5w4) |
| `car-muscle-coupe-hoodup.glb` | 1972 Bursley Defiance | Grzybek | CC BY 3.0 | 999 KB | [Poly Pizza](https://poly.pizza/m/jxV8VZ9fYo) |
| `car-prewar-hotrod-donor.glb` | Old Car | Attila Dobák | CC BY 3.0 | 1.61 MB | [Poly Pizza](https://poly.pizza/m/3knnxGlixiJ) |
| `car-project-shell-rusted.glb` | Broken Car | Quaternius | CC0 1.0 | 206 KB | [Poly Pizza](https://poly.pizza/m/Y67erogmR9) |
| `truck-old-flatnose.glb` | Truck | Poly by Google | CC BY 3.0 | 289 KB | [Poly Pizza](https://poly.pizza/m/fv2QPJ3DJOY) |
| `truck-pickup-classic.glb` | Pickup Truck | Quaternius | CC0 1.0 | 267 KB | [Poly Pizza](https://poly.pizza/m/qn4grQgHm8) |

## 2. Shop equipment and props — photoreal PBR (Poly Haven, all CC0)

These are photogrammetry/PBR-grade and should carry the hero shots. The welding cart, roll cab, bench vice, rusted rims and industrial lamps are the pieces that sell "real working shop".

| File | What it is | Author | Licence | Size | Source |
|---|---|---|---|---|---|
| `prop-ammo-box.glb` | Ammo Box | DanKit | CC0 1.0 | 1.4 MB | [Poly Haven](https://polyhaven.com/a/ammo_box) |
| `prop-barrel-rusted-a.glb` | Barrel_01 | Jorge Camacho | CC0 1.0 | 676 KB | [Poly Haven](https://polyhaven.com/a/Barrel_01) |
| `prop-barrel-rusted-b.glb` | Barrel 02 | Jorge Camacho | CC0 1.0 | 411 KB | [Poly Haven](https://polyhaven.com/a/Barrel_02) |
| `prop-barrel-rusted-c.glb` | Barrel 03 | Serhii Khromov | CC0 1.0 | 560 KB | [Poly Haven](https://polyhaven.com/a/barrel_03) |
| `prop-bench-vice.glb` | Bench Vice 01 | Yann Kervran, Antanas Kep | CC0 1.0 | 2.32 MB | [Poly Haven](https://polyhaven.com/a/bench_vice_01) |
| `prop-bookshelf-worn.glb` | Wooden Bookshelf Worn | Ulan Cabanilla | CC0 1.0 | 2.65 MB | [Poly Haven](https://polyhaven.com/a/wooden_bookshelf_worn) |
| `prop-can-rusted.glb` | Can Rusted | Rahul Chaudhary | CC0 1.0 | 2.01 MB | [Poly Haven](https://polyhaven.com/a/can_rusted) |
| `prop-cardboard-box.glb` | Cardboard Box 01 | Rahul Chaudhary | CC0 1.0 | 2.07 MB | [Poly Haven](https://polyhaven.com/a/cardboard_box_01) |
| `prop-container-industrial.glb` | Industrial Plastic Container | Galo Benivegna | CC0 1.0 | 1.49 MB | [Poly Haven](https://polyhaven.com/a/industrial_pastic_container) |
| `prop-crate-military-old.glb` | Old Military Crate | Jack Mava | CC0 1.0 | 2.38 MB | [Poly Haven](https://polyhaven.com/a/old_military_crate) |
| `prop-crate-plastic.glb` | Plastic Crate 01 | PierreB3D | CC0 1.0 | 3.04 MB | [Poly Haven](https://polyhaven.com/a/plastic_crate_01) |
| `prop-crate-wooden.glb` | Wooden Crate 01 | James Ray Cock | CC0 1.0 | 2.17 MB | [Poly Haven](https://polyhaven.com/a/wooden_crate_01) |
| `prop-desk-lamp-arm.glb` | Desk Lamp Arm 01 | Yann Kervran, Kuutti Siitonen | CC0 1.0 | 2.74 MB | [Poly Haven](https://polyhaven.com/a/desk_lamp_arm_01) |
| `prop-desk-metal-office.glb` | Metal Office Desk | Ulan Cabanilla | CC0 1.0 | 1.53 MB | [Poly Haven](https://polyhaven.com/a/metal_office_desk) |
| `prop-fire-extinguisher-wall.glb` | Korean Fire Extinguisher 01 | UM JOORIN | CC0 1.0 | 1.54 MB | [Poly Haven](https://polyhaven.com/a/korean_fire_extinguisher_01) |
| `prop-generator-portable.glb` | Portable Generator | James Ray Cock | CC0 1.0 | 3.99 MB | [Poly Haven](https://polyhaven.com/a/portable_generator) |
| `prop-jerrycan-green.glb` | Metal Jerrycan Green | Ulan Cabanilla | CC0 1.0 | 2.46 MB | [Poly Haven](https://polyhaven.com/a/metal_jerrycan_green) |
| `prop-jerrycan-metal.glb` | Metal Jerrycan | Sean Buckley | CC0 1.0 | 2.89 MB | [Poly Haven](https://polyhaven.com/a/metal_jerrycan) |
| `prop-ladder-sectioned.glb` | Ladder Sectioned 01 | MP | CC0 1.0 | 2.45 MB | [Poly Haven](https://polyhaven.com/a/ladder_sectioned_01) |
| `prop-ladder-wooden.glb` | Wooden Ladder | Miroslav Turura | CC0 1.0 | 2.47 MB | [Poly Haven](https://polyhaven.com/a/wooden_ladder) |
| `prop-lamp-caged-hanging.glb` | Caged Hanging Light | Ulan Cabanilla | CC0 1.0 | 2.94 MB | [Poly Haven](https://polyhaven.com/a/caged_hanging_light) |
| `prop-lamp-industrial-hanging.glb` | Hanging Industrial Lamp | Kuutti Siitonen | CC0 1.0 | 3.09 MB | [Poly Haven](https://polyhaven.com/a/hanging_industrial_lamp) |
| `prop-lamp-pipe-industrial.glb` | Industrial Pipe Lamp | Mateusz Sadek | CC0 1.0 | 2.29 MB | [Poly Haven](https://polyhaven.com/a/industrial_pipe_lamp) |
| `prop-lamp-wall-industrial.glb` | Industrial Wall Lamp | Kuutti Siitonen | CC0 1.0 | 3.6 MB | [Poly Haven](https://polyhaven.com/a/industrial_wall_lamp) |
| `prop-light-security.glb` | Security Light | Maximilian Schuster | CC0 1.0 | 2.84 MB | [Poly Haven](https://polyhaven.com/a/security_light) |
| `prop-lights-fluorescent-mounted.glb` | Mounted Fluorescent Lights | Ulan Cabanilla | CC0 1.0 | 1.74 MB | [Poly Haven](https://polyhaven.com/a/mounted_fluorescent_lights) |
| `prop-lpg-tank-small.glb` | Small Lpg Tank | Ulan Cabanilla | CC0 1.0 | 2.62 MB | [Poly Haven](https://polyhaven.com/a/small_lpg_tank) |
| `prop-lubricant-spray.glb` | Lubricant Spray | James Ray Cock | CC0 1.0 | 1.67 MB | [Poly Haven](https://polyhaven.com/a/lubricant_spray) |
| `prop-metal-jug.glb` | Metal Jug | Anzor Lezhava | CC0 1.0 | 1.71 MB | [Poly Haven](https://polyhaven.com/a/metal_jug) |
| `prop-oil-can-small.glb` | Small Oil Can 01 | Raven van de Werken | CC0 1.0 | 912 KB | [Poly Haven](https://polyhaven.com/a/small_oil_can_01) |
| `prop-pipes-industrial.glb` | Modular Industrial Pipes 01 | Jorge Camacho | CC0 1.0 | 4.59 MB | [Poly Haven](https://polyhaven.com/a/modular_industrial_pipes_01) |
| `prop-pipes-modular.glb` | Modular Pipes | Kuutti Siitonen | CC0 1.0 | 5.5 MB | [Poly Haven](https://polyhaven.com/a/modular_pipes) |
| `prop-power-box.glb` | Power Box 01 | Rico Cilliers, Yann Kervran | CC0 1.0 | 2.6 MB | [Poly Haven](https://polyhaven.com/a/power_box_01) |
| `prop-propane-tank.glb` | Propane Tank | Slinc | CC0 1.0 | 2.11 MB | [Poly Haven](https://polyhaven.com/a/propane_tank) |
| `prop-rack-metal-worn.glb` | Worn Metal Rack | Luca B | CC0 1.0 | 1.92 MB | [Poly Haven](https://polyhaven.com/a/worn_metal_rack) |
| `prop-searchlight-portable.glb` | Portable Searchlight | Elijah Cragg | CC0 1.0 | 2.13 MB | [Poly Haven](https://polyhaven.com/a/portable_searchlight) |
| `prop-shelf-wooden.glb` | Shelf 01 | Gabriel Radić | CC0 1.0 | 590 KB | [Poly Haven](https://polyhaven.com/a/Shelf_01) |
| `prop-stool-metal-a.glb` | Metal Stool 01 | Ulan Cabanilla | CC0 1.0 | 2.2 MB | [Poly Haven](https://polyhaven.com/a/metal_stool_01) |
| `prop-stool-metal-b.glb` | Metal Stool 02 | Ulan Cabanilla | CC0 1.0 | 2.45 MB | [Poly Haven](https://polyhaven.com/a/metal_stool_02) |
| `prop-stool-metal-c.glb` | Metal Stool 03 | Flo Tasser | CC0 1.0 | 2.18 MB | [Poly Haven](https://polyhaven.com/a/metal_stool_03) |
| `prop-storage-cart-industrial.glb` | Industrial Storage Cart | Jule Bielitz | CC0 1.0 | 2.51 MB | [Poly Haven](https://polyhaven.com/a/industrial_storage_cart) |
| `prop-tire-pump.glb` | Tire Pump | Garrison Gager | CC0 1.0 | 1.59 MB | [Poly Haven](https://polyhaven.com/a/tire_pump) |
| `prop-tool-cart-rolling.glb` | Tool Cart | Savva Zakharov | CC0 1.0 | 3.02 MB | [Poly Haven](https://polyhaven.com/a/tool_cart) |
| `prop-tool-chest-metal.glb` | Metal Tool Chest | Yann Kervran, John Hutcheson | CC0 1.0 | 2.24 MB | [Poly Haven](https://polyhaven.com/a/metal_tool_chest) |
| `prop-toolbox-metal.glb` | Metal Toolbox | Mateusz Sadek | CC0 1.0 | 2.61 MB | [Poly Haven](https://polyhaven.com/a/metal_toolbox) |
| `prop-trash-can-metal.glb` | Metal Trash Can | GurJas Studios | CC0 1.0 | 4.76 MB | [Poly Haven](https://polyhaven.com/a/metal_trash_can) |
| `prop-tyre-old.glb` | Old Tyre | MP | CC0 1.0 | 2.13 MB | [Poly Haven](https://polyhaven.com/a/old_tyre) |
| `prop-utility-box.glb` | Utility Box 01 | James Ray Cock | CC0 1.0 | 1.88 MB | [Poly Haven](https://polyhaven.com/a/utility_box_01) |
| `prop-welding-cart.glb` | Portable Welding Cart | Georgii Gorbunov | CC0 1.0 | 3.34 MB | [Poly Haven](https://polyhaven.com/a/portable_welding_cart) |
| `prop-wheel-rim-rusted-a.glb` | Rusted Wheel Rim 01 | John Hutcheson | CC0 1.0 | 2.48 MB | [Poly Haven](https://polyhaven.com/a/rusted_wheel_rim_01) |
| `prop-wheel-rim-rusted-b.glb` | Rusted Wheel Rim 02 | John Hutcheson | CC0 1.0 | 2.47 MB | [Poly Haven](https://polyhaven.com/a/rusted_wheel_rim_02) |
| `prop-wrench-adjustable.glb` | Adjustable Wrench | Mateusz Sadek | CC0 1.0 | 2.52 MB | [Poly Haven](https://polyhaven.com/a/adjustable_wrench) |
| `prop-wrench-pipe.glb` | Pipe Wrench | Will Evarts | CC0 1.0 | 2.87 MB | [Poly Haven](https://polyhaven.com/a/pipe_wrench) |

## 3. Shop props — stylized low-poly (Poly Pizza)

Lighter-weight and flat-shaded. Good for background dressing, clutter and silhouette filler where PBR detail would be wasted.

| File | What it is | Author | Licence | Size | Source |
|---|---|---|---|---|---|
| `prop-car-battery.glb` | Car Battery | J-Toastie | CC BY 3.0 | 35 KB | [Poly Pizza](https://poly.pizza/m/hLVNyFYOOX) |
| `prop-cardboard-boxes.glb` | Cardboard Boxes | Quaternius | CC0 1.0 | 25 KB | [Poly Pizza](https://poly.pizza/m/V9KbWC8Vd6) |
| `prop-corrugated-sheet.glb` | Corrugated Iron Sheet | Kenney | CC0 1.0 | 19 KB | [Poly Pizza](https://poly.pizza/m/XbTpa4CwVl) |
| `prop-drill.glb` | Drill | jeremy | CC BY 3.0 | 41 KB | [Poly Pizza](https://poly.pizza/m/93nEcwogYE0) |
| `prop-droplight-pendant.glb` | old lamp | Justin Randall | CC BY 3.0 | 688 KB | [Poly Pizza](https://poly.pizza/m/73r4EQM-Z8e) |
| `prop-fire-extinguisher.glb` | Fire Extinguisher | dook | CC BY 3.0 | 53 KB | [Poly Pizza](https://poly.pizza/m/LtrzDvRya9) |
| `prop-fluorescent-strip.glb` | Fluorescent Light | Nick Slough | CC BY 3.0 | 92 KB | [Poly Pizza](https://poly.pizza/m/J8dFHQHQJZ) |
| `prop-funnel.glb` | Funnel | Poly by Google | CC BY 3.0 | 6 KB | [Poly Pizza](https://poly.pizza/m/46SWQ4tgI_V) |
| `prop-gas-bottle-propane.glb` | Propane Tank | Quaternius | CC0 1.0 | 31 KB | [Poly Pizza](https://poly.pizza/m/3revwBHxDC) |
| `prop-gas-bottle-tall.glb` | Scuba tank | Steren Giannini | CC BY 3.0 | 17 KB | [Poly Pizza](https://poly.pizza/m/4GhtCNARi8c) |
| `prop-gas-can-red.glb` | Gas can | Poly by Google | CC BY 3.0 | 56 KB | [Poly Pizza](https://poly.pizza/m/bOjbK_rGqRA) |
| `prop-gas-tank-yellow.glb` | Gas Tank | Quaternius | CC0 1.0 | 32 KB | [Poly Pizza](https://poly.pizza/m/RoCvKBGkoC) |
| `prop-hammer.glb` | Hammer | jeremy | CC BY 3.0 | 15 KB | [Poly Pizza](https://poly.pizza/m/cOizz1RJnb3) |
| `prop-hanging-lamp.glb` | Ceiling Lamp | Zsky | CC BY 3.0 | 28 KB | [Poly Pizza](https://poly.pizza/m/zq1Fus3I15) |
| `prop-hoist-hook-cable.glb` | Crane | cg_world | CC0 1.0 | 2 MB | [Poly Pizza](https://poly.pizza/m/17aBNzIsVg) |
| `prop-hoist-hook-chain.glb` | Hook and chain | Zacharylll | CC BY 3.0 | 243 KB | [Poly Pizza](https://poly.pizza/m/dBp9m8k9kTi) |
| `prop-jerry-can.glb` | Gas Can | Quaternius | CC0 1.0 | 28 KB | [Poly Pizza](https://poly.pizza/m/jRymgnHTTb) |
| `prop-jumper-cables.glb` | Jumper Cables | J-Toastie | CC BY 3.0 | 144 KB | [Poly Pizza](https://poly.pizza/m/Qt4PcL7wjJ) |
| `prop-ladder.glb` | Ladder | Quaternius | CC0 1.0 | 20 KB | [Poly Pizza](https://poly.pizza/m/h2xOIRr1OP) |
| `prop-metal-door.glb` | Metal Door | dook | CC BY 3.0 | 64 KB | [Poly Pizza](https://poly.pizza/m/H3BYbNwq8a) |
| `prop-oil-drum.glb` | Barrel | Quaternius | CC0 1.0 | 44 KB | [Poly Pizza](https://poly.pizza/m/MraIiFnpAY) |
| `prop-oil-drums-row.glb` | Oil Barrels | Robert Schlyter | CC BY 3.0 | 172 KB | [Poly Pizza](https://poly.pizza/m/cSXe7zbSSAL) |
| `prop-pallet-jack.glb` | Pallet Truck | KolosStudios | CC BY 3.0 | 43 KB | [Poly Pizza](https://poly.pizza/m/snDq7v3GRO) |
| `prop-pallet.glb` | Pallet | Kenney | CC0 1.0 | 16 KB | [Poly Pizza](https://poly.pizza/m/J6bhnc2wFP) |
| `prop-parts-cabinet.glb` | Container Shelf | MilkAndBanana | CC0 1.0 | 32 KB | [Poly Pizza](https://poly.pizza/m/cvmkDWTTL8) |
| `prop-pipes-stock.glb` | Pipes | Quaternius | CC0 1.0 | 58 KB | [Poly Pizza](https://poly.pizza/m/LqinclZKTn) |
| `prop-pliers.glb` | Pliers | jeremy | CC BY 3.0 | 12 KB | [Poly Pizza](https://poly.pizza/m/14FVXuvklov) |
| `prop-service-ramp.glb` | Ramp | Quaternius | CC0 1.0 | 18 KB | [Poly Pizza](https://poly.pizza/m/cS1JQReXZs) |
| `prop-shelving-tall.glb` | Shelf Tall | Quaternius | CC0 1.0 | 28 KB | [Poly Pizza](https://poly.pizza/m/TDgvIuorcX) |
| `prop-shop-light-4tube.glb` | 4 Bulb Grey Light - LRG Tubes | Evol-Love | CC BY 3.0 | 572 KB | [Poly Pizza](https://poly.pizza/m/aEsJgELAO9e) |
| `prop-shop-machine.glb` | Generator | KolosStudios | CC BY 3.0 | 30 KB | [Poly Pizza](https://poly.pizza/m/K58RQ63qR5) |
| `prop-spark-plug.glb` | Spark plug | Poly by Google | CC BY 3.0 | 320 KB | [Poly Pizza](https://poly.pizza/m/b5AlUtUp75O) |
| `prop-tyre-bare.glb` | Tire | Poly by Google | CC BY 3.0 | 108 KB | [Poly Pizza](https://poly.pizza/m/504DFE6EMeN) |
| `prop-tyre-stack.glb` | Tires | Quaternius | CC0 1.0 | 78 KB | [Poly Pizza](https://poly.pizza/m/mmq7GmG1AK) |
| `prop-tyre-truck.glb` | Truck Tire | Jarlan Perez | CC BY 3.0 | 40 KB | [Poly Pizza](https://poly.pizza/m/2GuaLHL6p5g) |
| `prop-wheel-mag.glb` | Tire | Poly by Google | CC BY 3.0 | 13 KB | [Poly Pizza](https://poly.pizza/m/cV6yx0v8Bfy) |
| `prop-wheel-stack-bare.glb` | Wheel | Quaternius | CC0 1.0 | 26 KB | [Poly Pizza](https://poly.pizza/m/UQg9S2RE0x) |
| `prop-wheel-tyre.glb` | Vehicle Tire | Jarlan Perez | CC BY 3.0 | 37 KB | [Poly Pizza](https://poly.pizza/m/2SNngBhunHZ) |
| `prop-workbench-anvil.glb` | Workbench Anvil | Kenney | CC0 1.0 | 20 KB | [Poly Pizza](https://poly.pizza/m/bY1pp3kAAb) |
| `prop-workbench-cluttered.glb` | Workbench | sirkitree | CC BY 3.0 | 626 KB | [Poly Pizza](https://poly.pizza/m/24I9X8aeWTR) |
| `prop-workbench-grinder.glb` | Workbench Grind | Kenney | CC0 1.0 | 30 KB | [Poly Pizza](https://poly.pizza/m/hnxYRW4Nx3) |

---

## Attribution block — REQUIRED for the 32 CC BY files

CC BY 3.0 requires visible credit. The CC0 files (all Poly Haven assets plus the Quaternius / Kenney / CreativeTrio / iPoly3D / Polygonal Mind items) require nothing, though Poly Haven says credit is appreciated.

Paste this into the site colophon, an `/credits` page, or a collapsed "Asset credits" section in the footer:

> 3D models by Attila Dobák, David Sirera, dook, Evol-Love, Grzybek, J-Toastie, Jarlan Perez, jeremy, Justin Randall, KolosStudios, Mihail Burduja, Nick Slough, Poly by Google, PuKkBuMXDD, Robert Schlyter, sirkitree, Steren Giannini, Zacharylll, Zsky — licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), sourced via [Poly Pizza](https://poly.pizza). Additional models from [Poly Haven](https://polyhaven.com) (CC0).

Full per-author breakdown:

| Author | Model(s) | Licence | Link |
|---|---|---|---|
| **Attila Dobák** | Old Car | CC BY 3.0 | https://poly.pizza/m/3knnxGlixiJ |
| **David Sirera** | Dodge Charger | CC BY 3.0 | https://poly.pizza/m/4b80hRVxqvv |
| **dook** | Fire Extinguisher, Metal Door | CC BY 3.0 | https://poly.pizza/m/LtrzDvRya9 |
| **Evol-Love** | 4 Bulb Grey Light - LRG Tubes | CC BY 3.0 | https://poly.pizza/m/aEsJgELAO9e |
| **Grzybek** | 1972 Bursley Defiance, 2015 Dodge Challenger | CC BY 3.0 | https://poly.pizza/m/jxV8VZ9fYo |
| **J-Toastie** | Car Battery, Jumper Cables | CC BY 3.0 | https://poly.pizza/m/hLVNyFYOOX |
| **Jarlan Perez** | Truck Tire, Vehicle Tire | CC BY 3.0 | https://poly.pizza/m/2SNngBhunHZ |
| **jeremy** | Drill, Hammer, Pliers | CC BY 3.0 | https://poly.pizza/m/14FVXuvklov |
| **Justin Randall** | old lamp | CC BY 3.0 | https://poly.pizza/m/73r4EQM-Z8e |
| **KolosStudios** | Generator, Pallet Truck | CC BY 3.0 | https://poly.pizza/m/snDq7v3GRO |
| **Mihail Burduja** | Camaro SS LP | CC BY 3.0 | https://poly.pizza/m/e01OsIsKEt- |
| **Nick Slough** | Fluorescent Light | CC BY 3.0 | https://poly.pizza/m/J8dFHQHQJZ |
| **Poly by Google** | Convertible, Funnel, Gas can, Spark plug, Tire, Tire, Truck | CC BY 3.0 | https://poly.pizza/m/fv2QPJ3DJOY |
| **PuKkBuMXDD** | Chevrolet Camaro | CC BY 3.0 | https://poly.pizza/m/kVcKsd2dEk |
| **Robert Schlyter** | Oil Barrels | CC BY 3.0 | https://poly.pizza/m/cSXe7zbSSAL |
| **sirkitree** | Workbench | CC BY 3.0 | https://poly.pizza/m/24I9X8aeWTR |
| **Steren Giannini** | Scuba tank | CC BY 3.0 | https://poly.pizza/m/4GhtCNARi8c |
| **Zacharylll** | Hook and chain | CC BY 3.0 | https://poly.pizza/m/dBp9m8k9kTi |
| **Zsky** | Ceiling Lamp | CC BY 3.0 | https://poly.pizza/m/zq1Fus3I15 |

---

## Honest assessment — read this before composing the scene

**Style mismatch is the main risk.** The vehicles are stylized/low-poly with simple flat materials (Poly Pizza), while the best props are photoreal PBR (Poly Haven). Side by side in daylight this would look wrong. It works in the intended **night garage** because pooled lighting, deep shadow and grade flatten the difference — but it must be lit that way deliberately. If a car has to be a hero close-up in bright light, the props around it should be the Poly Pizza set, not the Poly Haven set, for consistency.

**How well the vehicles actually match 1960s American silhouettes — candidly:**

| File | Verdict |
|---|---|
| `car-muscle-coupe-hoodup.glb` | **Best in set.** Fictional "1972 Bursley Defiance" — genuine long-hood/short-deck muscle proportions, and it comes **with the hood already open**, which directly serves the "work in progress" brief. Era-correct. |
| `car-muscle-challenger.glb` | Strong. Modelled as a 2015 Challenger, but that car is a deliberate homage to the 1970 original, so the silhouette reads correctly as classic muscle. Highest-fidelity body in the set. |
| `car-dodge-charger.glb` | Good. Boxy 2-door coupe proportions that read as a late-60s Charger. |
| `car-camaro.glb` / `car-camaro-primer-shell.glb` | Acceptable. Camaro silhouette; the "primer shell" is untextured white, which is genuinely useful as a body-in-primer project car. |
| `truck-pickup-classic.glb` | Reasonable stepside-ish American pickup shape, but clearly low-poly/toy-leaning. Closest match to the shop's real Dodge D100. |
| `car-convertible-50s.glb` | Era-correct **1950s** finned convertible silhouette, but strongly toy-styled. Best used mid-ground or in shadow. |
| `car-project-shell-rusted.glb` | Rusted wreck body — excellent as the bare project shell in a back bay. Low-poly but the role hides it. |
| `car-covered-project.glb` | **PBR quality.** A car under a cover — perfect for the "project under a tarp in the back bay" beat, and it sidesteps the style mismatch entirely because no bodywork is visible. |
| `car-prewar-hotrod-donor.glb` | 1920s–30s brass-era body. Not 1960s, but legitimate as a hot rod *donor* car. |
| `truck-old-flatnose.glb` | Generic old truck, toy-styled. Background only. |

**Bottom line:** three of the vehicles (`muscle-coupe-hoodup`, `muscle-challenger`, `dodge-charger`) genuinely carry classic American muscle silhouettes and are good enough to be hero cars. The pickups are the weak point — they read as "old American pickup" but are stylistically toy-like, and none is specifically a 1960s Dodge D100 stepside. That is a real compromise, not a match.

---

## Practical notes

- All files are self-contained `.glb` — drop them straight into a three.js / React Three Fiber `GLTFLoader`. No sidecar `.bin` or texture folders to wire up.
- The Poly Haven files were served by that site as `.gltf` + `.bin` + JPEG textures; they were repacked into single-file `.glb` locally with `@gltf-transform/cli` at **1k texture resolution**. 2k/4k/8k are available from the same source if a hero prop needs more detail.
- Largest file is `prop-pipes-modular.glb` at 5.5 MB; everything else is under 5 MB and most props are 2–3 MB. The Poly Pizza props are tiny (4–1000 KB).
- Scales differ between the two sources. Poly Haven assets are real-world metres; Poly Pizza assets are not consistently scaled. Expect to normalise per-object on import.
- `prop-pipes-modular.glb` is effectively a **pegboard tool wall** — hang it above a bench for the classic shop look.


