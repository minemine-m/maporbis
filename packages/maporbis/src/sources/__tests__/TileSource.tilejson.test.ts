import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TileSource } from "../TileSource";

describe("TileSource TileJSON maxzoom", () => {
	beforeEach(() => {
		vi.stubGlobal("fetch", vi.fn());
	});
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("derives tiles.json URL from XYZ template", () => {
		const s = new TileSource({
			url: "https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=abc",
		});
		expect(s.getTileJSONUrl()).toBe(
			"https://api.maptiler.com/tiles/v3/tiles.json?key=abc"
		);
	});

	it("returns null when template has no z/x/y", () => {
		const s = new TileSource({ url: "https://example.com/static.png" });
		expect(s.getTileJSONUrl()).toBeNull();
	});

	it("prefers explicit tileJSONUrl", () => {
		const s = new TileSource({
			url: "https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=abc",
			tileJSONUrl: "https://example.com/custom.json",
		});
		expect(s.getTileJSONUrl()).toBe("https://example.com/custom.json");
	});

	it("loadMetadata applies minzoom/maxzoom from TileJSON", async () => {
		(fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({ minzoom: 0, maxzoom: 15, bounds: [-180, -85, 180, 85] }),
		});
		const s = new TileSource({
			url: "https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=abc",
			minLevel: 2,
			maxLevel: 19,
		});
		await s.loadMetadata();
		expect(s.minLevel).toBe(0);
		expect(s.maxLevel).toBe(15);
	});

	it("loadMetadata keeps levels on fetch failure", async () => {
		(fetch as any).mockRejectedValue(new Error("network"));
		const s = new TileSource({
			url: "https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=abc",
			maxLevel: 19,
		});
		await s.loadMetadata();
		expect(s.maxLevel).toBe(19);
	});
});
