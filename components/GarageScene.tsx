"use client";

/**
 * The hero-only canvas is gone.
 *
 * `GarageScene` used to mount a WebGL garage inside the hero section, where it
 * scrolled away with the first viewport. That scene has been folded into
 * `ShopWorld` — one continuous building fixed behind the entire document, with
 * the camera travelling through it station by station as the reader scrolls.
 *
 * This module stays only so nothing that still imports the old name breaks.
 * New code should import `ShopWorldMount` directly.
 *
 * @deprecated Import { ShopWorldMount } from "./ShopWorldMount" instead.
 */
export { ShopWorldMount as GarageScene, ShopWorldMount as default } from "./ShopWorldMount";
