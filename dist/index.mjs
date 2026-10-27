import{fileURLToPath as __sdk_f}from'node:url';import{dirname as __sdk_d}from'node:path';const __filename=__sdk_f(import.meta.url);const __dirname=__sdk_d(__filename);
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../zero_addon_sdk/src/types.ts
var init_types = __esm({
  "../zero_addon_sdk/src/types.ts"() {
    "use strict";
  }
});

// ../zero_addon_sdk/src/capabilities.ts
var init_capabilities = __esm({
  "../zero_addon_sdk/src/capabilities.ts"() {
    "use strict";
  }
});

// ../zero_addon_sdk/src/responses.ts
var init_responses = __esm({
  "../zero_addon_sdk/src/responses.ts"() {
    "use strict";
  }
});

// ../zero_addon_sdk/src/settings.ts
function uiText(text, locale = "en") {
  if (text === void 0) return "";
  if (typeof text === "string") return text;
  return text[locale] ?? text.en ?? Object.values(text)[0] ?? "";
}
var init_settings = __esm({
  "../zero_addon_sdk/src/settings.ts"() {
    "use strict";
  }
});

// ../zero_addon_sdk/src/ui.ts
var init_ui = __esm({
  "../zero_addon_sdk/src/ui.ts"() {
    "use strict";
    init_settings();
  }
});

// ../zero_addon_sdk/src/storage.ts
async function migrate(db3, steps) {
  const row = await db3.get("PRAGMA user_version");
  const current = row?.user_version ?? 0;
  for (let v = current + 1; v <= steps.length; v += 1) {
    await db3.transaction(async () => {
      await db3.exec(steps[v - 1]);
      await db3.exec(`PRAGMA user_version = ${v}`);
    });
  }
  return steps.length;
}
var init_storage = __esm({
  "../zero_addon_sdk/src/storage.ts"() {
    "use strict";
  }
});

// ../zero_addon_sdk/src/services.ts
var init_services = __esm({
  "../zero_addon_sdk/src/services.ts"() {
    "use strict";
  }
});

// ../zero_addon_sdk/src/spaces.ts
var init_spaces = __esm({
  "../zero_addon_sdk/src/spaces.ts"() {
    "use strict";
  }
});

// ../zero_addon_sdk/src/manifest.ts
var SDK_PROTOCOL_VERSION;
var init_manifest = __esm({
  "../zero_addon_sdk/src/manifest.ts"() {
    "use strict";
    init_services();
    init_spaces();
    init_capabilities();
    init_settings();
    init_ui();
    SDK_PROTOCOL_VERSION = 3;
  }
});

// ../zero_addon_sdk/src/host.ts
var init_host = __esm({
  "../zero_addon_sdk/src/host.ts"() {
    "use strict";
  }
});

// ../zero_addon_sdk/src/addon.ts
function defineAddon(def) {
  return {
    manifest: def.manifest,
    async register(host2) {
      const { resources: resources2 = {}, actions = {}, routes = {}, services = {}, api } = await def.setup(host2);
      const sdk = def.manifest.zero.sdk ?? Math.min(2, SDK_PROTOCOL_VERSION);
      return { sdk, manifest: def.manifest, resources: resources2, actions, routes, services, ...api !== void 0 ? { api } : {} };
    }
  };
}
var init_addon = __esm({
  "../zero_addon_sdk/src/addon.ts"() {
    "use strict";
    init_manifest();
  }
});

// ../zero_addon_sdk/src/router.ts
var init_router = __esm({
  "../zero_addon_sdk/src/router.ts"() {
    "use strict";
    init_responses();
  }
});

// ../zero_addon_sdk/src/projection.ts
function detectProjection(rawTitle, opts = {}) {
  const t = ` ${rawTitle.toLowerCase().replace(/[._\-]+/g, " ")} `;
  const has = (re) => re.test(t);
  let stereo = "mono";
  if (has(/\bmono\b/)) {
    stereo = "mono";
  } else if (has(/\b(tb|ou|htab|hou|3dv|over[- ]?under|top[- ]?bottom)\b/)) {
    stereo = "tb";
  } else if (has(/\b(sbs|lr|hsbs|fsbs|3dh|half[- ]?sbs|full[- ]?sbs|side[- ]?by[- ]?side)\b/)) {
    stereo = "sbs";
  }
  if (has(/\bmkx220\b/)) return immersive("mkx220", 220, stereo);
  if (has(/\bmkx200\b/)) return immersive("mkx200", 200, stereo);
  if (has(/\bvrca220\b/)) return immersive("vrca220", 220, stereo);
  if (has(/\brf52\b/)) return immersive("rf52", 190, stereo);
  if (has(/\bfisheye190\b/) || has(/\bfisheye\b/)) {
    const fov = has(/\b220\b/) ? 220 : has(/\b200\b/) ? 200 : 190;
    return immersive("fisheye", fov, stereo);
  }
  if (has(/\b360\b/)) return immersive("sphere", 360, stereo);
  if (has(/\b180\b/) || has(/\b180x180\b/)) return immersive("dome", 180, stereo);
  if (opts.assumeVrWhenHinted && VR_HINT.test(t)) return immersive("dome", 180, stereo);
  if (has(/\b(sbs|hsbs|fsbs|half[- ]?sbs|full[- ]?sbs|halfsbs|fullsbs|hou|htab|h[- ]?ou|half[- ]?ou|full[- ]?ou|over[- ]?under|top[- ]?bottom|side[- ]?by[- ]?side|3dh|3dv)\b/)) {
    const s3d = stereo === "mono" ? "sbs" : stereo;
    return { is3d: true, isVr: false, stereo: s3d, screenType: "flat", fov: 0 };
  }
  return { ...FLAT_2D };
}
function immersive(screenType, fov, stereo) {
  const s = stereo === "mono" ? "sbs" : stereo;
  return { is3d: true, isVr: true, stereo: s, screenType, fov };
}
var FLAT_2D, VR_HINT;
var init_projection = __esm({
  "../zero_addon_sdk/src/projection.ts"() {
    "use strict";
    FLAT_2D = {
      is3d: false,
      isVr: false,
      stereo: "mono",
      screenType: "flat",
      fov: 0
    };
    VR_HINT = /\bvr\b|vrporn|czechvr|wankzvr|badoinkvr|vrbangers|vrhush|vrcosplay|vrconk|sexbabesvr|realjamvr|milfvr|18vr|vrallure|vrlatina|tmwvrnet|virtualreal|naughtyamericavr|\bslr\b/;
  }
});

// ../zero_addon_sdk/src/conformance.ts
var init_conformance = __esm({
  "../zero_addon_sdk/src/conformance.ts"() {
    "use strict";
    init_capabilities();
    init_manifest();
    init_responses();
    init_ui();
  }
});

// ../zero_addon_sdk/src/index.ts
var init_src = __esm({
  "../zero_addon_sdk/src/index.ts"() {
    "use strict";
    init_types();
    init_capabilities();
    init_responses();
    init_settings();
    init_ui();
    init_storage();
    init_manifest();
    init_host();
    init_addon();
    init_router();
    init_services();
    init_spaces();
    init_projection();
    init_conformance();
  }
});

// src/host.ts
var host_exports = {};
__export(host_exports, {
  getVaultHost: () => getVaultHost,
  hasVaultHost: () => hasVaultHost,
  saveSettings: () => saveSettings,
  setVaultHost: () => setVaultHost,
  settings: () => settings
});
function setVaultHost(host2) {
  _host = host2;
}
function getVaultHost() {
  if (!_host) throw new Error("Vault host not configured \u2014 call setVaultHost() first");
  return _host;
}
function hasVaultHost() {
  return _host !== null;
}
async function settings() {
  let s = {};
  if (_host) s = await _host.settings.get().catch(() => ({}));
  const str = (k) => typeof s[k] === "string" ? s[k].trim() : "";
  const list = (k) => Array.isArray(s[k]) ? s[k] : [];
  const types = list("content_types").filter((t) => CONTENT_TYPES.has(t));
  return {
    tpdb_token: str("tpdb_token"),
    content_types: types.length ? types : ["scenes"],
    cached_only: s.cached_only !== false,
    zilean_url: str("zilean_url"),
    torznab_url: str("torznab_url"),
    torznab_key: str("torznab_key"),
    // A list since 2.0.2; before that one comma-separated string.
    torznab_categories: Array.isArray(s.torznab_categories) ? list("torznab_categories") : str("torznab_categories").split(/[\s,]+/),
    apijav_enabled: s.apijav_enabled === true,
    apijav_url: str("apijav_url") || "https://server.apijav.com",
    apijav_key: str("apijav_key"),
    home_rails: list("home_rails")
  };
}
async function saveSettings(patch) {
  await getVaultHost().settings.set(patch);
}
var _host, CONTENT_TYPES;
var init_host2 = __esm({
  "src/host.ts"() {
    "use strict";
    _host = null;
    CONTENT_TYPES = /* @__PURE__ */ new Set(["scenes", "movies", "jav"]);
  }
});

// src/db.ts
var db_exports = {};
__export(db_exports, {
  adultCatalogHasTpdbId: () => adultCatalogHasTpdbId,
  adultCatalogStats: () => adultCatalogStats,
  getAdultCatalogEntry: () => getAdultCatalogEntry,
  kvGet: () => kvGet,
  kvSet: () => kvSet,
  listAdultCatalogByTpdbId: () => listAdultCatalogByTpdbId,
  listAdultCatalogForEnrich: () => listAdultCatalogForEnrich,
  listAdultStreamSources: () => listAdultStreamSources,
  migrateStorage: () => migrateStorage,
  searchAdultCatalog: () => searchAdultCatalog,
  updateAdultCatalogDuration: () => updateAdultCatalogDuration,
  updateAdultCatalogEnrichment: () => updateAdultCatalogEnrichment,
  upsertAdultCatalog: () => upsertAdultCatalog
});
function migrateStorage() {
  const db3 = storage();
  let done = migrated.get(db3);
  if (done) return done;
  done = (async () => {
    await migrate(db3, [
      `CREATE TABLE IF NOT EXISTS adult_catalog (
        info_hash TEXT PRIMARY KEY,
        raw_title TEXT NOT NULL,
        parsed_title TEXT,
        title TEXT,
        studio TEXT,
        performers_json TEXT NOT NULL DEFAULT '[]',
        content_type TEXT,
        poster_url TEXT,
        date TEXT,
        year INTEGER,
        size_bytes INTEGER,
        tpdb_id TEXT,
        tpdb_type TEXT,
        enriched_at INTEGER,
        source_term TEXT,
        duration_seconds INTEGER,
        added_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE INDEX IF NOT EXISTS idx_adult_catalog_enrich ON adult_catalog(enriched_at);
      CREATE INDEX IF NOT EXISTS idx_adult_catalog_tpdb ON adult_catalog(tpdb_id);`
    ]);
  })();
  migrated.set(db3, done);
  return done;
}
async function db() {
  await migrateStorage();
  return storage();
}
async function upsertAdultCatalog(entries) {
  if (!entries.length) return 0;
  const d = await db();
  let added = 0;
  for (const e of entries) {
    const hash = e.infoHash.toLowerCase();
    if (!hash || !e.rawTitle) continue;
    const res = await d.run(
      `INSERT INTO adult_catalog (info_hash, raw_title, parsed_title, studio, size_bytes, year, source_term)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(info_hash) DO NOTHING`,
      [hash, e.rawTitle, e.parsedTitle ?? null, e.studio ?? null, e.sizeBytes ?? null, e.year ?? null, e.sourceTerm ?? null]
    );
    added += res.changes;
  }
  return added;
}
async function listAdultCatalogForEnrich(limit = 200) {
  return (await db()).all("SELECT * FROM adult_catalog WHERE enriched_at IS NULL ORDER BY added_at DESC LIMIT ?", [limit]);
}
async function updateAdultCatalogEnrichment(infoHash, m) {
  await (await db()).run(
    `UPDATE adult_catalog SET
       title = COALESCE(?, title),
       studio = COALESCE(?, studio),
       performers_json = COALESCE(?, performers_json),
       content_type = COALESCE(?, content_type),
       poster_url = COALESCE(?, poster_url),
       date = COALESCE(?, date),
       year = COALESCE(?, year),
       tpdb_id = ?,
       tpdb_type = ?,
       enriched_at = ?
     WHERE info_hash = ?`,
    [
      m.title ?? null,
      m.studio ?? null,
      m.performers ? JSON.stringify(m.performers) : null,
      m.contentType ?? null,
      m.posterUrl ?? null,
      m.date ?? null,
      m.year ?? null,
      m.tpdbId ?? null,
      m.tpdbType ?? null,
      Math.floor(Date.now() / 1e3),
      infoHash.toLowerCase()
    ]
  );
}
async function searchAdultCatalog(query, opts = {}) {
  const q = query.trim();
  const where = [];
  const params = [];
  if (q) {
    for (const w of q.split(/\s+/).filter(Boolean).slice(0, 6)) {
      const like = `%${w.replace(/[%_\\]/g, (c) => "\\" + c)}%`;
      where.push("(title LIKE ? ESCAPE '\\' OR raw_title LIKE ? ESCAPE '\\' OR studio LIKE ? ESCAPE '\\' OR performers_json LIKE ? ESCAPE '\\')");
      params.push(like, like, like, like);
    }
  }
  if (opts.matchedOnly !== false) where.push("tpdb_id IS NOT NULL");
  params.push(opts.limit ?? 120);
  return (await db()).all(
    `SELECT * FROM adult_catalog ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY (tpdb_id IS NOT NULL) DESC, (enriched_at IS NOT NULL) DESC, added_at DESC
     LIMIT ?`,
    params
  );
}
async function getAdultCatalogEntry(infoHash) {
  return (await db()).get("SELECT * FROM adult_catalog WHERE info_hash = ?", [infoHash.toLowerCase()]);
}
async function listAdultCatalogByTpdbId(tpdbId, limit = 60) {
  return (await db()).all(
    "SELECT * FROM adult_catalog WHERE tpdb_id = ? ORDER BY (size_bytes IS NOT NULL) DESC, size_bytes DESC LIMIT ?",
    [tpdbId, limit]
  );
}
async function adultCatalogHasTpdbId(tpdbId) {
  return !!await (await db()).get("SELECT 1 AS n FROM adult_catalog WHERE tpdb_id = ? LIMIT 1", [tpdbId]);
}
async function updateAdultCatalogDuration(infoHash, seconds) {
  await (await db()).run("UPDATE adult_catalog SET duration_seconds = ? WHERE info_hash = ?", [Math.round(seconds), infoHash.toLowerCase()]);
}
async function adultCatalogStats() {
  const row = await (await db()).get(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN tpdb_id IS NOT NULL THEN 1 ELSE 0 END) AS matched,
            SUM(CASE WHEN enriched_at IS NOT NULL THEN 1 ELSE 0 END) AS enriched
     FROM adult_catalog`
  );
  return { total: row?.total ?? 0, matched: row?.matched ?? 0, enriched: row?.enriched ?? 0 };
}
async function kvGet(key, ns = "") {
  if (!hasVaultHost()) return null;
  return getVaultHost().cache.get(ns ? `${ns}:${key}` : key);
}
async function kvSet(key, ns, value, ttlSeconds = 0) {
  if (!hasVaultHost()) return;
  await getVaultHost().cache.set(ns ? `${ns}:${key}` : key, value, ttlSeconds);
}
async function listAdultStreamSources() {
  const s = await settings();
  const row = (id, type, url, apiKey, config = {}) => ({ id, source_type: type, name: type, url, api_key: apiKey, enabled: 1, priority: 100, config_json: JSON.stringify(config), last_checked_at: null, last_error: null, created_at: 0 });
  const out = [];
  if (s.apijav_enabled) out.push(row("apijav", "apijav", s.apijav_url, s.apijav_key || null));
  if (s.zilean_url) out.push(row("zilean", "zilean", s.zilean_url, null));
  if (s.torznab_url) {
    const categories = s.torznab_categories.map((c) => Number(c)).filter((n) => Number.isFinite(n) && n > 0);
    out.push(row("torznab", "torznab", s.torznab_url, s.torznab_key || null, categories.length ? { categories } : {}));
  }
  return out;
}
var storage, migrated;
var init_db = __esm({
  "src/db.ts"() {
    "use strict";
    init_src();
    init_host2();
    storage = () => getVaultHost().storage;
    migrated = /* @__PURE__ */ new WeakMap();
  }
});

// src/debrid.ts
var debrid_exports = {};
__export(debrid_exports, {
  DebridClient: () => DebridClient,
  canUnrestrict: () => canUnrestrict,
  getDebrid: () => getDebrid,
  unrestrict: () => unrestrict
});
function fromService(r, fallbackName) {
  if (r.status === "ready") return { url: r.url, name: r.fileName ?? fallbackName };
  if (r.status === "queued") return { queued: true, state: r.state ?? null, progress: r.progress ?? null, seeds: r.seeds ?? null };
  return null;
}
async function getDebrid(account) {
  if (!hasVaultHost()) return null;
  return await getVaultHost().services.available("debrid").catch(() => false) ? new DebridClient(account) : null;
}
async function canUnrestrict() {
  if (!await getDebrid()) return false;
  const { accounts } = await getVaultHost().services.call("debrid", "accounts", {}).catch(() => ({ accounts: [] }));
  return accounts.some((a) => a.unrestricts);
}
async function unrestrict(link) {
  return getVaultHost().services.call("debrid", "unrestrict", { link });
}
var DebridClient;
var init_debrid = __esm({
  "src/debrid.ts"() {
    "use strict";
    init_host2();
    DebridClient = class {
      constructor(account) {
        this.account = account;
      }
      /** Which candidates (by id) are cached on the debrid now. */
      async checkAvailability(candidates, _signal) {
        const byHash = new Map(candidates.filter((c) => c.infoHash).map((c) => [c.infoHash.toLowerCase(), c.id]));
        const out = /* @__PURE__ */ new Map();
        for (const id of byHash.values()) out.set(id, false);
        if (!byHash.size) return out;
        const { cached } = await getVaultHost().services.call("debrid", "cached", { hashes: [...byHash.keys()], account: this.account });
        for (const h of cached) {
          const id = byHash.get(h.toLowerCase());
          if (id) out.set(id, true);
        }
        return out;
      }
      /** A playable URL + the file it picked, "queued" when not cached yet, null on failure. */
      async resolveDetailed(candidate, _signal) {
        if (!candidate.infoHash) return null;
        return fromService(await getVaultHost().services.call("debrid", "resolve", { hash: candidate.infoHash, account: this.account }), candidate.rawTitle ?? "");
      }
    };
  }
});

// src/log.ts
function sink() {
  return hasVaultHost() ? getVaultHost().logger : consoleLogger;
}
var consoleLogger, logger;
var init_log = __esm({
  "src/log.ts"() {
    "use strict";
    init_host2();
    consoleLogger = {
      info: (c, m) => console.log(`[${c}] ${m}`),
      success: (c, m) => console.log(`[${c}] ${m}`),
      warn: (c, m) => console.warn(`[${c}] ${m}`),
      error: (c, m, e) => console.error(`[${c}] ${m}`, e ?? "")
    };
    logger = {
      info: (c, m) => sink().info(c, m),
      success: (c, m) => sink().success(c, m),
      warn: (c, m) => sink().warn(c, m),
      error: (c, m, e) => sink().error(c, m, e)
    };
  }
});

// ../zero_forge/src/host.ts
function setForgeHost(host2) {
  _host2 = host2;
}
function getForgeHost() {
  if (!_host2) {
    throw new Error(
      "Forge host not configured \u2014 call setForgeHost() before using the pipeline"
    );
  }
  return _host2;
}
function hasForgeHost() {
  return _host2 !== null;
}
var _host2;
var init_host3 = __esm({
  "../zero_forge/src/host.ts"() {
    "use strict";
    _host2 = null;
  }
});

// ../zero_forge/src/types.ts
var HDR_FLAG_HDR10, HDR_FLAG_DV, HDR_FLAG_HDR10_PLUS, HDR_FLAG_HLG;
var init_types2 = __esm({
  "../zero_forge/src/types.ts"() {
    "use strict";
    HDR_FLAG_HDR10 = 1;
    HDR_FLAG_DV = 2;
    HDR_FLAG_HDR10_PLUS = 4;
    HDR_FLAG_HLG = 8;
  }
});

// ../zero_forge/src/store.ts
function migrateStorage2() {
  const db3 = storage2();
  let done = migrated2.get(db3);
  if (done) return done;
  done = (async () => {
    await migrate(db3, [
      `CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        source_type TEXT NOT NULL,
        name TEXT NOT NULL,
        url TEXT,
        api_key TEXT,
        enabled INTEGER NOT NULL DEFAULT 1,
        priority INTEGER NOT NULL DEFAULT 100,
        config_json TEXT NOT NULL DEFAULT '{}',
        last_checked_at INTEGER,
        last_error TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        provider TEXT NOT NULL,
        kind TEXT NOT NULL,
        api_key TEXT,
        host TEXT,
        enabled INTEGER NOT NULL DEFAULT 1,
        priority INTEGER NOT NULL DEFAULT 100,
        config_json TEXT NOT NULL DEFAULT '{}',
        premium_until INTEGER,
        last_checked_at INTEGER,
        last_error TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );`
    ]);
  })();
  migrated2.set(db3, done);
  return done;
}
async function db2() {
  await migrateStorage2();
  return storage2();
}
async function listStreamSources() {
  return (await db2()).all("SELECT * FROM sources ORDER BY priority, created_at");
}
async function listStreamAccounts(kind) {
  const d = await db2();
  return kind ? d.all("SELECT * FROM accounts WHERE kind = ? ORDER BY priority, created_at", [kind]) : d.all("SELECT * FROM accounts ORDER BY kind, priority, created_at");
}
var storage2, migrated2;
var init_store = __esm({
  "../zero_forge/src/store.ts"() {
    "use strict";
    init_src();
    init_host3();
    storage2 = () => getForgeHost().storage;
    migrated2 = /* @__PURE__ */ new WeakMap();
  }
});

// ../zero_forge/src/log.ts
function sink2() {
  return hasForgeHost() ? getForgeHost().logger : consoleLogger2;
}
var consoleLogger2, logger2;
var init_log2 = __esm({
  "../zero_forge/src/log.ts"() {
    "use strict";
    init_host3();
    consoleLogger2 = {
      info: (c, m) => console.log(`[${c}] ${m}`),
      success: (c, m) => console.log(`[${c}] ${m}`),
      warn: (c, m) => console.warn(`[${c}] ${m}`),
      error: (c, m, e) => console.error(`[${c}] ${m}`, e ?? "")
    };
    logger2 = {
      info: (c, m) => sink2().info(c, m),
      success: (c, m) => sink2().success(c, m),
      warn: (c, m) => sink2().warn(c, m),
      error: (c, m, e) => sink2().error(c, m, e)
    };
  }
});

// ../zero_forge/src/filter.ts
function applyFilters(streams, prefs) {
  return streams.filter((s) => matchesPrefs(s, prefs));
}
function applySeasonEpisodeGate(streams, query) {
  if (query.kind === "movie") {
    return streams.filter(
      (s) => s.seasons.length === 0 && s.episodes.length === 0
    );
  }
  if (query.kind !== "series") return streams;
  const wantedSeason = query.season;
  const wantedEpisode = query.episode;
  if (!wantedSeason && !wantedEpisode) return streams;
  return streams.filter((s) => {
    const hasSeasons = s.seasons.length > 0;
    const hasEpisodes = s.episodes.length > 0;
    if (!hasSeasons && !hasEpisodes) return true;
    if (s.seasonPack && wantedSeason) {
      return s.seasons.includes(wantedSeason);
    }
    if (hasEpisodes && wantedEpisode) {
      if (!s.episodes.includes(wantedEpisode)) return false;
      if (hasSeasons && wantedSeason && !s.seasons.includes(wantedSeason)) {
        return false;
      }
      return true;
    }
    if (hasSeasons && wantedSeason) return s.seasons.includes(wantedSeason);
    return true;
  });
}
function matchesPrefs(stream, prefs) {
  if (prefs.resolutions.length > 0 && !prefs.resolutions.includes(stream.resolution)) {
    return false;
  }
  if (prefs.codecs.length > 0) {
    if (!stream.codec || !prefs.codecs.includes(stream.codec)) return false;
  }
  if (!prefs.hdrAllowed && stream.hdrFlags > 0) return false;
  if (stream.sizeBytes != null) {
    const mb = stream.sizeBytes / (1024 * 1024);
    if (prefs.sizeMinMb != null && mb < prefs.sizeMinMb) return false;
    if (prefs.sizeMaxMb != null && mb > prefs.sizeMaxMb) return false;
  }
  if (prefs.excludedLanguages.length > 0 && stream.languages.length > 0) {
    const allExcluded = stream.languages.every((l) => prefs.excludedLanguages.includes(l));
    if (allExcluded) return false;
  }
  if (prefs.languages.length > 0 && stream.languages.length > 0) {
    const hit = stream.languages.some((l) => prefs.languages.includes(l) || l === "multi" || l === "dual");
    if (!hit) return false;
  }
  if (prefs.minSeeders != null && stream.seeders != null) {
    if (stream.seeders < prefs.minSeeders) return false;
  }
  return true;
}
function applyAvailabilityFilters(streams, prefs) {
  if (!prefs.excludeUncached) return streams;
  return streams.filter((s) => s.cachedOnDebrid || s.assumedCached);
}
function parseStreamPrefs(row) {
  const safeJson = (s, fallback) => {
    try {
      return JSON.parse(s);
    } catch {
      return fallback;
    }
  };
  const CODEC_ALIASES = {
    hevc: "h265",
    x265: "h265",
    avc: "h264",
    x264: "h264"
  };
  const VALID_CODECS = /* @__PURE__ */ new Set(["h264", "h265", "av1", "vp9", "mpeg2"]);
  const normalizeCodecs = (raw) => raw.map((c) => CODEC_ALIASES[c.toLowerCase()] ?? c).filter((c) => VALID_CODECS.has(c));
  const scope = row.binge_pin_scope === "series" ? "series" : "season";
  return {
    resolutions: safeJson(row.resolutions_json, []),
    codecs: normalizeCodecs(safeJson(row.codecs_json, [])),
    hdrAllowed: row.hdr_allowed === 1,
    sizeMinMb: row.size_min_mb,
    sizeMaxMb: row.size_max_mb,
    languages: safeJson(row.languages_json, []),
    excludedLanguages: safeJson(row.excluded_languages_json ?? "[]", []),
    sortOrder: safeJson(row.sort_order_json, ["resolution", "cached", "seeders", "size"]),
    bingePinReleaseGroup: row.binge_pin_release_group === 1,
    minSeeders: row.min_seeders,
    excludeUncached: row.exclude_uncached === 1,
    bingeOnlySeasonPacks: (row.binge_only_season_packs ?? 0) === 1,
    bingeStrictReleaseGroup: (row.binge_strict_release_group ?? 0) === 1,
    bingePinScope: scope
  };
}
var init_filter = __esm({
  "../zero_forge/src/filter.ts"() {
    "use strict";
  }
});

// ../zero_forge/node_modules/@viren070/parse-torrent-title/dist/types.js
var ValueSet;
var init_types3 = __esm({
  "../zero_forge/node_modules/@viren070/parse-torrent-title/dist/types.js"() {
    "use strict";
    ValueSet = class {
      constructor() {
        this.existMap = /* @__PURE__ */ new Map();
        this._values = [];
      }
      append(v) {
        if (!this.existMap.has(v)) {
          this.existMap.set(v, true);
          this._values.push(v);
        }
        return this;
      }
      exists(v) {
        return this.existMap.has(v);
      }
      get values() {
        return this._values;
      }
    };
  }
});

// ../zero_forge/node_modules/@viren070/parse-torrent-title/dist/utils.js
function cleanTitle(rawTitle) {
  let title = rawTitle.trim();
  title = title.replace(/_/g, " ");
  title = title.replace(movieIndicatorRegex, "");
  title = title.replace(notAllowedSymbolsAtStartAndEndRegex, "");
  const russianMatches = title.match(russianCastRegex);
  if (russianMatches) {
    for (let i = 1; i < russianMatches.length; i++) {
      if (russianMatches[i]) {
        title = title.replace(russianMatches[i], "");
      }
    }
  }
  title = title.replace(releaseGroupMarkingAtStartRegex, "$1");
  title = title.replace(releaseGroupMarkingAtEndRegex, "$1");
  title = title.replace(altTitlesRegex, "");
  const notOnlyNonEnglishMatch = title.match(notOnlyNonEnglishRegex);
  if (notOnlyNonEnglishMatch) {
    for (let i = 1; i < notOnlyNonEnglishMatch.length; i++) {
      if (notOnlyNonEnglishMatch[i]) {
        title = title.replace(notOnlyNonEnglishMatch[i], "");
        break;
      }
    }
  }
  title = title.replace(remainingNotAllowedSymbolsAtStartAndEndRegex, "");
  if (!title.includes(" ") && title.includes(".")) {
    title = title.replace(/\./g, " ");
  }
  for (const [open, close] of brackets) {
    const openCount = (title.match(new RegExp("\\" + open, "g")) || []).length;
    const closeCount = (title.match(new RegExp("\\" + close, "g")) || []).length;
    if (openCount !== closeCount) {
      title = title.replace(new RegExp("\\" + open, "g"), "").replace(new RegExp("\\" + close, "g"), "");
    }
  }
  title = title.replace(redundantSymbolsAtEnd, "");
  title = title.replace(whitespacesRegex, " ");
  return title.trim();
}
function getMatchIndices(regex, str) {
  const match = regex.exec(str);
  if (!match)
    return [];
  const indices = [];
  indices.push(match.index, match.index + match[0].length);
  for (let i = 1; i < match.length; i++) {
    if (match[i] !== void 0) {
      const captureIndex = str.indexOf(match[i], match.index);
      indices.push(captureIndex, captureIndex + match[i].length);
    } else {
      indices.push(-1, -1);
    }
  }
  return indices;
}
var NON_ENGLISH_CHARS, russianCastRegex, altTitlesRegex, notOnlyNonEnglishRegex, notAllowedSymbolsAtStartAndEndRegex, remainingNotAllowedSymbolsAtStartAndEndRegex, movieIndicatorRegex, releaseGroupMarkingAtStartRegex, releaseGroupMarkingAtEndRegex, beforeTitleRegex, nonDigitsRegex, nonAlphasRegex, underscoresRegex, whitespacesRegex, redundantSymbolsAtEnd, trailingEpisodePattern, curlyBrackets, squareBrackets, parentheses, brackets;
var init_utils = __esm({
  "../zero_forge/node_modules/@viren070/parse-torrent-title/dist/utils.js"() {
    "use strict";
    NON_ENGLISH_CHARS = "\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FFF\\u0400-\\u04FF";
    russianCastRegex = new RegExp(`(\\([^)]*[${NON_ENGLISH_CHARS}][^)]*\\))$|(?:\\/.*?)(\\(.*\\))$`, "u");
    altTitlesRegex = new RegExp(`[^/|(]*[${NON_ENGLISH_CHARS}][^/|]*[/|]|[/|][^/|(]*[${NON_ENGLISH_CHARS}][^/|]*`, "gu");
    notOnlyNonEnglishRegex = new RegExp(`(?:[a-zA-Z][^${NON_ENGLISH_CHARS}]+)([${NON_ENGLISH_CHARS}].*[${NON_ENGLISH_CHARS}])|([${NON_ENGLISH_CHARS}].*[${NON_ENGLISH_CHARS}])(?:[^${NON_ENGLISH_CHARS}]+[a-zA-Z])`, "u");
    notAllowedSymbolsAtStartAndEndRegex = new RegExp(`^[^\\w${NON_ENGLISH_CHARS}#[\u3010\u2605]+|[ \\-:/\\\\[|{(#$&^]+$`, "gu");
    remainingNotAllowedSymbolsAtStartAndEndRegex = new RegExp(`^[^\\w${NON_ENGLISH_CHARS}#]+|[\\[\\]({} ]+$`, "gu");
    movieIndicatorRegex = /[[(]movie[)\]]/gi;
    releaseGroupMarkingAtStartRegex = /^[[【★].*[\]】★][ .]?(.+)/;
    releaseGroupMarkingAtEndRegex = /(.+)[ .]?[[【★].*[\]】★]$/;
    beforeTitleRegex = /^\[([^[\]]+)]/;
    nonDigitsRegex = /\D+/g;
    nonAlphasRegex = /\W+/g;
    underscoresRegex = /_+/g;
    whitespacesRegex = /\s+/g;
    redundantSymbolsAtEnd = /[ \-:./\\]+$/;
    trailingEpisodePattern = /[ .]+-[ .]*\d{1,4}[ .]*$/;
    curlyBrackets = ["{", "}"];
    squareBrackets = ["[", "]"];
    parentheses = ["(", ")"];
    brackets = [curlyBrackets, squareBrackets, parentheses];
  }
});

// ../zero_forge/node_modules/@viren070/parse-torrent-title/dist/parser.js
function hasValueSet(field) {
  return VALUE_SET_FIELDS.has(field);
}
function parse(title, handlers2) {
  const result = /* @__PURE__ */ new Map();
  title = title.replace(whitespacesRegex, " ");
  title = title.replace(underscoresRegex, " ");
  let endOfTitle = title.length;
  for (const handler of handlers2) {
    const field = handler.field;
    let skipFromTitle = handler.skipFromTitle ?? false;
    let m = result.get(field);
    const mFound = m !== void 0;
    if (handler.pattern) {
      if (mFound && !handler.keepMatching) {
        continue;
      }
      const idxs = getMatchIndices(handler.pattern, title);
      if (idxs.length === 0) {
        continue;
      }
      if (handler.validateMatch && !handler.validateMatch(title, idxs)) {
        continue;
      }
      let shouldSkip = false;
      if (handler.skipIfFirst) {
        let hasOther = false;
        let hasBefore = false;
        for (const [f, fm] of result) {
          if (f !== field && fm.mValue) {
            hasOther = true;
            if (idxs[0] >= fm.mIndex) {
              hasBefore = true;
              break;
            }
          }
        }
        shouldSkip = hasOther && !hasBefore;
      }
      if (shouldSkip) {
        continue;
      }
      if (handler.skipIfBefore && handler.skipIfBefore.length > 0) {
        for (const skipField of handler.skipIfBefore) {
          const fm = result.get(skipField);
          if (fm && idxs[0] < fm.mIndex) {
            shouldSkip = true;
            break;
          }
        }
        if (shouldSkip) {
          continue;
        }
      }
      const rawMatchedPart = title.substring(idxs[0], idxs[1]);
      let matchedPart = rawMatchedPart;
      if (idxs.length > 2) {
        if (handler.valueGroup === void 0 || handler.valueGroup === 0) {
          matchedPart = title.substring(idxs[2], idxs[3]);
        } else if (idxs.length > handler.valueGroup * 2) {
          matchedPart = title.substring(idxs[handler.valueGroup * 2], idxs[handler.valueGroup * 2 + 1]);
        }
      }
      const beforeTitleMatch = beforeTitleRegex.exec(title);
      if (beforeTitleMatch && beforeTitleMatch[0].includes(rawMatchedPart)) {
        skipFromTitle = true;
      }
      if (!mFound) {
        m = {
          mIndex: 0,
          mValue: "",
          value: hasValueSet(field) ? new ValueSet() : null,
          remove: false,
          processed: false
        };
        result.set(field, m);
      }
      if (m) {
        m.mIndex = idxs[0];
        m.mValue = rawMatchedPart;
        if (!hasValueSet(field)) {
          m.value = matchedPart;
        }
        if (handler.matchGroup) {
          m.mIndex = idxs[handler.matchGroup * 2];
          m.mValue = title.substring(idxs[handler.matchGroup * 2], idxs[handler.matchGroup * 2 + 1]);
        }
      }
    }
    if (handler.process) {
      if (mFound && m) {
        m = handler.process(title, m, result);
      } else {
        const emptyMeta = {
          mIndex: 0,
          mValue: "",
          value: null,
          remove: false,
          processed: false
        };
        m = handler.process(title, emptyMeta, result);
        if (m.value !== null) {
          result.set(field, m);
        }
      }
    }
    if (!m) {
      continue;
    }
    if (m.value !== null && handler.transform) {
      handler.transform(title, m, result);
    }
    if (m.value === null) {
      result.delete(field);
      continue;
    }
    if (!result.has(field) || m.processed && !handler.keepMatching && !hasValueSet(field)) {
      continue;
    }
    if (handler.remove || m.remove) {
      m.remove = true;
      title = title.substring(0, m.mIndex) + title.substring(m.mIndex + m.mValue.length);
    }
    if (!skipFromTitle && m.mIndex !== 0 && m.mIndex < endOfTitle) {
      endOfTitle = m.mIndex;
    }
    if (m.remove && (skipFromTitle || m.mIndex === 0) && m.mIndex < endOfTitle) {
      endOfTitle -= m.mValue.length;
    }
    m.remove = false;
    m.processed = true;
  }
  const finalResult = {};
  for (const [field, fieldMeta] of result) {
    const v = fieldMeta.value;
    switch (field) {
      case "audio":
        if (v instanceof ValueSet) {
          finalResult.audio = v.values;
        }
        break;
      case "bitDepth":
        finalResult.bitDepth = v;
        break;
      case "channels":
        if (v instanceof ValueSet) {
          finalResult.channels = v.values;
        }
        break;
      case "codec":
        finalResult.codec = v;
        break;
      case "commentary":
        finalResult.commentary = v;
        break;
      case "complete":
        finalResult.complete = v;
        break;
      case "container":
        finalResult.container = v;
        break;
      case "convert":
        finalResult.convert = v;
        break;
      case "date":
        finalResult.date = v;
        break;
      case "documentary":
        finalResult.documentary = v;
        break;
      case "ppv":
        finalResult.ppv = v;
        break;
      case "dubbed":
        finalResult.dubbed = v;
        break;
      case "editions":
        if (v instanceof ValueSet) {
          finalResult.editions = v.values;
        }
        break;
      case "episodeCode":
        finalResult.episodeCode = v;
        break;
      case "episodes":
        finalResult.episodes = v;
        break;
      case "extended":
        finalResult.extended = v;
        break;
      case "extension":
        finalResult.extension = v;
        break;
      case "group":
        finalResult.group = v;
        break;
      case "hardcoded":
        finalResult.hardcoded = v;
        break;
      case "hdr":
        if (v instanceof ValueSet) {
          finalResult.hdr = v.values;
        }
        break;
      case "languages":
        if (v instanceof ValueSet) {
          const languages = v.values;
          if (languages.includes("es-419") && languages.includes("es")) {
            finalResult.languages = languages.filter((lang) => lang !== "es");
          } else {
            finalResult.languages = languages;
          }
        }
        break;
      case "network":
        finalResult.network = v;
        break;
      case "proper":
        finalResult.proper = v;
        break;
      case "region":
        finalResult.region = v;
        break;
      case "repack":
        finalResult.repack = v;
        break;
      case "resolution":
        finalResult.resolution = v;
        break;
      case "retail":
        finalResult.retail = v;
        break;
      case "seasons":
        finalResult.seasons = v;
        break;
      case "size":
        finalResult.size = v;
        break;
      case "site":
        finalResult.site = v;
        break;
      case "quality":
        finalResult.quality = v;
        break;
      case "releaseTypes":
        if (v instanceof ValueSet) {
          finalResult.releaseTypes = v.values;
        }
        break;
      case "subbed":
        finalResult.subbed = v;
        break;
      case "threeD":
        finalResult.threeD = v;
        break;
      case "uncensored":
        finalResult.uncensored = v;
        break;
      case "unrated":
        finalResult.unrated = v;
        break;
      case "regraded":
        finalResult.regraded = v;
        break;
      case "upscaled":
        finalResult.upscaled = v;
        break;
      case "volumes":
        finalResult.volumes = v;
        break;
      case "year":
        finalResult.year = v;
        break;
      default:
        finalResult[field] = v;
        break;
    }
  }
  const titleEnd = Math.max(Math.min(endOfTitle, title.length), 0);
  let rawTitle = title.substring(0, titleEnd);
  if (finalResult.episodes && finalResult.episodes.length > 0) {
    rawTitle = rawTitle.replace(trailingEpisodePattern, "");
  }
  finalResult.title = cleanTitle(rawTitle);
  return finalResult;
}
var VALUE_SET_FIELDS;
var init_parser = __esm({
  "../zero_forge/node_modules/@viren070/parse-torrent-title/dist/parser.js"() {
    "use strict";
    init_types3();
    init_utils();
    VALUE_SET_FIELDS = /* @__PURE__ */ new Set([
      "audio",
      "channels",
      "editions",
      "hdr",
      "languages",
      "releaseTypes"
    ]);
  }
});

// ../zero_forge/node_modules/@viren070/parse-torrent-title/dist/transforms.js
function toValue(value) {
  return (title, m) => {
    m.value = value;
  };
}
function toLowercase() {
  return (title, m) => {
    m.value = m.value.toLowerCase();
  };
}
function toUppercase() {
  return (title, m) => {
    m.value = m.value.toUpperCase();
  };
}
function toTrimmed() {
  return (title, m) => {
    m.value = m.value.trim();
  };
}
function toCleanDate() {
  const re = /(\d+)(?:st|nd|rd|th)/g;
  return (title, m) => {
    if (typeof m.value === "string") {
      m.value = m.value.replace(re, "$1");
    }
  };
}
function toCleanMonth() {
  const re = /(?:feb(?:ruary)?|jan(?:uary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)/gi;
  return (title, m) => {
    if (typeof m.value === "string") {
      m.value = m.value.replace(re, (str) => str.substring(0, 3));
    }
  };
}
function toDate(format) {
  const separatorRe = /[.\-/\\]/g;
  return (title, m) => {
    if (typeof m.value === "string") {
      const normalized = m.value.replace(separatorRe, " ");
      const parsed = parseDate(normalized, format);
      m.value = parsed || "";
    }
  };
}
function parseDate(dateStr, format) {
  try {
    if (format === "20060102" && dateStr.length === 8) {
      const year2 = parseInt(dateStr.substring(0, 4));
      const month2 = parseInt(dateStr.substring(4, 6));
      const day2 = parseInt(dateStr.substring(6, 8));
      if (year2 && month2 && day2) {
        const date = new Date(Date.UTC(year2, month2 - 1, day2));
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0];
        }
      }
      return null;
    }
    const parts = dateStr.trim().split(/\s+/);
    const formatParts = format.split(/\s+/);
    let year = 0, month = 0, day = 0;
    for (let i = 0; i < formatParts.length && i < parts.length; i++) {
      const fmt = formatParts[i];
      const val = parts[i];
      if (fmt === "2006" || fmt === "YYYY") {
        year = parseInt(val);
      } else if (fmt === "06" || fmt === "YY") {
        year = 2e3 + parseInt(val);
        if (year > 2069)
          year -= 100;
      } else if (fmt === "01" || fmt === "MM") {
        month = parseInt(val);
      } else if (fmt === "02" || fmt === "DD" || fmt === "_2") {
        day = parseInt(val);
      } else if (fmt === "Jan" || fmt === "MMM") {
        const months = [
          "jan",
          "feb",
          "mar",
          "apr",
          "may",
          "jun",
          "jul",
          "aug",
          "sep",
          "oct",
          "nov",
          "dec"
        ];
        month = months.indexOf(val.toLowerCase().substring(0, 3)) + 1;
      } else if (fmt === "YYYYMMDD") {
        year = parseInt(val.substring(0, 4));
        month = parseInt(val.substring(4, 6));
        day = parseInt(val.substring(6, 8));
      }
    }
    if (year && month && day) {
      const date = new Date(Date.UTC(year, month - 1, day));
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }
    return null;
  } catch {
    return null;
  }
}
function toYear() {
  return (title, m) => {
    if (typeof m.value !== "string") {
      m.value = "";
      return;
    }
    const parts = m.value.split(nonDigitsRegex).filter((p) => p);
    if (parts.length === 1) {
      m.value = parts[0];
      return;
    }
    const start = parts[0];
    const end = parts[1];
    let endYear = parseInt(end);
    if (isNaN(endYear)) {
      m.value = start;
      return;
    }
    const startYear = parseInt(start);
    if (isNaN(startYear)) {
      m.value = "";
      return;
    }
    if (endYear < 100) {
      endYear = endYear + startYear - startYear % 100;
    }
    if (endYear <= startYear) {
      m.value = "";
      return;
    }
    m.value = `${startYear}-${endYear}`;
  };
}
function toIntRange() {
  return (title, m) => {
    if (typeof m.value !== "string") {
      m.value = null;
      return;
    }
    const parts = m.value.replace(nonDigitsRegex, " ").trim().split(" ").filter((p) => p);
    const nums = parts.map((p) => parseInt(p)).filter((n) => !isNaN(n));
    if (nums.length === 2 && nums[0] < nums[1]) {
      const seq = [];
      for (let i = nums[0]; i <= nums[1]; i++) {
        seq.push(i);
      }
      m.value = seq;
      return;
    }
    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] + 1 !== nums[i + 1]) {
        m.value = null;
        return;
      }
    }
    m.value = nums;
  };
}
function toWithSuffix(suffix) {
  return (title, m) => {
    if (typeof m.value === "string") {
      m.value = m.value + suffix;
    } else {
      m.value = "";
    }
  };
}
function toBoolean() {
  return (title, m) => {
    m.value = true;
  };
}
function toValueSet(v) {
  return (title, m) => {
    if (m.value instanceof ValueSet) {
      m.value.append(v);
    }
  };
}
function toValueSetWithTransform(toV) {
  return (title, m) => {
    if (m.value instanceof ValueSet) {
      m.value.append(toV(m.mValue));
    }
  };
}
function toValueSetMultiWithTransform(toV) {
  return (title, m) => {
    if (m.value instanceof ValueSet) {
      const values = toV(m.mValue);
      for (const val of values) {
        m.value.append(val);
      }
    }
  };
}
function toIntArray() {
  return (title, m) => {
    if (typeof m.value === "string") {
      const num = parseInt(m.value);
      m.value = !isNaN(num) ? [num] : [];
    } else {
      m.value = [];
    }
  };
}
function toIntRangeTill() {
  return (title, m) => {
    if (typeof m.value !== "string") {
      m.value = null;
      return;
    }
    const parts = m.value.replace(nonDigitsRegex, " ").trim().split(" ").filter((p) => p);
    if (parts.length === 0) {
      m.value = null;
      return;
    }
    const num = parseInt(parts[0]);
    if (!isNaN(num)) {
      const nums = [];
      for (let i = 1; i <= num; i++) {
        nums.push(i);
      }
      m.value = nums;
      return;
    }
    m.value = null;
  };
}
var init_transforms = __esm({
  "../zero_forge/node_modules/@viren070/parse-torrent-title/dist/transforms.js"() {
    "use strict";
    init_types3();
    init_utils();
  }
});

// ../zero_forge/node_modules/@viren070/parse-torrent-title/dist/validators.js
function validateOr(...validators) {
  return (input, idxs) => {
    return validators.some((v) => v(input, idxs));
  };
}
function validateAnd(...validators) {
  return (input, idxs) => {
    return validators.every((v) => v(input, idxs));
  };
}
function validateLookbehind(pattern, flags, polarity) {
  const flagStr = flags.toLowerCase().replace(/[^gimsuy]/g, "");
  const re = new RegExp(pattern + "$", flagStr);
  return (input, match) => {
    const rv = input.substring(0, match[0]);
    if (polarity) {
      return re.test(rv);
    }
    return !re.test(rv);
  };
}
function validateLookahead(pattern, flags, polarity) {
  const flagStr = flags.toLowerCase().replace(/[^gimsuy]/g, "");
  const re = new RegExp("^" + pattern, flagStr);
  return (input, match) => {
    const rv = input.substring(match[1]);
    if (polarity) {
      return re.test(rv);
    }
    return !re.test(rv);
  };
}
function validateNotAtStart() {
  return (input, match) => {
    return match[0] !== 0;
  };
}
function validateNotAtEnd() {
  return (input, match) => {
    return match[1] !== input.length;
  };
}
function validateNotStartSpaced() {
  return (input, match) => {
    if (match[0] !== 0)
      return true;
    return !/\s$/.test(input.substring(match[0], match[1]));
  };
}
function validateNotMatch(re) {
  return (input, match) => {
    const rv = input.substring(match[0], match[1]);
    return !re.test(rv);
  };
}
function validateMatch(re) {
  return (input, match) => {
    const rv = input.substring(match[0], match[1]);
    return re.test(rv);
  };
}
function validateMatchedGroupsAreSame(...indices) {
  return (input, match) => {
    const first = input.substring(match[indices[0] * 2], match[indices[0] * 2 + 1]);
    for (let i = 1; i < indices.length; i++) {
      const index = indices[i];
      const other = input.substring(match[index * 2], match[index * 2 + 1]);
      if (other !== first) {
        return false;
      }
    }
    return true;
  };
}
var init_validators = __esm({
  "../zero_forge/node_modules/@viren070/parse-torrent-title/dist/validators.js"() {
    "use strict";
  }
});

// ../zero_forge/node_modules/@viren070/parse-torrent-title/dist/processors.js
function removeFromValue(re) {
  return (title, m) => {
    if (typeof m.value === "string" && m.value !== "") {
      m.value = m.value.replace(re, "");
    }
    return m;
  };
}
function regexMatchUntilValid(re, validator) {
  return (title, m) => {
    let offset = 0;
    while (offset < title.length) {
      const substring = title.substring(offset);
      const idxs = getMatchIndices(re, substring);
      if (idxs.length === 0) {
        return m;
      }
      for (let i = 0; i < idxs.length; i++) {
        if (idxs[i] >= 0) {
          idxs[i] += offset;
        }
      }
      if (validator(title, idxs)) {
        m.mIndex = idxs[0];
        m.mValue = title.substring(idxs[0], idxs[1]);
        if (idxs.length >= 4 && idxs[2] >= 0 && idxs[3] >= 0) {
          m.value = title.substring(idxs[2], idxs[3]);
        } else {
          m.value = m.mValue;
        }
        return m;
      }
      offset = idxs[1];
      if (offset === idxs[0]) {
        offset++;
      }
    }
    return m;
  };
}
var init_processors = __esm({
  "../zero_forge/node_modules/@viren070/parse-torrent-title/dist/processors.js"() {
    "use strict";
    init_utils();
  }
});

// ../zero_forge/node_modules/@viren070/parse-torrent-title/dist/handlers.js
var handlers;
var init_handlers = __esm({
  "../zero_forge/node_modules/@viren070/parse-torrent-title/dist/handlers.js"() {
    "use strict";
    init_types3();
    init_utils();
    init_transforms();
    init_validators();
    init_processors();
    handlers = [
      // Title handlers (lines 285-292 in handlers.go)
      {
        field: "title",
        pattern: /360.Degrees.of.Vision.The.Byakugan'?s.Blind.Spot/i,
        remove: true
      },
      {
        field: "title",
        pattern: /\b(?:INTERNAL|HFR)\b/i,
        remove: true
      },
      {
        field: "title",
        pattern: /413 Days/i,
        remove: true
      },
      // PPV handlers (lines 294-300 in handlers.go)
      {
        field: "ppv",
        pattern: /\bPPV(?:HD)?\b/i,
        transform: toBoolean(),
        remove: true,
        skipFromTitle: true
      },
      {
        field: "ppv",
        pattern: /\b\W?Fight.?Nights?\W?\b/i,
        transform: toBoolean(),
        skipFromTitle: true
      },
      // Site handlers (lines 302-317 in handlers.go)
      {
        field: "site",
        pattern: /^(www?[., ][\w-]+[. ][\w-]+(?:[. ][\w-]+)?)\s+-\s*/i,
        keepMatching: true,
        skipFromTitle: true,
        remove: true
      },
      {
        field: "site",
        pattern: /\bwww[., ][\w-]+[., ](?:rodeo|hair)\b/i,
        remove: true,
        skipFromTitle: true
      },
      // 20-40 group handler, placed before episode handlers to prevent matching as episodes
      {
        field: "group",
        pattern: /\b(20-40)\b$/,
        transform: toValue("20-40"),
        remove: true
      },
      // Episode Code handlers (lines 319-328 in handlers.go)
      {
        field: "episodeCode",
        pattern: /([\[(]([a-z0-9]{8}|[A-Z0-9]{8})[\])])(?:\.[a-zA-Z0-9]{1,5}$|$)/,
        transform: toUppercase(),
        remove: true,
        matchGroup: 1,
        valueGroup: 2
      },
      {
        field: "episodeCode",
        pattern: /\[([A-Z0-9]{8})]/,
        validateMatch: validateMatch(/(?:[A-Z]+\d|\d+[A-Z])/),
        transform: toUppercase(),
        remove: true
      },
      // Resolution handlers (lines 330-378 in handlers.go)
      {
        field: "resolution",
        pattern: /\b(?:4k|2160p|1080p|720p|480p)\b.+\b(4k|2160p|1080p|720p|480p)\b/i,
        transform: toLowercase(),
        remove: true,
        matchGroup: 1
      },
      {
        field: "resolution",
        pattern: /\b[(\[]?4k[)\]]?\b/i,
        transform: toValue("4k"),
        remove: true
      },
      {
        field: "resolution",
        pattern: /21600?[pi]/i,
        transform: toValue("4k"),
        remove: true,
        keepMatching: true
      },
      {
        field: "resolution",
        pattern: /[(\[]?3840x\d{4}[)\]]?/i,
        transform: toValue("4k"),
        remove: true
      },
      {
        field: "resolution",
        pattern: /[(\[]?1920x\d{3,4}[)\]]?/i,
        transform: toValue("1080p"),
        remove: true
      },
      {
        field: "resolution",
        pattern: /[(\[]?1280x\d{3}[)\]]?/i,
        transform: toValue("720p"),
        remove: true
      },
      {
        field: "resolution",
        pattern: /[(\[]?\d{3,4}x(\d{3,4})[)\]]?/i,
        transform: toWithSuffix("p"),
        remove: true
      },
      {
        field: "resolution",
        pattern: /(480|720|1080)0[pi]/i,
        transform: toWithSuffix("p"),
        remove: true
      },
      {
        field: "resolution",
        pattern: /(?:BD|HD|M)(720|1080|2160)/i,
        transform: toWithSuffix("p"),
        remove: true
      },
      {
        field: "resolution",
        pattern: /(480|576|720|1080|2160)[pi]/i,
        transform: toWithSuffix("p"),
        remove: true
      },
      {
        field: "resolution",
        pattern: /(?:^|\D)(\d{3,4})[pi]/i,
        transform: toWithSuffix("p"),
        remove: true
      },
      // Date handlers (lines 380-451 in handlers.go)
      {
        field: "date",
        pattern: /(?:\W|^)([(\[]?((?:19[6-9]|20[012])[0-9]([. \-/\\])(?:0[1-9]|1[012])([. \-/\\])(?:0[1-9]|[12][0-9]|3[01]))[)\]]?)(?:\W|$)/,
        validateMatch: validateMatchedGroupsAreSame(3, 4),
        transform: toDate("2006 01 02"),
        remove: true,
        valueGroup: 2,
        matchGroup: 1
      },
      {
        field: "date",
        pattern: /(?:\W|^)[(\[]?((?:0[1-9]|[12][0-9]|3[01])([. \-/\\])(?:0[1-9]|1[012])([. \-/\\])(?:19[6-9]|20[012])[0-9])[)\]]?(?:\W|$)/,
        validateMatch: validateMatchedGroupsAreSame(2, 3),
        transform: toDate("02 01 2006"),
        remove: true
      },
      {
        field: "date",
        pattern: /(?:\W)[(\[]?((?:0[1-9]|1[012])([. \-/\\])(?:0[1-9]|[12][0-9]|3[01])([. \-/\\])(?:19[6-9]|20[012])[0-9])[)\]]?(?:\W|$)/,
        validateMatch: validateMatchedGroupsAreSame(2, 3),
        transform: toDate("01 02 2006"),
        remove: true
      },
      {
        field: "date",
        pattern: /(?:\W)[(\[]?((?:0[1-9]|1[012])([. \-/\\])(?:0[1-9]|[12][0-9]|3[01])([. \-/\\])(?:[0][1-9]|[0126789][0-9]))[)\]]?(?:\W|$)/,
        validateMatch: validateMatchedGroupsAreSame(2, 3),
        transform: toDate("01 02 06"),
        remove: true
      },
      {
        field: "date",
        pattern: /(?:\W)[(\[]?((?:0[1-9]|[12][0-9]|3[01])([. \-/\\])(?:0[1-9]|1[012])([. \-/\\])(?:[0][1-9]|[0126789][0-9]))[)\]]?(?:\W|$)/,
        validateMatch: validateMatchedGroupsAreSame(2, 3),
        transform: toDate("02 01 06"),
        matchGroup: 1,
        remove: true
      },
      {
        field: "date",
        pattern: /(?:\W|^)[(\[]?((?:0?[1-9]|[12][0-9]|3[01])[. ]?(?:st|nd|rd|th)?([. \-/\\])(?:feb(?:ruary)?|jan(?:uary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)([. \-/\\])(?:19[7-9]|20[012])[0-9])[)\]]?(?:\W|$)/i,
        validateMatch: validateMatchedGroupsAreSame(2, 3),
        transform: (title, m, result) => {
          toCleanDate()(title, m, result);
          toCleanMonth()(title, m, result);
          toDate("_2 Jan 2006")(title, m, result);
        },
        remove: true
      },
      {
        field: "date",
        pattern: /(?:\W|^)[(\[]?((?:0?[1-9]|[12][0-9]|3[01])[. ]?(?:st|nd|rd|th)?([. \-/\\])(?:feb(?:ruary)?|jan(?:uary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)([. \-/\\])(?:0[1-9]|[0126789][0-9]))[)\]]?(?:\W|$)/i,
        validateMatch: validateMatchedGroupsAreSame(2, 3),
        transform: (title, m, result) => {
          toCleanDate()(title, m, result);
          toCleanMonth()(title, m, result);
          toDate("_2 Jan 06")(title, m, result);
        },
        remove: true
      },
      {
        field: "date",
        pattern: /(?:\W|^)[(\[]?(20[012][0-9](?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[01]))[)\]]?(?:\W|$)/,
        transform: toDate("20060102"),
        remove: true
      },
      // Year handlers (lines 456-542 in handlers.go)
      {
        field: "year",
        pattern: /[ .]?([(\[*]?((?:19\d|20[012])\d[ .]?-[ .]?(?:19\d|20[012])\d)[*)\]]?)[ .]?/,
        transform: (title, m, result) => {
          toYear()(title, m, result);
          if (!result.has("complete") && typeof m.value === "string" && m.value.includes("-")) {
            result.set("complete", {
              mIndex: m.mIndex,
              mValue: m.mValue,
              value: true,
              remove: false,
              processed: false
            });
          }
        },
        matchGroup: 1,
        valueGroup: 2,
        remove: true
      },
      {
        field: "year",
        pattern: /[(\[*][ .]?((?:19\d|20[012])\d[ .]?-[ .]?\d{2})(?:\s?[*)\]])?/,
        transform: (title, m, result) => {
          toYear()(title, m, result);
          if (!result.has("complete") && typeof m.value === "string" && m.value.includes("-")) {
            result.set("complete", {
              mIndex: m.mIndex,
              mValue: m.mValue,
              value: true,
              remove: false,
              processed: false
            });
          }
        },
        remove: true
      },
      {
        field: "year",
        pattern: /[(\[*]?\b(20[0-9]{2}|2100)[*\])]?/i,
        validateMatch: validateLookahead("(?:\\D*\\d{4}\\b)", "", false),
        transform: toYear(),
        remove: true
      },
      {
        field: "year",
        pattern: /(?:[(\[*]|.)((?:\d|[SE]|Cap[. ]?)?(?:19\d|20[012])\d(?:\d|kbps)?)[*)\]]?/i,
        validateMatch: (input, match) => {
          if (match[0] < 2) {
            return false;
          }
          return input.substring(match[2], match[3]).length === 4;
        },
        transform: toYear(),
        remove: true,
        matchGroup: 1
      },
      {
        field: "year",
        pattern: /^[(\[]?((?:19\d|20[012])\d)(?:\d|kbps)?[)\]]?/,
        validateMatch: (input, match) => {
          const mValue = input.substring(match[0], match[1]);
          if (mValue.length === 4) {
            return match[0] !== 0;
          }
          return mValue.replace(/[()[\]]/g, "").length === 4;
        },
        transform: toYear(),
        remove: true
      },
      // Extended handlers (lines 544-549 in handlers.go)
      {
        field: "extended",
        pattern: /EXTENDED/,
        transform: toBoolean()
      },
      {
        field: "extended",
        pattern: /- Extended/i,
        transform: toBoolean()
      },
      // Edition handlers (lines 551-606 in handlers.go)
      {
        field: "editions",
        pattern: /\b\d{2,3}(?:th)?[\.\s\-\+_\/(),]Anniversary[\.\s\-\+_\/(),](?:Edition|Ed)?\b/i,
        transform: toValueSet("Anniversary Edition"),
        keepMatching: true,
        remove: true,
        skipIfBefore: ["year"]
      },
      {
        field: "editions",
        pattern: /\b(?:D(ragon)?[\.\s\-\+_\/(),]?Box)\b/i,
        transform: toValueSet("Dragon Box"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\bCC\b|\bcolou?r[.\s-]?corrected\b/i,
        transform: toValueSet("Color Corrected"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\bUltimate[\.\s\-\+_\/(),]Edition\b/i,
        transform: toValueSet("Ultimate Edition"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\bExtended[\.\s\-\+_\/(),]Director\W?s\b/i,
        transform: toValueSet("Director's Cut"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\b(?:custom.?)?Extended\b/i,
        transform: toValueSet("Extended Edition"),
        keepMatching: true,
        remove: true
      },
      {
        // criterion collection
        field: "editions",
        pattern: /\bCriterion\.Collection\b/i,
        transform: toValueSet("Criterion Collection"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\bDirector\W?s.?Cut\b/i,
        transform: toValueSet("Director's Cut"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\bCollector\W?s\b/i,
        transform: toValueSet("Collector's Edition"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\bTheatrical\b/i,
        transform: toValueSet("Theatrical"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\buncut(?:.gems)?\b/i,
        validateMatch: validateNotMatch(/(?:.gems)/i),
        transform: toValueSet("Uncut"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\bIMAX\b/i,
        transform: toValueSet("IMAX"),
        keepMatching: true,
        remove: true,
        skipFromTitle: true
      },
      {
        field: "editions",
        pattern: /\bDiamond[\s.]Edition\b/i,
        transform: toValueSet("Diamond Edition"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\b\.Diamond\.\b/i,
        transform: toValueSet("Diamond Edition"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\bRemaster(?:ed)?\b|\b[\[(]?REKONSTRUKCJA[\])]?\b/i,
        transform: toValueSet("Remastered"),
        keepMatching: true,
        remove: true
      },
      {
        field: "editions",
        pattern: /\bDC\b/,
        transform: toValueSet("Director's Cut"),
        keepMatching: true,
        remove: true,
        skipIfBefore: ["year"]
      },
      // Release Types handlers (lines 608-623 in handlers.go)
      {
        field: "releaseTypes",
        pattern: /\b((?:OAD|OAV|ODA|ONA|OVA)\b(?:[+&]\b(?:OAD|OAV|ODA|ONA|OVA)\b)?)/i,
        transform: toValueSetMultiWithTransform((v) => {
          const values = [];
          for (const part of v.split(nonAlphasRegex)) {
            if (part) {
              values.push(part.toUpperCase());
            }
          }
          return values;
        }),
        remove: true,
        matchGroup: 1
      },
      {
        field: "releaseTypes",
        pattern: /\b(OAD|OAV|ODA|ONA|OVA)(?:[ .-]*\d{1,3})?(?:v\d)?\b/i,
        transform: toValueSetWithTransform((v) => v.toUpperCase()),
        remove: true,
        matchGroup: 1
      },
      // Upscaled handlers (lines 625-636 in handlers.go)
      {
        field: "regraded",
        pattern: /\bRegraded?\b/i,
        transform: toBoolean(),
        remove: true
      },
      {
        field: "upscaled",
        pattern: /\b(?:AI.?)?(Upscal(ed?|ing)|Enhanced?)\b/i,
        transform: toBoolean()
      },
      {
        field: "upscaled",
        pattern: /\b(?:iris2|ups(?:uhd|fhd|hd|4k))\b/i,
        transform: toBoolean()
      },
      {
        field: "upscaled",
        pattern: /\bups\b/i,
        transform: toBoolean(),
        skipIfFirst: true
      },
      {
        field: "upscaled",
        pattern: /\b\.AI\.\b/i,
        transform: toBoolean()
      },
      // Convert handler (lines 638-643 in handlers.go)
      {
        field: "convert",
        pattern: /\bCONVERT\b/,
        transform: toBoolean(),
        remove: true
      },
      // Hardcoded handler (lines 645-650 in handlers.go)
      {
        field: "hardcoded",
        pattern: /\bHC|HARDCODED\b/,
        transform: toBoolean(),
        remove: true
      },
      // Proper handler (lines 652-657 in handlers.go)
      {
        field: "proper",
        pattern: /\b(?:REAL.)?PROPER\b/i,
        transform: toBoolean(),
        remove: true
      },
      // Repack handler (lines 659-664 in handlers.go)
      {
        field: "repack",
        pattern: /\bREPACK|RERIP\b/i,
        transform: toBoolean(),
        remove: true
      },
      // Retail handler (lines 666-670 in handlers.go)
      {
        field: "retail",
        pattern: /\bRetail\b/i,
        transform: toBoolean()
      },
      // Documentary handler (lines 672-677 in handlers.go)
      {
        field: "documentary",
        pattern: /\bDOCU(?:menta?ry)?\b/i,
        transform: toBoolean(),
        skipFromTitle: true
      },
      // Unrated handler (lines 679-684 in handlers.go)
      {
        field: "unrated",
        pattern: /\bunrated\b/i,
        transform: toBoolean(),
        remove: true
      },
      // Uncensored handler (lines 686-691 in handlers.go)
      {
        field: "uncensored",
        pattern: /\buncensored\b/i,
        transform: toBoolean(),
        remove: true
      },
      // Commentary handler (lines 693-698 in handlers.go)
      {
        field: "commentary",
        pattern: /\bcommentary\b/i,
        transform: toBoolean(),
        remove: true
      },
      // Region handlers (lines 700-710 in handlers.go)
      {
        field: "region",
        pattern: /R\dJ?\b/,
        remove: true,
        skipIfFirst: true
      },
      {
        field: "region",
        pattern: /\b(PAL|NTSC|SECAM)\b/,
        transform: toUppercase(),
        remove: true
      },
      // Quality/Source handlers (lines 712-1054 in handlers.go)
      {
        field: "quality",
        pattern: /\b(?:H[DQ][ .-]*)?CAM(?:H[DQ])?(?:[ .-]*Rip)?\b/i,
        transform: toValue("CAM"),
        skipIfFirst: true,
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(?:H[DQ][ .-]*)?S[ .-]+print/i,
        transform: toValue("CAM"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(?:HD[ .-]*)?T(?:ELE)?S(?:YNC)?(?:Rip)?\b/i,
        transform: toValue("TeleSync"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(?:HD[ .-]*)?T(?:ELE)?C(?:INE)?(?:Rip)?\b/,
        transform: toValue("TeleCine"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(?:DVD?|BD|BR|HD)?[ .-]*Scr(?:eener)?\b/i,
        transform: toValue("SCR"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bP(?:RE)?-?(HD|DVD)(?:Rip)?\b/i,
        transform: toValue("SCR"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(Blu[ .-]*Ray)\b(?:.*remux)/i,
        transform: toValue("BluRay REMUX"),
        remove: true,
        matchGroup: 1
      },
      {
        field: "quality",
        pattern: /(?:BD|BR|UHD)[- ]?remux/i,
        transform: toValue("BluRay REMUX"),
        remove: true
      },
      {
        field: "quality",
        pattern: /(?:remux.*)\bBlu[ .-]*Ray\b/i,
        transform: toValue("BluRay REMUX"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bremux\b/i,
        transform: toValue("REMUX"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bBlu[ .-]*Ray\b(?:[ .-]*Rip)?/i,
        validateMatch: (input, match) => {
          return !input.substring(match[0], match[1]).toLowerCase().endsWith("rip");
        },
        transform: toValue("BluRay"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bUHD[ .-]*Rip\b/i,
        transform: toValue("UHDRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bHD[ .-]*Rip\b/i,
        transform: toValue("HDRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bMicro[ .-]*HD\b/i,
        transform: toValue("HDRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(?:BR|Blu[ .-]*Ray)[ .-]*Rip\b/i,
        transform: toValue("BRRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bBD[ .-]*Rip\b|\bBDR\b|\bBD-RM\b|[\[(]BD[\]) .,-]/i,
        transform: toValue("BDRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bVOD[ .-]*Rip\b/i,
        transform: toValue("VODR"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(?:HD[ .-]*)?DVD[ .-]*Rip\b/i,
        transform: toValue("DVDRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bVHS[ .-]*Rip\b/i,
        transform: toValue("VHSRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(?:R\d?)?DVD(?:R\d?)?\b/i,
        transform: toValue("DVD"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bVHS\b/i,
        transform: toValue("DVD"),
        remove: true,
        skipIfFirst: true
      },
      {
        field: "quality",
        pattern: /\bPPV[ .-]*HD\b/i,
        transform: toValue("PPV"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bPPVRip\b/i,
        transform: toValue("PPVRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bHD.?TV.?Rip\b/i,
        transform: toValue("HDTVRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bDVB[ .-]*(?:Rip)?\b/i,
        transform: toValue("HDTV"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bSAT[ .-]*Rips?\b/i,
        transform: toValue("SATRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bTVRips?\b/i,
        transform: toValue("TVRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bR5\b/i,
        transform: toValue("R5"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bWEB[ .-]*Rip\b/i,
        transform: toValue("WEBRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bWEB[ .-]?Cap\b/i,
        transform: toValue("WEBCap"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bWEB[ .-]?DL[ .-]?Rip\b/i,
        transform: toValue("WEB-DLRip"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bWEB[ .-]*(DL|.BDrip|.DLRIP)\b/i,
        transform: toValue("WEB-DL"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(?:DL|WEB|BD|BR)MUX\b/i,
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(W(?:ORK)P(?:RINT))\b/,
        transform: toValue("WORKPRINT"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\b(?:\w.)?WEB\b|\bWEB(?:(?:[ \.\-\(\],]+\d))?\b/i,
        validateMatch: validateNotMatch(/\b(?:\w.)WEB\b|\bWEB(?:(?:[ \.\-\(\],]+\d))\b/i),
        transform: toValue("WEB"),
        remove: true,
        skipFromTitle: true
      },
      {
        field: "quality",
        pattern: /\bPDTV\b/i,
        transform: toValue("PDTV"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bHD(?:.?TV)?\b(?!-ELITE\.NET)/i,
        transform: toValue("HDTV"),
        remove: true
      },
      {
        field: "quality",
        pattern: /\bSD(?:.?TV)?\b/i,
        transform: toValue("SDTV"),
        remove: true
      },
      // Bit Depth handlers (lines 1056-1077 in handlers.go)
      {
        field: "bitDepth",
        pattern: /(?:8|10|12)[-.]?bit\b/i,
        transform: toLowercase(),
        remove: true
      },
      {
        field: "bitDepth",
        pattern: /\bhevc\s?10\b/i,
        transform: toValue("10bit")
      },
      {
        field: "bitDepth",
        pattern: /\bhdr10(?:\+|plus)?\b/i,
        transform: toValue("10bit")
      },
      {
        field: "bitDepth",
        pattern: /\bhi10\b/i,
        transform: toValue("10bit")
      },
      {
        field: "bitDepth",
        process: removeFromValue(/[ -]/)
      },
      // HDR handlers (lines 1079-1101 in handlers.go)
      {
        field: "hdr",
        pattern: /\bDV\b|dolby.?vision|\bDoVi\b/i,
        transform: toValueSet("DV"),
        remove: true,
        keepMatching: true
      },
      {
        field: "hdr",
        pattern: /HDR10(?:\+|plus)/i,
        transform: toValueSet("HDR10+"),
        remove: true,
        keepMatching: true
      },
      {
        field: "hdr",
        pattern: /\bHDR(?:10)?\b/i,
        transform: toValueSet("HDR"),
        remove: true,
        keepMatching: true
      },
      {
        field: "hdr",
        pattern: /\bSDR\b/i,
        transform: toValueSet("SDR"),
        remove: true,
        keepMatching: true
      },
      // 3D handlers (lines 1103-1138 in handlers.go)
      {
        field: "threeD",
        pattern: /\b(3D)\b.*\b(Half-?SBS|H[-\\/]?SBS)\b/i,
        transform: toValue("3D HSBS")
      },
      {
        field: "threeD",
        pattern: /\bHalf.Side.?By.?Side\b/i,
        transform: toValue("3D HSBS")
      },
      {
        field: "threeD",
        pattern: /\b(3D)\b.*\b(Full-?SBS|SBS)\b/i,
        transform: toValue("3D SBS")
      },
      {
        field: "threeD",
        pattern: /\bSide.?By.?Side\b/i,
        transform: toValue("3D SBS")
      },
      {
        field: "threeD",
        pattern: /\b(3D)\b.*\b(Half-?OU|H[-\\/]?OU)\b/i,
        transform: toValue("3D HOU")
      },
      {
        field: "threeD",
        pattern: /\bHalf.?Over.?Under\b/i,
        transform: toValue("3D HOU")
      },
      {
        field: "threeD",
        pattern: /\b(3D)\b.*\b(OU)\b/i,
        transform: toValue("3D OU")
      },
      {
        field: "threeD",
        pattern: /\bOver.?Under\b/i,
        transform: toValue("3D OU")
      },
      {
        field: "threeD",
        pattern: /\b((?:BD)?3D)\b/i,
        transform: toValue("3D"),
        skipIfFirst: true
      },
      // Codec handlers (lines 1140-1167 in handlers.go)
      {
        field: "codec",
        pattern: /\b[xh][-. ]?26[45]/i,
        transform: toLowercase(),
        remove: true
      },
      {
        field: "codec",
        pattern: /\bhevc(?:\s?10)?\b/i,
        transform: toValue("hevc"),
        remove: true,
        keepMatching: true
      },
      {
        field: "codec",
        pattern: /\b(?:dvix|mpeg2|divx|xvid|avc)\b/i,
        transform: toLowercase(),
        remove: true,
        keepMatching: true
      },
      {
        field: "codec",
        pattern: /\bvp[89]\b/i,
        transform: toLowercase(),
        remove: true,
        keepMatching: true
      },
      {
        field: "codec",
        pattern: /\bAV1\b/i,
        transform: toValue("av1"),
        remove: true,
        keepMatching: true
      },
      {
        field: "codec",
        process: removeFromValue(/[ .-]/)
      },
      // Channels handlers (lines 1169-1199 in handlers.go)
      {
        field: "channels",
        pattern: /5[.\s]1(?:ch|-S\d+)?\b/i,
        transform: toValueSet("5.1"),
        keepMatching: true,
        remove: true
      },
      {
        field: "channels",
        pattern: /\b(?:x[2-4]|5[\W]1(?:x[2-4])?)\b/i,
        transform: toValueSet("5.1"),
        keepMatching: true,
        remove: true
      },
      {
        field: "channels",
        pattern: /\b7[.\- ]1(?:.?ch(?:annel)?)?\b/i,
        transform: toValueSet("7.1"),
        keepMatching: true,
        remove: true
      },
      {
        field: "channels",
        pattern: /(?:\b|AAC|DDP)\+?(2[.\s]0)(?:x[2-4])?\b/i,
        transform: toValueSet("2.0"),
        keepMatching: true,
        remove: true,
        matchGroup: 1
      },
      {
        field: "channels",
        pattern: /\b2\.0\b/i,
        transform: toValueSet("2.0"),
        keepMatching: true,
        remove: true
      },
      {
        field: "channels",
        pattern: /\bstereo\b/i,
        transform: toValueSet("stereo"),
        keepMatching: true
      },
      {
        field: "channels",
        pattern: /\bmono\b/i,
        transform: toValueSet("mono"),
        keepMatching: true
      },
      // Audio handlers (lines 1201-1251 in handlers.go)
      {
        field: "audio",
        pattern: /\b(?:.+HR)?(?:DTS.?HD.?Ma(?:ster)?|DTS.?X)\b/i,
        validateMatch: validateNotMatch(/(?:.+HR)/i),
        transform: toValueSet("DTS Lossless"),
        remove: true,
        keepMatching: true
      },
      {
        field: "audio",
        pattern: /\bDTS(?:(?:.?HD.?Ma(?:ster)?|.X))?.?(?:HD.?HR|HD)?\b/i,
        validateMatch: validateNotMatch(/DTS(?:.?HD.?Ma(?:ster)?|.X)/i),
        transform: toValueSet("DTS Lossy"),
        remove: true,
        keepMatching: true
      },
      {
        field: "audio",
        pattern: /\b(?:Dolby.?)?Atmos\b/i,
        transform: toValueSet("Atmos"),
        remove: true,
        keepMatching: true
      },
      {
        field: "audio",
        pattern: /\bTrue[ .-]?HD\b/i,
        transform: toValueSet("TrueHD"),
        keepMatching: true,
        remove: true,
        skipFromTitle: true
      },
      {
        field: "audio",
        pattern: /\bTRUE\b/,
        transform: toValueSet("TrueHD"),
        keepMatching: true,
        remove: true,
        skipFromTitle: true,
        skipIfBefore: ["year", "seasons", "episodes"]
      },
      // More Audio handlers (lines 1253-1521 in handlers.go)
      {
        field: "audio",
        pattern: /\bFLAC(?:\d\.\d)?(?:x\d+)?\b/i,
        transform: toValueSet("FLAC"),
        keepMatching: true,
        remove: true
      },
      {
        field: "audio",
        pattern: /\bDD2?[+p]|DD Plus|Dolby Digital Plus|DDP5[ ._]1/i,
        transform: toValueSet("DDP"),
        keepMatching: true,
        remove: true
      },
      {
        field: "audio",
        pattern: /E-?AC-?3(?:-S\d+)?/i,
        transform: toValueSet("EAC3"),
        keepMatching: true,
        remove: true
      },
      {
        field: "audio",
        pattern: /\b(DD|Dolby.?Digital|DolbyD)\b/i,
        transform: toValueSet("DD"),
        keepMatching: true,
        remove: true
      },
      {
        field: "audio",
        pattern: /\b(AC-?3(?:x2)?(?:-S\d+)?)\b/i,
        transform: toValueSet("AC3"),
        keepMatching: true,
        remove: true
      },
      {
        field: "audio",
        pattern: /\bQ?AAC(?:[. ]?2[. ]0|x2)?\b/,
        transform: toValueSet("AAC"),
        keepMatching: true,
        remove: true
      },
      {
        field: "audio",
        pattern: /\bL?PCM\b/i,
        transform: toValueSet("PCM"),
        keepMatching: true,
        remove: true
      },
      {
        field: "audio",
        pattern: /\bOPUS(?:\b|\d)(?:.*[ ._-](?:\d{3,4}p))?/i,
        validateMatch: validateNotMatch(/OPUS(?:\b|\d)(?:.*[ ._-](?:\d{3,4}p))/i),
        transform: toValueSet("OPUS"),
        keepMatching: true,
        remove: true
      },
      {
        field: "audio",
        pattern: /\b(?:H[DQ])?.?(?:Clean.?Aud(?:io)?)\b/i,
        transform: toValueSet("HQ"),
        remove: true,
        keepMatching: true
      },
      {
        field: "channels",
        pattern: /\[([257][.-][01])]/,
        transform: toValueSetWithTransform((v) => v.toLowerCase()),
        remove: true,
        keepMatching: true
      },
      // Group handler (lines 1523-1528 in handlers.go)
      {
        field: "group",
        process: regexMatchUntilValid(/- ?([^\-. \[]+[^\-. \[)\]E\d][^\-. \[)\]]*)(?:\[[\w.-]+])?/i, validateAnd(validateNotMatch(/- ?(?:\d+$|S\d+|\d+x|ep?\d+|[^[]+]$)/i), validateLookahead("(?:[ .]\\w{2,4}$|$)", "i", true)))
      },
      // Size handler
      {
        field: "size",
        pattern: /\b(\d+((\.|,)\d+)?\s?(MB|GB|TB))\b/i,
        remove: true
      },
      // Container handler (lines 1530-1534 in handlers.go)
      {
        field: "container",
        pattern: /\.?[\[(]?\b(MKV|AVI|MP4|WMV|MPG|MPEG)\b[\])]?/i,
        transform: toLowercase()
      },
      // Batch 6: Volumes, Languages, Complete handlers (lines 1536-1749 in handlers.go)
      // Volumes handlers (lines 1548-1591 in handlers.go)
      {
        field: "volumes",
        pattern: /\bvol(?:s|umes?)?[. -]*(?:\d{1,3}[., +/\\&-]+)+\d{1,3}\b/i,
        transform: toIntRange(),
        remove: true
      },
      {
        field: "volumes",
        process: (title, m, result) => {
          const re = /\bvol(?:ume)?[. -]*(\d{1,3})/i;
          let startIndex = 0;
          if (result.has("year")) {
            const yr = result.get("year");
            startIndex = Math.min(yr.mIndex, title.length);
          }
          const match = title.substring(startIndex).match(re);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num)) {
              m.mIndex = startIndex + match.index;
              m.mValue = match[0];
              m.value = [num];
              m.remove = true;
            }
          }
          return m;
        }
      },
      // Country handler (lines 1593-1597 in handlers.go)
      {
        field: "country",
        pattern: /\b(US|UK|AU|NZ)\b/
      },
      // Languages handlers (lines 1599-1612 in handlers.go)
      {
        field: "languages",
        pattern: /\b(temporadas?|completa)\b/i,
        transform: toValueSet("es"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(?:INT[EÉ]GRALE?)\b/i,
        transform: toValueSet("fr"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(?:Saison)\b/i,
        transform: toValueSet("fr"),
        keepMatching: true
      },
      // Complete handlers (lines 1614-1725 in handlers.go)
      {
        field: "complete",
        pattern: /\b(?:INTEGRALE?|INTÉGRALE?)\b/i,
        transform: toBoolean(),
        keepMatching: true,
        remove: true
      },
      {
        field: "complete",
        pattern: /(?:\bthe\W)?(?:\bcomplete|collection|dvd)?\b[ .]?\bbox[ .-]?set\b/i,
        transform: toBoolean()
      },
      {
        field: "complete",
        pattern: /(?:\bthe\W)?(?:\bcomplete|collection|dvd)?\b[ .]?\bmini[ .-]?series\b/i,
        transform: toBoolean()
      },
      {
        field: "complete",
        pattern: /(?:\bthe\W)?(?:\bcomplete|full|\ball)\b.*\b(?:series|seasons|collection|episodes|set|pack|movies)\b/i,
        transform: toBoolean()
      },
      {
        field: "complete",
        pattern: /\b(?:series|seasons|movies?)\b.*\b(?:complete|collection)\b/i,
        transform: toBoolean()
      },
      {
        field: "complete",
        pattern: /(?:\bthe\W)?\bultimate\b[ .]\bcollection\b/i,
        transform: toBoolean(),
        keepMatching: true
      },
      {
        field: "complete",
        pattern: /\bcollection\b.*\b(?:set|pack|movies)\b/i,
        transform: toBoolean()
      },
      {
        field: "complete",
        pattern: /\bcollection(?:(\s\[|\s\())/i,
        transform: toBoolean(),
        remove: true
      },
      {
        field: "complete",
        pattern: /\bkolekcja\b(?:\Wfilm(?:y|ów|ow)?)?/i,
        transform: toBoolean(),
        remove: true
      },
      {
        field: "complete",
        pattern: /duology|trilogy|quadr[oi]logy|tetralogy|pentalogy|hexalogy|heptalogy|anthology/i,
        transform: toBoolean(),
        keepMatching: true
      },
      {
        field: "complete",
        pattern: /\bcompleta\b/i,
        transform: toBoolean(),
        remove: true
      },
      {
        field: "complete",
        pattern: /\bsaga\b/i,
        transform: toBoolean(),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "complete",
        pattern: /\b\[Complete\]\b/i,
        transform: toBoolean(),
        remove: true
      },
      {
        field: "complete",
        pattern: /(?:A.?|The.?)?\bComplete\b/i,
        validateMatch: validateNotMatch(/(?:A.?|The.?)\bComplete/i),
        transform: toBoolean(),
        remove: true
      },
      {
        field: "complete",
        pattern: /\bCOMPLETE\b/,
        transform: toBoolean(),
        remove: true
      },
      // Batch 7: Seasons handlers (lines 1727-1868 in handlers.go)
      {
        field: "seasons",
        pattern: /(?:complete\W|seasons?\W|\W|^)((?:s\d{1,2}[., +/\\&-]+)+s\d{1,2}\b)/i,
        transform: toIntRange(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /(?:complete\W|seasons?\W|\W|^)[(\[]?(s\d{2,}-\d{2,}\b)[)\]]?/i,
        transform: toIntRange(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /(?:complete\W|seasons?\W|\W|^)[(\[]?(s[1-9]-[2-9]\b)[)\]]?/i,
        transform: toIntRange(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /\d+ª(?:.+)?(?:a.?)?\d+ª(?:(?:.+)?(?:temporadas?))/i,
        transform: toIntRange(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /(?:(?:\bthe\W)?\bcomplete\W)?(?:seasons?|[Сс]езони?|sezon|temporadas?|stagioni)[. ]?[-:]?[. ]?[(\[]?((?:\d{1,2} ?(?:[,/\\&]+ ?)+)+\d{1,2}\b)[)\]]?/i,
        transform: toIntRange()
      },
      {
        field: "seasons",
        pattern: /(?:(?:\bthe\W)?\bcomplete\W)?(?:seasons|[Сс]езони?|sezon|temporadas?|stagioni)[. ]?[-:]?[. ]?[(\[]?((?:\d{1,2}[. -]+)+0?[1-9]\d?\b)[)\]]?/i,
        transform: toIntRange(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /(?:(?:\bthe\W)?\bcomplete\W)?season[. ]?[(\[]?((?:\d{1,2}[. -]+)+0?\d{1,2}\b)[)\]]?(?:.*\.\w{2,4}$)?/i,
        validateMatch: (input, idxs) => {
          if (/(?:.*\.\w{2,4}$)/i.test(input)) {
            return false;
          }
          const capturedRange = input.substring(idxs[2], idxs[3]);
          if (/\s{2,}/.test(capturedRange)) {
            return false;
          }
          return true;
        },
        transform: toIntRange(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /(?:(?:\bthe\W)?\bcomplete\W)?\bseasons?\b[. -]?(\d{1,2}[. -]?(?:to|thru|and|\+|:)[. -]?\d{1,2})\b/i,
        transform: toIntRange(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /\bseason\b[ .-]?(\d{1,2}[ .-]?(?:to|thru|and|\+)[ .-]?\bseason\b[ .-]?\d{1,2})/i,
        transform: toIntRange()
      },
      {
        field: "seasons",
        pattern: new RegExp("(\\d{1,2})(?:-?\u0439)?[. _]?(?:[\u0421\u0441]\u0435\u0437\u043E\u043D|sez(?:on)?)(?:\\P{L}?\\D|$)", "iu"),
        transform: toIntArray(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /(?:(?:\bthe\W)?\bcomplete\W)?(?:saison|seizoen|sezon(?:SO?)?|stagione|season|series|temp(?:orada)?):?[. ]?(\d{1,2})/i,
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /[Сс]езон:?[. _]?№?(\d{1,2})(?:\d)?/i,
        validateMatch: validateNotMatch(/\d{3}/i),
        transform: toIntArray(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /(?:\D|^)(\d{1,2})Â?[°ºªa]?[. ]*temporada/i,
        transform: toIntArray(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /t(\d{1,3})(?:[ex]+|$)/i,
        transform: toIntArray(),
        remove: true
      },
      {
        field: "seasons",
        pattern: /(?:(?:\bthe\W)?\bcomplete)?(?:\W|^)so?([01]?[0-5]?[1-9])(?:[\Wex]|\d{2}\b)/i,
        validateMatch: validateNotStartSpaced(),
        transform: toIntArray(),
        keepMatching: true
      },
      {
        field: "seasons",
        pattern: /(?:so?|t)(\d{1,4})[. ]?[xх-]?[. ]?(?:e|x|х|ep|-|\.)[. ]?\d{1,4}(?:[abc]|v0?[1-4]|\D|$)/i,
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /(?:(?:\bthe\W)?\bcomplete\W)?(?:\W|^)(\d{1,2})[. ]?(?:st|nd|rd|th)[. ]*season/i,
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /(?:\D|^)(\d{1,2})[Xxх]\d{1,3}(?:\D|$)/,
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /\bSn([1-9])(?:\D|$)/,
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /[\[(](\d{1,2})\.\d{1,3}[)\]]/,
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /-\s?(\d{1,2})\.\d{2,3}\s?-/,
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /^(\d{1,2})\.\d{2,3} - /,
        transform: toIntArray(),
        skipIfBefore: ["year", "source", "resolution"]
      },
      {
        field: "seasons",
        pattern: /(?:^|\/)(?:20-20)?(\d{1,2})-\d{2}\b(?:-\d)?/,
        validateMatch: validateNotMatch(/^(?:20-20)|(\d{1,2})-\d{2}\b(?:-\d)/),
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /[^\w-](\d{1,2})-\d{2}(?:\.\w{2,4}$)/,
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /(?:\bEp?(?:isode)? ?\d+\b.*)?\b(\d{2})[ ._]\d{2}(?:.F)?\.\w{2,4}$/,
        validateMatch: validateNotMatch(/(?:\bEp?(?:isode)? ?\d+\b.*)/),
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /\bEp(?:isode)?\W+(\d{1,2})\.\d{1,3}\b/i,
        transform: toIntArray()
      },
      {
        field: "seasons",
        pattern: /(?:(?:\bthe\W)?\bcomplete)?(?:[a-z])?\bs(\d{1,3})(?:[\Wex]|\d{2}\b|$)/i,
        validateMatch: validateAnd(validateNotMatch(/(?:[a-z])\bs\d{1,3}/i), validateNotStartSpaced()),
        transform: toIntArray(),
        keepMatching: true
      },
      {
        field: "seasons",
        pattern: /\bSeasons?\b.*\b(\d{1,2}-\d{1,2})\b/i,
        transform: toIntRange()
      },
      {
        field: "seasons",
        pattern: /(?:\W|^)(\d{1,2})(?:e|ep)\d{1,3}(?:\W|$)/i,
        transform: toIntArray()
      },
      /**
       * 	// ~ parser.add_handler("seasons", regex.compile(r"\bТВ-(\d{1,2})\b", regex.IGNORECASE), array(integer))
        {
            Field:     "seasons",
            Pattern:   regexp.MustCompile(`(?i)[\[\(]ТВ-(\d{1,2})[\)\]]`),
            Transform: to_int_array(),
        },
       */
      {
        field: "seasons",
        pattern: /[\[\(]ТВ-(\d{1,2})[\)\]]/i,
        transform: toIntArray()
      },
      // Batch 8: Episodes handlers (lines 1870-2125 in handlers.go)
      {
        field: "episodes",
        pattern: /(?:[\W\d]|^)e[ .]?[(\[]?(\d{1,3}(?:[à .-]*(?:[&+]|e){1,2}[ .]?\d{1,3})+)(?:\W|$)/i,
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /(?:[\W\d]|^)ep[ .]?[(\[]?(\d{1,3}(?:[ .-]*(?:[&+]|ep){1,2}[ .]?\d{1,3})+)(?:\W|$)/i,
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /(?:[\W\d]|^)\d+[xх][ .]?[(\[]?(\d{1,3}(?:[ .]?[xх][ .]?\d{1,3})+)(?:\W|$)/i,
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /(?:[\W\d]|^)(?:episodes?|[Сс]ерии:?)[ .]?[(\[]?(\d{1,3}(?:[ .+]*[&+][ .]?\d{1,3})+)(?:\W|$)/i,
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /[(\[]?(?:\D|^)(\d{1,3}[ .]?ao[ .]?\d{1,3})[)\]]?(?:\W|$)/i,
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /(?:[\W\d]|^)(?:e|eps?|episodes?|[Сс]ерии:?|\d+[xх])[ .]*[(\[]?(\d{1,3}(?:-\d{1,3})+)(?:\W|$)/i,
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /\bs\d{1,2}[ .]*-[ .]*\b(\d{1,3}(?:[ .]*~[ .]*\d{1,3})+)\b/i,
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /(?:so?|t)\d{1,4}[. ]?[xх-]?[. ]?(?:e|x|х|ep)[. ]?(\d{1,4})(?:[abc]|v0?[1-4]|\D|$)/i,
        remove: true,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /(?:so?|t)\d{1,2}\s?[-.]\s?(\d{1,4})(?:[abc]|v0?[1-4]|\D|$)/i,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /\b(?:so?|t)\d{2}(\d{2})\b/i,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /(?:\W|^)(\d{1,3}(?:[ .]*~[ .]*\d{1,3})+)(?:\W|$)/i,
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /-\s(\d{1,3}[ .]*-[ .]*\d{1,3})(?:-\d*)?(?:\W|$)/i,
        validateMatch: validateNotMatch(/-\s(\d{1,3}[ .]*-[ .]*\d{1,3})(?:-\d*)/i),
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /s\d{1,2}\s?\((\d{1,3}[ .]*-[ .]*\d{1,3})\)/i,
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /(?:^|\/)(?:20-20)?\d{1,2}-(\d{2})\b(?:-\d)?/,
        validateMatch: validateNotMatch(/^(?:20-20)|\d{1,2}-(\d{2})\b(?:-\d)/),
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /(?:\d-)?\b\d{1,2}-(\d{2})(?:\.\w{2,4}$)/,
        validateMatch: validateNotMatch(/(?:\d-)\b\d{1,2}-(\d{2})/),
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /(?:^\[.+].+)([. ]+-[. ]*(\d{1,4})[. ]+)(?:\W)/i,
        transform: toIntArray(),
        valueGroup: 2,
        matchGroup: 1
      },
      {
        field: "episodes",
        pattern: new RegExp("(?:(?:seasons?|[\u0421\u0441]\u0435\u0437\u043E\u043D\u0438?)\\P{L}*)?(?:[ .(\\[-]|^)(\\d{1,3}(?:[ .]?[,&+~][ .]?\\d{1,3})+)(?:[ .)\\]-]|$)", "iu"),
        validateMatch: validateNotMatch(new RegExp("(?:(?:seasons?|[\u0421\u0441]\u0435\u0437\u043E\u043D\u0438?)\\P{L}*)", "iu")),
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: new RegExp("(?:(?:seasons?|[\u0421\u0441]\u0435\u0437\u043E\u043D\u0438?)\\P{L}*)?(?:20-20)?(?:[ .(\\[-]|^)(\\d{1,4}(?:-\\d{1,4})+)(?:[ .)(\\]]|[+-]\\D|$)", "iu"),
        validateMatch: validateAnd(validateNotMatch(new RegExp("(?:seasons?|[\u0421\u0441]\u0435\u0437\u043E\u043D\u0438?)\\P{L}*|^(?:20-20)", "iu")), validateOr(validateLookbehind("Tatsuki[\\s._-]Fujimoto", "i", false), validateNotMatch(/\b17-26\b/))),
        transform: toIntRange()
      },
      {
        field: "episodes",
        pattern: /\bEp(?:isode)?\W+\d{1,2}\.(\d{1,3})\b/i,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /Ep.\d+.-.\d+/i,
        transform: toIntRange(),
        remove: true
      },
      {
        field: "episodes",
        pattern: /(\d{1,3})[. ]?(?:of|из|iz)[. ]?\d{1,3}/i,
        validateMatch: validateAnd(validateLookbehind("(?:\\D|^)", "i", true), validateLookahead("(?:\\D|$)", "i", true)),
        transform: toIntRangeTill()
      },
      {
        field: "episodes",
        pattern: /(?:\b[ée]p?(?:isode)?|[Ээ]пизод|[Сс]ер(?:ии|ия|\.)?|caa?p(?:itulo)?|epis[oó]dio)[. ]?[-:#№]?[. ]?(\d{1,4})(?:[abc]|v0?[1-4]|\W|$)/i,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /\b(\d{1,3})(?:-?я)?[ ._-]*(?:ser(?:i?[iyj]a|\b)|[Сс]ер(?:ии|ия|\.)?)/i,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /(?:\D|^)\d{1,2}[. ]?[Xxх][. ]?(\d{1,3})(?:[abc]|v0?[1-4]|\D|$)/i,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /[\[(]\d{1,2}\.(\d{1,3})[)\]]/i,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /\b[Ss](?:eason\W?)?\d{1,2}[ .](\d{1,2})\b/,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /-\s?\d{1,2}\.(\d{2,3})\s?-/i,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /^\d{1,2}\.(\d{2,3}) - /,
        skipIfBefore: ["year", "source", "resolution"],
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /\b\d{2}[ ._-](\d{2})(?:.F)?\.\w{2,4}$/i,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /(?:^)?\[(\d{2,3})](?:(?:\.\w{2,4})?$)?/i,
        validateMatch: validateAnd(validateNotAtStart(), validateNotAtEnd(), validateNotMatch(/(?:720|1080)|\[(\d{2,3})](?:(?:\.\w{2,4})$)/i)),
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /\bodc[. ]+(\d{1,3})\b/i,
        transform: toIntArray()
      },
      {
        field: "episodes",
        pattern: /\b264\b|\b265\b/i,
        validateMatch: (input, match) => {
          const re = /\b[xh]\b/i;
          return !re.test(input.substring(0, match[0]));
        },
        transform: toIntArray(),
        remove: true
      },
      {
        field: "episodes",
        pattern: /(?:\W|^)(?:\d+)?(?:e|ep)(\d{1,3})(?:\W|$)/i,
        transform: toIntArray(),
        remove: true
      },
      {
        field: "episodes",
        pattern: /\d+.-.\d+TV/i,
        transform: toIntRange(),
        remove: true
      },
      {
        field: "episodes",
        pattern: /season\s*\d{1,2}\s*(\d{1,4}\s*-\s*\d{1,4})/i,
        validateMatch: validateNotMatch(/season\s*\d{1,2}\s*-/i),
        transform: toIntRange()
      },
      {
        field: "episodes",
        process: (title, m, result) => {
          if (m.value !== null && m.value !== void 0) {
            return m;
          }
          const btRe = /(?:movie\W*|film\W*|^)?(?:[ .]+-[ .]+|[(\[][ .]*)(\d{1,4})(?:a|b|v\d|\.\d)?(?:\W|$)(?:movie|film|\d+)?/i;
          const btReNegBefore = /(?:movie\W*|film\W*)(?:[ .]+-[ .]+|[(\[][ .]*)(\d{1,4})/i;
          const btReNegAfter = /(?:movie|film)|(\d{1,4})(?:a|b|v\d|\.\d)(?:\W)(?:\d+)/i;
          const mtRe = /^(?:[(\[-][ .]?)?(\d{1,4})(?:a|b|v\d)?(?:\Wmovie|\Wfilm|-\d)?(?:\W|$)/i;
          const mtReNegAfter = /(\d{1,4})(?:a|b|v\d)?(?:\Wmovie|\Wfilm|-\d)/i;
          const commonResolutionNeg = /\[(?:480|720|1080)\]/;
          const commonFPSNeg = /\d+(?:fps|帧率?)/i;
          let startIndex = 0;
          for (const component of ["year", "seasons"]) {
            if (result.has(component)) {
              const cm = result.get(component);
              if (cm.mIndex > 0 && (startIndex === 0 || cm.mIndex < startIndex)) {
                startIndex = cm.mIndex;
              }
            }
          }
          let endIndex = title.length;
          for (const component of ["resolution", "quality", "codec", "audio"]) {
            if (result.has(component)) {
              const cm = result.get(component);
              if (cm.mIndex > 0 && cm.mIndex < endIndex) {
                endIndex = cm.mIndex;
              }
            }
          }
          const beginningTitle = title.substring(0, endIndex);
          startIndex = Math.min(startIndex, title.length);
          const middleTitle = title.substring(startIndex, Math.max(endIndex, startIndex));
          let match = beginningTitle.match(btRe);
          let mStr = "";
          if (match && match.index !== void 0) {
            mStr = match[0];
            const matchEndPos = match.index + match[0].length;
            const nextCharIsWordChar = matchEndPos >= beginningTitle.length && endIndex < title.length && /\w/.test(title[endIndex]);
            if (match.index === 0 || btReNegBefore.test(mStr) || btReNegAfter.test(mStr) || commonResolutionNeg.test(mStr) || commonFPSNeg.test(mStr) || nextCharIsWordChar) {
              match = null;
              mStr = "";
            } else if (match[1]) {
              mStr = match[1];
            }
          }
          if (!mStr && endIndex > 0 && endIndex < title.length) {
            const dotEpisodeRe = /[ ._](\d{2,3})(?:[ ._]?v\d)?[ ._(\[]*$/i;
            const endSection = title.substring(0, endIndex);
            const dotMatch = endSection.match(dotEpisodeRe);
            if (dotMatch && dotMatch[1]) {
              mStr = dotMatch[1];
            }
          }
          if (!mStr) {
            match = middleTitle.match(mtRe);
            if (match && match.index !== void 0 && match[1]) {
              const captureGroupIndex = match[0].indexOf(match[1]);
              const fromCaptureGroup = middleTitle.substring(match.index + captureGroupIndex);
              if (mtReNegAfter.test(fromCaptureGroup) || commonResolutionNeg.test(mStr)) {
                match = null;
                mStr = "";
              } else {
                mStr = match[1];
              }
            }
          }
          if (mStr) {
            mStr = mStr.replace(/\D/g, "");
            const ep = parseInt(mStr, 10);
            if (!isNaN(ep)) {
              m.mIndex = title.indexOf(mStr);
              m.mValue = mStr;
              m.value = [ep];
            }
          }
          return m;
        }
      },
      // Batch 9: Subbed, Dubbed, Multi-language detection (lines 2259-2290 in handlers.go)
      {
        field: "subbed",
        pattern: /\bSUB(?:FRENCH)\b|\b(?:DAN|E|FIN|PL|SLO|SWE)SUBS?\b/i,
        transform: toBoolean()
      },
      {
        field: "languages",
        pattern: /\bmulti(?:ple)?[ .-]*(?:su?$|sub\w*|dub\w*)\b|msub/i,
        transform: toValueSet("multi subs"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\bmulti(?:ple)?[ .-]*(?:lang(?:uages?)?|audio|VF2)?\b/i,
        transform: toValueSet("multi audio"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\btri(?:ple)?[ .-]*(?:audio|dub\w*)\b/i,
        transform: toValueSet("multi audio"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bdual[ .-]*(?:au?$|[aá]udio|line)\b/i,
        transform: toValueSet("dual audio"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bdual\b(?:[ .-]*sub)?/i,
        validateMatch: validateNotMatch(/(?:[ .-]*sub)/i),
        transform: toValueSet("dual audio"),
        keepMatching: true
      },
      // Batch 10: Detailed language handlers, subbed/dubbed, network, size, group, extension (lines 2291-3592)
      // English language handlers
      {
        field: "languages",
        pattern: /\bengl?(?:sub[A-Z]*)?\b/i,
        transform: toValueSet("en"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\beng?sub[A-Z]*\b/i,
        transform: toValueSet("en"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bing(?:l[eéê]s)?\b/i,
        transform: toValueSet("en"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\besub\b/i,
        transform: toValueSet("en"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\benglish\W+(?:subs?|sdh|hi)\b/i,
        transform: toValueSet("en"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bEN\b/i,
        transform: toValueSet("en"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\benglish?\b/i,
        transform: toValueSet("en"),
        keepMatching: true,
        skipIfFirst: true
      },
      // Japanese language handlers
      {
        field: "languages",
        pattern: /\b(?:JP|JAP|JPN)\b/i,
        transform: toValueSet("ja"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /(japanese|japon[eê]s)\b/i,
        transform: toValueSet("ja"),
        keepMatching: true,
        skipIfFirst: true
      },
      // Korean language handlers
      {
        field: "languages",
        pattern: /\b(?:KOR|kor[ .-]?sub)\b/i,
        transform: toValueSet("ko"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /(korean|coreano)\b/i,
        transform: toValueSet("ko"),
        keepMatching: true,
        skipIfFirst: true
      },
      // Chinese language handlers
      {
        field: "languages",
        pattern: /\b(?:traditional\W*chinese|chinese\W*traditional)(?:\Wchi)?\b/i,
        transform: toValueSet("zh-tw"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\bzh-hant\b/i,
        transform: toValueSet("zh-tw"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(?:mand[ae]rin|ch[sn])\b/i,
        transform: toValueSet("zh"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /(?:shang-?)?\bCH(?:I|T)\b/i,
        validateMatch: validateNotMatch(/shang-?/i),
        transform: toValueSet("zh"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /(chinese|chin[eê]s)\b/i,
        transform: toValueSet("zh"),
        keepMatching: true,
        skipIfFirst: true
      },
      {
        field: "languages",
        pattern: /\bzh-hans\b/i,
        transform: toValueSet("zh"),
        keepMatching: true
      },
      // French language handlers
      {
        field: "languages",
        pattern: /\bFR(?:a|e|anc[eê]s|VF[FQIB2]?)\b/i,
        transform: toValueSet("fr"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\b(?:TRUE|SUB).?FRENCH\b|\bFRENCH\b|\bFre?\b/,
        transform: toValueSet("fr"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\b\[?(?:VF[FQRIB2]?\]?\b|(?:VOST)?FR2?)\b/,
        transform: toValueSet("fr"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\bVOST(?:FR?|A)?\b/i,
        transform: toValueSet("fr"),
        keepMatching: true
      },
      // Spanish/Latino language handlers
      {
        field: "languages",
        pattern: /\bspanish\W?latin|american\W*(?:spa|esp?)/i,
        transform: toValueSet("es-419"),
        keepMatching: true,
        remove: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\b(?:audio.)?lat(?:in?|ino)?\b/i,
        transform: toValueSet("es-419"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(?:audio.)?(?:ESP?|spa|(?:en[ .]+)?espa[nñ]ola?|castellano)\b/i,
        transform: toValueSet("es"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bes(?:\.(?:ass|ssa|srt|sub|idx)$)/i,
        transform: toValueSet("es"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bspanish\W+subs?\b/i,
        transform: toValueSet("es"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(spanish|espanhol)\b/i,
        transform: toValueSet("es"),
        keepMatching: true,
        skipIfFirst: true
      },
      {
        field: "languages",
        pattern: /\bSP\b/i,
        validateMatch: validateAnd(validateLookbehind("(?:w{3}\\.\\w+\\.)", "i", false), validateOr(validateLookahead("(?:[ .,/-]+(?:[A-Z]{2}[ .,/-]+){2,})", "i", true), validateLookbehind("(?:(?:[ .,/\\[-]+[A-Z]{2}){2,}[ .,/-]+)", "i", true), validateAnd(validateLookahead("(?:[ .,/-]+[A-Z]{2}(?:[ .,/-]|$))", "i", true), validateLookbehind("(?:[ .,/\\[-]+[A-Z]{2}[ .,/-]+)", "i", true)))),
        transform: toValueSet("es"),
        keepMatching: true,
        remove: true
      },
      // Portuguese language handlers
      {
        field: "languages",
        pattern: /\b(?:p[rt]|en|port)[. (\\/-]*BR\b/i,
        transform: toValueSet("pt"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\bbr(?:a|azil|azilian)\W+(?:pt|por)\b/i,
        transform: toValueSet("pt"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\b(?:leg(?:endado|endas?)?|dub(?:lado)?|portugu[eèê]se?)[. -]*BR\b/i,
        transform: toValueSet("pt"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bleg(?:endado|endas?)\b/i,
        transform: toValueSet("pt"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bportugu[eèê]s[ea]?\b/i,
        transform: toValueSet("pt"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bPT[. -]*(?:PT|ENG?|sub(?:s|titles?))\b/i,
        transform: toValueSet("pt"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bpt(?:\.(?:ass|ssa|srt|sub|idx)$)/i,
        transform: toValueSet("pt"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bpt\b/i,
        transform: toValueSet("pt"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\bpor\b/i,
        transform: toValueSet("pt"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Italian language handlers
      {
        field: "languages",
        pattern: /\bITA\b/i,
        transform: toValueSet("it"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bIT\b/i,
        validateMatch: validateAnd(validateLookbehind("(?:w{3}\\.\\w+\\.)", "i", false), validateOr(validateLookahead("(?:[ .,/-]+(?:[A-Z]{2}[ .,/-]+){2,})", "i", true), validateLookbehind("(?:(?:[ .,/\\[-]+[A-Z]{2}){2,}[ .,/-]+)", "i", true))),
        transform: toValueSet("it"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bit/i,
        validateMatch: validateLookahead("(?:\\.(?:ass|ssa|srt|sub|idx)$)", "i", true),
        transform: toValueSet("it"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bitaliano?\b/i,
        transform: toValueSet("it"),
        keepMatching: true,
        skipIfFirst: true
      },
      // Greek language handlers
      {
        field: "languages",
        pattern: /\bgreek[ .-]*(?:audio|lang(?:uage)?|subs?(?:titles?)?)?\b/i,
        transform: toValueSet("el"),
        keepMatching: true,
        skipIfFirst: true
      },
      // German language handlers
      {
        field: "languages",
        pattern: /\b(?:GER|DEU)\b/i,
        transform: toValueSet("de"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bde\b/i,
        validateMatch: validateLookahead("(?:[ .,/-]+(?:[A-Z]{2}[ .,/-]+){2,})", "i", true),
        transform: toValueSet("de"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bde\b/i,
        transform: toValueSet("de"),
        validateMatch: validateLookbehind("(?:[ .,/-]+(?:[A-Z]{2}[ .,/-]+){2,})", "i", true),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bde\b/i,
        transform: toValueSet("de"),
        validateMatch: validateAnd(validateLookbehind("(?:[ .,/-]+[A-Z]{2}[ .,/-]+)", "i", true), validateLookahead("(?:[ .,/-]+[A-Z]{2}[ .,/-]+)", "i", true)),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bde(?:\.(?:ass|ssa|srt|sub|idx)$)/i,
        transform: toValueSet("de"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\b(german|alem[aã]o)\b/i,
        transform: toValueSet("de"),
        keepMatching: true,
        skipIfFirst: true
      },
      // Russian language handlers
      {
        field: "languages",
        pattern: /\bRUS?\b/i,
        transform: toValueSet("ru"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /(russian|russo)\b/i,
        transform: toValueSet("ru"),
        keepMatching: true,
        skipIfFirst: true
      },
      // Ukrainian language handlers
      {
        field: "languages",
        pattern: /\bUKR\b/i,
        transform: toValueSet("uk"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bukrainian\b/i,
        transform: toValueSet("uk"),
        keepMatching: true,
        skipIfFirst: true
      },
      // Indian language handlers
      {
        field: "languages",
        pattern: /\bhin(?:di)?\b/i,
        transform: toValueSet("hi"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.)?tel(?:\W*aviv)?|telugu)\b/i,
        validateMatch: validateNotMatch(/(?:(?:w{3}\.\w+\.)tel)|(?:tel(?:\W*aviv))/i),
        transform: toValueSet("te"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bt[aâ]m(?:il)?\b/i,
        transform: toValueSet("ta"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.)?MAL(?:ay)?|malayalam)\b/i,
        validateMatch: validateNotMatch(/\b(?:(?:w{3}\.\w+\.)MAL)\b/i),
        transform: toValueSet("ml"),
        keepMatching: true,
        remove: true,
        skipIfFirst: true
      },
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.)?KAN(?:nada)?|kannada)\b/i,
        validateMatch: validateNotMatch(/\b(?:(?:w{3}\.\w+\.)KAN)\b/i),
        transform: toValueSet("kn"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.)?MAR(?:a(?:thi)?)?|marathi)\b/i,
        validateMatch: validateNotMatch(/\b(?:(?:w{3}\.\w+\.)MAR)\b/i),
        transform: toValueSet("mr"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.)?GUJ(?:arati)?|gujarati)\b/i,
        validateMatch: validateNotMatch(/\b(?:(?:w{3}\.\w+\.)GUJ)\b/i),
        transform: toValueSet("gu"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.)?PUN(?:jabi)?|punjabi)\b/i,
        validateMatch: validateNotMatch(/\b(?:(?:w{3}\.\w+\.)PUN)\b/i),
        transform: toValueSet("pa"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.)?BEN(?:.\bThe|and|of\b)?(?:gali)?|bengali)\b/i,
        validateMatch: validateNotMatch(/\b(?:(?:w{3}\.\w+\.)BEN)|(?:BEN)(?:.\bThe|and|of\b)\b/i),
        transform: toValueSet("bn"),
        keepMatching: true,
        skipIfFirst: true
      },
      // Baltic language handlers
      {
        field: "languages",
        pattern: /\b(?:YTS\.)?LT\b/i,
        validateMatch: validateNotMatch(/(?:YTS\.)/i),
        transform: toValueSet("lt"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\blithuanian\b/i,
        transform: toValueSet("lt"),
        keepMatching: true,
        skipIfFirst: true
      },
      {
        field: "languages",
        pattern: /\blatvian\b/i,
        transform: toValueSet("lv"),
        keepMatching: true,
        skipIfFirst: true
      },
      {
        field: "languages",
        pattern: /\bestonian\b/i,
        transform: toValueSet("et"),
        keepMatching: true,
        skipIfFirst: true
      },
      // Polish language handlers
      {
        field: "languages",
        pattern: /\b(?:PLDUB|Dub(?:bing.?)?PL|Lek(?:tor.?)?PL|Film.Polski)\b/i,
        transform: toValueSet("pl"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\b(?:Napisy.PL|PLSUB(?:BED)?)\b/i,
        transform: toValueSet("pl"),
        keepMatching: true,
        remove: true
      },
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.)?PL|pol)\b/i,
        validateMatch: validateNotMatch(/(?:w{3}\.\w+\.)/i),
        transform: toValueSet("pl"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(polish|polon[eê]s|polaco)\b/i,
        transform: toValueSet("pl"),
        keepMatching: true,
        skipIfFirst: true
      },
      // Czech/Slovak language handlers
      {
        field: "languages",
        pattern: /\bCZ[EH]?\b/i,
        transform: toValueSet("cs"),
        keepMatching: true,
        skipIfFirst: true
      },
      {
        field: "languages",
        pattern: /\bczech\b/i,
        transform: toValueSet("cs"),
        keepMatching: true,
        skipIfFirst: true
      },
      {
        field: "languages",
        pattern: /\bslo(?:vak|vakian|subs|[\]_)]?\.\w{2,4}$)\b/i,
        transform: toValueSet("sk"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Hungarian language handlers
      {
        field: "languages",
        pattern: /\bHU\b/i,
        transform: toValueSet("hu"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bHUN(?:garian)?\b/i,
        transform: toValueSet("hu"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Romanian language handlers
      {
        field: "languages",
        pattern: /\bROM(?:anian)?\b/i,
        transform: toValueSet("ro"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bRO(?:[ .,/-]*(?:[A-Z]{2}[ .,/-]+)*sub)/i,
        transform: toValueSet("ro"),
        keepMatching: true
      },
      // Bulgarian language handlers
      {
        field: "languages",
        pattern: /\bbul(?:garian)?\b/i,
        transform: toValueSet("bg"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bBGAUDIO\b/i,
        transform: toValueSet("bg"),
        keepMatching: true,
        remove: true,
        skipFromTitle: true
      },
      // Serbian/Croatian/Slovenian language handlers
      {
        field: "languages",
        pattern: /\b(?:srp|serbian)\b/i,
        transform: toValueSet("sr"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(?:HRV|croatian)\b/i,
        transform: toValueSet("hr"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bHR(?:[ .,/-]*(?:[A-Z]{2}[ .,/-]+)*sub\w*)\b/i,
        transform: toValueSet("hr"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bslovenian\b/i,
        transform: toValueSet("sl"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Dutch language handlers
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.)?NL|dut|holand[eê]s)\b/i,
        validateMatch: validateNotMatch(/(?:w{3}\.\w+\.)NL/i),
        transform: toValueSet("nl"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bdutch\b/i,
        transform: toValueSet("nl"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bflemish\b/i,
        transform: toValueSet("nl"),
        keepMatching: true
      },
      // Danish language handlers
      {
        field: "languages",
        pattern: /\b(?:DK|danska|dansub|nordic)\b/i,
        transform: toValueSet("da"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(danish|dinamarqu[eê]s)\b/i,
        transform: toValueSet("da"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bdan\b(?:.*\.(?:srt|vtt|ssa|ass|sub|idx)$)/i,
        transform: toValueSet("da"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Finnish language handlers
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.|Sci-)?FI|finsk|finsub|nordic)\b/i,
        validateMatch: validateNotMatch(/(?:w{3}\.\w+\.|Sci-)FI/i),
        transform: toValueSet("fi"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\bfinnish\b/i,
        transform: toValueSet("fi"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Swedish language handlers
      {
        field: "languages",
        pattern: /\b(?:(?:w{3}\.\w+\.)?SE|swe|swesubs?|sv(?:ensk)?|nordic)\b/i,
        validateMatch: validateNotMatch(/(?:w{3}\.\w+\.)SE/i),
        transform: toValueSet("sv"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(swedish|sueco)\b/i,
        transform: toValueSet("sv"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Norwegian language handlers
      {
        field: "languages",
        pattern: /\b(?:NOR|norsk|norsub|nordic)\b/i,
        transform: toValueSet("no"),
        keepMatching: true
      },
      {
        field: "languages",
        pattern: /\b(norwegian|noruegu[eê]s|bokm[aå]l|nob|nor(?:[\]_)]?\.\w{2,4}$))\b/i,
        transform: toValueSet("no"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Arabic language handlers
      {
        field: "languages",
        pattern: /\b(?:arabic|[aá]rabe|ara)\b/i,
        transform: toValueSet("ar"),
        keepMatching: true,
        skipIfFirst: true
      },
      {
        field: "languages",
        pattern: /\barab.*(?:audio|lang(?:uage)?|sub(?:s|titles?)?)\b/i,
        transform: toValueSet("ar"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\bar(?:\.(?:ass|ssa|srt|sub|idx)$)/i,
        transform: toValueSet("ar"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Turkish language handlers
      {
        field: "languages",
        pattern: /\b(?:turkish|tur(?:co)?)\b/i,
        transform: toValueSet("tr"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /\b(TİVİBU|tivibu|bitturk(?:\.net)?|turktorrent)\b/i,
        transform: toValueSet("tr"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Vietnamese language handlers
      {
        field: "languages",
        pattern: /\bvietnamese\b|\bvie(?:[\]_)]?\.\w{2,4}$)/i,
        transform: toValueSet("vi"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Indonesian language handlers
      {
        field: "languages",
        pattern: /\bind(?:onesian)?\b/i,
        transform: toValueSet("id"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Thai language handlers
      {
        field: "languages",
        pattern: /\b(thai|tailand[eê]s)\b/i,
        transform: toValueSet("th"),
        keepMatching: true,
        skipIfFirst: true
      },
      {
        field: "languages",
        pattern: /\b(THA|tha)\b/,
        transform: toValueSet("th"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Malay language handlers
      {
        field: "languages",
        pattern: /\b(?:malay|may(?:[\]_)]?\.\w{2,4}$)|(?:subs?\([a-z,]+)may)\b/i,
        transform: toValueSet("ms"),
        keepMatching: true
      },
      // Hebrew language handlers
      {
        field: "languages",
        pattern: /\bheb(?:rew|raico)?\b/i,
        transform: toValueSet("he"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Persian language handlers
      {
        field: "languages",
        pattern: /\b(persian|persa)\b/i,
        transform: toValueSet("fa"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Unicode spt detection for languages
      {
        field: "languages",
        pattern: /[\u3040-\u30ff]+/i,
        transform: toValueSet("ja"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u3400-\u4dbf]+/i,
        transform: toValueSet("zh"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u4e00-\u9fff]+/i,
        transform: toValueSet("zh"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\uf900-\ufaff]+/i,
        transform: toValueSet("zh"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\uff66-\uff9f]+/i,
        transform: toValueSet("ja"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u0400-\u04ff]+/i,
        transform: toValueSet("ru"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u0600-\u06ff]+/i,
        transform: toValueSet("ar"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u0750-\u077f]+/i,
        transform: toValueSet("ar"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u0c80-\u0cff]+/i,
        transform: toValueSet("kn"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u0d00-\u0d7f]+/i,
        transform: toValueSet("ml"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u0e00-\u0e7f]+/i,
        transform: toValueSet("th"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u0900-\u097f]+/i,
        transform: toValueSet("hi"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u0980-\u09ff]+/i,
        transform: toValueSet("bn"),
        keepMatching: true,
        skipFromTitle: true
      },
      {
        field: "languages",
        pattern: /[\u0a00-\u0a7f]+/i,
        transform: toValueSet("gu"),
        keepMatching: true,
        skipFromTitle: true
      },
      // Portuguese/Spanish episode detection
      {
        field: "languages",
        process: (title, m, result) => {
          const ere = /capitulo|ao/i;
          const tre = /dublado/i;
          m.mIndex = 0;
          m.mValue = "";
          const vs = m.value;
          if (vs && vs.exists && (vs.exists("pt") || vs.exists("es"))) {
            return m;
          }
          const em = result.get("episodes");
          if (em && em.mValue && ere.test(em.mValue) || tre.test(title)) {
            if (!vs || !vs.append) {
              const newVs = new ValueSet();
              m.value = newVs.append("pt");
            } else {
              m.value = vs.append("pt");
            }
          }
          return m;
        }
      },
      // Subbed handlers
      {
        field: "subbed",
        pattern: /\b(?:Official.*?|Dual-?)?sub(?:s|bed)?\b/i,
        transform: toBoolean(),
        remove: true,
        skipIfFirst: true
      },
      {
        field: "subbed",
        pattern: /\b(?:Official.*?|Dual-?)sub(?:s|bed)?\b/i,
        transform: toBoolean(),
        remove: true
      },
      {
        field: "subbed",
        process: (title, m, result) => {
          const lm = result.get("languages");
          if (!lm) {
            return m;
          }
          const s = lm.value;
          if (s && s.exists && s.exists("multi subs")) {
            m.value = true;
          }
          return m;
        }
      },
      // Dubbed handlers
      {
        field: "dubbed",
        pattern: /\b(?:fan\s?dub)\b/i,
        transform: toBoolean(),
        remove: true,
        skipFromTitle: true
      },
      {
        field: "dubbed",
        pattern: /\bMULTi\b/i,
        transform: toBoolean(),
        remove: true
      },
      {
        field: "dubbed",
        pattern: /\b(?:Fan.*)?(?:DUBBED|dublado|dubbing|DUBS?)\b/i,
        transform: toBoolean(),
        remove: true
      },
      {
        field: "dubbed",
        pattern: /\b(?:.*\bsub(?:s|bed)?\b)?(?:[ _\-\[(\.])?(dual|multi)(?:[ _\-\[(\.])?(?:audio)\b/i,
        validateMatch: validateNotMatch(/\b(?:.*\bsub(s|bed)?\b)/i),
        transform: toBoolean(),
        remove: true
      },
      {
        field: "dubbed",
        pattern: /\b(?:DUBBED|dublado|dubbing|DUBS?)\b/i,
        transform: toBoolean()
      },
      {
        field: "dubbed",
        process: (title, m, result) => {
          const lm = result.get("languages");
          if (!lm) {
            return m;
          }
          const s = lm.value;
          if (s && s.exists && (s.exists("multi audio") || s.exists("dual audio"))) {
            m.value = true;
          }
          return m;
        }
      },
      // Site handlers
      {
        field: "site",
        pattern: /\[eztv\]/i,
        transform: toValue("eztv.re"),
        remove: true,
        skipFromTitle: true
      },
      {
        field: "site",
        pattern: /\beztv\b/i,
        transform: toValue("eztv.re"),
        remove: true,
        skipFromTitle: true
      },
      {
        field: "site",
        pattern: /(\[([^\[\].]+\.[^\].]+)\])(?:\.\w{2,4}$|\s)/i,
        transform: toTrimmed(),
        remove: true,
        matchGroup: 1,
        valueGroup: 2
      },
      {
        field: "site",
        pattern: /[\[{(](www.\w*.\w+)[)}\]]/i,
        remove: true,
        skipFromTitle: true
      },
      {
        field: "site",
        pattern: /[[(【].*?((?:www?.?)?(?:\w+-)?\w+(?:[.\s](?:com|org|net|ms|tv|mx|co|party|vip|nu|pics))\b).*?[\])】]/i,
        matchGroup: 0,
        remove: true,
        skipFromTitle: true
      },
      {
        field: "site",
        pattern: /-(www\.[\w-]+\.[\w-]+(?:\.[\w-]+)*)\.(\w{2,4})$/i,
        transform: toTrimmed(),
        remove: true,
        skipFromTitle: true,
        matchGroup: 1
      },
      {
        field: "site",
        pattern: /\[([^\[\].]+\.[^\].]+)\](?:\.\w{2,4})?(?:$|\s)/i,
        transform: toTrimmed(),
        remove: true,
        skipFromTitle: true,
        matchGroup: 1
      },
      {
        field: "site",
        pattern: /[\[{(](www\.[\w-]+\.[\w-]+(?:\.[\w-]+)*)[)}\]]/i,
        transform: toTrimmed(),
        remove: true,
        skipFromTitle: true,
        matchGroup: 1
      },
      // Network handlers
      {
        field: "network",
        pattern: /\bATVP?\b/i,
        transform: toValue("Apple TV"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bAMZN\b/i,
        transform: toValue("Amazon"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bNF|Netflix\b/i,
        transform: toValue("Netflix"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bNICK(?:elodeon)?\b/i,
        transform: toValue("Nickelodeon"),
        remove: true,
        skipIfFirst: true
      },
      {
        field: "network",
        pattern: /\bDSNY?P?\b/i,
        transform: toValue("Disney"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bH(MAX|BO)\b/i,
        transform: toValue("HBO"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bSHOWTIME\b/i,
        transform: toValue("Showtime"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bitunes\b/i,
        transform: toValue("iTunes"),
        remove: true
      },
      {
        field: "network",
        pattern: /\biT\b/,
        transform: toValue("iTunes"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bHULU\b/i,
        transform: toValue("Hulu"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bCBS\b/i,
        transform: toValue("CBS"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bNBC\b/i,
        transform: toValue("NBC"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bAMC\b/i,
        transform: toValue("AMC"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bPBS\b/i,
        transform: toValue("PBS"),
        remove: true
      },
      {
        field: "network",
        pattern: /\b(Crunchyroll|CR)\b/i,
        transform: toValue("Crunchyroll"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bVICE\b/,
        transform: toValue("VICE"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bSony\b/i,
        transform: toValue("Sony"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bHallmark\b/i,
        transform: toValue("Hallmark"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bAdult.?Swim\b/i,
        transform: toValue("Adult Swim"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bAnimal.?Planet|ANPL\b/i,
        transform: toValue("Animal Planet"),
        remove: true
      },
      {
        field: "network",
        pattern: /\bCartoon.?Network(?:.TOONAMI.BROADCAST)?\b/i,
        transform: toValue("Cartoon Network"),
        remove: true
      },
      // Group handlers (final)
      {
        field: "group",
        pattern: /\b(INFLATE|DEFLATE)\b/,
        remove: true
      },
      {
        field: "group",
        pattern: /\b(?:Erai-raws|Erai-raws\.com)\b/i,
        transform: toValue("Erai-raws"),
        remove: true
      },
      {
        field: "group",
        pattern: /^\[([^\[\]]+)]/
      },
      {
        field: "group",
        pattern: /\(([\w-]+)\)(?:$|\.\w{2,4}$)/
      },
      {
        field: "group",
        process: (title, m, result) => {
          const re = /^\[.+]$/;
          if (m.mValue && re.test(m.mValue)) {
            const endIndex = m.mIndex + m.mValue.length;
            for (const [key, km] of result.entries()) {
              if (km.mIndex > 0 && km.mIndex < endIndex) {
                m.value = null;
                return m;
              }
            }
          }
          m.mIndex = 0;
          m.mValue = "";
          return m;
        }
      },
      // Extension handler
      {
        field: "extension",
        pattern: /\.(3g2|3gp|avi|flv|mkv|mk3d|mov|mp2|mp4|m4v|mpe|mpeg|mpg|mpv|webm|wmv|ogm|divx|ts|m2ts|iso|vob|sub|idx|ttxt|txt|smi|srt|ssa|ass|vtt|nfo|html)$/i,
        transform: toLowercase()
      },
      // Final MP3 audio handler
      {
        field: "audio",
        pattern: /\bMP3\b/i,
        transform: toValueSet("MP3"),
        remove: true,
        keepMatching: true
      }
    ];
  }
});

// ../zero_forge/node_modules/@viren070/parse-torrent-title/dist/index.js
var Parser;
var init_dist = __esm({
  "../zero_forge/node_modules/@viren070/parse-torrent-title/dist/index.js"() {
    "use strict";
    init_parser();
    init_handlers();
    init_transforms();
    init_processors();
    init_validators();
    init_handlers();
    Parser = class {
      constructor() {
        this.handlers = [];
      }
      /**
       * Add a custom handler to the parser
       * @param handler - The handler to add
       * @returns The parser instance for chaining
       */
      addHandler(handler) {
        if (!handler) {
          throw new Error("Handler cannot be undefined or null");
        }
        this.handlers.push(handler);
        return this;
      }
      /**
       * Add multiple custom handlers to the parser
       * @param handlers - Array of handlers to add
       * @returns The parser instance for chaining
       */
      addHandlers(handlers2) {
        if (!handlers2 || handlers2.length === 0) {
          throw new Error("Handlers array cannot be undefined, null, or empty");
        }
        if (handlers2.some((h) => h === null || h === void 0)) {
          throw new Error("Handlers array cannot contain null or undefined handlers");
        }
        this.handlers.push(...handlers2);
        return this;
      }
      /**
       * Add default handlers for specific fields
       * @param fields - Optional array of field names to include. If empty, all default handlers are added.
       * @returns The parser instance for chaining
       */
      addDefaultHandlers(...fields) {
        if (fields.length === 0) {
          this.handlers.push(...handlers);
        } else {
          const selectedFieldMap = new Set(fields);
          const selectedHandlers = handlers.filter((h) => selectedFieldMap.has(h.field));
          this.handlers.push(...selectedHandlers);
        }
        return this;
      }
      /**
       * Parse a torrent title using the configured handlers
       * @param title - The torrent title to parse
       * @returns Parsed result with extracted metadata and any custom fields
       * @template T - Optional type for custom fields added by custom handlers
       *
       * @example
       * // Without custom fields
       * const result = parser.parse('Movie.2024.1080p');
       *
       * @example
       * // With typed custom fields
       * const result = parser.parse<{ customId: number[] }>('Movie.2024.custom-123.1080p');
       * console.log(result.customId); // Type-safe access
       */
      parse(title) {
        return parse(title, this.handlers);
      }
    };
  }
});

// ../zero_forge/src/parser.ts
var parser_exports = {};
__export(parser_exports, {
  parseCandidate: () => parseCandidate,
  parseReleaseName: () => parseReleaseName,
  parseSeasonEpisode: () => parseSeasonEpisode,
  parseSeasonEpisodeLib: () => parseSeasonEpisodeLib,
  parseSeeders: () => parseSeeders,
  parseSizeBytes: () => parseSizeBytes
});
function uniqueSortedInts(xs) {
  return Array.from(new Set(xs.filter((n) => Number.isFinite(n) && n > 0))).sort((a, b) => a - b);
}
function parseSeasonEpisodeLib(rawTitle) {
  const p = parseReleaseName(rawTitle);
  return { seasons: p.seasons, episodes: p.episodes, seasonPack: p.seasonPack };
}
function parseSeasonEpisode(rawTitle) {
  const usefulLines = (rawTitle ?? "").split(/[\r\n]/).filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (/^(?:size|seed(?:ers?)?|peers?):/i.test(trimmed)) return false;
    if (/^[\p{Extended_Pictographic}]/u.test(trimmed)) return false;
    return true;
  });
  if (usefulLines.length === 0) {
    return { seasons: [], episodes: [], seasonPack: false };
  }
  const seasons = [];
  const episodes = [];
  for (const title of usefulLines) {
    for (const m of title.matchAll(/\bS(\d{1,3})((?:[ ._-]?E\d{1,3})+(?:[ ._-]?-[ ._-]?E?\d{1,3})?)/gi)) {
      seasons.push(parseInt(m[1], 10));
      const epPart = m[2] ?? "";
      const eps = [];
      for (const em of epPart.matchAll(/E?(\d{1,3})/gi)) {
        const n = parseInt(em[1], 10);
        if (!Number.isNaN(n)) eps.push(n);
      }
      const rangeMatch = epPart.match(/E?(\d{1,3})[ ._-]?-[ ._-]?E?(\d{1,3})/i);
      if (rangeMatch) {
        const a = parseInt(rangeMatch[1], 10);
        const b = parseInt(rangeMatch[2], 10);
        if (Number.isFinite(a) && Number.isFinite(b) && a <= b && b - a <= 30) {
          for (let v = a; v <= b; v++) eps.push(v);
        }
      }
      episodes.push(...eps);
    }
    for (const m of title.matchAll(/\bS(\d{1,2})[ ._-]?-[ ._-]?S?(\d{1,2})\b/gi)) {
      const a = parseInt(m[1], 10);
      const b = parseInt(m[2], 10);
      if (a <= b && b - a <= 20) for (let v = a; v <= b; v++) seasons.push(v);
    }
    {
      const re = new RegExp(`\\b${SEASON_WORD}s?[ ._:-]?(\\d{1,2})[ ._-]?(?:-|to|\u2013)[ ._-]?(\\d{1,2})\\b`, "giu");
      for (const m of title.matchAll(re)) {
        const a = parseInt(m[1], 10);
        const b = parseInt(m[2], 10);
        if (a <= b && b - a <= 20) for (let v = a; v <= b; v++) seasons.push(v);
      }
    }
    for (const m of title.matchAll(/\b(?:season|s)[ ._-]?(\d{1,2})\b(?!\d)(?!.*?E\d)/gi)) {
      seasons.push(parseInt(m[1], 10));
    }
    {
      const re = new RegExp(`\\b${SEASON_WORD}s?[ ._:-]?(\\d{1,2})\\b`, "giu");
      for (const m of title.matchAll(re)) {
        seasons.push(parseInt(m[1], 10));
      }
    }
    for (const m of title.matchAll(/\b(\d{1,2})x(\d{1,3})\b/gi)) {
      seasons.push(parseInt(m[1], 10));
      episodes.push(parseInt(m[2], 10));
    }
    {
      const re = new RegExp(`\\b${EPISODE_WORD}s?[ ._:-]?(\\d{1,3})(?:[ ._-]?(?:-|to|\u2013|\u0438\u0437|of)[ ._-]?(\\d{1,3}))?`, "giu");
      for (const m of title.matchAll(re)) {
        const a = parseInt(m[1], 10);
        const b = m[2] ? parseInt(m[2], 10) : null;
        if (b != null && Number.isFinite(a) && Number.isFinite(b) && a <= b && b - a <= 50) {
          for (let v = a; v <= b; v++) episodes.push(v);
        } else if (Number.isFinite(a)) {
          episodes.push(a);
        }
      }
    }
    if (seasons.length === 0) {
      for (const m of title.matchAll(/\bE(?:p|pisode)?[ ._-]?(\d{1,3})\b/gi)) {
        episodes.push(parseInt(m[1], 10));
      }
    }
    if (seasons.length === 0 && episodes.length === 0) {
      const abs = title.match(/(?:^|[\s\]])-\s(\d{1,3})(?=[\s\[(.]|$)/);
      if (abs) {
        const n = parseInt(abs[1], 10);
        if (Number.isFinite(n) && n >= 1 && n <= 999) episodes.push(n);
      }
    }
  }
  const uniqSeasons = uniqueSortedInts(seasons);
  const uniqEpisodes = uniqueSortedInts(episodes);
  const completeHint = /\b(?:complete|completa|completo|complet|komplett|полная|полный|complète)\b/iu.test(usefulLines.join(" "));
  const seasonPack = uniqSeasons.length > 0 && uniqEpisodes.length === 0 || uniqEpisodes.length > 5 || uniqSeasons.length > 1 || completeHint && uniqEpisodes.length === 0;
  return { seasons: uniqSeasons, episodes: uniqEpisodes, seasonPack };
}
function mapResolution(raw) {
  if (!raw) return "unknown";
  const v = raw.toLowerCase();
  if (v === "4k" || v === "2160p" || v === "uhd") return "2160p";
  if (v === "1080p" || v === "fhd") return "1080p";
  if (v === "720p" || v === "hd") return "720p";
  if (v === "480p" || v === "576p" || v === "sd") return "480p";
  return "unknown";
}
function mapCodec(raw) {
  if (!raw) return null;
  const v = raw.toLowerCase();
  if (v === "hevc" || v === "h265" || v === "x265") return "h265";
  if (v === "avc" || v === "h264" || v === "x264") return "h264";
  if (v === "av1") return "av1";
  if (v === "vp9") return "vp9";
  if (v === "mpeg2" || v === "mpeg-2") return "mpeg2";
  return null;
}
function mapSourceTag(raw) {
  if (!raw) return null;
  const v = raw.toLowerCase();
  if (/\bremux\b/.test(v)) return "Remux";
  if (/\bblu-?ray\b|\bbdrip\b|\bbrrip\b|\bbd\b/.test(v)) return "BluRay";
  if (/\bweb[-. ]?dl\b/.test(v)) return "WEB-DL";
  if (/\bweb[-. ]?rip\b/.test(v)) return "WEBRip";
  if (/\bhdtv\b/.test(v)) return "HDTV";
  if (/\bdvdrip\b|\bdvd\b/.test(v)) return "DVDRip";
  if (/\bcam\b|\bhdcam\b|\bcamrip\b/.test(v)) return "CAM";
  if (/\bts\b|\btelesync\b|\bhdts\b/.test(v)) return "TS";
  return null;
}
function mapAudioCodec(raw) {
  if (!raw) return null;
  const v = raw.toLowerCase();
  if (v === "truehd" || v === "atmos") return "truehd";
  if (v === "dtshd" || v === "dts-hd" || v === "dts hd ma") return "dts-hd";
  if (v === "dts") return "dts";
  if (v === "eac3" || v === "ddp" || v === "dd+" || v === "e-ac3" || v === "eac-3") return "eac3";
  if (v === "ac3" || v === "dd" || v === "dolby digital") return "ac3";
  if (v === "flac") return "flac";
  if (v === "aac") return "aac";
  if (v === "opus") return "opus";
  if (v === "mp3") return "mp3";
  return null;
}
function mapHdrFlags(hdr) {
  if (!hdr || hdr.length === 0) return 0;
  let flags = 0;
  for (const v of hdr) {
    const k = v.toLowerCase();
    if (k.includes("hdr10+")) flags |= HDR_FLAG_HDR10_PLUS;
    else if (k.includes("hdr")) flags |= HDR_FLAG_HDR10;
    if (k === "dv" || k.includes("dolby vision") || k.includes("dovi")) flags |= HDR_FLAG_DV;
    if (k === "hlg") flags |= HDR_FLAG_HLG;
  }
  return flags;
}
function parseReleaseName(rawTitle) {
  const lines = (rawTitle ?? "").split(/[\r\n]/).filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (/^(?:size|seed(?:ers?)?|peers?):/i.test(trimmed)) return false;
    if (/^[\p{Extended_Pictographic}]/u.test(trimmed)) return false;
    return true;
  });
  const merged = {};
  for (const line of lines) {
    const r = ptt.parse(line);
    if (!merged.title && r.title) merged.title = r.title;
    if (!merged.year && r.year) merged.year = r.year;
    if (!merged.resolution && r.resolution) merged.resolution = r.resolution;
    if (!merged.codec && r.codec) merged.codec = r.codec;
    if (!merged.quality && (r.quality || r.source)) merged.quality = r.quality ?? r.source;
    if (!merged.group && (r.group || r.encoder)) merged.group = r.group ?? r.encoder;
    if (!merged.hdr && r.hdr) merged.hdr = r.hdr;
    if (!merged.audio && r.audio) merged.audio = r.audio;
    if (!merged.audiochannels && (r.audiochannels || r.channels)) merged.audiochannels = r.audiochannels ?? r.channels;
    if (!merged.languages && (r.languages || r.language)) {
      merged.languages = r.languages ?? (r.language ? [r.language] : void 0);
    }
    if (r.seasons?.length) merged.seasons = [...merged.seasons ?? [], ...r.seasons];
    if (r.episodes?.length) merged.episodes = [...merged.episodes ?? [], ...r.episodes];
    if (r.complete) merged.complete = true;
    if (r.editions?.length) merged.editions = [...merged.editions ?? [], ...r.editions];
    if (r.extended) merged.editions = [...merged.editions ?? [], "Extended"];
  }
  const uniqSeasons = uniqueSortedInts(merged.seasons ?? []);
  const uniqEpisodes = uniqueSortedInts(merged.episodes ?? []);
  const seasonPack = !!merged.complete || uniqSeasons.length > 0 && uniqEpisodes.length === 0 || uniqEpisodes.length > 5 || uniqSeasons.length > 1;
  const audioList = (merged.audio ?? []).map((a) => a.toLowerCase());
  const audioCodec = mapAudioCodec(audioList.find((a) => a === "truehd" || a === "atmos")) ?? mapAudioCodec(audioList.find((a) => a === "dts-hd" || a === "dtshd")) ?? mapAudioCodec(audioList.find((a) => a === "dts")) ?? mapAudioCodec(audioList.find((a) => a === "eac3" || a === "ddp")) ?? mapAudioCodec(audioList.find((a) => a === "ac3" || a === "dd")) ?? mapAudioCodec(audioList[0]);
  let audioChannels = merged.audiochannels?.[0] ?? merged.channels?.[0] ?? null;
  if (!audioChannels && audioList.includes("atmos")) audioChannels = "Atmos";
  if (audioChannels === "atmos") audioChannels = "Atmos";
  let sourceTag = mapSourceTag(merged.quality ?? merged.source);
  if (sourceTag === "BluRay" && /\bremux\b/i.test(rawTitle ?? "")) {
    sourceTag = "Remux";
  }
  const langs = (merged.languages ?? []).map((l) => {
    const k = l.toLowerCase().trim();
    if (k === "multi audio" || k === "multi-audio") return "multi";
    if (k === "dual audio" || k === "dual-audio") return "dual";
    return k;
  });
  const cleanTitle2 = merged.title?.replace(/[._]+/g, " ").replace(/\s+/g, " ").trim() || null;
  const parsedYearNum = merged.year ? parseInt(merged.year, 10) : NaN;
  const parsedYear = Number.isFinite(parsedYearNum) ? parsedYearNum : null;
  const editions = Array.from(new Set(merged.editions ?? []));
  return {
    releaseGroup: merged.group ?? null,
    resolution: mapResolution(merged.resolution),
    codec: mapCodec(merged.codec),
    hdrFlags: mapHdrFlags(merged.hdr),
    audioCodec,
    audioChannels,
    languages: Array.from(new Set(langs)),
    sourceTag,
    parsedTitle: cleanTitle2,
    parsedYear,
    editions,
    seasons: uniqSeasons,
    episodes: uniqEpisodes,
    seasonPack
  };
}
function parseCandidate(candidate) {
  const parsed = parseReleaseName(candidate.rawTitle);
  return {
    ...candidate,
    ...parsed
  };
}
function parseSizeBytes(text) {
  if (!text) return null;
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*(b|kb|mb|gb|tb|kib|mib|gib|tib)\b/i);
  if (!match) return null;
  const value = parseFloat(match[1].replace(",", "."));
  if (Number.isNaN(value)) return null;
  const unit = match[2].toLowerCase();
  const multipliers = {
    b: 1,
    kb: 1024,
    kib: 1024,
    mb: 1024 ** 2,
    mib: 1024 ** 2,
    gb: 1024 ** 3,
    gib: 1024 ** 3,
    tb: 1024 ** 4,
    tib: 1024 ** 4
  };
  const mult = multipliers[unit];
  if (!mult) return null;
  return Math.round(value * mult);
}
function parseSeeders(text) {
  if (!text) return null;
  const labeled = text.match(/(?:seed(?:ers?)?|👥|👤|⬆)\s*[:=]?\s*(\d+)/i);
  if (labeled) return parseInt(labeled[1], 10);
  return null;
}
var ptt, SEASON_WORD, EPISODE_WORD;
var init_parser2 = __esm({
  "../zero_forge/src/parser.ts"() {
    "use strict";
    init_dist();
    init_types2();
    ptt = new Parser().addHandlers(handlers);
    SEASON_WORD = "(?:season|\u0441\u0435\u0437\u043E\u043D|temporada|stagione|sezon|saison|staffel)";
    EPISODE_WORD = "(?:episode|episodio|epis\xF3dio|\u0441\u0435\u0440\u0438\u0438|\u0441\u0435\u0440\u0438\u044F|odcinek|folge|\xE9pisode|cap\xEDtulo|capitulo)";
  }
});

// ../zero_forge/src/sources/base.ts
import { createHash } from "node:crypto";
function candidateId(sourceId, sourceLocalKey) {
  return createHash("md5").update(`${sourceId}:${sourceLocalKey}`).digest("hex");
}
function redactUrl(url) {
  let out = url.replace(SECRET_PARAM_RE, "$1\u2022\u2022\u2022");
  out = out.replace(/\/([A-Za-z0-9]{20,})(?=\/|$)/g, "/\u2022\u2022\u2022");
  return out;
}
function hostLabel(url, label) {
  if (label) return label;
  try {
    return new URL(url).host;
  } catch {
    return "source";
  }
}
function describeFetchFailure(err) {
  if (err instanceof Error) {
    if (err.name === "AbortError" || err.name === "TimeoutError") return "timed out / aborted";
    const cause = err.cause;
    return cause?.code || cause?.message || err.message || err.name;
  }
  return String(err);
}
function readSourceConfig(row, fallback) {
  if (!row.config_json) return fallback;
  try {
    const parsed = JSON.parse(row.config_json);
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}
async function loggedFetch(url, opts) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), opts.timeoutMs ?? 2e4);
  if (opts.signal) {
    if (opts.signal.aborted) ac.abort();
    else opts.signal.addEventListener("abort", () => ac.abort(), { once: true });
  }
  const label = hostLabel(url, opts.label);
  try {
    const res = await fetch(url, { signal: ac.signal, headers: opts.headers });
    if (!res.ok) {
      const body = (await res.text().catch(() => "")).slice(0, 200).replace(/\s+/g, " ").trim();
      logger2.warn(
        "streams",
        `Indexer ${label} \u2192 HTTP ${res.status} ${res.statusText} on ${redactUrl(url)}` + (body ? ` \xB7 ${body}` : "")
      );
      return null;
    }
    return await res.text();
  } catch (err) {
    logger2.warn("streams", `Indexer ${label} request failed (${describeFetchFailure(err)}) on ${redactUrl(url)}`);
    return null;
  } finally {
    clearTimeout(t);
  }
}
async function fetchJson(url, opts = {}) {
  const text = await loggedFetch(url, opts);
  if (text == null) return null;
  try {
    return JSON.parse(text);
  } catch {
    logger2.warn(
      "streams",
      `Indexer ${hostLabel(url, opts.label)} returned non-JSON on ${redactUrl(url)} \xB7 ${text.slice(0, 160).replace(/\s+/g, " ").trim()}`
    );
    return null;
  }
}
async function fetchText(url, opts = {}) {
  return loggedFetch(url, opts);
}
var SECRET_PARAM_RE;
var init_base = __esm({
  "../zero_forge/src/sources/base.ts"() {
    "use strict";
    init_log2();
    SECRET_PARAM_RE = /([?&](?:apikey|api_key|apitoken|token|auth_token|passkey|password|pass|key|secret)=)[^&#]*/gi;
  }
});

// ../zero_forge/src/resolvers/base.ts
var base_exports = {};
__export(base_exports, {
  fetchAuthed: () => fetchAuthed,
  host: () => host,
  magnetFromHash: () => magnetFromHash,
  pickFileForEpisode: () => pickFileForEpisode
});
async function fetchAuthed(url, apiKey, opts = {}) {
  const scheme = opts.headerScheme ?? "bearer";
  const headers = { ...opts.headers ?? {} };
  let finalUrl = url;
  if (scheme === "bearer") headers.Authorization = `Bearer ${apiKey}`;
  else if (scheme === "x-api-key") headers["X-API-KEY"] = apiKey;
  else if (scheme === "raw") headers.Authorization = apiKey;
  else if (scheme === "query") {
    const sep = url.includes("?") ? "&" : "?";
    finalUrl = `${url}${sep}${opts.queryKeyName ?? "auth_token"}=${encodeURIComponent(apiKey)}`;
  }
  const method = opts.method ?? "GET";
  let label = opts.label;
  if (!label) {
    try {
      label = new URL(url).host;
    } catch {
      label = "debrid";
    }
  }
  const safeUrl = redactUrl(finalUrl).replace(
    new RegExp(`([?&]${opts.queryKeyName ?? "auth_token"}=)[^&#]*`, "i"),
    "$1\u2022\u2022\u2022"
  ).replace(/(?:•••\/){3,}•••/g, "\u2022\u2022\u2022(batch)");
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), opts.timeoutMs ?? 3e4);
  if (opts.signal) {
    if (opts.signal.aborted) ac.abort();
    else opts.signal.addEventListener("abort", () => ac.abort(), { once: true });
  }
  try {
    const res = await fetch(finalUrl, {
      method,
      headers,
      body: opts.body,
      signal: ac.signal
    });
    if (!res.ok) {
      const body = (await res.text().catch(() => "")).slice(0, 200).replace(/\s+/g, " ").trim();
      const disabledEndpoint = res.status === 403 && /disabled_endpoint|"error_code"\s*:\s*37/i.test(body);
      const hint = disabledEndpoint ? " \u2014 endpoint retired by the provider (not a key issue)" : res.status === 401 || res.status === 403 ? " \u2014 check the API key" : res.status === 429 ? " \u2014 rate limited" : "";
      logger2.warn(
        "streams",
        `Debrid ${label} \u2192 HTTP ${res.status} ${res.statusText}${hint} on ${method} ${safeUrl}` + (body ? ` \xB7 ${body}` : "")
      );
      return null;
    }
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      logger2.warn("streams", `Debrid ${label} returned non-JSON on ${method} ${safeUrl} \xB7 ${text.slice(0, 160).replace(/\s+/g, " ").trim()}`);
      return null;
    }
  } catch (err) {
    logger2.warn("streams", `Debrid ${label} request failed (${describeFetchFailure(err)}) on ${method} ${safeUrl}`);
    return null;
  } finally {
    clearTimeout(t);
  }
}
function host(row, fallback) {
  return (row.host || fallback).replace(/\/$/, "");
}
function magnetFromHash(infoHash) {
  return `magnet:?xt=urn:btih:${infoHash}`;
}
function pickFileForEpisode(files, hint) {
  if (!files.length) return null;
  const videos = files.filter((f) => {
    if (NON_VIDEO_EXT.test(f.name)) return false;
    if (VIDEO_EXT.test(f.name)) return true;
    return f.size >= 50 * 1024 * 1024;
  });
  if (!videos.length) {
    return [...files].sort((a, b) => b.size - a.size)[0] ?? null;
  }
  if (hint?.episode || hint?.season) {
    const matches = videos.map((f) => ({ f, p: parseSeasonEpisodeLib(f.name) })).filter(({ p }) => {
      if (hint.season && p.seasons.length > 0 && !p.seasons.includes(hint.season)) return false;
      if (hint.episode && !p.episodes.includes(hint.episode)) return false;
      return true;
    }).sort((a, b) => b.f.size - a.f.size);
    if (matches.length > 0) return matches[0].f;
  }
  return [...videos].sort((a, b) => b.size - a.size)[0] ?? null;
}
var VIDEO_EXT, NON_VIDEO_EXT;
var init_base2 = __esm({
  "../zero_forge/src/resolvers/base.ts"() {
    "use strict";
    init_log2();
    init_base();
    init_parser2();
    VIDEO_EXT = /\.(mkv|mp4|avi|m4v|ts|webm|mov|m2ts)$/i;
    NON_VIDEO_EXT = /\.(srt|vtt|ass|ssa|sub|idx|nfo|txt|jpg|jpeg|png|gif|html|sfv|md5|pdf|exe)$/i;
  }
});

// ../zero_forge/src/resolvers/alldebrid.ts
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
var AD_HOST, AllDebridResolver;
var init_alldebrid = __esm({
  "../zero_forge/src/resolvers/alldebrid.ts"() {
    "use strict";
    init_base2();
    AD_HOST = "https://api.alldebrid.com/v4";
    AllDebridResolver = class {
      constructor(row) {
        this.row = row;
        this.provider = "alldebrid";
        this.accepts = ["torrent"];
        this.apiKey = row.api_key ?? "";
      }
      async checkAvailability(candidates, signal) {
        const out = /* @__PURE__ */ new Map();
        if (!this.apiKey) return out;
        const hashes = candidates.filter((c) => c.infoHash);
        if (hashes.length === 0) return out;
        const BATCH = 50;
        for (let i = 0; i < hashes.length; i += BATCH) {
          const slice = hashes.slice(i, i + BATCH);
          const params = new URLSearchParams();
          params.set("agent", "zero");
          for (const c of slice) params.append("magnets[]", c.infoHash);
          const data = await fetchAuthed(
            `${AD_HOST}/magnet/instant?${params.toString()}`,
            this.apiKey,
            { headerScheme: "query", queryKeyName: "apikey", signal }
          );
          const byHash = /* @__PURE__ */ new Map();
          for (const m of data?.data?.magnets ?? []) {
            if (m.hash) byHash.set(m.hash.toLowerCase(), m.instant === true);
          }
          for (const c of slice) out.set(c.id, byHash.get(c.infoHash) ?? false);
        }
        return out;
      }
      async resolve(candidate, signal, hint) {
        if (!this.apiKey || !candidate.infoHash) return null;
        const uploadBody = new URLSearchParams();
        uploadBody.set("agent", "zero");
        uploadBody.append("magnets[]", magnetFromHash(candidate.infoHash));
        const uploaded = await fetchAuthed(
          `${AD_HOST}/magnet/upload?apikey=${encodeURIComponent(this.apiKey)}`,
          this.apiKey,
          {
            method: "POST",
            headerScheme: "raw",
            // already in URL
            body: uploadBody,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            signal
          }
        );
        const mag = uploaded?.data?.magnets?.[0];
        if (!mag?.id) return null;
        for (let attempt = 0; attempt < 3; attempt++) {
          const status2 = await fetchAuthed(
            `${AD_HOST}/magnet/status?id=${mag.id}&apikey=${encodeURIComponent(this.apiKey)}`,
            this.apiKey,
            { headerScheme: "raw", signal }
          );
          const m = status2?.data?.magnets;
          if (m?.links?.length) {
            const { pickFileForEpisode: pickFileForEpisode2 } = await Promise.resolve().then(() => (init_base2(), base_exports));
            const pickable = m.links.map((l, i) => ({ id: i, name: l.filename, size: l.size }));
            const chosen = pickFileForEpisode2(pickable, hint) ?? pickable[0];
            const link = m.links[chosen.id];
            if (!link) return null;
            const unlocked = await fetchAuthed(
              `${AD_HOST}/link/unlock?link=${encodeURIComponent(link.link)}&apikey=${encodeURIComponent(this.apiKey)}`,
              this.apiKey,
              { headerScheme: "raw", signal }
            );
            return unlocked?.data?.link ?? link.link;
          }
          await sleep(2e3);
        }
        return null;
      }
    };
  }
});

// ../zero_forge/src/resolvers/nzbdav.ts
function parseConfig(raw) {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function pickCategory(hint, c) {
  if (hint?.season != null || hint?.episode != null) return "TV";
  const title = (c.rawTitle || c.description || "").toLowerCase();
  return /s\d{2}e\d{2}|season|episode/.test(title) ? "TV" : "Movies";
}
function sanitiseJobLabel(s) {
  const cleaned = s.replace(/[\u0000-\u001F\u007F]+/g, " ").replace(/[^\x20-\x7E]/g, "").replace(/[/\\]/g, "_").replace(/\s+/g, " ").trim().slice(0, 240);
  return cleaned || "zero-nzb";
}
function basename(p) {
  const parts = p.replace(/\\/g, "/").split("/").filter(Boolean);
  return parts[parts.length - 1] ?? p;
}
function encodeSegment(s) {
  return s.split("/").map((p) => encodeURIComponent(p)).join("/");
}
function basicAuthHeader(user, pass) {
  if (!user || !pass) return null;
  return `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
}
function embedBasicAuth(url, user, pass) {
  if (!user || !pass) return url;
  return url.replace(/^(https?:\/\/)/i, (m) => `${m}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@`);
}
async function sleep2(ms, signal) {
  await new Promise((resolve) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      resolve();
    }, { once: true });
  });
}
function parsePropfindFiles(xml, baseUrl) {
  const stripped = xml.replace(/<\/?[a-z0-9]+:/gi, (m2) => m2.replace(/[a-z0-9]+:/i, ""));
  const items = [];
  const responseRe = /<response>([\s\S]*?)<\/response>/gi;
  let m;
  const baseHrefPath = (() => {
    try {
      return new URL(baseUrl).pathname.replace(/\/$/, "");
    } catch {
      return "";
    }
  })();
  while ((m = responseRe.exec(stripped)) !== null) {
    const block = m[1];
    const href = /<href>([\s\S]*?)<\/href>/i.exec(block)?.[1]?.trim();
    if (!href) continue;
    const isCollection = /<resourcetype>[\s\S]*?<collection\s*\/?>[\s\S]*?<\/resourcetype>/i.test(block);
    if (isCollection) continue;
    const lengthStr = /<getcontentlength>([\s\S]*?)<\/getcontentlength>/i.exec(block)?.[1]?.trim();
    const size = lengthStr ? parseInt(lengthStr, 10) || 0 : 0;
    let hrefPath;
    try {
      hrefPath = new URL(href, baseUrl).pathname;
    } catch {
      hrefPath = href;
    }
    if (baseHrefPath && hrefPath.startsWith(baseHrefPath)) {
      hrefPath = hrefPath.slice(baseHrefPath.length);
    }
    const name = decodeURIComponent(basename(hrefPath));
    if (!name) continue;
    if (!VIDEO_EXT2.test(name) && size < 50 * 1024 * 1024) continue;
    items.push({ name, size });
  }
  return items;
}
var DEFAULT_POLL_MS, DEFAULT_MAX_WAIT_MS, DEFAULT_CONTENT_PREFIX, NzbDavResolver, VIDEO_EXT2;
var init_nzbdav = __esm({
  "../zero_forge/src/resolvers/nzbdav.ts"() {
    "use strict";
    init_log2();
    init_base2();
    init_base();
    DEFAULT_POLL_MS = 2e3;
    DEFAULT_MAX_WAIT_MS = 9e4;
    DEFAULT_CONTENT_PREFIX = "/content";
    NzbDavResolver = class {
      constructor(row) {
        this.provider = "nzbdav";
        this.accepts = ["usenet"];
        this.host = (row.host ?? "").replace(/\/$/, "");
        this.apiKey = row.api_key ?? "";
        const cfg = parseConfig(row.config_json);
        this.publicHost = (cfg.publicHost ?? this.host).replace(/\/$/, "");
        this.webdavUser = cfg.webdavUser;
        this.webdavPassword = cfg.webdavPassword;
        this.pollIntervalMs = cfg.pollIntervalMs ?? DEFAULT_POLL_MS;
        this.maxWaitMs = cfg.maxWaitMs ?? DEFAULT_MAX_WAIT_MS;
        this.contentPathPrefix = cfg.contentPathPrefix ?? DEFAULT_CONTENT_PREFIX;
      }
      async checkAvailability(candidates, _signal) {
        const out = /* @__PURE__ */ new Map();
        for (const c of candidates) if (c.nzbId) out.set(c.id, true);
        return out;
      }
      async resolve(candidate, signal, hint) {
        if (!this.host || !candidate.nzbId) return null;
        const category = pickCategory(hint, candidate);
        const jobLabel = sanitiseJobLabel(candidate.rawTitle || candidate.description || candidate.id);
        const added = await this.sabRequest({
          mode: "addurl",
          name: candidate.nzbId,
          cat: category,
          nzbname: jobLabel,
          output: "json"
        }, signal);
        if (!added?.status || !added.nzo_ids?.length) return null;
        const nzoId = added.nzo_ids[0];
        const slot = await this.waitForCompletion(nzoId, signal);
        if (!slot) return null;
        const folderName = basename(slot.storage ?? slot.name ?? jobLabel);
        const jobCategory = slot.category ?? category;
        const folderUrl = `${this.host}${this.contentPathPrefix}/${encodeSegment(jobCategory)}/${encodeSegment(folderName)}`;
        const files = await this.listWebdavFiles(folderUrl, signal);
        if (!files.length) return null;
        const chosen = pickFileForEpisode(
          files.map((f, i) => ({ id: i, name: f.name, size: f.size })),
          hint
        );
        if (!chosen) return null;
        const chosenFile = files[chosen.id];
        const publicFolder = `${this.publicHost}${this.contentPathPrefix}/${encodeSegment(jobCategory)}/${encodeSegment(folderName)}`;
        return embedBasicAuth(`${publicFolder}/${encodeSegment(chosenFile.name)}`, this.webdavUser, this.webdavPassword);
      }
      async sabRequest(params, signal) {
        const sp = new URLSearchParams({ ...params, apikey: this.apiKey });
        const url = `${this.host}${this.sabApiPath()}?${sp.toString()}`;
        try {
          const res = await fetch(url, {
            headers: { "x-api-key": this.apiKey },
            signal
          });
          if (!res.ok) {
            const body = (await res.text().catch(() => "")).slice(0, 200).replace(/\s+/g, " ").trim();
            const hint = res.status === 401 || res.status === 403 ? " \u2014 check the API key" : "";
            logger2.warn(
              "streams",
              `Usenet ${this.host} (SABnzbd mode=${params.mode ?? "?"}) \u2192 HTTP ${res.status} ${res.statusText}${hint} on ${redactUrl(url)}` + (body ? ` \xB7 ${body}` : "")
            );
            return null;
          }
          return await res.json();
        } catch (err) {
          logger2.warn("streams", `Usenet ${this.host} (SABnzbd mode=${params.mode ?? "?"}) request failed (${describeFetchFailure(err)})`);
          return null;
        }
      }
      /** Override point so AltMount can swap to its own API path. */
      sabApiPath() {
        return "/api";
      }
      async waitForCompletion(nzoId, signal) {
        const deadline = Date.now() + this.maxWaitMs;
        while (Date.now() < deadline) {
          if (signal?.aborted) return null;
          const history = await this.sabRequest({
            mode: "history",
            nzo_ids: nzoId,
            output: "json"
          }, signal);
          const slot = history?.history?.slots?.find((s) => s.nzo_id === nzoId);
          if (slot?.status?.toLowerCase() === "completed") return slot;
          if (slot?.status?.toLowerCase() === "failed") return null;
          await sleep2(this.pollIntervalMs, signal);
        }
        return null;
      }
      async listWebdavFiles(folderUrl, signal) {
        const headers = {
          Depth: "infinity",
          "Content-Type": "application/xml"
        };
        const basic = basicAuthHeader(this.webdavUser, this.webdavPassword);
        if (basic) headers.Authorization = basic;
        try {
          const res = await fetch(folderUrl, { method: "PROPFIND", headers, signal });
          if (!res.ok) {
            logger2.warn("streams", `Usenet ${this.host} WebDAV PROPFIND \u2192 HTTP ${res.status} ${res.statusText} on ${redactUrl(folderUrl)}`);
            return [];
          }
          const xml = await res.text();
          return parsePropfindFiles(xml, folderUrl);
        } catch (err) {
          logger2.warn("streams", `Usenet ${this.host} WebDAV PROPFIND failed (${describeFetchFailure(err)}) on ${redactUrl(folderUrl)}`);
          return [];
        }
      }
    };
    VIDEO_EXT2 = /\.(mkv|mp4|avi|m4v|ts|webm|mov|m2ts)$/i;
  }
});

// ../zero_forge/src/resolvers/altmount.ts
var AltMountResolver;
var init_altmount = __esm({
  "../zero_forge/src/resolvers/altmount.ts"() {
    "use strict";
    init_nzbdav();
    AltMountResolver = class extends NzbDavResolver {
      constructor(row) {
        let cfg = {};
        try {
          cfg = JSON.parse(row.config_json || "{}");
        } catch {
        }
        if (cfg.contentPathPrefix == null) cfg.contentPathPrefix = "/webdav";
        super({ ...row, config_json: JSON.stringify(cfg) });
        this.provider = "altmount";
      }
      sabApiPath() {
        return "/sabnzbd/api";
      }
    };
  }
});

// ../zero_forge/src/resolvers/debridlink.ts
var DL_HOST, DebridLinkResolver;
var init_debridlink = __esm({
  "../zero_forge/src/resolvers/debridlink.ts"() {
    "use strict";
    init_base2();
    DL_HOST = "https://debrid-link.com/api/v2";
    DebridLinkResolver = class {
      constructor(row) {
        this.row = row;
        this.provider = "debridlink";
        this.accepts = ["torrent"];
        this.apiKey = row.api_key ?? "";
      }
      async checkAvailability(candidates, signal) {
        const out = /* @__PURE__ */ new Map();
        if (!this.apiKey) return out;
        const torrents = candidates.filter((c) => c.infoHash);
        if (torrents.length === 0) return out;
        const BATCH = 25;
        for (let i = 0; i < torrents.length; i += BATCH) {
          const slice = torrents.slice(i, i + BATCH);
          const params = new URLSearchParams();
          params.set("url", slice.map((c) => magnetFromHash(c.infoHash)).join(","));
          const data = await fetchAuthed(
            `${DL_HOST}/seedbox/cached?${params.toString()}`,
            this.apiKey,
            { signal }
          );
          const byHash = data?.value ?? {};
          for (const c of slice) out.set(c.id, byHash[c.infoHash] === true);
        }
        return out;
      }
      async resolve(candidate, signal, hint) {
        if (!this.apiKey || !candidate.infoHash) return null;
        const added = await fetchAuthed(
          `${DL_HOST}/seedbox/add`,
          this.apiKey,
          {
            method: "POST",
            body: new URLSearchParams({ url: magnetFromHash(candidate.infoHash) }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            signal
          }
        );
        const id = added?.value?.id;
        if (!id) return null;
        for (let attempt = 0; attempt < 3; attempt++) {
          const list = await fetchAuthed(
            `${DL_HOST}/seedbox/list?ids=${id}`,
            this.apiKey,
            { signal }
          );
          const files = list?.value?.[0]?.files ?? [];
          if (files.length) {
            const { pickFileForEpisode: pickFileForEpisode2 } = await Promise.resolve().then(() => (init_base2(), base_exports));
            const pickable = files.map((f, i) => ({ id: i, name: f.name, size: f.size }));
            const chosen = pickFileForEpisode2(pickable, hint);
            if (chosen) {
              const file = files[chosen.id];
              if (file?.downloadUrl) return file.downloadUrl;
            }
          }
          await new Promise((r) => setTimeout(r, 1500));
        }
        return null;
      }
    };
  }
});

// ../zero_forge/src/resolvers/easydebrid.ts
var ED_HOST, EasyDebridResolver;
var init_easydebrid = __esm({
  "../zero_forge/src/resolvers/easydebrid.ts"() {
    "use strict";
    init_base2();
    ED_HOST = "https://easydebrid.com/api/v1";
    EasyDebridResolver = class {
      constructor(row) {
        this.row = row;
        this.provider = "easydebrid";
        this.accepts = ["torrent"];
        this.apiKey = row.api_key ?? "";
      }
      async checkAvailability(candidates, signal) {
        const out = /* @__PURE__ */ new Map();
        if (!this.apiKey) return out;
        const torrents = candidates.filter((c) => c.infoHash);
        if (torrents.length === 0) return out;
        const BATCH = 50;
        for (let i = 0; i < torrents.length; i += BATCH) {
          const slice = torrents.slice(i, i + BATCH);
          const data = await fetchAuthed(
            `${ED_HOST}/link/lookup`,
            this.apiKey,
            {
              method: "POST",
              body: JSON.stringify({ urls: slice.map((c) => magnetFromHash(c.infoHash)) }),
              headers: { "Content-Type": "application/json" },
              signal
            }
          );
          const cached = data?.cached ?? [];
          slice.forEach((c, idx) => out.set(c.id, cached[idx] === true));
        }
        return out;
      }
      async resolve(candidate, signal, hint) {
        if (!this.apiKey || !candidate.infoHash) return null;
        const data = await fetchAuthed(
          `${ED_HOST}/link/generate`,
          this.apiKey,
          {
            method: "POST",
            body: JSON.stringify({ url: magnetFromHash(candidate.infoHash) }),
            headers: { "Content-Type": "application/json" },
            signal
          }
        );
        if (!data?.files?.length) return null;
        const { pickFileForEpisode: pickFileForEpisode2 } = await Promise.resolve().then(() => (init_base2(), base_exports));
        const pickable = data.files.map((f, i) => ({ id: i, name: f.name, size: f.size }));
        const chosen = pickFileForEpisode2(pickable, hint);
        if (!chosen) return null;
        return data.files[chosen.id]?.url ?? null;
      }
    };
  }
});

// ../zero_forge/src/resolvers/offcloud.ts
var OC_HOST, OffcloudResolver;
var init_offcloud = __esm({
  "../zero_forge/src/resolvers/offcloud.ts"() {
    "use strict";
    init_base2();
    OC_HOST = "https://offcloud.com/api";
    OffcloudResolver = class {
      constructor(row) {
        this.row = row;
        this.provider = "offcloud";
        this.accepts = ["torrent"];
        this.apiKey = row.api_key ?? "";
      }
      async checkAvailability(candidates, signal) {
        const out = /* @__PURE__ */ new Map();
        if (!this.apiKey) return out;
        const torrents = candidates.filter((c) => c.infoHash);
        if (torrents.length === 0) return out;
        const BATCH = 50;
        for (let i = 0; i < torrents.length; i += BATCH) {
          const slice = torrents.slice(i, i + BATCH);
          const data = await fetchAuthed(
            `${OC_HOST}/cache?apiKey=${encodeURIComponent(this.apiKey)}`,
            this.apiKey,
            {
              method: "POST",
              headerScheme: "raw",
              body: JSON.stringify({ hashes: slice.map((c) => c.infoHash) }),
              headers: { "Content-Type": "application/json" },
              signal
            }
          );
          const cached = new Set((data?.cachedItems ?? []).map((h) => h.toLowerCase()));
          for (const c of slice) out.set(c.id, cached.has(c.infoHash));
        }
        return out;
      }
      async resolve(candidate, signal, hint) {
        if (!this.apiKey || !candidate.infoHash) return null;
        const added = await fetchAuthed(
          `${OC_HOST}/cloud?apiKey=${encodeURIComponent(this.apiKey)}`,
          this.apiKey,
          {
            method: "POST",
            headerScheme: "raw",
            body: JSON.stringify({ url: magnetFromHash(candidate.infoHash) }),
            headers: { "Content-Type": "application/json" },
            signal
          }
        );
        if (added?.isDirectLink && added.url) return added.url;
        const id = added?.requestId;
        if (!id) return null;
        const explored = await fetchAuthed(
          `${OC_HOST}/cloud/explore/${id}?apiKey=${encodeURIComponent(this.apiKey)}`,
          this.apiKey,
          { headerScheme: "raw", signal }
        );
        if (!Array.isArray(explored) || explored.length === 0) return null;
        if (hint?.episode || hint?.season) {
          const { parseSeasonEpisode: parseSeasonEpisode2 } = await Promise.resolve().then(() => (init_parser2(), parser_exports));
          const match = explored.find((url) => {
            const name = decodeURIComponent(url.split("/").pop() ?? "");
            const p = parseSeasonEpisode2(name);
            if (hint.season && p.seasons.length > 0 && !p.seasons.includes(hint.season)) return false;
            if (hint.episode && !p.episodes.includes(hint.episode)) return false;
            return true;
          });
          if (match) return match;
        }
        const biggest = [...explored].sort((a, b) => b.length - a.length)[0];
        return biggest ?? null;
      }
    };
  }
});

// ../zero_forge/src/resolvers/premiumize.ts
var PM_HOST, PremiumizeResolver;
var init_premiumize = __esm({
  "../zero_forge/src/resolvers/premiumize.ts"() {
    "use strict";
    init_base2();
    PM_HOST = "https://www.premiumize.me/api";
    PremiumizeResolver = class {
      constructor(row) {
        this.row = row;
        this.provider = "premiumize";
        this.accepts = ["torrent"];
        this.apiKey = row.api_key ?? "";
      }
      async checkAvailability(candidates, signal) {
        const out = /* @__PURE__ */ new Map();
        if (!this.apiKey) return out;
        const torrents = candidates.filter((c) => c.infoHash);
        if (torrents.length === 0) return out;
        const BATCH = 50;
        for (let i = 0; i < torrents.length; i += BATCH) {
          const slice = torrents.slice(i, i + BATCH);
          const params = new URLSearchParams();
          params.set("apikey", this.apiKey);
          for (const c of slice) params.append("items[]", c.infoHash);
          const data = await fetchAuthed(
            `${PM_HOST}/cache/check?${params.toString()}`,
            this.apiKey,
            { headerScheme: "raw", method: "POST", signal }
          );
          const arr = data?.response ?? [];
          slice.forEach((c, idx) => out.set(c.id, arr[idx] === true));
        }
        return out;
      }
      async resolve(candidate, signal, hint) {
        if (!this.apiKey || !candidate.infoHash) return null;
        const params = new URLSearchParams();
        params.set("apikey", this.apiKey);
        params.set("src", magnetFromHash(candidate.infoHash));
        const data = await fetchAuthed(
          `${PM_HOST}/transfer/directdl`,
          this.apiKey,
          {
            method: "POST",
            body: params,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            headerScheme: "raw",
            signal
          }
        );
        if (!data?.content?.length) return null;
        const { pickFileForEpisode: pickFileForEpisode2 } = await Promise.resolve().then(() => (init_base2(), base_exports));
        const pickable = data.content.map((c, i) => ({
          id: i,
          name: c.path.split("/").pop() ?? c.path,
          size: c.size
        }));
        const chosen = pickFileForEpisode2(pickable, hint);
        if (!chosen) return null;
        const file = data.content[chosen.id];
        return file?.stream_link ?? file?.link ?? null;
      }
    };
  }
});

// ../zero_forge/src/resolvers/putio.ts
var PUTIO_HOST, PutioResolver;
var init_putio = __esm({
  "../zero_forge/src/resolvers/putio.ts"() {
    "use strict";
    init_base2();
    PUTIO_HOST = "https://api.put.io/v2";
    PutioResolver = class {
      constructor(row) {
        this.row = row;
        this.provider = "putio";
        this.accepts = ["torrent"];
        this.apiKey = row.api_key ?? "";
      }
      async checkAvailability(candidates, _signal) {
        const out = /* @__PURE__ */ new Map();
        for (const c of candidates) if (c.infoHash) out.set(c.id, false);
        return out;
      }
      // hint currently ignored — Put.io doesn't expose a per-file picker in
      // the v2 transfers flow; the returned file_id is the parent folder if
      // the torrent contains multiple files. Walking /files/{id}/children to
      // pick by S×E is a follow-up; for now Put.io continues to serve the
      // root file as the prior code did.
      async resolve(candidate, signal, _hint) {
        if (!this.apiKey || !candidate.infoHash) return null;
        const body = new URLSearchParams({
          url: magnetFromHash(candidate.infoHash),
          save_parent_id: "0"
        });
        const added = await fetchAuthed(
          `${PUTIO_HOST}/transfers/add`,
          this.apiKey,
          {
            method: "POST",
            body,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            signal
          }
        );
        const id = added?.transfer?.id;
        if (!id) return null;
        let fileId = added.transfer.file_id;
        if (!fileId) {
          for (let attempt = 0; attempt < 4 && !fileId; attempt++) {
            await new Promise((r) => setTimeout(r, 2e3));
            const status2 = await fetchAuthed(
              `${PUTIO_HOST}/transfers/${id}`,
              this.apiKey,
              { signal }
            );
            fileId = status2?.transfer?.file_id;
          }
        }
        if (!fileId) return null;
        return `${PUTIO_HOST}/files/${fileId}/download?oauth_token=${encodeURIComponent(this.apiKey)}`;
      }
    };
  }
});

// ../zero_forge/src/resolvers/realdebrid.ts
function isCached(node) {
  if (!node) return false;
  if (Array.isArray(node)) return node.length > 0;
  if (typeof node === "object") return Object.keys(node).length > 0;
  return false;
}
function sleep3(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
var RD_HOST, RealDebridResolver;
var init_realdebrid = __esm({
  "../zero_forge/src/resolvers/realdebrid.ts"() {
    "use strict";
    init_base2();
    RD_HOST = "https://api.real-debrid.com/rest/1.0";
    RealDebridResolver = class {
      constructor(row) {
        this.row = row;
        this.provider = "realdebrid";
        this.accepts = ["torrent"];
        // RD retired /torrents/instantAvailability (403 disabled_endpoint) — it can
        // no longer confirm what's cached. The pipeline skips its availability call
        // entirely and treats RD candidates as assumed-available + flagged unverified.
        this.verifiesCache = false;
        this.apiKey = row.api_key ?? "";
      }
      async checkAvailability(candidates, signal) {
        const out = /* @__PURE__ */ new Map();
        if (!this.apiKey) return out;
        const torrents = candidates.filter((c) => c.infoHash);
        if (torrents.length === 0) return out;
        const BATCH = 40;
        for (let i = 0; i < torrents.length; i += BATCH) {
          const slice = torrents.slice(i, i + BATCH);
          const path4 = slice.map((c) => c.infoHash).join("/");
          const data = await fetchAuthed(
            `${RD_HOST}/torrents/instantAvailability/${path4}`,
            this.apiKey,
            { signal, label: "Real-Debrid" }
          );
          if (data === null) break;
          for (const c of slice) {
            const node = data[c.infoHash];
            out.set(c.id, isCached(node));
          }
        }
        return out;
      }
      async resolve(candidate, signal, hint) {
        if (!this.apiKey || !candidate.infoHash) return null;
        const addBody = new URLSearchParams({ magnet: magnetFromHash(candidate.infoHash) });
        const added = await fetchAuthed(`${RD_HOST}/torrents/addMagnet`, this.apiKey, {
          method: "POST",
          body: addBody,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          signal
        });
        if (!added?.id) return null;
        await fetchAuthed(`${RD_HOST}/torrents/selectFiles/${added.id}`, this.apiKey, {
          method: "POST",
          body: new URLSearchParams({ files: "all" }),
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          signal
        });
        let info = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          info = await fetchAuthed(
            `${RD_HOST}/torrents/info/${added.id}`,
            this.apiKey,
            { signal }
          );
          if (info?.status === "downloaded" && info.links?.length) break;
          await sleep3(2e3);
        }
        if (!info?.links?.length) return null;
        const videoFiles = info.files.map((f, i) => ({ ...f, _origIdx: i })).filter((f) => f.selected === 1);
        if (videoFiles.length === 0) return null;
        const pickable = videoFiles.map((f) => ({
          id: f._origIdx,
          // f.path is "/folder/Show.S01E05.mkv" — last segment is the filename.
          name: f.path.split("/").pop() ?? f.path,
          size: f.bytes
        }));
        const chosen = pickFileForEpisode(pickable, hint);
        if (!chosen) return null;
        const selectedIdx = videoFiles.findIndex((f) => f._origIdx === chosen.id);
        if (selectedIdx < 0) return null;
        const link = info.links[selectedIdx];
        if (!link) return null;
        const unrestricted = await fetchAuthed(
          `${RD_HOST}/unrestrict/link`,
          this.apiKey,
          {
            method: "POST",
            body: new URLSearchParams({ link }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            signal
          }
        );
        return unrestricted?.download ?? null;
      }
    };
  }
});

// ../zero_forge/src/resolvers/torbox.ts
async function pollForReady(fn) {
  let last = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    const info = await fn();
    if (info?.data?.files?.length) return info;
    if (info?.data) last = info;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return last;
}
var TB_HOST, TorBoxResolver;
var init_torbox = __esm({
  "../zero_forge/src/resolvers/torbox.ts"() {
    "use strict";
    init_base2();
    TB_HOST = "https://api.torbox.app/v1/api";
    TorBoxResolver = class {
      constructor(row) {
        this.row = row;
        this.provider = "torbox";
        this.accepts = ["torrent", "usenet"];
        this.apiKey = row.api_key ?? "";
      }
      async checkAvailability(candidates, signal) {
        const out = /* @__PURE__ */ new Map();
        if (!this.apiKey) return out;
        const torrents = candidates.filter((c) => c.infoHash);
        if (torrents.length === 0) return out;
        const BATCH = 75;
        for (let i = 0; i < torrents.length; i += BATCH) {
          const slice = torrents.slice(i, i + BATCH);
          const params = new URLSearchParams();
          for (const c of slice) params.append("hash", c.infoHash);
          const data = await fetchAuthed(
            `${TB_HOST}/torrents/checkcached?${params.toString()}&format=object`,
            this.apiKey,
            { signal }
          );
          const cached = data?.data ?? {};
          for (const c of slice) out.set(c.id, !!cached[c.infoHash]);
        }
        return out;
      }
      async resolve(candidate, signal, hint) {
        const r = await this.resolveDetailed(candidate, signal, hint);
        return r && "url" in r ? r.url : null;
      }
      /**
       * Like {@link resolve} but also returns the NAME of the file we picked. The
       * debrid service hands the name back so a caller can reject dirty hashlist entries whose cached
       * TorBox content turns out to be unrelated (e.g. a mainstream show) — the
       * torrent's release name matched, but the actual file doesn't.
       *
       * For an UNCACHED torrent TorBox queues the download instead of failing; in
       * that case this returns a {@link QueuedResolve} (state + progress) so the
       * caller can tell the user "it's downloading" rather than "not found".
       */
      async resolveDetailed(candidate, signal, hint) {
        if (!this.apiKey) return null;
        if (candidate.infoHash) return this.resolveTorrent(candidate, signal, hint);
        if (candidate.nzbId) {
          const url = await this.resolveUsenet(candidate, signal, hint);
          return url ? { url, name: candidate.rawTitle ?? "" } : null;
        }
        return null;
      }
      async resolveTorrent(candidate, signal, hint) {
        const body = new FormData();
        body.append("magnet", magnetFromHash(candidate.infoHash));
        const created = await fetchAuthed(
          `${TB_HOST}/torrents/createtorrent`,
          this.apiKey,
          { method: "POST", body, signal }
        );
        const id = created?.data?.torrent_id;
        if (!id) return null;
        const info = await pollForReady(
          () => fetchAuthed(`${TB_HOST}/torrents/mylist?id=${id}&bypass_cache=true`, this.apiKey, { signal })
        );
        const files = info?.data?.files ?? [];
        if (!files.length) {
          const d = info?.data;
          if (!d) return null;
          const progress = typeof d.progress === "number" ? Math.round(d.progress * 100) : null;
          return { queued: true, state: d.download_state ?? null, progress, seeds: d.seeds ?? null };
        }
        const chosen = pickFileForEpisode(files, hint);
        if (!chosen) return null;
        const dl = await fetchAuthed(
          `${TB_HOST}/torrents/requestdl?token=${encodeURIComponent(this.apiKey)}&torrent_id=${id}&file_id=${chosen.id}`,
          this.apiKey,
          { signal }
        );
        return dl?.data ? { url: dl.data, name: chosen.name ?? "" } : null;
      }
      async resolveUsenet(candidate, signal, hint) {
        const body = new FormData();
        body.append("link", candidate.nzbId);
        const created = await fetchAuthed(
          `${TB_HOST}/usenet/createusenetdownload`,
          this.apiKey,
          { method: "POST", body, signal }
        );
        const id = created?.data?.usenet_id;
        if (!id) return null;
        const info = await pollForReady(
          () => fetchAuthed(`${TB_HOST}/usenet/mylist?id=${id}&bypass_cache=true`, this.apiKey, { signal })
        );
        const files = info?.data?.files ?? [];
        if (!files.length) return null;
        const chosen = pickFileForEpisode(files, hint);
        if (!chosen) return null;
        const dl = await fetchAuthed(
          `${TB_HOST}/usenet/requestdl?token=${encodeURIComponent(this.apiKey)}&usenet_id=${id}&file_id=${chosen.id}`,
          this.apiKey,
          { signal }
        );
        return dl?.data ?? null;
      }
    };
  }
});

// ../zero_forge/src/usenet/files.ts
var NzbFileReader, SpanFile;
var init_files = __esm({
  "../zero_forge/src/usenet/files.ts"() {
    "use strict";
    NzbFileReader = class {
      constructor(file, store, readAhead = 8) {
        this.file = file;
        this.store = store;
        this.readAhead = readAhead;
        this.size = 0;
        this.partSize = 0;
      }
      /** Learn size + part size from the first article (or a saved layout). */
      async open(layout) {
        if (layout) {
          this.size = layout.size;
          this.partSize = layout.partSize;
          return this;
        }
        const first = await this.store.get(this.file.segments[0].messageId);
        this.size = first.fileSize;
        this.partSize = first.data.length || 1;
        return this;
      }
      get layout() {
        return { size: this.size, partSize: this.partSize };
      }
      /** First decoded bytes (for magic sniffing / archive headers). */
      async head() {
        return (await this.store.get(this.file.segments[0].messageId)).data;
      }
      async read(offset, length) {
        const out = [];
        for await (const chunk of this.stream(offset, Math.min(this.size, offset + length) - 1)) out.push(chunk);
        return Buffer.concat(out);
      }
      async *stream(start, endInclusive, signal) {
        if (start > endInclusive) return;
        let { index, part } = await this.locate(start);
        let pos = start;
        const segs = this.file.segments;
        const ahead = /* @__PURE__ */ new Set();
        const prefetch = (from) => {
          for (let i = from; i < Math.min(segs.length, from + this.readAhead); i++) {
            if (ahead.has(i)) continue;
            ahead.add(i);
            this.store.get(segs[i].messageId).catch(() => {
            });
          }
        };
        for (; ; ) {
          if (signal?.aborted) return;
          prefetch(index + 1);
          const from = pos - part.begin;
          const to = Math.min(part.data.length, endInclusive - part.begin + 1);
          if (to > from) {
            yield part.data.subarray(from, to);
            pos = part.begin + to;
          }
          if (pos > endInclusive) return;
          index++;
          if (index >= segs.length) throw new Error(`file ends at ${pos}, wanted ${endInclusive + 1}`);
          part = await this.store.get(segs[index].messageId);
          if (part.begin !== pos) {
            ({ index, part } = await this.locate(pos));
          }
        }
      }
      async locate(offset) {
        const segs = this.file.segments;
        let index = Math.min(segs.length - 1, Math.floor(offset / this.partSize));
        for (let steps = 0; steps < 64; steps++) {
          const part = await this.store.get(segs[index].messageId);
          if (offset < part.begin && index > 0) index--;
          else if (offset >= part.begin + part.data.length && index < segs.length - 1) index++;
          else return { index, part };
        }
        throw new Error(`could not locate offset ${offset} in ${this.file.name}`);
      }
    };
    SpanFile = class {
      constructor(spans) {
        this.spans = spans;
        this.size = spans.reduce((n, s) => n + s.length, 0);
      }
      async read(offset, length) {
        const out = [];
        for await (const chunk of this.stream(offset, Math.min(this.size, offset + length) - 1)) out.push(chunk);
        return Buffer.concat(out);
      }
      async *stream(start, endInclusive, signal) {
        let base2 = 0;
        for (const span of this.spans) {
          const spanEnd = base2 + span.length - 1;
          if (spanEnd >= start && base2 <= endInclusive) {
            const from = Math.max(start, base2) - base2;
            const to = Math.min(endInclusive, spanEnd) - base2;
            yield* span.file.stream(span.offset + from, span.offset + to, signal);
            if (signal?.aborted) return;
          }
          base2 += span.length;
          if (base2 > endInclusive) return;
        }
      }
    };
  }
});

// ../zero_forge/src/usenet/rar.ts
function rarVersion(head) {
  if (head.subarray(0, 8).equals(RAR5_SIG)) return 5;
  if (head.subarray(0, 7).equals(RAR4_SIG)) return 4;
  return null;
}
async function readRarSet(volumes) {
  const entries = /* @__PURE__ */ new Map();
  for (const vol of volumes) {
    const head = await vol.read(0, Math.min(vol.size, 64 * 1024));
    const version = rarVersion(head);
    if (!version) throw new RarError("volume is not a RAR archive");
    const blocks = version === 5 ? await readRar5(vol, head) : await readRar4(vol, head);
    for (const b of blocks) {
      let e = entries.get(b.name);
      if (!e) {
        e = { name: b.name, size: b.unpSize, spans: [], stored: b.stored, encrypted: b.encrypted };
        entries.set(b.name, e);
      }
      e.stored &&= b.stored;
      e.encrypted ||= b.encrypted;
      if (b.dataSize > 0) e.spans.push({ file: vol, offset: b.dataStart, length: b.dataSize });
    }
  }
  return [...entries.values()];
}
async function readRar4(vol, head) {
  const out = [];
  const reader = new WindowReader(vol, head);
  let pos = RAR4_SIG.length;
  while (pos + 7 <= vol.size) {
    const fixed = await reader.at(pos, 7);
    const type = fixed[2];
    const flags = fixed.readUInt16LE(3);
    const headSize = fixed.readUInt16LE(5);
    if (headSize < 7) throw new RarError("corrupt RAR4 block header");
    const h = await reader.at(pos, headSize);
    if (type === R4_MAIN && flags & 128) {
      throw new RarError("RAR headers are encrypted (password protected release)");
    }
    if (type === R4_END) break;
    let addSize = flags & R4_LONG_BLOCK ? h.readUInt32LE(7) : 0;
    if (type === R4_FILE) {
      let packSize = h.readUInt32LE(7);
      let unpSize = h.readUInt32LE(11);
      const method = h[25];
      const nameSize = h.readUInt16LE(26);
      let nameAt = 32;
      if (flags & 256) {
        packSize += h.readUInt32LE(32) * 2 ** 32;
        unpSize += h.readUInt32LE(36) * 2 ** 32;
        nameAt += 8;
      }
      addSize = packSize;
      out.push({
        name: decodeRar4Name(h.subarray(nameAt, nameAt + nameSize)),
        unpSize,
        dataStart: pos + headSize,
        dataSize: packSize,
        stored: method === 48,
        encrypted: !!(flags & 4),
        splitAfter: !!(flags & 2)
      });
      if (flags & 2) break;
    }
    pos += headSize + addSize;
  }
  return out;
}
function decodeRar4Name(raw) {
  const nul = raw.indexOf(0);
  const ascii = raw.subarray(0, nul >= 0 ? nul : raw.length);
  return ascii.toString("utf8").replace(/\\/g, "/").split("/").pop();
}
async function readRar5(vol, head) {
  const out = [];
  const reader = new WindowReader(vol, head);
  let pos = RAR5_SIG.length;
  while (pos + 7 <= vol.size) {
    const sizeField = new VintReader(await reader.at(pos + 4, 10), 0);
    const headSize = sizeField.vint();
    const headerStart = pos + 4 + sizeField.pos;
    const r = new VintReader(await reader.at(headerStart, headSize), 0);
    const type = r.vint();
    const flags = r.vint();
    const extraSize = flags & 1 ? r.vint() : 0;
    const dataSize = flags & 2 ? r.vint() : 0;
    const blockEnd = headerStart + headSize;
    if (type === R5_ENCRYPTION) throw new RarError("RAR headers are encrypted (password protected release)");
    if (type === R5_END) break;
    if (type === R5_FILE) {
      const fileFlags = r.vint();
      const unpSize = r.vint();
      r.vint();
      if (fileFlags & 2) r.skip(4);
      if (fileFlags & 4) r.skip(4);
      const compInfo = r.vint();
      r.vint();
      const nameLen = r.vint();
      const name = r.bytes(nameLen).toString("utf8").split("/").pop();
      const extra = extraSize ? r.bytes(extraSize) : Buffer.alloc(0);
      const splitAfter = !!(flags & 16);
      out.push({
        name,
        unpSize,
        dataStart: blockEnd,
        dataSize,
        stored: (compInfo >> 7 & 7) === 0,
        encrypted: hasRar5EncryptionRecord(extra),
        splitAfter
      });
      if (splitAfter) break;
    }
    pos = blockEnd + dataSize;
  }
  return out;
}
function hasRar5EncryptionRecord(extra) {
  const r = new VintReader(extra, 0);
  while (r.pos < extra.length) {
    const size = r.vint();
    const start = r.pos;
    if (r.vint() === 1) return true;
    r.pos = start + size;
  }
  return false;
}
var RAR4_SIG, RAR5_SIG, RarError, R4_MAIN, R4_FILE, R4_END, R4_LONG_BLOCK, R5_FILE, R5_ENCRYPTION, R5_END, WindowReader, VintReader;
var init_rar = __esm({
  "../zero_forge/src/usenet/rar.ts"() {
    "use strict";
    RAR4_SIG = Buffer.from([82, 97, 114, 33, 26, 7, 0]);
    RAR5_SIG = Buffer.from([82, 97, 114, 33, 26, 7, 1, 0]);
    RarError = class extends Error {
    };
    R4_MAIN = 115;
    R4_FILE = 116;
    R4_END = 123;
    R4_LONG_BLOCK = 32768;
    R5_FILE = 2;
    R5_ENCRYPTION = 4;
    R5_END = 5;
    WindowReader = class {
      constructor(vol, buf) {
        this.vol = vol;
        this.buf = buf;
        this.bufAt = 0;
      }
      async at(offset, length) {
        const len = Math.min(length, this.vol.size - offset);
        if (offset < this.bufAt || offset + len > this.bufAt + this.buf.length) {
          this.buf = await this.vol.read(offset, Math.min(this.vol.size - offset, Math.max(len, 64 * 1024)));
          this.bufAt = offset;
        }
        return this.buf.subarray(offset - this.bufAt, offset - this.bufAt + len);
      }
    };
    VintReader = class {
      constructor(buf, pos) {
        this.buf = buf;
        this.pos = pos;
      }
      vint() {
        let v = 0;
        let mul = 1;
        for (let i = 0; i < 10; i++) {
          const b = this.buf[this.pos++];
          if (b === void 0) throw new RarError("truncated RAR5 header");
          v += (b & 127) * mul;
          if (!(b & 128)) return v;
          mul *= 128;
        }
        throw new RarError("bad RAR5 vint");
      }
      skip(n) {
        this.pos += n;
      }
      bytes(n) {
        const b = this.buf.subarray(this.pos, this.pos + n);
        this.pos += n;
        return b;
      }
    };
  }
});

// ../zero_forge/src/usenet/media.ts
async function scanNzb(files, store, concurrency, wanted = VIDEO_EXT3) {
  const problems = [];
  const candidates = files.map((file, index) => ({ file, index })).filter(({ file }) => !JUNK_EXT.test(file.name) && !/\.vol\d+\+\d+/i.test(file.name));
  const opened = await mapLimit(candidates, concurrency, async ({ file, index }) => {
    const reader = await new NzbFileReader(file, store).open();
    return { index, file, reader, head: await reader.head() };
  });
  const layouts = {};
  for (const o of opened) layouts[o.index] = o.reader.layout;
  const entries = [];
  const rarGroups = /* @__PURE__ */ new Map();
  const splitGroups = /* @__PURE__ */ new Map();
  for (const o of opened) {
    const name = o.file.name;
    if (rarVersion(o.head)) {
      push(rarGroups, rarStem(name), o);
    } else if (/\.\d{3}$/.test(name)) {
      push(splitGroups, name.replace(/\.\d{3}$/, ""), o);
    } else if (wanted.test(name) || wanted.test(`.${sniffExt(o.head)}`)) {
      entries.push({
        name: wanted.test(name) ? name : `${name}.${sniffExt(o.head)}`,
        size: o.reader.size,
        spans: [{ nzbIndex: o.index, offset: 0, length: o.reader.size }]
      });
    }
  }
  for (const [stem, group] of splitGroups) {
    group.sort((a, b) => splitNumber(a.file.name) - splitNumber(b.file.name));
    const name = wanted.test(stem) ? stem : `${stem}.${sniffExt(group[0].head)}`;
    if (!wanted.test(name)) continue;
    entries.push({
      name,
      size: group.reduce((n, o) => n + o.reader.size, 0),
      spans: group.map((o) => ({ nzbIndex: o.index, offset: 0, length: o.reader.size }))
    });
  }
  for (const group of rarGroups.values()) {
    group.sort(compareRarVolumes);
    const readerIndex = new Map(group.map((o) => [o.reader, o.index]));
    let rarEntries;
    try {
      rarEntries = await readRarSet(group.map((o) => o.reader));
    } catch (err) {
      if (err instanceof RarError) {
        problems.push(err.message);
        continue;
      }
      throw err;
    }
    for (const e of rarEntries) {
      if (!wanted.test(e.name)) continue;
      if (e.encrypted) {
        problems.push(`${e.name} is password protected`);
        continue;
      }
      if (!e.stored) {
        problems.push(`${e.name} is compressed inside the RAR (can't stream)`);
        continue;
      }
      const spanBytes = e.spans.reduce((n, s) => n + s.length, 0);
      if (spanBytes !== e.size) {
        problems.push(`${e.name}: RAR volumes cover ${spanBytes} of ${e.size} bytes (volumes missing)`);
        continue;
      }
      entries.push({
        name: e.name,
        size: e.size,
        spans: e.spans.map((s) => ({ nzbIndex: readerIndex.get(s.file), offset: s.offset, length: s.length }))
      });
    }
  }
  const collator = new Intl.Collator(void 0, { numeric: true, sensitivity: "base" });
  entries.sort((a, b) => collator.compare(a.name, b.name));
  return { entries, layouts, problems };
}
function openEntry(entry, readers) {
  const spans = entry.spans.map((s) => ({ file: readers.get(s.nzbIndex), offset: s.offset, length: s.length }));
  return spans.length === 1 && spans[0].offset === 0 && spans[0].length === spans[0].file.size ? spans[0].file : new SpanFile(spans);
}
function sniffExt(head) {
  if (head.length >= 4 && head.readUInt32BE(0) === 440786851) return "mkv";
  if (head.length >= 12 && head.toString("latin1", 4, 8) === "ftyp") {
    const brand = head.toString("latin1", 8, 12);
    return brand === "M4B " ? "m4b" : brand === "M4A " ? "m4a" : "mp4";
  }
  if (head.length >= 58 && head.toString("latin1", 0, 2) === "PK" && head.toString("latin1", 30, 58) === "mimetypeapplication/epub+zip") return "epub";
  if (head.length >= 5 && head.toString("latin1", 0, 5) === "%PDF-") return "pdf";
  if (head.length >= 3 && head.toString("latin1", 0, 3) === "ID3") return "mp3";
  if (head.length >= 12 && head.toString("latin1", 0, 4) === "RIFF" && head.toString("latin1", 8, 11) === "AVI") return "avi";
  if (head.length >= 377 && head[0] === 71 && head[188] === 71 && head[376] === 71) return "ts";
  return "bin";
}
function rarStem(name) {
  if (/\.(part\d+\.rar|rar|r\d{2,3})$/i.test(name)) {
    return name.replace(/\.part\d+\.rar$/i, "").replace(/\.(rar|r\d{2,3})$/i, "").toLowerCase();
  }
  return "\0obfuscated";
}
function rarVolumeNumber(name) {
  const part = /\.part(\d+)\.rar$/i.exec(name);
  if (part) return Number(part[1]);
  if (/\.rar$/i.test(name)) return 0;
  const old = /\.r(\d{2,3})$/i.exec(name);
  if (old) return Number(old[1]) + 1;
  return null;
}
function compareRarVolumes(a, b) {
  const na = rarVolumeNumber(a.file.name);
  const nb = rarVolumeNumber(b.file.name);
  if (na != null && nb != null) return na - nb;
  return (a.file.subjectIndex ?? a.index) - (b.file.subjectIndex ?? b.index);
}
function splitNumber(name) {
  return Number(/\.(\d{3})$/.exec(name)?.[1] ?? 0);
}
function push(m, k, v) {
  const arr = m.get(k);
  if (arr) arr.push(v);
  else m.set(k, [v]);
}
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return out;
}
var JUNK_EXT, VIDEO_EXT3, BOOK_EXT;
var init_media = __esm({
  "../zero_forge/src/usenet/media.ts"() {
    "use strict";
    init_files();
    init_rar();
    JUNK_EXT = /\.(par2|nfo|sfv|srr|nzb|txt|jpe?g|png|gif|url|exe|sample\.\w+)$/i;
    VIDEO_EXT3 = /\.(mkv|mp4|m4v|avi|ts|m2ts|mov|webm|wmv|mpg|mpeg)$/i;
    BOOK_EXT = /\.(epub|pdf|cbz|m4b|m4a|mp3|aac|ogg|opus|flac)$/i;
  }
});

// ../zero_forge/src/usenet/nntp.ts
import net from "node:net";
import tls from "node:tls";
function dotUnstuff(raw) {
  if (raw.indexOf("\n..") < 0 && !(raw[0] === 46 && raw[1] === 46)) return raw;
  const out = Buffer.allocUnsafe(raw.length);
  let o = 0;
  let lineStart = true;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (lineStart && c === 46 && raw[i + 1] === 46) {
      lineStart = false;
      continue;
    }
    out[o++] = c;
    lineStart = c === 10;
  }
  return out.subarray(0, o);
}
var ArticleMissingError, NntpError, DEFAULT_TIMEOUT_MS, TERMINATOR, NntpConnection, NntpPool;
var init_nntp = __esm({
  "../zero_forge/src/usenet/nntp.ts"() {
    "use strict";
    ArticleMissingError = class extends Error {
      constructor(messageId) {
        super(`article <${messageId}> not found on the provider`);
        this.messageId = messageId;
      }
    };
    NntpError = class extends Error {
      constructor(message, code) {
        super(message);
        this.code = code;
      }
    };
    DEFAULT_TIMEOUT_MS = 2e4;
    TERMINATOR = Buffer.from("\r\n.\r\n");
    NntpConnection = class {
      constructor(cfg) {
        this.cfg = cfg;
        this.socket = null;
        this.buf = Buffer.alloc(0);
        this.pending = null;
        this.statusLine = null;
        this.scanFrom = 0;
        this.closed = false;
      }
      async connect() {
        const { host: host2, port, ssl } = this.cfg;
        const socket = ssl ? tls.connect({ host: host2, port, servername: net.isIP(host2) ? void 0 : host2 }) : net.connect({ host: host2, port });
        this.socket = socket;
        socket.setNoDelay(true);
        socket.on("data", (d) => this.onData(d));
        socket.on("error", (e) => this.fail(new NntpError(`${host2}:${port} ${e.message}`)));
        socket.on("close", () => this.fail(new NntpError(`${host2}:${port} connection closed`)));
        const greeting = await this.read(false);
        if (greeting.code !== 200 && greeting.code !== 201) {
          throw new NntpError(`unexpected greeting: ${greeting.line}`, greeting.code);
        }
        if (this.cfg.username) {
          const user = await this.command(`AUTHINFO USER ${this.cfg.username}`);
          if (user.code === 381) {
            const pass = await this.command(`AUTHINFO PASS ${this.cfg.password}`);
            if (pass.code !== 281) throw new NntpError(`login rejected: ${pass.line}`, pass.code);
          } else if (user.code !== 281) {
            throw new NntpError(`login rejected: ${user.line}`, user.code);
          }
        }
      }
      /** Fetch an article body, dot-unstuffed. */
      async body(messageId) {
        const r = await this.command(`BODY <${messageId}>`, true);
        if (r.code === 430) throw new ArticleMissingError(messageId);
        if (r.code !== 222 || !r.body) throw new NntpError(`BODY failed: ${r.line}`, r.code);
        return r.body;
      }
      /** True when the article exists on the provider. */
      async stat(messageId) {
        const r = await this.command(`STAT <${messageId}>`);
        if (r.code === 223) return true;
        if (r.code === 430) return false;
        throw new NntpError(`STAT failed: ${r.line}`, r.code);
      }
      close() {
        if (this.closed) return;
        this.closed = true;
        try {
          this.socket?.end("QUIT\r\n");
        } catch {
        }
        this.socket?.destroy();
      }
      async command(line, multiline = false) {
        if (this.closed || !this.socket) throw new NntpError("connection closed");
        const p = this.read(multiline);
        this.socket.write(`${line}\r
`);
        return p;
      }
      read(multiline) {
        if (this.pending) return Promise.reject(new NntpError("command already in flight"));
        return new Promise((resolve, reject) => {
          const timeout = this.cfg.timeoutMs ?? DEFAULT_TIMEOUT_MS;
          const timer = setTimeout(() => {
            this.fail(new NntpError(`timed out after ${timeout} ms`));
            this.close();
          }, timeout);
          this.pending = {
            multiline,
            resolve: (r) => {
              clearTimeout(timer);
              resolve(r);
            },
            reject: (e) => {
              clearTimeout(timer);
              reject(e);
            }
          };
          this.drain();
        });
      }
      onData(d) {
        this.buf = this.buf.length ? Buffer.concat([this.buf, d]) : d;
        this.drain();
      }
      drain() {
        const p = this.pending;
        if (!p) return;
        if (!this.statusLine) {
          const eol = this.buf.indexOf("\r\n");
          if (eol < 0) return;
          const line = this.buf.toString("latin1", 0, eol);
          this.buf = this.buf.subarray(eol + 2);
          this.statusLine = { code: Number(line.slice(0, 3)), line };
          this.scanFrom = 0;
          if (!p.multiline || this.statusLine.code >= 300) return this.finish(void 0);
        }
        if (this.buf.length >= 3 && this.buf[0] === 46 && this.buf[1] === 13 && this.buf[2] === 10) {
          this.buf = this.buf.subarray(3);
          return this.finish(Buffer.alloc(0));
        }
        const end = this.buf.indexOf(TERMINATOR, Math.max(0, this.scanFrom - 4));
        if (end < 0) {
          this.scanFrom = this.buf.length;
          return;
        }
        const raw = this.buf.subarray(0, end + 2);
        this.buf = this.buf.subarray(end + TERMINATOR.length);
        this.finish(dotUnstuff(raw));
      }
      finish(body) {
        const p = this.pending;
        const status2 = this.statusLine;
        this.pending = null;
        this.statusLine = null;
        p.resolve({ ...status2, body });
      }
      fail(err) {
        this.closed = true;
        const p = this.pending;
        this.pending = null;
        p?.reject(err);
      }
    };
    NntpPool = class {
      constructor(cfg, idleMs = 6e4) {
        this.cfg = cfg;
        this.idleMs = idleMs;
        this.idle = [];
        this.open = 0;
        this.waiters = [];
        this.idleTimers = /* @__PURE__ */ new Map();
        this.destroyed = false;
      }
      async run(fn, signal) {
        for (let attempt = 0; ; attempt++) {
          const conn = await this.acquire(signal);
          try {
            const out = await fn(conn);
            this.release(conn);
            return out;
          } catch (err) {
            if (err instanceof ArticleMissingError) {
              this.release(conn);
              throw err;
            }
            this.discard(conn);
            if (attempt >= 1 || this.destroyed) throw err;
          }
        }
      }
      destroy() {
        this.destroyed = true;
        for (const c of this.idle) c.close();
        this.idle = [];
        for (const t of this.idleTimers.values()) clearTimeout(t);
        this.idleTimers.clear();
        for (const w of this.waiters.splice(0)) w(null);
      }
      get stats() {
        return { open: this.open, idle: this.idle.length, waiting: this.waiters.length };
      }
      async acquire(signal) {
        if (this.destroyed) throw new NntpError("pool destroyed");
        while (this.idle.length) {
          const c2 = this.idle.pop();
          clearTimeout(this.idleTimers.get(c2));
          this.idleTimers.delete(c2);
          if (!c2.closed) return c2;
          this.open--;
        }
        if (this.open < Math.max(1, this.cfg.connections)) {
          this.open++;
          const c2 = new NntpConnection(this.cfg);
          try {
            await c2.connect();
            return c2;
          } catch (err) {
            this.open--;
            c2.close();
            this.wakeOne();
            throw err;
          }
        }
        const c = await new Promise((resolve, reject) => {
          const onAbort = () => {
            this.waiters = this.waiters.filter((w) => w !== waiter);
            reject(new NntpError("aborted"));
          };
          const waiter = (conn) => {
            signal?.removeEventListener("abort", onAbort);
            resolve(conn);
          };
          if (signal?.aborted) return onAbort();
          signal?.addEventListener("abort", onAbort, { once: true });
          this.waiters.push(waiter);
        });
        if (!c) return this.acquire(signal);
        return c;
      }
      release(c) {
        if (c.closed || this.destroyed) return this.discard(c);
        const w = this.waiters.shift();
        if (w) return w(c);
        this.idle.push(c);
        this.idleTimers.set(c, setTimeout(() => {
          this.idle = this.idle.filter((x) => x !== c);
          this.idleTimers.delete(c);
          this.open--;
          c.close();
        }, this.idleMs));
      }
      discard(c) {
        c.close();
        this.open--;
        this.wakeOne();
      }
      /** A slot freed up — let one waiter open a new connection. */
      wakeOne() {
        const w = this.waiters.shift();
        if (w) w(null);
      }
    };
  }
});

// ../zero_forge/src/usenet/nzb.ts
function parseNzb(xml) {
  const files = [];
  const fileRe = /<file\b([^>]*)>([\s\S]*?)<\/file>/gi;
  let m;
  while ((m = fileRe.exec(xml)) !== null) {
    const subject = decodeEntities(/\bsubject="([^"]*)"/i.exec(m[1])?.[1] ?? "");
    const inner = m[2];
    const groups = [...inner.matchAll(/<group>([\s\S]*?)<\/group>/gi)].map((g2) => g2[1].trim());
    const segments = [];
    for (const s of inner.matchAll(/<segment\b([^>]*)>([\s\S]*?)<\/segment>/gi)) {
      const attrs = s[1];
      const number = Number(/\bnumber="(\d+)"/i.exec(attrs)?.[1] ?? 0);
      const bytes = Number(/\bbytes="(\d+)"/i.exec(attrs)?.[1] ?? 0);
      const messageId = decodeEntities(s[2].trim()).replace(/^<|>$/g, "");
      if (messageId) segments.push({ number, bytes, messageId });
    }
    if (!segments.length) continue;
    segments.sort((a, b) => a.number - b.number);
    files.push({
      subject,
      name: nameFromSubject(subject),
      subjectIndex: indexFromSubject(subject),
      groups,
      segments: dedupeSegments(segments)
    });
  }
  return files;
}
function dedupeSegments(segs) {
  const out = [];
  let last = -1;
  for (const s of segs) {
    if (s.number === last) continue;
    out.push(s);
    last = s.number;
  }
  return out;
}
function nameFromSubject(subject) {
  const quoted = /"([^"]+)"/.exec(subject)?.[1];
  if (quoted) return quoted.trim();
  const bare = /([^\s"]+\.[a-z0-9]{2,4})(?=\s|$)/i.exec(subject.replace(/\byEnc\b.*$/i, ""))?.[1];
  return (bare ?? subject).trim();
}
function indexFromSubject(subject) {
  const m = /[[(](\d+)\s*\/\s*\d+[\])]/.exec(subject);
  return m ? Number(m[1]) : null;
}
function decodeEntities(s) {
  return s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/&amp;/g, "&");
}
var init_nzb = __esm({
  "../zero_forge/src/usenet/nzb.ts"() {
    "use strict";
  }
});

// ../zero_forge/src/usenet/yenc.ts
function decodeYenc(body) {
  const beginAt = body.indexOf("=ybegin ");
  if (beginAt < 0) throw new YencError("article is not yEnc (no =ybegin)");
  const beginEol = lineEnd(body, beginAt);
  const header = body.toString("latin1", beginAt, beginEol);
  const fileSize = numAttr(header, "size");
  const name = /\bname=(.*)$/.exec(header)?.[1]?.trim() ?? "";
  if (fileSize == null) throw new YencError("=ybegin without size");
  let pos = skipEol(body, beginEol);
  let begin = 0;
  let partEnd = null;
  if (body.toString("latin1", pos, pos + 7) === "=ypart ") {
    const partEol = lineEnd(body, pos);
    const partLine = body.toString("latin1", pos, partEol);
    begin = (numAttr(partLine, "begin") ?? 1) - 1;
    const end = numAttr(partLine, "end");
    partEnd = end ?? null;
    pos = skipEol(body, partEol);
  }
  let dataEnd = body.indexOf("\r\n=yend", pos - 2);
  if (dataEnd < 0) dataEnd = body.indexOf("\n=yend", pos - 1);
  if (dataEnd < 0) dataEnd = body.length;
  const expected = partEnd != null ? partEnd - begin : dataEnd - pos;
  const out = Buffer.allocUnsafe(Math.max(expected, 0) + 64);
  let o = 0;
  for (let i = pos; i < dataEnd; i++) {
    let c = body[i];
    if (c === CR || c === LF) continue;
    if (c === EQ) {
      i++;
      if (i >= dataEnd) break;
      c = body[i] - 64 & 255;
    }
    if (o >= out.length) throw new YencError("decoded data overflows =ypart range");
    out[o++] = c - 42 & 255;
  }
  if (partEnd != null && o !== partEnd - begin) {
    throw new YencError(`part decoded to ${o} bytes, =ypart says ${partEnd - begin}`);
  }
  return { data: out.subarray(0, o), begin, fileSize, name };
}
function numAttr(line, key) {
  const m = new RegExp(`\\b${key}=(\\d+)`).exec(line);
  return m ? Number(m[1]) : void 0;
}
function lineEnd(buf, from) {
  const i = buf.indexOf(LF, from);
  if (i < 0) return buf.length;
  return i > from && buf[i - 1] === CR ? i - 1 : i;
}
function skipEol(buf, eol) {
  let p = eol;
  if (buf[p] === CR) p++;
  if (buf[p] === LF) p++;
  return p;
}
var CR, LF, EQ, YencError;
var init_yenc = __esm({
  "../zero_forge/src/usenet/yenc.ts"() {
    "use strict";
    CR = 13;
    LF = 10;
    EQ = 61;
    YencError = class extends Error {
    };
  }
});

// ../zero_forge/src/usenet/segments.ts
var SegmentStore;
var init_segments = __esm({
  "../zero_forge/src/usenet/segments.ts"() {
    "use strict";
    init_yenc();
    SegmentStore = class {
      constructor(pool, maxCacheBytes = 256 * 1024 * 1024) {
        this.pool = pool;
        this.maxCacheBytes = maxCacheBytes;
        this.cache = /* @__PURE__ */ new Map();
        this.cachedBytes = 0;
        this.inflight = /* @__PURE__ */ new Map();
      }
      get(messageId) {
        const hit = this.cache.get(messageId);
        if (hit) {
          this.cache.delete(messageId);
          this.cache.set(messageId, hit);
          return Promise.resolve(hit);
        }
        const running = this.inflight.get(messageId);
        if (running) return running;
        const p = this.pool.run((c) => c.body(messageId)).then((body) => {
          const part = decodeYenc(body);
          this.put(messageId, part);
          return part;
        }).finally(() => this.inflight.delete(messageId));
        this.inflight.set(messageId, p);
        return p;
      }
      /** Is the article still on the provider? (cheap: no body transfer) */
      exists(messageId) {
        if (this.cache.has(messageId)) return Promise.resolve(true);
        return this.pool.run((c) => c.stat(messageId));
      }
      put(id, part) {
        this.cache.set(id, part);
        this.cachedBytes += part.data.length;
        while (this.cachedBytes > this.maxCacheBytes && this.cache.size > 1) {
          const [oldId, old] = this.cache.entries().next().value;
          this.cache.delete(oldId);
          this.cachedBytes -= old.data.length;
        }
      }
    };
  }
});

// ../zero_forge/src/usenet/verdicts.ts
import { createHash as createHash2 } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
function classifyFailure(message) {
  if (/sampled articles are gone|not found on the provider|volumes missing/i.test(message)) return "missing";
  if (/password|encrypted|compressed inside the RAR/i.test(message)) return "locked";
  if (/no playable video|no book files|NZB has no files|no streamable video/i.test(message)) return "empty";
  return null;
}
var DAY, TTL, GOOD_TTL, CHECKED_TTL, MAX_ENTRIES, VerdictStore;
var init_verdicts = __esm({
  "../zero_forge/src/usenet/verdicts.ts"() {
    "use strict";
    DAY = 864e5;
    TTL = { missing: 14 * DAY, locked: 365 * DAY, empty: 365 * DAY };
    GOOD_TTL = 30 * DAY;
    CHECKED_TTL = 3 * DAY;
    MAX_ENTRIES = 2e4;
    VerdictStore = class _VerdictStore {
      constructor(file) {
        this.file = file;
        this.map = null;
        this.saving = null;
        this.dirty = false;
      }
      static key(nzbUrl) {
        return createHash2("sha1").update(nzbUrl).digest("hex").slice(0, 20);
      }
      async get(nzbUrl) {
        const map = await this.load();
        const v = map.get(_VerdictStore.key(nzbUrl));
        if (!v) return null;
        const ttl = v.ok ? v.checked ? CHECKED_TTL : GOOD_TTL : TTL[v.reason];
        if (Date.now() - v.at > ttl) {
          map.delete(_VerdictStore.key(nzbUrl));
          return null;
        }
        return v;
      }
      async isBad(nzbUrl) {
        return (await this.get(nzbUrl))?.ok === false;
      }
      async good(nzbUrl) {
        await this.set(nzbUrl, { ok: true, at: Date.now() });
      }
      /** Screened alive (never downgrades a release that already streamed). */
      async checked(nzbUrl) {
        if ((await this.get(nzbUrl))?.ok) return;
        await this.set(nzbUrl, { ok: true, at: Date.now(), checked: true });
      }
      async bad(nzbUrl, reason) {
        await this.set(nzbUrl, { ok: false, reason, at: Date.now() });
      }
      async set(nzbUrl, v) {
        const map = await this.load();
        const k = _VerdictStore.key(nzbUrl);
        map.delete(k);
        map.set(k, v);
        while (map.size > MAX_ENTRIES) map.delete(map.keys().next().value);
        this.dirty = true;
        await this.flush();
      }
      async load() {
        if (this.map) return this.map;
        try {
          this.map = new Map(Object.entries(JSON.parse(await readFile(this.file, "utf8"))));
        } catch {
          this.map = /* @__PURE__ */ new Map();
        }
        return this.map;
      }
      async flush() {
        if (this.saving) return this.saving;
        this.saving = (async () => {
          while (this.dirty) {
            this.dirty = false;
            await mkdir(path.dirname(this.file), { recursive: true });
            await writeFile(this.file, JSON.stringify(Object.fromEntries(this.map ?? [])));
          }
        })().finally(() => {
          this.saving = null;
        });
        return this.saving;
      }
    };
  }
});

// ../zero_forge/src/usenet/engine.ts
import { createHash as createHash3 } from "node:crypto";
import { mkdir as mkdir2, readFile as readFile2, writeFile as writeFile2 } from "node:fs/promises";
import path2 from "node:path";
async function fetchNzb(url, signal) {
  let res;
  try {
    res = await fetch(url, {
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(2e4)]) : AbortSignal.timeout(2e4),
      headers: { "User-Agent": "Zero Media" }
    });
  } catch (err) {
    throw new Error(`NZB download failed (${describeFetchFailure(err)}) from ${redactUrl(url)}`);
  }
  if (!res.ok) {
    const hint = res.status === 429 ? " \u2014 indexer API/grab limit reached" : "";
    throw new Error(`NZB download \u2192 HTTP ${res.status}${hint} from ${redactUrl(url)}`);
  }
  const text = await res.text();
  if (!/<nzb\b/i.test(text)) throw new Error(`indexer did not return an NZB (${text.slice(0, 120).replace(/\s+/g, " ")})`);
  return text;
}
function jobIdFor(mode, nzbUrl) {
  const key = mode === "video" ? nzbUrl : `${mode}\0${nzbUrl}`;
  return createHash3("sha1").update(key).digest("hex").slice(0, 20);
}
function cleanNzbUrl(url) {
  let out = url.trim();
  for (let i = 0; i < 2 && out.includes("&amp;"); i++) out = out.replace(/&amp;/g, "&");
  return out;
}
var WANTED, HEALTH_SAMPLE, SCREEN_SAMPLE, UsenetEngine;
var init_engine = __esm({
  "../zero_forge/src/usenet/engine.ts"() {
    "use strict";
    init_log2();
    init_base2();
    init_base();
    init_files();
    init_media();
    init_nntp();
    init_nzb();
    init_segments();
    init_verdicts();
    WANTED = { video: VIDEO_EXT3, book: BOOK_EXT };
    HEALTH_SAMPLE = 24;
    SCREEN_SAMPLE = 12;
    UsenetEngine = class {
      constructor(cfg, dir) {
        this.cfg = cfg;
        this.dir = dir;
        this.jobs = /* @__PURE__ */ new Map();
        this.preparing = /* @__PURE__ */ new Map();
        this.pool = new NntpPool(cfg);
        this.store = new SegmentStore(this.pool);
        this.verdicts = new VerdictStore(path2.join(dir, "verdicts.json"));
      }
      /** Run a prepare and remember whether the release works (see verdicts.ts). */
      async judged(nzbUrl, run) {
        try {
          const out = await run();
          await this.verdicts.good(nzbUrl).catch(() => {
          });
          return out;
        } catch (err) {
          const reason = classifyFailure(err.message ?? "");
          if (reason) await this.verdicts.bad(nzbUrl, reason).catch(() => {
          });
          throw err;
        }
      }
      destroy() {
        this.pool.destroy();
      }
      prepare(rawUrl, hint, signal) {
        const nzbUrl = cleanNzbUrl(rawUrl);
        return this.judged(nzbUrl, () => this.prepareVideo(nzbUrl, hint, signal));
      }
      async prepareVideo(nzbUrl, hint, signal) {
        const jobId = jobIdFor("video", nzbUrl);
        const job = await this.loadOrBuild(jobId, nzbUrl, "video", signal);
        const chosen = pickFileForEpisode(
          job.saved.entries.map((e, i) => ({ id: i, name: e.name, size: e.size })),
          hint
        );
        if (!chosen) throw new Error("release has no streamable video");
        const entry = job.saved.entries[chosen.id];
        await this.checkHealth(job, [entry]);
        return { jobId, fileIndex: chosen.id, name: entry.name, size: entry.size };
      }
      /** Every book file in the release (an ebook, or an audiobook's parts). */
      prepareBook(rawUrl, signal) {
        const nzbUrl = cleanNzbUrl(rawUrl);
        return this.judged(nzbUrl, async () => {
          const jobId = jobIdFor("book", nzbUrl);
          const job = await this.loadOrBuild(jobId, nzbUrl, "book", signal);
          await this.checkHealth(job, job.saved.entries);
          return job.saved.entries.map((e, i) => ({ jobId, fileIndex: i, name: e.name, size: e.size }));
        });
      }
      /**
       * Is this release still on the provider? Grabs the NZB (saved — a later
       * prepare reuses it, no second grab) and STATs an even sample of its data
       * articles. Dead → a "missing" verdict; alive → "checked". Indexer or
       * provider trouble → "unknown" (offered, nothing recorded).
       */
      async screen(rawUrl, signal) {
        const nzbUrl = cleanNzbUrl(rawUrl);
        const known2 = await this.verdicts.get(nzbUrl);
        if (known2) return known2.ok ? "alive" : "missing";
        try {
          const nzb = await this.nzbFor(jobIdFor("video", nzbUrl), nzbUrl, signal);
          const data = nzb.filter((f) => !/\.par2\b|\.(nfo|sfv|srr)\b/i.test(`${f.name} ${f.subject}`));
          const ids = (data.length ? data : nzb).flatMap((f) => f.segments.map((s) => s.messageId));
          if (!ids.length) return "unknown";
          const step = Math.max(1, Math.floor(ids.length / SCREEN_SAMPLE));
          const sample = ids.filter((_, i) => i % step === 0).slice(0, SCREEN_SAMPLE);
          sample.push(ids[ids.length - 1]);
          const results = await mapLimit(
            sample,
            Math.min(4, this.cfg.connections),
            (id) => this.store.exists(id).catch((err) => err instanceof ArticleMissingError ? false : Promise.reject(err))
          );
          if (results.some((ok) => !ok)) {
            await this.verdicts.bad(nzbUrl, "missing").catch(() => {
            });
            return "missing";
          }
          await this.verdicts.checked(nzbUrl).catch(() => {
          });
          return "alive";
        } catch {
          return "unknown";
        }
      }
      async open(jobId, fileIndex) {
        if (!/^[0-9a-f]{20}$/.test(jobId)) return null;
        const job = this.jobs.get(jobId) ?? await this.loadSaved(jobId);
        const entry = job?.saved.entries[fileIndex];
        if (!job || !entry) return null;
        return openEntry(entry, job.readers);
      }
      // ─── Jobs ──────────────────────────────────────────────────────────────────
      loadOrBuild(jobId, nzbUrl, mode, signal) {
        const live = this.jobs.get(jobId);
        if (live) return Promise.resolve(live);
        const running = this.preparing.get(jobId);
        if (running) return running;
        const p = (async () => await this.loadSaved(jobId) ?? await this.build(jobId, nzbUrl, mode, signal))().finally(() => this.preparing.delete(jobId));
        this.preparing.set(jobId, p);
        return p;
      }
      async build(jobId, nzbUrl, mode, signal) {
        const t0 = Date.now();
        const nzb = await this.nzbFor(jobId, nzbUrl, signal);
        const scan = await scanNzb(nzb, this.store, this.cfg.connections, WANTED[mode]);
        for (const p of scan.problems) logger2.warn("streams", `Usenet: ${p}`);
        if (!scan.entries.length) {
          throw new Error(scan.problems[0] ?? `no ${mode === "book" ? "book files" : "playable video"} in this release`);
        }
        const saved = {
          version: 1,
          nzbUrl,
          createdAt: Date.now(),
          layouts: scan.layouts,
          entries: scan.entries
        };
        await writeFile2(path2.join(this.dir, `${jobId}.json`), JSON.stringify(saved));
        logger2.info(
          "streams",
          `Usenet: indexed ${nzb.length} posted files \u2192 ${scan.entries.length} playable in ${Date.now() - t0} ms`
        );
        return this.activate(jobId, saved, nzb);
      }
      /** The job's NZB: saved copy (screening grabbed it) or a fresh grab. */
      async nzbFor(jobId, nzbUrl, signal) {
        const file = path2.join(this.dir, `${jobId}.nzb`);
        const saved = await readFile2(file, "utf8").catch(() => null);
        if (saved) {
          const nzb2 = parseNzb(saved);
          if (nzb2.length) return nzb2;
        }
        const xml = await fetchNzb(nzbUrl, signal);
        const nzb = parseNzb(xml);
        if (!nzb.length) throw new Error("NZB has no files");
        await mkdir2(this.dir, { recursive: true });
        await writeFile2(file, xml);
        return nzb;
      }
      async loadSaved(jobId) {
        try {
          const [json, xml] = await Promise.all([
            readFile2(path2.join(this.dir, `${jobId}.json`), "utf8"),
            readFile2(path2.join(this.dir, `${jobId}.nzb`), "utf8")
          ]);
          const saved = JSON.parse(json);
          if (saved.version !== 1) return null;
          return this.activate(jobId, saved, parseNzb(xml));
        } catch {
          return null;
        }
      }
      async activate(jobId, saved, nzb) {
        const readers = /* @__PURE__ */ new Map();
        for (const [idx, layout] of Object.entries(saved.layouts)) {
          const i = Number(idx);
          if (nzb[i]) readers.set(i, await new NzbFileReader(nzb[i], this.store).open(layout));
        }
        const job = { saved, nzb, readers };
        this.jobs.set(jobId, job);
        return job;
      }
      /**
       * STAT an even sample of the articles behind `entry`. Any missing article
       * means a hole in the video — fail now so the picker can try the next
       * release instead of the player freezing at minute 40.
       */
      async checkHealth(job, entries) {
        const ids = [];
        const used = [...new Set(entries.flatMap((e) => e.spans.map((s) => s.nzbIndex)))];
        for (const i of used) for (const s of job.nzb[i]?.segments ?? []) ids.push(s.messageId);
        if (!ids.length) return;
        const step = Math.max(1, Math.floor(ids.length / HEALTH_SAMPLE));
        const sample = ids.filter((_, i) => i % step === 0);
        sample.push(ids[ids.length - 1]);
        const results = await mapLimit(
          sample,
          this.cfg.connections,
          (id) => this.store.exists(id).catch((err) => err instanceof ArticleMissingError ? false : Promise.reject(err))
        );
        const missing = results.filter((ok) => !ok).length;
        if (missing) {
          throw new Error(
            `${missing}/${sample.length} sampled articles are gone from your provider (release expired or taken down)`
          );
        }
      }
    };
  }
});

// ../zero_forge/src/usenet/server.ts
import http from "node:http";
function createStreamServer(open) {
  return http.createServer((req, res) => {
    handle(open, req, res).catch((err) => {
      logger2.warn("streams", `Usenet stream error: ${err.message}`);
      if (!res.headersSent) {
        res.writeHead(502, { "Content-Type": "text/plain" });
        res.end(err.message);
      } else {
        res.destroy();
      }
    });
  });
}
async function handle(open, req, res) {
  const m = /^\/usenet\/([0-9a-f]{20})\/(\d+)\/([^/?]*)/.exec(req.url ?? "");
  if (!m || req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(404).end();
    return;
  }
  const file = await open(m[1], Number(m[2]));
  if (!file) {
    res.writeHead(404).end();
    return;
  }
  const ext = /\.([a-z0-9]+)$/i.exec(decodeURIComponent(m[3]))?.[1]?.toLowerCase() ?? "";
  const headers = {
    "Accept-Ranges": "bytes",
    "Content-Type": MIME[ext] ?? "application/octet-stream"
  };
  const range = parseRange(req.headers.range, file.size);
  if (range === "invalid") {
    res.writeHead(416, { "Content-Range": `bytes */${file.size}` }).end();
    return;
  }
  const [start, end] = range ?? [0, file.size - 1];
  headers["Content-Length"] = end - start + 1;
  if (range) headers["Content-Range"] = `bytes ${start}-${end}/${file.size}`;
  res.writeHead(range ? 206 : 200, headers);
  if (req.method === "HEAD" || file.size === 0) {
    res.end();
    return;
  }
  const ac = new AbortController();
  res.on("close", () => ac.abort());
  for await (const chunk of file.stream(start, end, ac.signal)) {
    if (ac.signal.aborted) return;
    if (!res.write(chunk)) {
      await new Promise((resolve) => {
        const done = () => {
          res.off("drain", done);
          res.off("close", done);
          resolve();
        };
        res.on("drain", done);
        res.on("close", done);
      });
    }
  }
  res.end();
}
function parseRange(header, size) {
  if (!header) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || !m[1] && !m[2]) return "invalid";
  let start;
  let end;
  if (!m[1]) {
    const n = Number(m[2]);
    start = Math.max(0, size - n);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  }
  if (start >= size || start > end) return "invalid";
  return [start, end];
}
var MIME;
var init_server = __esm({
  "../zero_forge/src/usenet/server.ts"() {
    "use strict";
    init_log2();
    MIME = {
      mkv: "video/x-matroska",
      mp4: "video/mp4",
      m4v: "video/mp4",
      avi: "video/x-msvideo",
      ts: "video/mp2t",
      m2ts: "video/mp2t",
      mov: "video/quicktime",
      webm: "video/webm"
    };
  }
});

// ../zero_forge/src/usenet/service.ts
import os from "node:os";
import path3 from "node:path";
async function readUsenetSettings(overrides) {
  if (!hasForgeHost()) return null;
  const saved = await getForgeHost().settings.get().catch(() => ({}));
  const cfg = {};
  for (const [k, v] of Object.entries(saved)) if (v !== void 0 && v !== null) cfg[k] = String(v);
  for (const [k, v] of Object.entries(overrides ?? {})) if (v !== void 0 && v !== null && String(v).trim()) cfg[k] = String(v);
  const host2 = (cfg.usenet_host ?? "").trim();
  if (!host2) return null;
  const ssl = !/^(0|false|no|off)$/i.test((cfg.usenet_ssl ?? "true").trim());
  return {
    host: host2,
    port: positive(cfg.usenet_port) ?? (ssl ? 563 : 119),
    ssl,
    username: (cfg.usenet_username ?? "").trim(),
    password: cfg.usenet_password ?? "",
    connections: positive(cfg.usenet_connections) ?? 10,
    streamPort: positive(cfg.usenet_stream_port) ?? DEFAULT_STREAM_PORT
  };
}
async function getUsenetEngine() {
  const s = await readUsenetSettings();
  if (!s) return null;
  const { streamPort, ...nntp } = s;
  const key = JSON.stringify(nntp);
  if (shared.engine?.key !== key || shared.engine.owner !== THIS_MODULE) {
    shared.engine?.engine.destroy();
    shared.engine = { key, engine: new UsenetEngine(nntp, jobsDir()), owner: THIS_MODULE };
  }
  await ensureServer(streamPort);
  return { engine: shared.engine.engine, streamPort };
}
async function ensureServer(port) {
  if (shared.server?.port === port) return shared.server.ready;
  const old = shared.server;
  shared.server = null;
  if (old) await new Promise((r) => old.server.close(() => r()));
  const srv = createStreamServer((jobId, idx) => shared.open ? shared.open(jobId, idx) : Promise.resolve(null));
  const ready = new Promise((resolve, reject) => {
    srv.once("error", (err) => {
      logger2.error("streams", `Usenet stream server could not listen on 127.0.0.1:${port}: ${err.message}`, err);
      if (shared.server?.server === srv) shared.server = null;
      reject(err);
    });
    srv.listen(port, "127.0.0.1", () => {
      logger2.info("streams", `Usenet stream server listening on 127.0.0.1:${port}`);
      resolve();
    });
  });
  shared.server = { port, server: srv, ready };
  return ready;
}
function jobsDir() {
  return path3.join(hasForgeHost() && getForgeHost().dataDir || path3.join(os.tmpdir(), "zero-forge"), "usenet");
}
function positive(v) {
  const n = Number((v ?? "").trim());
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : void 0;
}
var DEFAULT_STREAM_PORT, g, shared, THIS_MODULE;
var init_service = __esm({
  "../zero_forge/src/usenet/service.ts"() {
    "use strict";
    init_host3();
    init_log2();
    init_engine();
    init_nntp();
    init_server();
    DEFAULT_STREAM_PORT = 47810;
    g = globalThis;
    shared = g.__zeroForgeUsenet ??= { engine: null, server: null, open: null };
    THIS_MODULE = /* @__PURE__ */ Symbol("forge-usenet");
    shared.open = async (jobId, idx) => {
      const e = shared.engine?.owner === THIS_MODULE ? shared.engine.engine : (await getUsenetEngine())?.engine;
      return e ? e.open(jobId, idx) : null;
    };
  }
});

// ../zero_forge/src/resolvers/usenet.ts
var UsenetResolver;
var init_usenet = __esm({
  "../zero_forge/src/resolvers/usenet.ts"() {
    "use strict";
    init_log2();
    init_service();
    UsenetResolver = class {
      constructor() {
        this.provider = "usenet";
        this.accepts = ["usenet"];
        this.rejected = /* @__PURE__ */ new Set();
      }
      async checkAvailability(candidates) {
        const svc = await getUsenetEngine();
        const out = /* @__PURE__ */ new Map();
        for (const c of candidates) {
          if (!c.nzbId) continue;
          if (svc && await svc.engine.verdicts.isBad(c.nzbId)) {
            this.rejected.add(c.id);
            continue;
          }
          out.set(c.id, true);
        }
        return out;
      }
      async resolve(candidate, signal, hint) {
        if (!candidate.nzbId) return null;
        const svc = await getUsenetEngine();
        if (!svc) {
          logger2.warn("streams", "Usenet: no provider configured \u2014 set Usenet Provider host + login under API Keys");
          return null;
        }
        try {
          const f = await svc.engine.prepare(candidate.nzbId, hint, signal);
          return `http://127.0.0.1:${svc.streamPort}/usenet/${f.jobId}/${f.fileIndex}/${encodeURIComponent(f.name)}`;
        } catch (err) {
          logger2.warn("streams", `Usenet: can't stream "${candidate.rawTitle}": ${err.message}`);
          return null;
        }
      }
    };
  }
});

// ../zero_forge/src/resolvers/index.ts
function buildResolver(row) {
  const factory = FACTORIES[row.provider];
  return factory ? factory(row) : null;
}
function prettyProvider(provider) {
  return PROVIDER_NAMES[provider] ?? provider.charAt(0).toUpperCase() + provider.slice(1);
}
function providerTag(provider) {
  return PROVIDER_TAGS[provider] ?? provider.slice(0, 3).toUpperCase();
}
var FACTORIES, RESOLVER_PROVIDERS, PROVIDER_NAMES, PROVIDER_TAGS;
var init_resolvers = __esm({
  "../zero_forge/src/resolvers/index.ts"() {
    "use strict";
    init_alldebrid();
    init_altmount();
    init_debridlink();
    init_easydebrid();
    init_nzbdav();
    init_offcloud();
    init_premiumize();
    init_putio();
    init_realdebrid();
    init_torbox();
    init_usenet();
    FACTORIES = {
      realdebrid: (row) => new RealDebridResolver(row),
      alldebrid: (row) => new AllDebridResolver(row),
      premiumize: (row) => new PremiumizeResolver(row),
      torbox: (row) => new TorBoxResolver(row),
      easydebrid: (row) => new EasyDebridResolver(row),
      debridlink: (row) => new DebridLinkResolver(row),
      offcloud: (row) => new OffcloudResolver(row),
      putio: (row) => new PutioResolver(row),
      nzbdav: (row) => new NzbDavResolver(row),
      altmount: (row) => new AltMountResolver(row),
      usenet: () => new UsenetResolver()
    };
    RESOLVER_PROVIDERS = Object.keys(FACTORIES);
    PROVIDER_NAMES = {
      realdebrid: "Real-Debrid",
      alldebrid: "AllDebrid",
      premiumize: "Premiumize",
      torbox: "TorBox",
      easydebrid: "EasyDebrid",
      debridlink: "DebridLink",
      offcloud: "Offcloud",
      putio: "put.io",
      nzbdav: "NZBDav",
      altmount: "AltMount",
      usenet: "Usenet"
    };
    PROVIDER_TAGS = {
      realdebrid: "RD",
      alldebrid: "AD",
      premiumize: "PM",
      torbox: "TB",
      easydebrid: "ED",
      debridlink: "DL",
      offcloud: "OC",
      putio: "PIO",
      nzbdav: "NZB",
      altmount: "ALT",
      usenet: "NNTP"
    };
  }
});

// ../zero_forge/src/sort.ts
function cacheRank(s) {
  if (s.cachedOnDebrid) return 2;
  if (s.assumedCached) return 1;
  return 0;
}
function cmpForKey(key) {
  switch (key) {
    case "resolution":
      return (a, b) => RESOLUTION_RANK[b.resolution] - RESOLUTION_RANK[a.resolution];
    case "quality":
      return (a, b) => (SOURCE_TAG_RANK[b.sourceTag] ?? -1) - (SOURCE_TAG_RANK[a.sourceTag] ?? -1);
    case "cached":
      return (a, b) => cacheRank(b) - cacheRank(a);
    case "seeders":
      return (a, b) => (b.seeders ?? -1) - (a.seeders ?? -1);
    case "size":
      return (a, b) => (b.sizeBytes ?? 0) - (a.sizeBytes ?? 0);
    case "size_desc":
      return (a, b) => (a.sizeBytes ?? Number.MAX_SAFE_INTEGER) - (b.sizeBytes ?? Number.MAX_SAFE_INTEGER);
    case "name":
      return (a, b) => a.name.localeCompare(b.name);
    case "source_priority":
      return () => 0;
    default:
      return () => 0;
  }
}
function sortStreams(streams, prefs) {
  if (prefs.sortOrder.length === 0) return streams;
  const userCmps = prefs.sortOrder.map(cmpForKey);
  return [...streams].sort((a, b) => {
    const aPack = a.seasonPack ? 1 : 0;
    const bPack = b.seasonPack ? 1 : 0;
    if (aPack !== bPack) return aPack - bPack;
    for (const cmp of userCmps) {
      const r = cmp(a, b);
      if (r !== 0) return r;
    }
    return 0;
  });
}
function pinReleaseGroup(streams, preferredGroup, opts) {
  if (!preferredGroup) return streams;
  const target = preferredGroup.toLowerCase();
  const matches = [];
  const rest = [];
  for (const s of streams) {
    if (s.releaseGroup && s.releaseGroup.toLowerCase() === target) {
      matches.push(s);
    } else {
      rest.push(s);
    }
  }
  if (opts?.strict) {
    if (matches.length > 0) return matches;
  }
  if (opts?.preferPacks) {
    const packs = matches.filter((s) => s.seasonPack);
    const nonPacks = matches.filter((s) => !s.seasonPack);
    return [...packs, ...nonPacks, ...rest];
  }
  return [...matches, ...rest];
}
var RESOLUTION_RANK, SOURCE_TAG_RANK;
var init_sort = __esm({
  "../zero_forge/src/sort.ts"() {
    "use strict";
    RESOLUTION_RANK = {
      "2160p": 4,
      "1080p": 3,
      "720p": 2,
      "480p": 1,
      unknown: 0
    };
    SOURCE_TAG_RANK = {
      Remux: 7,
      BluRay: 6,
      "WEB-DL": 5,
      WEBRip: 4,
      HDTV: 3,
      DVDRip: 2,
      TS: 1,
      CAM: 0
    };
  }
});

// ../zero_forge/src/sources/comet.ts
function isCometErrorStream(s) {
  const name = (s.name ?? "").trim();
  if (/^\[(?:❌|⚠️?|ℹ️?|❗|⛔)\]/u.test(name)) return true;
  const hasHash = typeof s.infoHash === "string" && /^[a-f0-9]{40}$/i.test(s.infoHash);
  if (hasHash) return false;
  if (!s.url) return true;
  try {
    const parsed = new URL(s.url);
    return parsed.pathname === "/" || parsed.pathname === "";
  } catch {
    return true;
  }
}
function isCometSyncTrigger(s) {
  if (s.url) {
    try {
      if (new URL(s.url).pathname.includes("/debrid-sync/")) return true;
    } catch {
    }
  }
  return /🔄\]\s*Comet Sync\b/u.test(s.name ?? "");
}
function extractInfoHashFromCometPlaybackUrl(url) {
  if (!url) return null;
  const m = url.match(/\/playback\/([a-f0-9]{40})(?:\/|\?|$)/i);
  return m ? m[1].toLowerCase() : null;
}
function buildCandidate(row, s) {
  const rawTitle = s.title ?? s.behaviorHints?.filename ?? s.description ?? "";
  const directHash = s.infoHash?.toLowerCase();
  const extractedHash = directHash ?? extractInfoHashFromCometPlaybackUrl(s.url);
  const dropProxyUrl = !!extractedHash && !directHash;
  const localKey = extractedHash ? `${extractedHash}:${s.fileIdx ?? 0}` : s.url ?? "";
  const text = `${s.title ?? ""}
${s.description ?? ""}`;
  const hinted = s.behaviorHints?.videoSize;
  const sizeBytes = typeof hinted === "number" && hinted > 0 ? hinted : parseSizeBytes(text);
  const seeders = parseSeeders(text);
  return {
    id: candidateId(row.id, localKey),
    sourceType: "comet",
    sourceId: row.id,
    name: s.name ?? row.name,
    description: s.description ?? s.title ?? "",
    rawTitle,
    url: dropProxyUrl ? void 0 : s.url ?? void 0,
    infoHash: extractedHash ?? void 0,
    sizeBytes: sizeBytes ?? void 0,
    seeders: seeders ?? void 0,
    bingeGroup: s.behaviorHints?.bingeGroup,
    meta: { fileIdx: s.fileIdx, trackers: s.sources }
  };
}
var DEFAULT_HOST, COMET_SERVICE_BY_PROVIDER, CometSource;
var init_comet = __esm({
  "../zero_forge/src/sources/comet.ts"() {
    "use strict";
    init_store();
    init_base();
    init_parser2();
    DEFAULT_HOST = "https://comet.elfhosted.com";
    COMET_SERVICE_BY_PROVIDER = {
      realdebrid: "realdebrid",
      alldebrid: "alldebrid",
      premiumize: "premiumize",
      torbox: "torbox",
      easydebrid: "easydebrid",
      debridlink: "debridlink",
      offcloud: "offcloud"
      // Putio + Pikpak are Comet-supported but we don't have parity resolvers,
      // so leave them out — passing them in would have Comet pre-restore on a
      // service Zero Media can't pick up.
    };
    CometSource = class {
      constructor(row) {
        this.row = row;
        this.type = "comet";
        // "direct" because for cached streams Comet returns a pre-resolved debrid
        // URL. Uncached candidates come back with `infoHash` and route through our
        // own debrid resolvers, exactly like external-addon does.
        this.kind = "direct";
      }
      async search(query, signal) {
        if (!query.imdbId) return [];
        const cfg = readSourceConfig(this.row, {
          manifestUrl: "",
          includeP2P: false,
          removeTrash: true,
          cachedOnly: false,
          publicToken: ""
        });
        const addonType = query.kind === "movie" ? "movie" : "series";
        const id = query.kind === "series" && query.season != null && query.episode != null ? `${query.imdbId}:${query.season}:${query.episode}` : query.imdbId;
        const base2 = await this.buildBaseUrl(cfg);
        if (!base2) return [];
        const data = await fetchJson(
          `${base2}/stream/${addonType}/${encodeURIComponent(id)}.json`,
          { signal }
        );
        if (!data?.streams?.length) return [];
        const usable = [];
        for (const s of data.streams) {
          if (!s.url && !s.infoHash) continue;
          if (isCometSyncTrigger(s)) continue;
          if (isCometErrorStream(s)) {
            const msg = (s.description ?? s.title ?? s.name ?? "").replace(/\s+/g, " ").trim();
            console.warn(`[streams:comet] Upstream error: ${msg.slice(0, 200)}`);
            continue;
          }
          usable.push(s);
        }
        return usable.map((s) => buildCandidate(this.row, s));
      }
      /**
       * Build the path-prefix that holds the base64 config (or use the manifest
       * URL the admin pasted, if any). Returns the trimmed base WITHOUT the
       * trailing `/manifest.json` so the search path can be appended directly.
       */
      async buildBaseUrl(cfg) {
        if (cfg.manifestUrl) {
          const i = cfg.manifestUrl.indexOf("/manifest.json");
          const base2 = i >= 0 ? cfg.manifestUrl.slice(0, i) : cfg.manifestUrl;
          return base2.replace(/\/+$/, "");
        }
        const host2 = (this.row.url || DEFAULT_HOST).replace(/\/$/, "");
        const accounts = await listStreamAccounts("debrid");
        const debridServices = accounts.filter((a) => a.enabled === 1 && a.api_key && COMET_SERVICE_BY_PROVIDER[a.provider]).map((a) => ({
          service: COMET_SERVICE_BY_PROVIDER[a.provider],
          apiKey: a.api_key ?? ""
        }));
        if (debridServices.length === 0 && !cfg.includeP2P) return null;
        const configBlob = {
          maxResultsPerResolution: 0,
          maxSize: 0,
          cachedOnly: cfg.cachedOnly,
          removeTrash: cfg.removeTrash,
          resultFormat: ["all"],
          debridServices,
          enableTorrent: cfg.includeP2P,
          scrapeDebridAccountTorrents: false,
          debridStreamProxyPassword: "",
          languages: { required: [], exclude: [], preferred: [] },
          resolutions: {},
          options: {
            remove_ranks_under: -1e10,
            allow_english_in_languages: false,
            remove_unknown_languages: false
          }
        };
        const configB64 = Buffer.from(JSON.stringify(configBlob)).toString("base64");
        const tokenSegment = cfg.publicToken ? `/s/${encodeURIComponent(cfg.publicToken)}` : "";
        return `${host2}${tokenSegment}/${configB64}`;
      }
    };
  }
});

// ../zero_forge/src/sources/easynews.ts
function buildCandidateFromItem(raw, downHost, user, pass, rowId, rowName) {
  let hash;
  let id;
  let filename;
  let ext;
  let sizeBytes;
  if (Array.isArray(raw)) {
    hash = typeof raw[0] === "string" ? raw[0] : void 0;
    filename = typeof raw[10] === "string" ? raw[10] : void 0;
    ext = typeof raw[11] === "string" ? raw[11] : void 0;
    const s = raw[4];
    sizeBytes = typeof s === "number" ? s : typeof s === "string" ? parseInt(s, 10) || void 0 : void 0;
  } else if (raw && typeof raw === "object") {
    const it = raw;
    hash = it.hash ?? it["0"];
    id = it.id;
    filename = it.fn ?? it["10"];
    ext = it.extension ?? it.ext ?? it["11"];
    const s = it.rawSize ?? it.size ?? it["4"];
    sizeBytes = typeof s === "number" ? s : typeof s === "string" ? parseInt(s, 10) || void 0 : void 0;
  }
  if (!hash || !ext) return null;
  const fullName = `${filename ?? ""}${ext}`;
  const pathFirst = `${hash}${id ?? ""}${ext}`;
  const directUrl = `${downHost}/${pathFirst}/${encodeURIComponent(fullName)}`;
  const authedUrl = directUrl.replace(
    /^https?:\/\//,
    (m) => `${m}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@`
  );
  return {
    id: candidateId(rowId, hash),
    sourceType: "easynews",
    sourceId: rowId,
    name: rowName,
    description: fullName,
    rawTitle: fullName,
    url: authedUrl,
    sizeBytes
  };
}
function buildMovieQuery(query) {
  if (query.title && query.year) return `${query.title} ${query.year}`;
  if (query.imdbId) return query.imdbId;
  return query.title ?? null;
}
function buildEpisodeQuery(query) {
  if (!query.title) return query.imdbId ?? null;
  const s = String(query.season ?? 1).padStart(2, "0");
  const e = String(query.episode ?? 1).padStart(2, "0");
  return `${query.title} S${s}E${e}`;
}
var EasyNewsSource;
var init_easynews = __esm({
  "../zero_forge/src/sources/easynews.ts"() {
    "use strict";
    init_base();
    EasyNewsSource = class {
      constructor(row) {
        this.row = row;
        this.type = "easynews";
        this.kind = "direct";
      }
      async search(query, signal) {
        const cfg = readSourceConfig(this.row, { username: "", password: "" });
        const user = cfg.username || (this.row.api_key ?? "").split(":")[0] || "";
        const pass = cfg.password || (this.row.api_key ?? "").split(":")[1] || "";
        if (!user || !pass) return [];
        const term = query.kind === "movie" ? buildMovieQuery(query) : buildEpisodeQuery(query);
        if (!term) return [];
        const params = new URLSearchParams({
          fly: "2",
          sb: "1",
          pno: "1",
          pby: "250",
          u: "1",
          chxu: "1",
          chxgx: "1",
          st: "basic",
          gps: term,
          vv: "1",
          safeO: "0",
          s1: "relevance",
          s1d: "-",
          "fty[]": "VIDEO"
        });
        const baseHost = this.row.url || "https://members.easynews.com";
        const url = `${baseHost.replace(/\/$/, "")}/2.0/search/solr-search/?${params.toString()}`;
        const auth = Buffer.from(`${user}:${pass}`).toString("base64");
        const data = await fetchJson(url, {
          signal,
          headers: {
            Authorization: `Basic ${auth}`,
            Accept: "application/json, text/javascript, */*; q=0.9"
          }
        });
        if (!data?.data?.length) return [];
        const downHost = data.downURL && data.dlFarm && data.dlPort ? `${data.downURL}/${data.dlFarm}/${data.dlPort}` : null;
        if (!downHost) return [];
        return data.data.map((raw) => buildCandidateFromItem(raw, downHost, user, pass, this.row.id, this.row.name)).filter((c) => c !== null);
      }
    };
  }
});

// ../zero_forge/src/sources/external-addon.ts
var ExternalAddonSource;
var init_external_addon = __esm({
  "../zero_forge/src/sources/external-addon.ts"() {
    "use strict";
    init_base();
    ExternalAddonSource = class {
      constructor(row) {
        this.row = row;
        this.type = "external-addon";
        this.kind = "direct";
      }
      async search(query, signal) {
        if (!this.row.url) return [];
        const base2 = this.row.url.replace(/\/manifest\.json$/, "").replace(/\/$/, "");
        const addonType = query.kind === "movie" ? "movie" : "series";
        const id = query.kind === "series" && query.season != null && query.episode != null ? `${query.imdbId}:${query.season}:${query.episode}` : query.imdbId ?? "";
        if (!id) return [];
        const data = await fetchJson(
          `${base2}/stream/${addonType}/${encodeURIComponent(id)}.json`,
          { signal }
        );
        if (!data?.streams?.length) return [];
        return data.streams.filter((s) => !!s.url || !!s.infoHash).map((s) => {
          const rawTitle = s.title ?? s.behaviorHints?.filename ?? s.description ?? "";
          const localKey = s.url ?? `${s.infoHash}:${s.fileIdx ?? 0}`;
          return {
            id: candidateId(this.row.id, localKey),
            sourceType: "external-addon",
            sourceId: this.row.id,
            name: s.name ?? this.row.name,
            description: s.description ?? s.title ?? "",
            rawTitle,
            // Forward whichever identifier the addon gave us. The pipeline
            // routes per-candidate: `url` → no resolver; `infoHash` → debrid.
            url: s.url ?? void 0,
            infoHash: s.infoHash?.toLowerCase(),
            bingeGroup: s.behaviorHints?.bingeGroup,
            meta: { fileIdx: s.fileIdx, trackers: s.sources }
          };
        });
      }
    };
  }
});

// ../zero_forge/src/sources/torbox-search.ts
var TORBOX_SEARCH_HOST, TorBoxSearchSource;
var init_torbox_search = __esm({
  "../zero_forge/src/sources/torbox-search.ts"() {
    "use strict";
    init_base();
    TORBOX_SEARCH_HOST = "https://search-api.torbox.app";
    TorBoxSearchSource = class {
      constructor(row) {
        this.row = row;
        this.type = "torbox-search";
        // TorBox search emits both torrents and NZBs in a single response. We mark
        // it as torrent (the dominant case); the per-candidate fields (infoHash vs
        // nzbId) tell the pipeline which resolver category to use.
        this.kind = "torrent";
      }
      async search(query, signal) {
        if (!query.imdbId) return [];
        const cfg = readSourceConfig(this.row, {
          searchKind: "both"
        });
        const apiKey = this.row.api_key ?? "";
        if (!apiKey) return [];
        const tbImdbId = query.imdbId;
        const path4 = query.kind === "movie" ? `/torrents/imdb:${tbImdbId}` : `/torrents/imdb:${tbImdbId}?season=${query.season ?? 1}&episode=${query.episode ?? 1}`;
        const data = await fetchJson(`${TORBOX_SEARCH_HOST}${path4}`, {
          signal,
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (!data?.data) return [];
        const out = [];
        if (cfg.searchKind !== "usenet" && data.data.torrents?.length) {
          for (const t of data.data.torrents) {
            if (!t.hash) continue;
            out.push({
              id: candidateId(this.row.id, t.hash),
              sourceType: "torbox-search",
              sourceId: this.row.id,
              name: this.row.name,
              description: t.raw_title ?? t.title ?? "",
              rawTitle: t.raw_title ?? t.title ?? "",
              infoHash: t.hash.toLowerCase(),
              sizeBytes: t.size ?? void 0,
              seeders: t.last_known_seeders ?? void 0,
              meta: { tracker: t.tracker, magnet: t.magnet, age: t.age }
            });
          }
        }
        if (cfg.searchKind !== "torrent" && data.data.nzbs?.length) {
          for (const n of data.data.nzbs) {
            if (!n.nzb) continue;
            out.push({
              id: candidateId(this.row.id, n.nzb),
              sourceType: "torbox-search",
              sourceId: this.row.id,
              name: this.row.name,
              description: n.raw_title ?? n.title ?? "",
              rawTitle: n.raw_title ?? n.title ?? "",
              nzbId: n.nzb,
              sizeBytes: n.size ?? void 0,
              meta: { age: n.age }
            });
          }
        }
        return out;
      }
    };
  }
});

// ../zero_forge/src/sources/torrentio.ts
function buildCandidate2(row, s) {
  const rawTitle = s.title ?? s.behaviorHints?.filename ?? "";
  const sizeBytes = pullSize(rawTitle);
  const seeders = pullSeeders(rawTitle);
  return {
    id: candidateId(row.id, `${s.infoHash}:${s.fileIdx ?? 0}`),
    sourceType: "torrentio",
    sourceId: row.id,
    name: s.name ?? "Torrentio",
    description: rawTitle,
    rawTitle,
    infoHash: s.infoHash.toLowerCase(),
    sizeBytes: sizeBytes ?? void 0,
    seeders: seeders ?? void 0,
    bingeGroup: s.behaviorHints?.bingeGroup,
    meta: { fileIdx: s.fileIdx, trackers: s.sources }
  };
}
function pullSize(text) {
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(b|kb|mb|gb|tb|kib|mib|gib|tib)\b/i);
  if (!m) return null;
  const v = parseFloat(m[1].replace(",", "."));
  if (!Number.isFinite(v)) return null;
  const mult = {
    b: 1,
    kb: 1024,
    kib: 1024,
    mb: 1024 ** 2,
    mib: 1024 ** 2,
    gb: 1024 ** 3,
    gib: 1024 ** 3,
    tb: 1024 ** 4,
    tib: 1024 ** 4
  };
  return Math.round(v * (mult[m[2].toLowerCase()] ?? 1));
}
function pullSeeders(text) {
  const m = text.match(/👤\s*(\d+)|seeders?\s*[:=]?\s*(\d+)/i);
  if (!m) return null;
  return parseInt(m[1] ?? m[2], 10);
}
var DEFAULT_HOST2, TorrentioSource;
var init_torrentio = __esm({
  "../zero_forge/src/sources/torrentio.ts"() {
    "use strict";
    init_base();
    DEFAULT_HOST2 = "https://torrentio.strem.fun";
    TorrentioSource = class {
      constructor(row) {
        this.row = row;
        this.type = "torrentio";
        this.kind = "torrent";
      }
      async search(query, signal) {
        const cfg = readSourceConfig(this.row, { configToken: "" });
        const host2 = (this.row.url || DEFAULT_HOST2).replace(/\/manifest\.json$/i, "").replace(/\/$/, "");
        const tokenPath = cfg.configToken ? `/${cfg.configToken.replace(/^\/+|\/+$/g, "")}` : "";
        if (!query.imdbId) return [];
        const addonType = query.kind === "movie" ? "movie" : "series";
        const streamPath = addonType === "movie" ? `/stream/movie/${query.imdbId}.json` : `/stream/series/${query.imdbId}:${query.season ?? 1}:${query.episode ?? 1}.json`;
        const data = await fetchJson(`${host2}${tokenPath}${streamPath}`, { signal });
        if (!data?.streams?.length) return [];
        return data.streams.filter((s) => !!s.infoHash).map((s) => buildCandidate2(this.row, s));
      }
    };
  }
});

// ../zero_forge/src/sources/torznab.ts
function parseTorznabXml(xml, row, isUsenet) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = pickTag(block, "title") ?? "";
    const link = pickTag(block, "link") ?? "";
    const guid = pickTag(block, "guid") ?? link;
    const description = pickTag(block, "description") ?? "";
    const attrs = pickAttrs(block);
    const enclosure = pickEnclosure(block);
    const nzbUrl = enclosure?.type === "application/x-nzb" ? enclosure.url : enclosure?.url ?? link;
    const infoHash = (attrs.get("infohash") ?? attrs.get("infoHash"))?.toLowerCase() ?? void 0;
    const seedersStr = attrs.get("seeders");
    const enclosureSize = enclosure?.length;
    const sizeStr = attrs.get("size") ?? pickTag(block, "size") ?? enclosureSize ?? void 0;
    const seeders = seedersStr ? parseInt(seedersStr, 10) : void 0;
    const sizeBytes = sizeStr ? parseInt(sizeStr, 10) : void 0;
    if (!link && !infoHash && !nzbUrl) continue;
    if (isUsenet) {
      if (!nzbUrl) continue;
      items.push({
        id: candidateId(row.id, guid || nzbUrl),
        sourceType: row.source_type,
        sourceId: row.id,
        name: row.name,
        description: description || title,
        rawTitle: title,
        nzbId: nzbUrl,
        // NZB download URL — usenet resolvers fetch + submit this.
        sizeBytes,
        meta: { guid }
      });
    } else if (infoHash) {
      items.push({
        id: candidateId(row.id, infoHash),
        sourceType: row.source_type,
        sourceId: row.id,
        name: row.name,
        description: description || title,
        rawTitle: title,
        infoHash,
        sizeBytes,
        seeders,
        meta: { guid, magnetLink: link.startsWith("magnet:") ? link : void 0 }
      });
    }
  }
  return items;
}
function pickTag(block, tag) {
  const r = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(r);
  if (!m) return void 0;
  return decodeEntities2(m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim());
}
function decodeEntities2(s) {
  let out = s;
  for (let i = 0; i < 2 && /&(?:[a-z]+|#\d+|#x[0-9a-f]+);/i.test(out); i++) {
    out = out.replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, "&");
  }
  return out;
}
function pickAttrs(block) {
  const out = /* @__PURE__ */ new Map();
  const r = /<(?:torznab|newznab):attr\s+name="([^"]+)"\s+value="([^"]*)"/g;
  let m;
  while ((m = r.exec(block)) !== null) {
    out.set(m[1].toLowerCase(), m[2]);
  }
  return out;
}
function pickEnclosure(block) {
  const m = /<enclosure\s+([^>]*?)\/?>/i.exec(block);
  if (!m) return null;
  const tag = m[1];
  const url = decodeEntities2(/\burl="([^"]*)"/i.exec(tag)?.[1] ?? "");
  if (!url) return null;
  const length = /\blength="([^"]*)"/i.exec(tag)?.[1];
  const type = /\btype="([^"]*)"/i.exec(tag)?.[1];
  return { url, length, type };
}
var TorznabSource;
var init_torznab = __esm({
  "../zero_forge/src/sources/torznab.ts"() {
    "use strict";
    init_base();
    TorznabSource = class {
      constructor(row) {
        this.row = row;
        this.type = row.source_type;
        const isUsenet = row.source_type === "newznab" || row.source_type === "nzbhydra";
        this.kind = isUsenet ? "usenet" : "torrent";
      }
      async search(query, signal) {
        if (!this.row.url) return [];
        const cfg = readSourceConfig(this.row, {
          kind: this.kind === "usenet" ? "newznab" : "torznab",
          categories: this.kind === "usenet" ? query.kind === "movie" ? [2e3] : [5e3] : query.kind === "movie" ? [2e3] : [5e3],
          apiKey: this.row.api_key ?? ""
        });
        const params = new URLSearchParams();
        params.set("t", query.kind === "movie" ? "movie" : "tvsearch");
        if (cfg.apiKey || this.row.api_key) params.set("apikey", cfg.apiKey || this.row.api_key);
        if (cfg.categories?.length) params.set("cat", cfg.categories.join(","));
        if (query.imdbId) params.set("imdbid", query.imdbId.replace(/^tt/i, ""));
        if (query.kind === "series") {
          if (query.season != null) params.set("season", String(query.season));
          if (query.episode != null) params.set("ep", String(query.episode));
        }
        if (query.title && (query.kind === "series" || !query.imdbId)) {
          params.set("q", query.title);
        }
        const base2 = this.row.url.replace(/\/$/, "");
        const url = `${base2}/api?${params.toString()}`;
        const xml = await fetchText(url, { signal });
        if (!xml) return [];
        return parseTorznabXml(xml, this.row, this.kind === "usenet");
      }
    };
  }
});

// ../zero_forge/src/sources/zilean.ts
function buildCandidate3(row, item) {
  const rawTitle = item.raw_title ?? item.parsed_title ?? "";
  return {
    id: candidateId(row.id, item.info_hash),
    sourceType: "zilean",
    sourceId: row.id,
    name: row.name,
    description: rawTitle,
    rawTitle,
    infoHash: item.info_hash.toLowerCase(),
    sizeBytes: parseZileanSize(item.size),
    meta: {
      parsedTitle: item.parsed_title,
      year: item.year,
      season: item.season,
      episode: item.episode
    }
  };
}
function parseZileanSize(size) {
  if (size == null) return void 0;
  if (typeof size === "number") return size > 0 ? size : void 0;
  const m = String(size).match(/(\d+(?:[.,]\d+)?)\s*(b|kb|mb|gb|tb|kib|mib|gib|tib)\b/i);
  if (!m) {
    const n = parseInt(size, 10);
    return Number.isFinite(n) && n > 0 ? n : void 0;
  }
  const v = parseFloat(m[1].replace(",", "."));
  if (!Number.isFinite(v)) return void 0;
  const mult = {
    b: 1,
    kb: 1024,
    kib: 1024,
    mb: 1024 ** 2,
    mib: 1024 ** 2,
    gb: 1024 ** 3,
    gib: 1024 ** 3,
    tb: 1024 ** 4,
    tib: 1024 ** 4
  };
  return Math.round(v * (mult[m[2].toLowerCase()] ?? 1));
}
var ZileanSource;
var init_zilean = __esm({
  "../zero_forge/src/sources/zilean.ts"() {
    "use strict";
    init_base();
    ZileanSource = class {
      constructor(row) {
        this.row = row;
        this.type = "zilean";
        this.kind = "torrent";
      }
      async search(query, signal) {
        if (!this.row.url) return [];
        if (!query.title) return [];
        const cfg = readSourceConfig(this.row, { resolution: "" });
        const params = new URLSearchParams();
        params.set("Query", query.title);
        if (query.year) params.set("Year", String(query.year));
        if (query.kind === "series") {
          if (query.season != null) params.set("Season", String(query.season));
          if (query.episode != null) params.set("Episode", String(query.episode));
        }
        if (cfg.resolution) params.set("Resolution", cfg.resolution);
        const base2 = this.row.url.replace(/\/$/, "");
        const headers = {};
        if (this.row.api_key) headers.Authorization = `Bearer ${this.row.api_key}`;
        const data = await fetchJson(
          `${base2}/dmm/filtered?${params.toString()}`,
          { signal, headers }
        );
        if (!Array.isArray(data) || data.length === 0) return [];
        return data.filter((item) => !!item.info_hash).map((item) => buildCandidate3(this.row, item));
      }
    };
  }
});

// ../zero_forge/src/sources/index.ts
function buildSource(row) {
  const factory = FACTORIES2[row.source_type];
  return factory ? factory(row) : null;
}
var FACTORIES2, SOURCE_TYPES;
var init_sources = __esm({
  "../zero_forge/src/sources/index.ts"() {
    "use strict";
    init_comet();
    init_easynews();
    init_external_addon();
    init_torbox_search();
    init_torrentio();
    init_torznab();
    init_zilean();
    FACTORIES2 = {
      torrentio: (row) => new TorrentioSource(row),
      torznab: (row) => new TorznabSource(row),
      newznab: (row) => new TorznabSource(row),
      nzbhydra: (row) => new TorznabSource(row),
      zilean: (row) => new ZileanSource(row),
      comet: (row) => new CometSource(row),
      easynews: (row) => new EasyNewsSource(row),
      "torbox-search": (row) => new TorBoxSearchSource(row),
      "external-addon": (row) => new ExternalAddonSource(row)
    };
    SOURCE_TYPES = Object.keys(FACTORIES2);
  }
});

// ../zero_forge/src/usenet/screen.ts
async function screenUsenet(streams, isUsenet) {
  const queue = streams.filter((s) => s.nzbId && isUsenet(s));
  if (!queue.length) return streams;
  const svc = await getUsenetEngine().catch(() => null);
  if (!svc) return streams;
  const signal = AbortSignal.timeout(BUDGET_MS);
  const dead = /* @__PURE__ */ new Set();
  let alive = 0;
  let screened = 0;
  let grabbed = 0;
  let next = 0;
  const worker = async () => {
    while (next < queue.length && alive < WANT_ALIVE && grabbed < MAX_SCREENED && !signal.aborted) {
      const s = queue[next++];
      const known2 = await svc.engine.verdicts.get(s.nzbId);
      if (!known2) grabbed += 1;
      const r = await svc.engine.screen(s.nzbId, signal);
      screened += 1;
      if (r === "missing") dead.add(s.id);
      else if (r === "alive") alive += 1;
    }
  };
  const t0 = Date.now();
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  if (dead.size || grabbed) {
    logger2.info(
      "streams",
      `Usenet: screened ${screened} releases (${grabbed} new) \u2192 ${alive} alive, ${dead.size} gone from the provider (dropped) in ${Date.now() - t0} ms`
    );
  }
  return dead.size ? streams.filter((s) => !dead.has(s.id)) : streams;
}
var WANT_ALIVE, MAX_SCREENED, CONCURRENCY, BUDGET_MS;
var init_screen = __esm({
  "../zero_forge/src/usenet/screen.ts"() {
    "use strict";
    init_log2();
    init_service();
    WANT_ALIVE = 5;
    MAX_SCREENED = 12;
    CONCURRENCY = 4;
    BUDGET_MS = 8e3;
  }
});

// ../zero_forge/src/formatter.ts
function renderHdr(s, mode) {
  const tags = [];
  if (s.hdrFlags & HDR_FLAG_HDR10_PLUS2) tags.push("HDR10+");
  else if (s.hdrFlags & HDR_FLAG_HDR102) tags.push("HDR");
  if (s.hdrFlags & HDR_FLAG_DV2) tags.push("DV");
  if (s.hdrFlags & HDR_FLAG_HLG2) tags.push("HLG");
  if (tags.length === 0) return "";
  if (mode === "emoji") {
    return tags.map((t) => t === "DV" ? "\u{1F31F} DV" : t.startsWith("HDR") ? `\u{1F308} ${t}` : t === "HLG" ? "\u{1F3A8} HLG" : t).join(" ");
  }
  if (mode === "bracket") return tags.map((t) => `[${t}]`).join("");
  return tags.join(" \xB7 ");
}
function renderAudio(s) {
  if (!s.audioCodec) return "";
  const map = {
    truehd: "TrueHD",
    "dts-hd": "DTS-HD",
    dts: "DTS",
    eac3: "EAC3",
    ac3: "AC3",
    aac: "AAC",
    opus: "Opus",
    flac: "FLAC",
    mp3: "MP3"
  };
  return map[s.audioCodec] ?? s.audioCodec.toUpperCase();
}
function renderSeasonEpisode(s, mode) {
  if (s.seasons.length === 0 && s.episodes.length === 0) return "";
  const ss = s.seasons[0];
  const ee = s.episodes[0];
  if (ss == null && ee == null) return "";
  if (mode === "full") {
    const sPart2 = ss != null ? `S${String(ss).padStart(2, "0")}` : "";
    const ePart2 = ee != null ? `E${String(ee).padStart(2, "0")}` : "";
    return `${sPart2}${ePart2}`;
  }
  if (mode === "short") {
    if (ss != null && ee != null) return `${ss}x${String(ee).padStart(2, "0")}`;
    if (ee != null) return `Ep ${ee}`;
    return `S${ss}`;
  }
  const sPart = ss != null ? `s${String(ss).padStart(2, "0")}` : "";
  const ePart = ee != null ? `e${String(ee).padStart(2, "0")}` : "";
  return [sPart, ePart].filter(Boolean).join("\xB7");
}
function renderPack(s, mode) {
  if (!s.seasonPack) return "";
  if (mode === "emoji") return "\u{1F4E6} Pack";
  if (mode === "short") {
    if (s.seasons.length === 1) return `[S${String(s.seasons[0]).padStart(2, "0")} Pack]`;
    if (s.seasons.length > 1) {
      const a = String(s.seasons[0]).padStart(2, "0");
      const b = String(s.seasons[s.seasons.length - 1]).padStart(2, "0");
      return `[S${a}-S${b} Pack]`;
    }
    if (s.episodes.length > 5) return `[${s.episodes.length}-Ep Batch]`;
    return "[Pack]";
  }
  return "[Pack]";
}
function extractFilename(s) {
  const text = `${s.description ?? ""}
${s.rawTitle ?? ""}`;
  for (const line of text.split(/[\r\n]/)) {
    const t = line.trim();
    if (/\.(mkv|mp4|avi|m4v|ts|webm)$/i.test(t)) return t;
  }
  return s.rawTitle ?? "";
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[unit]}`;
}
function formatBytesCompact(bytes) {
  return formatBytes(bytes).replace(" ", "").replace("KB", "K").replace("MB", "M").replace("GB", "G").replace("TB", "T");
}
function langToFlag(code) {
  return FLAG_MAP[code.toLowerCase()] ?? code.toUpperCase();
}
function listCategoryStyles() {
  return Object.keys(CATEGORY_STYLES).map((category) => ({
    category,
    styles: CATEGORY_STYLES[category].map(({ id, label }) => ({ id, label }))
  }));
}
function renderRow(row, s, ctx) {
  const parts = [];
  for (const block of row.blocks) {
    const styleDef = CATEGORY_STYLES[block.category]?.find((d) => d.id === block.style);
    if (!styleDef) continue;
    const chunk = styleDef.render(s, ctx);
    if (chunk) parts.push(chunk);
  }
  const sep = row.separator || " ";
  return parts.join(sep);
}
function formatStream(s, cfg, ctx = {}) {
  const title = renderRow(cfg.title, s, ctx);
  const subtitle = cfg.subtitle.map((row) => renderRow(row, s, ctx)).filter(Boolean).join("\n");
  return { title, subtitle };
}
function hasAnySeriesContextBlock(cfg) {
  const rows = [cfg.title, ...cfg.subtitle];
  return rows.some(
    (row) => row.blocks.some((block) => block.category === "seasonEpisode" || block.category === "episodeName")
  );
}
function injectDefaultSeriesContext(cfg) {
  if (hasAnySeriesContextBlock(cfg)) return cfg;
  const titleBlocks = [
    ...cfg.title.blocks,
    { category: "seasonEpisode", style: "short" }
  ];
  const subtitle = cfg.subtitle.length > 0 ? cfg.subtitle.map(
    (row, idx) => idx === 0 ? { ...row, blocks: [{ category: "episodeName", style: "plain" }, ...row.blocks] } : row
  ) : [{ separator: " \xB7 ", blocks: [{ category: "episodeName", style: "plain" }] }];
  return {
    title: { ...cfg.title, blocks: titleBlocks },
    subtitle
  };
}
function parseFormatterConfig(raw) {
  if (!raw || typeof raw !== "object") return DEFAULT_FORMATTER_CONFIG;
  const obj = raw;
  const validRow = (row) => {
    if (!row || typeof row !== "object") return null;
    const r = row;
    if (!Array.isArray(r.blocks)) return null;
    const blocks = [];
    for (const b of r.blocks.slice(0, 20)) {
      if (!b || typeof b !== "object") continue;
      const { category, style } = b;
      if (typeof category !== "string" || typeof style !== "string") continue;
      const cat = CATEGORY_STYLES[category];
      if (!cat) continue;
      if (!cat.find((s) => s.id === style)) continue;
      blocks.push({ category, style });
    }
    return { blocks, separator: typeof r.separator === "string" ? r.separator : " " };
  };
  const title = validRow(obj.title) ?? DEFAULT_FORMATTER_CONFIG.title;
  const subtitleRaw = Array.isArray(obj.subtitle) ? obj.subtitle.slice(0, 8) : [];
  const subtitle = subtitleRaw.map(validRow).filter((r) => !!r);
  if (subtitle.length === 0) return DEFAULT_FORMATTER_CONFIG;
  return injectDefaultSeriesContext({ title, subtitle });
}
var RES_MAP_NAMES, RES_MAP_EMOJI, CATEGORY_STYLES, HDR_FLAG_HDR102, HDR_FLAG_DV2, HDR_FLAG_HDR10_PLUS2, HDR_FLAG_HLG2, FLAG_MAP, DEFAULT_FORMATTER_CONFIG, PRESET_MINIMAL, PRESET_PRISM, PRESETS;
var init_formatter = __esm({
  "../zero_forge/src/formatter.ts"() {
    "use strict";
    RES_MAP_NAMES = {
      "2160p": "4K",
      "1080p": "FHD",
      "720p": "HD",
      "480p": "SD",
      "unknown": ""
    };
    RES_MAP_EMOJI = {
      "2160p": "\u{1F525} 4K",
      "1080p": "\u{1F680} FHD",
      "720p": "\u{1F4BF} HD",
      "480p": "\u{1F4FA} SD",
      "unknown": ""
    };
    CATEGORY_STYLES = {
      title: [
        {
          id: "plain",
          label: "Plain (Dune Part Two)",
          render: (s) => s.parsedTitle ?? ""
        },
        {
          id: "withYear",
          label: "With year (Dune Part Two (2024))",
          render: (s) => {
            if (!s.parsedTitle) return "";
            return s.parsedYear ? `${s.parsedTitle} (${s.parsedYear})` : s.parsedTitle;
          }
        },
        {
          id: "withEdition",
          label: "With edition (Dune\u2026 \xB7 Director's Cut)",
          render: (s) => {
            if (!s.parsedTitle) return "";
            return s.editions.length > 0 ? `${s.parsedTitle} \xB7 ${s.editions.join(" \xB7 ")}` : s.parsedTitle;
          }
        },
        {
          id: "full",
          label: "Full (Dune Part Two (2024) \xB7 Director's Cut)",
          render: (s) => {
            if (!s.parsedTitle) return "";
            const yearPart = s.parsedYear ? ` (${s.parsedYear})` : "";
            const editionPart = s.editions.length > 0 ? ` \xB7 ${s.editions.join(" \xB7 ")}` : "";
            return `${s.parsedTitle}${yearPart}${editionPart}`;
          }
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F3AC} Dune Part Two)",
          render: (s) => s.parsedTitle ? `\u{1F3AC} ${s.parsedTitle}` : ""
        }
      ],
      edition: [
        {
          id: "text",
          label: "Text (Director's Cut)",
          render: (s) => s.editions.join(" \xB7 ")
        },
        {
          id: "bracket",
          label: "Bracket ([Director's Cut])",
          render: (s) => s.editions.length > 0 ? s.editions.map((e) => `[${e}]`).join("") : ""
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F3AC} Director's Cut)",
          render: (s) => s.editions.length > 0 ? `\u{1F3AC} ${s.editions.join(" \xB7 ")}` : ""
        }
      ],
      resolution: [
        {
          id: "numbers",
          label: "Numbers (2160p / 1080p)",
          render: (s) => s.resolution !== "unknown" ? s.resolution : ""
        },
        {
          id: "names",
          label: "Names (4K / FHD / HD)",
          render: (s) => RES_MAP_NAMES[s.resolution] ?? ""
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F525} 4K)",
          render: (s) => RES_MAP_EMOJI[s.resolution] ?? ""
        }
      ],
      quality: [
        {
          id: "full",
          label: "Full (BluRay Remux)",
          render: (s) => s.sourceTag ?? ""
        },
        {
          id: "short",
          label: "Short (BR / RMX / WEB)",
          render: (s) => {
            if (!s.sourceTag) return "";
            const map = {
              BluRay: "BR",
              Remux: "RMX",
              "WEB-DL": "WEB",
              WEBRip: "WRP",
              HDTV: "HDTV",
              DVDRip: "DVD",
              CAM: "CAM",
              TS: "TS"
            };
            return map[s.sourceTag] ?? s.sourceTag;
          }
        },
        {
          id: "tagged",
          label: "Tagged ([BluRay])",
          render: (s) => s.sourceTag ? `[${s.sourceTag}]` : ""
        }
      ],
      hdr: [
        {
          id: "emoji",
          label: "Emoji (\u{1F308} HDR / \u{1F31F} DV)",
          render: (s) => renderHdr(s, "emoji")
        },
        {
          id: "text",
          label: "Text (HDR \xB7 DV)",
          render: (s) => renderHdr(s, "text")
        },
        {
          id: "bracket",
          label: "Bracket ([HDR][DV])",
          render: (s) => renderHdr(s, "bracket")
        }
      ],
      codec: [
        {
          id: "modern",
          label: "Modern (HEVC / AVC)",
          render: (s) => {
            if (!s.codec) return "";
            const map = { h265: "HEVC", h264: "AVC", av1: "AV1", vp9: "VP9", mpeg2: "MPEG-2" };
            return map[s.codec] ?? s.codec;
          }
        },
        {
          id: "encoder",
          label: "Encoder (x265 / x264)",
          render: (s) => {
            if (!s.codec) return "";
            const map = { h265: "x265", h264: "x264", av1: "AV1", vp9: "VP9", mpeg2: "MPEG-2" };
            return map[s.codec] ?? s.codec;
          }
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F39E}\uFE0F HEVC)",
          render: (s) => {
            if (!s.codec) return "";
            const map = { h265: "HEVC", h264: "AVC", av1: "AV1", vp9: "VP9", mpeg2: "MPEG-2" };
            return `\u{1F39E}\uFE0F ${map[s.codec] ?? s.codec}`;
          }
        }
      ],
      audio: [
        {
          id: "text",
          label: "Text (Atmos / DTS-HD)",
          render: (s) => renderAudio(s)
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F3A7} Atmos)",
          render: (s) => {
            const v = renderAudio(s);
            return v ? `\u{1F3A7} ${v}` : "";
          }
        }
      ],
      channels: [
        {
          id: "number",
          label: "Number (5.1 / 7.1)",
          render: (s) => s.audioChannels ?? ""
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F50A} 5.1)",
          render: (s) => s.audioChannels ? `\u{1F50A} ${s.audioChannels}` : ""
        }
      ],
      languages: [
        {
          id: "flags",
          label: "Flags (\u{1F1FA}\u{1F1F8} \u{1F1EA}\u{1F1F8})",
          render: (s) => s.languages.map(langToFlag).filter(Boolean).join(" ")
        },
        {
          id: "codes",
          label: "Codes (EN \xB7 ES)",
          render: (s) => s.languages.map((l) => l.toUpperCase()).join(" \xB7 ")
        },
        {
          id: "compact",
          label: "Compact (\u{1F310} 3 langs)",
          render: (s) => s.languages.length > 0 ? `\u{1F310} ${s.languages.length} lang${s.languages.length > 1 ? "s" : ""}` : ""
        }
      ],
      sourceType: [
        {
          id: "emoji",
          label: "Emoji (\u26A1 Debrid / \u{1F331} P2P)",
          render: (s, ctx) => {
            if (s.url?.startsWith("magnet:") || s.infoHash) {
              if (s.assumedCached) return ctx.debridTag ? `\u2754 ${ctx.debridTag}` : "\u2754";
              if (!s.cachedOnDebrid) return "\u{1F331}";
              return ctx.debridTag ? `\u26A1 ${ctx.debridTag}` : "\u26A1";
            }
            if (s.nzbId) return "\u{1F4F0}";
            return s.url ? "\u{1F4BB}" : "";
          }
        },
        {
          id: "text",
          label: "Text ([Debrid] / [P2P])",
          render: (s, ctx) => {
            if (s.infoHash) {
              if (s.assumedCached) return ctx.debridTag ? `[${ctx.debridTag}?]` : "[Debrid?]";
              if (!s.cachedOnDebrid) return "[P2P]";
              return ctx.debridTag ? `[${ctx.debridTag}]` : "[Debrid]";
            }
            if (s.nzbId) return "[Usenet]";
            return s.url ? "[Web]" : "";
          }
        }
      ],
      cache: [
        {
          id: "emoji",
          label: "Emoji (\u26A1 / \u2754 / \u23F3)",
          render: (s, ctx) => {
            if (!s.resolverId) return "";
            if (s.assumedCached) return ctx.debridTag ? `\u2754 ${ctx.debridTag}` : "\u2754";
            if (!s.cachedOnDebrid) return "\u23F3";
            return ctx.debridTag ? `\u26A1 ${ctx.debridTag}` : "\u26A1";
          }
        },
        {
          id: "text",
          // Stremio-style: "[RD+]" = verified cached, "[RD?]" = assumed (provider
          // can't verify), "[RD ⏳]" = needs download. Shows which debrid + status.
          label: "Text ([RD+] / [RD?] / [Download])",
          render: (s, ctx) => {
            if (!s.resolverId) return "";
            if (s.assumedCached) return ctx.debridTag ? `[${ctx.debridTag}?]` : "[Cache?]";
            if (s.cachedOnDebrid) return ctx.debridTag ? `[${ctx.debridTag}+]` : "[Cached]";
            return ctx.debridTag ? `[${ctx.debridTag} \u23F3]` : "[Download]";
          }
        },
        {
          id: "name",
          label: "Provider name (Real-Debrid)",
          render: (s, ctx) => {
            if (!s.resolverId || !ctx.debridName) return "";
            if (s.assumedCached) return `${ctx.debridName} (unverified)`;
            return s.cachedOnDebrid ? ctx.debridName : `${ctx.debridName} (download)`;
          }
        }
      ],
      size: [
        {
          id: "smart",
          label: "Smart (4.5 GB)",
          render: (s) => s.sizeBytes ? formatBytes(s.sizeBytes) : ""
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F4E6} 4.5 GB)",
          render: (s) => s.sizeBytes ? `\u{1F4E6} ${formatBytes(s.sizeBytes)}` : ""
        },
        {
          id: "compact",
          label: "Compact (4.5G)",
          render: (s) => s.sizeBytes ? formatBytesCompact(s.sizeBytes) : ""
        }
      ],
      seeders: [
        {
          id: "number",
          label: "Number (245)",
          render: (s) => s.seeders != null ? String(s.seeders) : ""
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F464} 245)",
          render: (s) => s.seeders != null ? `\u{1F464} ${s.seeders}` : ""
        }
      ],
      releaseGroup: [
        {
          id: "text",
          label: "Text (FLUX)",
          render: (s) => s.releaseGroup ?? ""
        },
        {
          id: "bracket",
          label: "Bracket ([FLUX])",
          render: (s) => s.releaseGroup ? `[${s.releaseGroup}]` : ""
        },
        {
          id: "tagged",
          label: "Tagged (\u{1F3F7}\uFE0F FLUX)",
          render: (s) => s.releaseGroup ? `\u{1F3F7}\uFE0F ${s.releaseGroup}` : ""
        }
      ],
      seasonEpisode: [
        {
          id: "full",
          label: "Full (S01E05)",
          render: (s) => renderSeasonEpisode(s, "full")
        },
        {
          id: "short",
          label: "Short (1x05)",
          render: (s) => renderSeasonEpisode(s, "short")
        },
        {
          id: "compact",
          label: "Compact (s01\xB7e05)",
          render: (s) => renderSeasonEpisode(s, "compact")
        }
      ],
      episodeName: [
        {
          id: "plain",
          label: "Plain (Pilot)",
          render: (_s, ctx) => ctx.episodeName ?? ""
        },
        {
          id: "bracket",
          label: "Bracket ([Pilot])",
          render: (_s, ctx) => ctx.episodeName ? `[${ctx.episodeName}]` : ""
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F3AC} Pilot)",
          render: (_s, ctx) => ctx.episodeName ? `\u{1F3AC} ${ctx.episodeName}` : ""
        }
      ],
      pack: [
        {
          id: "bracket",
          label: "Bracket ([Pack])",
          render: (s) => renderPack(s, "bracket")
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F4E6} Pack)",
          render: (s) => renderPack(s, "emoji")
        },
        {
          id: "short",
          label: "Short ([S1 Pack])",
          render: (s) => renderPack(s, "short")
        }
      ],
      addon: [
        {
          id: "name",
          label: "Name (Comet)",
          render: (_s, ctx) => ctx.addonName ?? ""
        },
        {
          id: "bracket",
          label: "Bracket ([Comet])",
          render: (_s, ctx) => ctx.addonName ? `[${ctx.addonName}]` : ""
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F50D} Comet)",
          render: (_s, ctx) => ctx.addonName ? `\u{1F50D} ${ctx.addonName}` : ""
        }
      ],
      filename: [
        {
          id: "full",
          label: "Full (full filename)",
          render: (s) => extractFilename(s)
        },
        {
          id: "truncated",
          label: "Truncated (40 chars)",
          render: (s) => {
            const f = extractFilename(s);
            return f.length > 40 ? f.slice(0, 37) + "\u2026" : f;
          }
        },
        {
          id: "emoji",
          label: "Emoji (\u{1F4C1} filename)",
          render: (s) => {
            const f = extractFilename(s);
            return f ? `\u{1F4C1} ${f}` : "";
          }
        }
      ],
      separator: [
        { id: "dot", label: "Dot ( \xB7 )", render: () => "\xB7" },
        { id: "pipe", label: "Pipe ( | )", render: () => "|" },
        { id: "dash", label: "Dash ( \u2013 )", render: () => "\u2013" },
        { id: "bullet", label: "Bullet ( \u2022 )", render: () => "\u2022" }
      ],
      newline: [{ id: "break", label: "New line", render: () => "\n" }]
    };
    HDR_FLAG_HDR102 = 1;
    HDR_FLAG_DV2 = 2;
    HDR_FLAG_HDR10_PLUS2 = 4;
    HDR_FLAG_HLG2 = 8;
    FLAG_MAP = {
      en: "\u{1F1FA}\u{1F1F8}",
      es: "\u{1F1EA}\u{1F1F8}",
      fr: "\u{1F1EB}\u{1F1F7}",
      de: "\u{1F1E9}\u{1F1EA}",
      it: "\u{1F1EE}\u{1F1F9}",
      pt: "\u{1F1F5}\u{1F1F9}",
      ru: "\u{1F1F7}\u{1F1FA}",
      ja: "\u{1F1EF}\u{1F1F5}",
      ko: "\u{1F1F0}\u{1F1F7}",
      zh: "\u{1F1E8}\u{1F1F3}",
      hi: "\u{1F1EE}\u{1F1F3}",
      ar: "\u{1F1F8}\u{1F1E6}",
      multi: "\u{1F310}",
      dual: "\u{1F3AD}"
    };
    DEFAULT_FORMATTER_CONFIG = {
      title: {
        separator: " ",
        blocks: [
          { category: "cache", style: "emoji" },
          { category: "addon", style: "bracket" },
          { category: "resolution", style: "names" },
          { category: "seasonEpisode", style: "short" },
          { category: "pack", style: "short" }
        ]
      },
      subtitle: [
        {
          separator: " \xB7 ",
          blocks: [{ category: "episodeName", style: "plain" }]
        },
        {
          separator: " \xB7 ",
          blocks: [
            { category: "quality", style: "full" },
            { category: "codec", style: "modern" },
            { category: "hdr", style: "emoji" }
          ]
        },
        {
          separator: " \xB7 ",
          blocks: [
            { category: "audio", style: "text" },
            { category: "channels", style: "number" },
            { category: "languages", style: "flags" }
          ]
        },
        {
          separator: " \xB7 ",
          blocks: [
            { category: "size", style: "emoji" },
            { category: "seeders", style: "emoji" },
            { category: "releaseGroup", style: "tagged" }
          ]
        }
      ]
    };
    PRESET_MINIMAL = {
      title: {
        separator: " ",
        blocks: [
          { category: "resolution", style: "names" },
          { category: "seasonEpisode", style: "short" },
          { category: "pack", style: "bracket" }
        ]
      },
      subtitle: [
        {
          separator: " \xB7 ",
          blocks: [
            { category: "episodeName", style: "plain" },
            { category: "quality", style: "short" },
            { category: "size", style: "smart" },
            { category: "languages", style: "codes" }
          ]
        }
      ]
    };
    PRESET_PRISM = {
      title: {
        separator: " ",
        blocks: [
          { category: "resolution", style: "emoji" },
          { category: "cache", style: "emoji" },
          { category: "seasonEpisode", style: "short" }
        ]
      },
      subtitle: [
        {
          separator: " ",
          blocks: [
            { category: "episodeName", style: "emoji" },
            { category: "quality", style: "tagged" },
            { category: "hdr", style: "emoji" },
            { category: "audio", style: "emoji" }
          ]
        },
        {
          separator: " ",
          blocks: [
            { category: "size", style: "emoji" },
            { category: "seeders", style: "emoji" },
            { category: "addon", style: "emoji" }
          ]
        }
      ]
    };
    PRESETS = {
      default: DEFAULT_FORMATTER_CONFIG,
      minimal: PRESET_MINIMAL,
      prism: PRESET_PRISM
    };
  }
});

// ../zero_forge/src/pipeline.ts
import { createHash as createHash4 } from "node:crypto";
function dbg(message) {
  if (STREAMS_DEBUG) logger2.info("streams", message);
}
function breakdown(entries) {
  return entries.filter(([, n]) => n > 0).map(([label, n]) => `${label} ${n}`).join(", ");
}
function prettySource(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
async function syncNativeStreams(opts) {
  const { itemId, query, prefs, preferredReleaseGroup, formatter, episodeName } = opts;
  const start = Date.now();
  const [sources, accounts, sourceRows] = await Promise.all([
    loadSources(),
    loadAccounts(),
    loadSourceRows()
  ]);
  const title = [query.title, query.season != null ? `S${String(query.season).padStart(2, "0")}E${String(query.episode ?? 0).padStart(2, "0")}` : null, episodeName].filter(Boolean).join(" \xB7 ") || itemId;
  if (sources.length === 0) {
    logger2.warn("streams", `${title} \u2014 no enabled stream sources, skipping search`);
    return [];
  }
  dbg(
    `Pipeline start: ${sources.length} sources [${sources.map((s) => s.type).join(", ")}], ${accounts.length} resolvers [${accounts.map((a) => a.row.provider).join(", ")}]`
  );
  const { candidates: rawCandidates, perSource } = await searchAll(sources, query);
  dbg(
    `Stage 1 search: ${rawCandidates.length} raw candidates (with infoHash: ${rawCandidates.filter((c) => c.infoHash).length}, with url: ${rawCandidates.filter((c) => c.url).length}, with nzb: ${rawCandidates.filter((c) => c.nzbId).length})`
  );
  const parsed = rawCandidates.map(parseCandidate);
  const seGated = applySeasonEpisodeGate(parsed, query);
  if (seGated.length !== parsed.length) {
    dbg(
      `Stage 2a S/E gate: ${parsed.length} \u2192 ${seGated.length} (want ${query.kind}${query.season ? ` S${query.season}` : ""}${query.episode ? `E${query.episode}` : ""})`
    );
  }
  const filtered = applyFilters(seGated, prefs);
  dbg(
    `Stage 2 content filter: ${seGated.length} \u2192 ${filtered.length} (prefs: resolutions=[${prefs.resolutions.join(",")}], codecs=[${prefs.codecs.join(",")}], hdrAllowed=${prefs.hdrAllowed}, minSeeders=${prefs.minSeeders ?? "any"}, sizeMinMb=${prefs.sizeMinMb ?? "any"}, sizeMaxMb=${prefs.sizeMaxMb ?? "any"})`
  );
  const { resolved, perDebrid } = await annotateAvailability(filtered, accounts);
  const cachedCount = resolved.filter((r) => r.cachedOnDebrid).length;
  dbg(
    `Stage 3 availability: ${resolved.length} candidates annotated, ${cachedCount} reported cached by debrid (${resolved.length - cachedCount} uncached)`
  );
  const available = applyAvailabilityFilters(resolved, prefs);
  dbg(
    `Stage 4 cached-only filter: ${resolved.length} \u2192 ${available.length} (excludeUncached=${prefs.excludeUncached})`
  );
  const sorted = sortStreams(available, prefs);
  const pinned = prefs.bingePinReleaseGroup ? pinReleaseGroup(sorted, preferredReleaseGroup ?? null, {
    strict: prefs.bingeStrictReleaseGroup,
    preferPacks: prefs.bingeOnlySeasonPacks
  }) : sorted;
  const usenetResolvers = new Set(accounts.filter((a) => a.row.provider === "usenet").map((a) => a.row.id));
  const screened = usenetResolvers.size ? await screenUsenet(pinned, (s) => !!s.resolverId && usenetResolvers.has(s.resolverId)) : pinned;
  const sourceNameById = new Map(sourceRows.map((r) => [r.id, r.name]));
  const resolverProviderById = new Map(accounts.map((a) => [a.row.id, a.row.provider]));
  const rows = toRows(
    itemId,
    screened,
    formatter ?? DEFAULT_FORMATTER_CONFIG,
    sourceNameById,
    resolverProviderById,
    episodeName
  );
  const tookSec = ((Date.now() - start) / 1e3).toFixed(1);
  const sourcesStr = breakdown(perSource) || "none";
  const verifiedStr = breakdown(
    perDebrid.filter((d) => !d.assumed).map((d) => [prettyProvider(d.provider), d.cached])
  );
  const assumedStr = breakdown(
    perDebrid.filter((d) => d.assumed).map((d) => [prettyProvider(d.provider), d.cached])
  );
  if (screened.length > 0) {
    const cachedPart = verifiedStr ? ` \xB7 cached: ${verifiedStr}` : "";
    const assumedPart = assumedStr ? ` \xB7 assumed: ${assumedStr}` : "";
    logger2.success(
      "streams",
      `${title} \u2014 ${screened.length} streams in ${tookSec}s \xB7 sources: ${sourcesStr}${cachedPart}${assumedPart}`
    );
  } else {
    let why;
    if (rawCandidates.length === 0) {
      why = `no candidates from ${sources.length} source${sources.length === 1 ? "" : "s"} (${sourcesStr})`;
    } else if (prefs.excludeUncached && available.length === 0) {
      const names = accounts.filter((a) => a.resolver.verifiesCache !== false).map((a) => prettyProvider(a.row.provider)).join(" / ") || "debrid";
      why = `${rawCandidates.length} found, none cached on ${names}; cached-only is on`;
    } else {
      why = `${rawCandidates.length} found, all filtered out by your stream prefs`;
    }
    logger2.warn("streams", `${title} \u2014 0 streams (${why}) in ${tookSec}s`);
  }
  return rows;
}
async function resolveStream(stream, hint) {
  if (!stream.resolverId) {
    logger2.warn("streams", `Resolve skipped: stream has no resolver assigned (${stream.rawTitle ?? stream.infoHash ?? stream.nzbId ?? "?"})`);
    return null;
  }
  const accounts = await listAccountsWithBuiltin();
  const row = accounts.find((a) => a.id === stream.resolverId && a.enabled === 1);
  if (!row) {
    logger2.warn("streams", `Resolve failed: assigned resolver ${stream.resolverId} is missing or disabled`);
    return null;
  }
  const resolver = buildResolver(row);
  if (!resolver) {
    logger2.warn("streams", `Resolve failed: ${row.provider} resolver could not be built`);
    return null;
  }
  const candidate = {
    id: stream.infoHash ?? stream.nzbId ?? "",
    sourceType: "cache",
    sourceId: stream.sourceId ?? "",
    name: row.provider,
    description: stream.rawTitle ?? "",
    rawTitle: stream.rawTitle ?? "",
    infoHash: stream.infoHash ?? void 0,
    nzbId: stream.nzbId ?? void 0
  };
  const kind = stream.infoHash ? "torrent" : stream.nzbId ? "usenet" : "direct";
  const ref = stream.infoHash ? stream.infoHash.slice(0, 8) : stream.nzbId ?? "?";
  const t0 = Date.now();
  try {
    const url = await resolver.resolve(
      candidate,
      AbortSignal.timeout(DEFAULT_RESOLVE_TIMEOUT_MS),
      hint
    );
    if (url) {
      logger2.success("streams", `Resolved ${kind} via ${row.provider} (${ref}) in ${Date.now() - t0}ms`);
    } else {
      logger2.warn("streams", `Resolve returned no URL: ${row.provider} could not play ${kind} ${ref} (${stream.rawTitle ?? ""})`.trim());
    }
    return url;
  } catch (err) {
    logger2.error("streams", `Resolve threw for ${row.provider} ${kind} ${ref}: ${err.message}`, err);
    return null;
  }
}
async function loadSources() {
  const rows = await listStreamSources();
  const enabled = rows.filter((r) => r.enabled === 1);
  return enabled.map(buildSource).filter((s) => s !== null);
}
async function listAccountsWithBuiltin() {
  const rows = await listStreamAccounts();
  if (rows.some((r) => r.provider === "usenet") || !await readUsenetSettings()) return rows;
  return [...rows, {
    id: BUILTIN_USENET_ACCOUNT_ID,
    provider: "usenet",
    kind: "usenet",
    api_key: null,
    host: null,
    enabled: 1,
    priority: 50,
    config_json: "{}",
    premium_until: null,
    last_checked_at: null,
    last_error: null,
    created_at: 0
  }];
}
async function loadAccounts() {
  const rows = await listAccountsWithBuiltin();
  return rows.filter((r) => r.enabled === 1).map((row) => ({ row, resolver: buildResolver(row) })).filter((x) => x.resolver !== null);
}
async function loadSourceRows() {
  const rows = await listStreamSources();
  return rows.filter((r) => r.enabled === 1);
}
async function searchAll(sources, query) {
  const perSource = [];
  const results = await Promise.all(
    sources.map(async (s) => {
      const t0 = Date.now();
      const signal = AbortSignal.timeout(SOURCE_SEARCH_TIMEOUT_MS);
      try {
        const res = await s.search(query, signal);
        dbg(`Source ${prettySource(s.type)} \u2192 ${res.length} candidates in ${Date.now() - t0}ms`);
        perSource.push([prettySource(s.type), res.length]);
        return res;
      } catch (err) {
        logger2.warn("streams", `Source ${prettySource(s.type)} failed after ${Date.now() - t0}ms: ${err.message}`);
        perSource.push([prettySource(s.type), 0]);
        return [];
      }
    })
  );
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const list of results) {
    for (const c of list) {
      const key = c.infoHash ?? c.nzbId ?? c.url ?? c.id;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(c);
    }
  }
  return { candidates: out, perSource };
}
async function annotateAvailability(candidates, accounts) {
  const direct = [];
  const needsResolver = [];
  for (const c of candidates) {
    if (c.url) {
      direct.push({ ...c, url: c.url, resolverId: null, cachedOnDebrid: true });
    } else {
      needsResolver.push(c);
    }
  }
  if (needsResolver.length === 0 || accounts.length === 0) {
    return {
      resolved: [
        ...direct,
        ...needsResolver.map((c) => ({
          ...c,
          url: "",
          resolverId: null,
          cachedOnDebrid: false
        }))
      ],
      perDebrid: []
    };
  }
  const accountsByPriority = [...accounts].sort((a, b) => a.row.priority - b.row.priority);
  const verifying = accountsByPriority.filter((a) => a.resolver.verifiesCache !== false);
  const nonVerifying = accountsByPriority.filter((a) => a.resolver.verifiesCache === false);
  const torrentCands = needsResolver.filter((c) => c.infoHash);
  const usenetCands = needsResolver.filter((c) => c.nzbId);
  const cacheMaps = await Promise.all(
    verifying.map(async ({ row, resolver }) => {
      const accepts = resolver.accepts;
      const slice = [
        ...accepts.includes("torrent") ? torrentCands : [],
        ...accepts.includes("usenet") ? usenetCands : []
      ];
      dbg(
        `\u2192 ${prettyProvider(row.provider)} checkAvailability for ${slice.length} candidates (torrent: ${torrentCands.length} accepted=${accepts.includes("torrent")}, usenet: ${usenetCands.length} accepted=${accepts.includes("usenet")})`
      );
      try {
        const map = await resolver.checkAvailability(slice, AbortSignal.timeout(DEFAULT_SOURCE_TIMEOUT_MS));
        const cachedHere = Array.from(map.values()).filter((v) => v === true).length;
        dbg(`\u2190 ${prettyProvider(row.provider)} returned cached map of ${map.size} entries, ${cachedHere} marked cached`);
        return { row, resolver, map };
      } catch (err) {
        logger2.warn("streams", `${prettyProvider(row.provider)} checkAvailability threw: ${err.message}`);
        return { row, resolver, map: /* @__PURE__ */ new Map() };
      }
    })
  );
  let assumedCount = 0;
  const annotated = needsResolver.map((c) => {
    const wantedKind = c.infoHash ? "torrent" : "usenet";
    let resolverId = null;
    for (const { row, resolver, map } of cacheMaps) {
      if (!resolver.accepts.includes(wantedKind)) continue;
      if (map.get(c.id) === true) {
        return { ...c, url: "", resolverId: row.id, cachedOnDebrid: true };
      }
      if (resolverId === null) resolverId = row.id;
    }
    const assumed = nonVerifying.find((a) => a.resolver.accepts.includes(wantedKind));
    if (assumed) {
      assumedCount += 1;
      return { ...c, url: "", resolverId: assumed.row.id, cachedOnDebrid: false, assumedCached: true };
    }
    return { ...c, url: "", resolverId, cachedOnDebrid: false };
  });
  const perDebrid = cacheMaps.map(({ row, map }) => ({
    provider: row.provider,
    cached: Array.from(map.values()).filter((v) => v === true).length
  }));
  for (const { row } of nonVerifying) {
    perDebrid.push({ provider: row.provider, cached: assumedCount, assumed: true });
  }
  const rejected = new Set(cacheMaps.flatMap(({ resolver }) => [...resolver.rejected ?? []]));
  const kept = rejected.size ? annotated.filter((c) => !rejected.has(c.id)) : annotated;
  if (rejected.size) logger2.info("streams", `Dropped ${annotated.length - kept.length} releases known to be broken`);
  return { resolved: [...direct, ...kept], perDebrid };
}
function toRows(itemId, streams, formatter, sourceNameById, resolverProviderById, episodeName) {
  return streams.map((s, i) => {
    const addonName = sourceNameById.get(s.sourceId) ?? s.sourceType;
    const provider = s.resolverId ? resolverProviderById.get(s.resolverId) : null;
    const debridName = provider ? prettyProvider(provider) : null;
    const debridTag = provider ? providerTag(provider) : null;
    const { title, subtitle } = formatStream(s, formatter, {
      addonName,
      episodeName,
      debridName,
      debridTag
    });
    const finalName = title.trim() ? title : s.name;
    const finalDescription = subtitle.trim() ? subtitle : s.description;
    return {
      id: streamRowId(itemId, s),
      url: s.url || `native://${s.infoHash ?? s.nzbId ?? s.id}`,
      name: finalName,
      description: finalDescription,
      // Clean release name — kept distinct from the formatted name/description
      // so JIT resolve hands the resolver a sane label (the formatted one has
      // emoji/newlines that break usenet job submission).
      rawTitle: s.rawTitle || s.name || null,
      bingeGroup: s.bingeGroup ?? null,
      sortIndex: i,
      sourceId: s.sourceId,
      resolverId: s.resolverId,
      infoHash: s.infoHash ?? null,
      nzbId: s.nzbId ?? null,
      releaseGroup: s.releaseGroup,
      resolution: s.resolution,
      codec: s.codec,
      hdrFlags: s.hdrFlags,
      sizeBytes: s.sizeBytes ?? null,
      seeders: s.seeders ?? null,
      cachedOnDebrid: s.cachedOnDebrid,
      languages: s.languages,
      audioChannels: s.audioChannels,
      audioCodec: s.audioCodec,
      sourceTag: s.sourceTag
    };
  });
}
function streamRowId(itemId, s) {
  const key = s.url || s.infoHash || s.nzbId || s.id;
  return createHash4("md5").update(`${itemId}:${key}`).digest("hex");
}
var BUILTIN_USENET_ACCOUNT_ID, DEFAULT_SOURCE_TIMEOUT_MS, DEFAULT_RESOLVE_TIMEOUT_MS, SOURCE_SEARCH_TIMEOUT_MS, STREAMS_DEBUG;
var init_pipeline = __esm({
  "../zero_forge/src/pipeline.ts"() {
    "use strict";
    init_store();
    init_log2();
    init_filter();
    init_parser2();
    init_resolvers();
    init_sort();
    init_sources();
    init_screen();
    init_service();
    init_formatter();
    BUILTIN_USENET_ACCOUNT_ID = "builtin-usenet";
    DEFAULT_SOURCE_TIMEOUT_MS = 2e4;
    DEFAULT_RESOLVE_TIMEOUT_MS = 3e4;
    SOURCE_SEARCH_TIMEOUT_MS = 9e3;
    STREAMS_DEBUG = /^(1|true|yes|on)$/i.test(process.env.STREAMS_DEBUG ?? "");
  }
});

// ../zero_forge/src/constants.ts
var DEFAULT_USER_ID;
var init_constants = __esm({
  "../zero_forge/src/constants.ts"() {
    "use strict";
    DEFAULT_USER_ID = "user-admin";
  }
});

// ../zero_forge/src/index.ts
var src_exports = {};
__export(src_exports, {
  CometSource: () => CometSource,
  DEFAULT_FORMATTER_CONFIG: () => DEFAULT_FORMATTER_CONFIG,
  DEFAULT_USER_ID: () => DEFAULT_USER_ID,
  EasyNewsSource: () => EasyNewsSource,
  ExternalAddonSource: () => ExternalAddonSource,
  HDR_FLAG_DV: () => HDR_FLAG_DV,
  HDR_FLAG_HDR10: () => HDR_FLAG_HDR10,
  HDR_FLAG_HDR10_PLUS: () => HDR_FLAG_HDR10_PLUS,
  HDR_FLAG_HLG: () => HDR_FLAG_HLG,
  PRESETS: () => PRESETS,
  SOURCE_TYPES: () => SOURCE_TYPES,
  TorBoxResolver: () => TorBoxResolver,
  TorBoxSearchSource: () => TorBoxSearchSource,
  TorrentioSource: () => TorrentioSource,
  TorznabSource: () => TorznabSource,
  ZileanSource: () => ZileanSource,
  applyAvailabilityFilters: () => applyAvailabilityFilters,
  applyFilters: () => applyFilters,
  applySeasonEpisodeGate: () => applySeasonEpisodeGate,
  buildResolver: () => buildResolver,
  buildSource: () => buildSource,
  candidateId: () => candidateId,
  describeFetchFailure: () => describeFetchFailure,
  fetchJson: () => fetchJson,
  formatStream: () => formatStream,
  getForgeHost: () => getForgeHost,
  hasForgeHost: () => hasForgeHost,
  listCategoryStyles: () => listCategoryStyles,
  parseCandidate: () => parseCandidate,
  parseFormatterConfig: () => parseFormatterConfig,
  parseReleaseName: () => parseReleaseName,
  parseStreamPrefs: () => parseStreamPrefs,
  pinReleaseGroup: () => pinReleaseGroup,
  prettyProvider: () => prettyProvider,
  providerTag: () => providerTag,
  redactUrl: () => redactUrl,
  resolveStream: () => resolveStream,
  setForgeHost: () => setForgeHost,
  sortStreams: () => sortStreams,
  syncNativeStreams: () => syncNativeStreams
});
var init_src2 = __esm({
  "../zero_forge/src/index.ts"() {
    "use strict";
    init_host3();
    init_types2();
    init_pipeline();
    init_sources();
    init_base();
    init_resolvers();
    init_torbox();
    init_parser2();
    init_filter();
    init_sort();
    init_formatter();
    init_constants();
  }
});

// src/plugin.ts
init_src();

// src/catalog.ts
init_db();
init_debrid();
init_host2();
init_log();

// src/scanner.ts
init_host2();
async function probeMedia(target) {
  if (!hasVaultHost()) return null;
  return getVaultHost().services.probe(target).catch(() => null);
}

// src/search.ts
init_db();
init_debrid();
init_host2();
init_log();

// src/parse.ts
init_src2();
function parseResolutionLabel(rawTitle) {
  const r = parseReleaseName(rawTitle).resolution;
  return r && r !== "unknown" ? r : null;
}
var VR_TOKEN = /\bvr\b/i;
var VR_STUDIO_SUFFIX = /[a-z]{2,}vr\b/i;
var VR_PROJECTION = /\b(?:180x180|180_180|360x180|mkx200|mkx220|mkx[0-9]{3}|fisheye190|fisheye|rf52|lr_?180|tb_?180|sbs|oculus|gearvr|smartphone_?vr|180°|360°)\b/i;
var VR_STUDIO_NAME = /\b(?:vr(?:bangers|conk|hush|cosplayx|spy|latina|allure|btrans|bgay|smash|porn(?:jack)?|edging|intimacy|oomed|hub)|slr(?:originals)?|sexlikereal|virtualrealporn|virtualtaboo|virtualrealtrans|virtualrealgay|povr|holivr|tmwvrnet|realitylovers|vrb)\b/i;
var MIN_VR_BYTES = 500 * 1024 * 1024;
function detectVrRelease(rawTitle, sizeBytes) {
  if (sizeBytes != null && sizeBytes > 0 && sizeBytes < MIN_VR_BYTES) return false;
  return detectVr(rawTitle);
}
function detectVr(rawTitle) {
  if (!rawTitle) return false;
  const t = `${rawTitle} ${rawTitle.replace(/[._-]+/g, " ")}`;
  return VR_TOKEN.test(t) || VR_STUDIO_SUFFIX.test(t) || VR_STUDIO_NAME.test(t) || VR_PROJECTION.test(t);
}

// src/tpdb.ts
var TPDB_API = "https://api.theporndb.net";
function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, Accept: "application/json" };
}
function pickString(...vals) {
  for (const v of vals) if (typeof v === "string" && v.trim()) return v.trim();
  return null;
}
function pickNumber(...vals) {
  for (const v of vals) {
    const n = typeof v === "string" ? parseFloat(v) : v;
    if (typeof n === "number" && Number.isFinite(n)) return n;
  }
  return null;
}
function pickImage(...vals) {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
    if (v && typeof v === "object") {
      const o = v;
      const url = pickString(o.full, o.large, o.medium, o.small, o.url);
      if (url) return url;
    }
  }
  return null;
}
function landscapeImage(url) {
  if (!url) return null;
  const m = /^https?:\/\/thumb\.theporndb\.net\/[^/]+\/\d+x\d+\/smart\/(?:filters:[^/]*\/)?(.+)$/.exec(url);
  if (!m) return url;
  try {
    return `https://cdn.theporndb.net/${decodeURIComponent(m[1])}`;
  } catch {
    return url;
  }
}
function normalize(raw, contentType) {
  if (!raw || typeof raw !== "object") return null;
  const uuid = pickString(raw.uuid, raw._id, raw.id != null ? String(raw.id) : void 0);
  const title = pickString(raw.title, raw.name);
  if (!uuid || !title) return null;
  const site = raw.site && typeof raw.site === "object" ? raw.site : null;
  const studio = pickString(site?.name) ?? pickString(site?.network?.name) ?? pickString(site?.parent?.name) ?? pickString(raw.studio?.name, raw.studio);
  const performers = Array.isArray(raw.performers) ? raw.performers.map((p) => pickString(p?.name, p?.parent?.name, typeof p === "string" ? p : void 0)).filter((n) => !!n) : [];
  const tags = Array.isArray(raw.tags) ? raw.tags.map((t) => pickString(t?.name, typeof t === "string" ? t : void 0)).filter((n) => !!n) : [];
  const dateRaw = pickString(raw.date, raw.released, raw.release_date);
  const date = dateRaw ? dateRaw.slice(0, 10) : null;
  const rating = pickNumber(raw.rating, raw.rating_value, raw.average_rating);
  return {
    uuid,
    contentType,
    title,
    description: pickString(raw.description, raw.overview, raw.synopsis),
    date,
    durationSeconds: pickNumber(raw.duration, raw.length, raw.runtime),
    // Prefer the explicit poster, then the posters object, then the raw
    // site image / cover (movies often only carry `posters.large`).
    posterUrl: pickImage(raw.poster, raw.posters, raw.poster_image, raw.image, raw.cover),
    backgroundUrl: pickImage(raw.background, raw.backgrounds, raw.back_image, raw.background_back),
    rating: rating != null ? Math.max(0, Math.min(10, rating)) : null,
    studio,
    performers,
    tags
  };
}
var TpdbRequestError = class extends Error {
  constructor(status2, url) {
    super(`TPDB request failed (${status2 || "network"}): ${url.split("?")[0]}`);
    this.status = status2;
  }
};
async function getJson(url, token, signal) {
  try {
    return await getJsonStrict(url, token, signal);
  } catch {
    return null;
  }
}
async function getJsonStrict(url, token, signal) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, { headers: authHeaders(token), signal });
    } catch {
      throw new TpdbRequestError(0, url);
    }
    if (res.ok) return await res.json().catch(() => {
      throw new TpdbRequestError(res.status, url);
    });
    if (res.status === 429 && attempt === 0) {
      const retryAfter = parseInt(res.headers.get("retry-after") || "", 10);
      const waitMs = Math.min(Number.isFinite(retryAfter) ? retryAfter * 1e3 : 2e3, 15e3);
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }
    throw new TpdbRequestError(res.status, url);
  }
}
async function tpdbSearch(rawName, opts) {
  if (!opts.token || !rawName.trim()) return [];
  const contentType = opts.contentType ?? "scenes";
  const params = new URLSearchParams({ parse: rawName });
  if (opts.hash) params.set("hash", opts.hash);
  if (opts.year) params.set("year", String(opts.year));
  const url = `${TPDB_API}/${contentType}?${params.toString()}`;
  const json = opts.strict ? await getJsonStrict(url, opts.token, opts.signal) : await getJson(url, opts.token, opts.signal);
  const data = json?.data;
  if (!Array.isArray(data)) return [];
  return data.map((d) => normalize(d, contentType)).filter((r) => r !== null);
}
async function tpdbBestMatch(rawName, opts) {
  const results = await tpdbSearch(rawName, opts);
  return results[0] ?? null;
}
async function tpdbGetById(uuid, opts) {
  if (!opts.token || !uuid) return null;
  const contentType = opts.contentType ?? "scenes";
  const json = await getJson(`${TPDB_API}/${contentType}/${encodeURIComponent(uuid)}`, opts.token, opts.signal);
  const data = json?.data;
  return data ? normalize(data, contentType) : null;
}

// src/knaben.ts
var KNABEN_URL = "https://api.knaben.org/v1";
var XXX_CATEGORY_MIN = 5e6;
var XXX_CATEGORY_MAX = 5999999;
var XXX_TAG = /\bxxx\b/i;
var NON_VIDEO_CATEGORY = (c) => c >= 5004e3 && c < 5005e3;
var NON_VIDEO_NAME = /\.(zip|rar|7z|cbz|cbr|pdf|epub|jpe?g|png|gif)\s*$/i;
function normalize2(raw) {
  const infoHash = typeof raw?.hash === "string" ? raw.hash.toLowerCase() : "";
  const rawTitle = typeof raw?.title === "string" ? raw.title.trim() : "";
  if (!/^[a-f0-9]{40}$/.test(infoHash) || !rawTitle || NON_VIDEO_NAME.test(rawTitle)) return null;
  const bytes = typeof raw?.bytes === "number" && raw.bytes > 0 ? raw.bytes : null;
  const cats = Array.isArray(raw?.categoryId) ? raw.categoryId : [];
  if (cats.some((c) => typeof c === "number" && NON_VIDEO_CATEGORY(c))) return null;
  const xxxCategory = cats.some((c) => typeof c === "number" && c >= XXX_CATEGORY_MIN && c <= XXX_CATEGORY_MAX);
  return { rawTitle, infoHash, sizeBytes: bytes, adult: xxxCategory || XXX_TAG.test(rawTitle) };
}
async function knabenQuery(body, signal) {
  try {
    const res = await fetch(KNABEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        search_type: "100%",
        search_field: "title",
        order_by: "seeders",
        order_direction: "desc",
        hide_unsafe: true,
        hide_xxx: false,
        ...body
      }),
      signal
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.hits) ? data.hits : [];
  } catch {
    return [];
  }
}
async function knabenSearch(query, opts = {}) {
  const q = query.trim();
  if (!q) return [];
  const size = opts.limit ?? 50;
  const [byCategory, byTag] = await Promise.all([
    knabenQuery({ query: q, size, categories: [XXX_CATEGORY_MIN] }, opts.signal),
    XXX_TAG.test(q) ? Promise.resolve([]) : knabenQuery({ query: `${q} xxx`, size }, opts.signal)
  ]);
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const item of [...byCategory, ...byTag]) {
    const t = normalize2(item);
    if (!t || seen.has(t.infoHash)) continue;
    seen.add(t.infoHash);
    out.push(t);
  }
  return out;
}

// src/zilean.ts
var SEARCH_PATH = "/dmm/search";
var FILTERED_PATH = "/dmm/filtered";
function toNumber(v) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : null;
}
function normalize3(raw) {
  const infoHash = typeof raw?.info_hash === "string" ? raw.info_hash.toLowerCase() : "";
  const rawTitle = typeof raw?.raw_title === "string" ? raw.raw_title : "";
  if (!infoHash || !rawTitle) return null;
  return {
    rawTitle,
    parsedTitle: typeof raw?.parsed_title === "string" && raw.parsed_title ? raw.parsed_title : rawTitle,
    infoHash,
    sizeBytes: toNumber(raw?.size),
    adult: raw?.adult === true || raw?.adult === "True" || raw?.adult === "true",
    category: typeof raw?.category === "string" ? raw.category : null,
    year: toNumber(raw?.year),
    site: typeof raw?.site === "string" && raw.site ? raw.site : null,
    episodeCode: typeof raw?.episode_code === "string" && raw.episode_code ? raw.episode_code : null
  };
}
async function zileanSearch(baseUrl, query, opts = {}) {
  const q = query.trim();
  if (!baseUrl || !q) return [];
  const url = `${baseUrl.replace(/\/+$/, "")}${SEARCH_PATH}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ queryText: q }),
      signal: opts.signal
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.results ?? data?.data ?? [];
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const item of list) {
      const t = normalize3(item);
      if (!t || seen.has(t.infoHash)) continue;
      seen.add(t.infoHash);
      out.push(t);
      if (opts.limit && out.length >= opts.limit) break;
    }
    return out;
  } catch {
    return [];
  }
}
async function zileanFiltered(baseUrl, query, opts = {}) {
  const q = query.trim();
  if (!baseUrl || !q) return [];
  const url = `${baseUrl.replace(/\/+$/, "")}${FILTERED_PATH}?Query=${encodeURIComponent(q)}&Page=1&PageSize=${opts.limit ?? 200}`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: opts.signal });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.results ?? data?.data ?? [];
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const item of list) {
      const t = normalize3(item);
      if (!t || seen.has(t.infoHash)) continue;
      seen.add(t.infoHash);
      out.push(t);
      if (opts.limit && out.length >= opts.limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

// src/search.ts
var JAV_CODE = /\b([A-Z]{2,6})-?(\d{2,5})\b/;
async function adultCachedOnly() {
  try {
    return (await settings()).cached_only;
  } catch {
    return false;
  }
}
function alnum(s) {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function words(s) {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4);
}
var MAINSTREAM_FINGERPRINT = /\b(19|20)\d{2}\b[\s\S]*\b(blu-?ray|web-?dl|web-?rip|hdrip|brrip|bdrip|dvdrip|hdtv|x264|x265|h\.?264|h\.?265|hevc|amzn|hmax|dsnp|nf|atvp|rarbg|yts|yify)\b/i;
var RELEASE_DATE = /(?:^|[^0-9])((?:19|20)?\d{2})[ ._-](\d{2})[ ._-](\d{2})(?![0-9])/;
var RELEASE_DATE_DMY = /(?:^|[^0-9])(\d{2})[ ._-](\d{2})[ ._-]((?:19|20)\d{2})(?![0-9])/;
function releaseDay(name) {
  let y, mo, d;
  const dmy = RELEASE_DATE_DMY.exec(name);
  const m = dmy ? null : RELEASE_DATE.exec(name);
  if (dmy) {
    [d, mo, y] = [parseInt(dmy[1], 10), parseInt(dmy[2], 10), parseInt(dmy[3], 10)];
  } else if (m) {
    y = m[1].length === 2 ? 2e3 + parseInt(m[1], 10) : parseInt(m[1], 10);
    mo = parseInt(m[2], 10);
    d = parseInt(m[3], 10);
  } else {
    return null;
  }
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return Math.floor(Date.UTC(y, mo - 1, d) / 864e5);
}
function compareReleaseDate(metaDate, releaseName) {
  const rel = releaseDay(releaseName);
  const m = metaDate ? /^(\d{4})-(\d{2})-(\d{2})/.exec(metaDate) : null;
  if (rel == null || !m) return "unknown";
  const meta = Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5);
  return Math.abs(meta - rel) <= 1 ? "match" : "mismatch";
}
function isRelevant(meta, t) {
  const hay = t.rawTitle;
  if (meta.contentType === "jav") {
    const m = JAV_CODE.exec(meta.title);
    if (!m) return false;
    const code = alnum(`${m[1]}${m[2]}`);
    return alnum(hay).includes(code);
  }
  if (!t.adult && MAINSTREAM_FINGERPRINT.test(hay)) return false;
  const hayWords = new Set(words(hay));
  const studioHit = !!(meta.studio && words(meta.studio).some((w) => hayWords.has(w)));
  const performerHit = meta.performers.some((p) => words(p).some((w) => hayWords.has(w)));
  if (meta.contentType === "scenes") {
    const dateCmp = compareReleaseDate(meta.date, hay);
    if (dateCmp === "mismatch") return false;
    if (dateCmp === "match" && studioHit) return true;
  }
  if (meta.contentType === "movies") {
    const titleWords = words(meta.title);
    const coverage = titleWords.length ? titleWords.filter((w) => hayWords.has(w)).length / titleWords.length : alnum(hay).includes(alnum(meta.title)) ? 1 : 0;
    if (coverage < 0.6) return false;
    return t.adult || studioHit;
  }
  if (!meta.performers.length) return t.adult && studioHit;
  return performerHit && (t.adult || studioHit);
}
var TV_EPISODE_MARKER = /\bS\d{1,2}[\s._-]?E\d{1,3}\b|\b\d{1,2}x\d{2}\b|\b(?:season|episode)[\s._-]?\d{1,3}\b|\bcomplete[\s._-](?:series|season)\b/i;
function fileNameMatchesMeta(meta, fileName) {
  if (!fileName.trim()) return true;
  const hayWords = new Set(words(fileName));
  const studioHit = !!(meta.studio && words(meta.studio).some((w) => hayWords.has(w)));
  const performerHit = meta.performers.some((p) => words(p).some((w) => hayWords.has(w)));
  if (meta.contentType === "jav") {
    const m = JAV_CODE.exec(meta.title);
    if (m && alnum(fileName).includes(alnum(`${m[1]}${m[2]}`))) return true;
  } else {
    const titleWords = words(meta.title);
    const titleHit = titleWords.length > 0 && titleWords.filter((w) => hayWords.has(w)).length / titleWords.length >= 0.5;
    if (performerHit || studioHit || titleHit) return true;
  }
  return !TV_EPISODE_MARKER.test(fileName);
}
function buildResolveQueries(meta) {
  const out = [];
  const push2 = (q) => {
    const v = (q ?? "").replace(/\s{2,}/g, " ").trim();
    if (v && !out.some((e) => e.toLowerCase() === v.toLowerCase())) out.push(v);
  };
  if (meta.contentType === "jav") {
    const code = meta.title.match(JAV_CODE)?.[0];
    push2(code);
    push2(meta.title);
  } else if (meta.contentType === "movies") {
    push2(meta.title);
    if (meta.studio) push2(`${meta.title} ${meta.studio}`);
  } else {
    const p0 = meta.performers[0];
    const p1 = meta.performers[1];
    if (meta.studio && p0) push2(`${meta.studio} ${p0}`);
    if (p0 && p1) push2(`${p0} ${p1}`);
    push2(meta.title);
    if (p0) push2(`${p0} ${meta.title}`);
  }
  return out.slice(0, 4);
}
async function searchAdultBackends(sources, query, signal) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const push2 = (infoHash, rawTitle, sizeBytes, adult) => {
    const h = (infoHash || "").toLowerCase();
    if (!h || !rawTitle || seen.has(h)) return;
    seen.add(h);
    out.push({ infoHash: h, rawTitle, sizeBytes, adult });
  };
  const zileanUrls2 = sources.filter((s) => s.source_type === "zilean" && s.url).map((s) => s.url);
  for (const url of zileanUrls2) {
    const z = await zileanSearch(url, query, { signal, limit: 80 });
    for (const t of z) push2(t.infoHash, t.rawTitle, t.sizeBytes, t.adult);
  }
  for (const t of await knabenSearch(query, { signal, limit: 50 })) {
    push2(t.infoHash, t.rawTitle, t.sizeBytes, t.adult);
  }
  const torznab = sources.filter((s) => s.source_type === "torznab" && s.url);
  if (torznab.length) {
    const { TorznabSource: TorznabSource2 } = await Promise.resolve().then(() => (init_src2(), src_exports));
    for (const s of torznab) {
      try {
        const cands = await new TorznabSource2(s).search({ kind: "movie", title: query }, signal);
        for (const c of cands) if (c.infoHash) push2(c.infoHash, c.rawTitle, c.sizeBytes ?? null, true);
      } catch {
      }
    }
  }
  return out;
}
function toStreamCandidate(t, accId) {
  return {
    id: t.infoHash,
    sourceType: "zilean",
    sourceId: accId,
    name: "adult",
    description: t.rawTitle,
    rawTitle: t.rawTitle,
    infoHash: t.infoHash,
    sizeBytes: t.sizeBytes ?? void 0
  };
}
async function adultResolveContext(itemId, signal) {
  const m = /^tpdb:(scenes|movies|jav):(.+)$/.exec(itemId);
  if (!m) return null;
  const contentType = m[1];
  const uuid = m[2];
  const cfg = await settings();
  const token = cfg.tpdb_token;
  if (!token) {
    logger.warn("adult", "resolve skipped: no ThePornDB token configured");
    return null;
  }
  const adultSources = await listAdultStreamSources();
  const meta = await tpdbGetById(uuid, { token, contentType, signal });
  if (!meta) {
    logger.warn("adult", `resolve skipped: ThePornDB had no record for ${itemId}`);
    return null;
  }
  const resolver = await getDebrid();
  if (!resolver) {
    logger.warn("adult", `${meta.title} \u2014 resolve skipped: no add-on provides debrid`);
    return null;
  }
  return { meta, adultSources, cfg, resolver, accId: "debrid" };
}
async function gatherCandidates(ctx, signal) {
  const { meta, adultSources, cfg, resolver, accId } = ctx;
  const queries = buildResolveQueries(meta);
  const relevant = /* @__PURE__ */ new Map();
  for (const q of queries) {
    const torrents = await searchAdultBackends(adultSources, q, signal);
    for (const t of torrents) {
      if (!relevant.has(t.infoHash) && isRelevant(meta, t)) relevant.set(t.infoHash, t);
    }
    if (relevant.size >= 40) break;
  }
  let pool = [...relevant.values()].slice(0, 60).sort((a, b) => (b.sizeBytes ?? 0) - (a.sizeBytes ?? 0));
  if (!pool.length) {
    logger.warn("adult", `${meta.title} \u2014 0 relevant torrents from ${queries.length} quer${queries.length === 1 ? "y" : "ies"} [${queries.join(" | ")}]`);
    return [];
  }
  if (await adultCachedOnly()) {
    const map = await resolver.checkAvailability(pool.map((t) => toStreamCandidate(t, accId)), signal);
    pool = pool.filter((t) => map.get(t.infoHash) === true);
    logger[pool.length ? "info" : "warn"]("adult", `${meta.title} \u2014 ${pool.length} cached (cached-only mode)`);
    if (!pool.length) return [];
  } else {
    logger.info("adult", `${meta.title} \u2014 ${pool.length} relevant release(s)`);
  }
  return pool.map((t) => ({
    infoHash: t.infoHash,
    rawTitle: t.rawTitle,
    sizeBytes: t.sizeBytes,
    resolution: parseResolutionLabel(t.rawTitle),
    isVr: detectVrRelease(t.rawTitle, t.sizeBytes)
  }));
}
async function adultListStreams(itemId, signal) {
  const ctx = await adultResolveContext(itemId, signal);
  if (!ctx) return [];
  return gatherCandidates(ctx, signal);
}
async function adultResolveItem(itemId, signal, opts) {
  const ctx = await adultResolveContext(itemId, signal);
  if (!ctx) return null;
  const { meta, resolver, accId } = ctx;
  const order = opts?.hash ? [{ infoHash: opts.hash.toLowerCase(), rawTitle: meta.title, sizeBytes: null }] : await gatherCandidates(ctx, signal);
  if (!order.length) return null;
  let queued = null;
  for (const opt of order.slice(0, 5)) {
    const ref = opt.infoHash.slice(0, 8);
    const detailed = await resolver.resolveDetailed(toStreamCandidate(opt, accId), signal);
    if (detailed && "queued" in detailed) {
      logger.info("adult", `${meta.title} \u2014 ${ref} queued on TorBox (${detailed.state ?? "?"} ${detailed.progress ?? 0}%, ${detailed.seeds ?? "?"} seeds)`);
      queued ??= { queued: true, title: meta.title, state: detailed.state, progress: detailed.progress };
      continue;
    }
    if (!detailed?.url) {
      logger.warn("adult", `${meta.title} \u2014 TorBox returned no URL for ${ref} (${opt.rawTitle}); trying next`);
      continue;
    }
    if (!fileNameMatchesMeta(meta, detailed.name)) {
      logger.warn("adult", `${meta.title} \u2014 resolved file "${detailed.name}" doesn't match the item (dirty hash ${ref}); skipping`);
      continue;
    }
    const url = detailed.url;
    logger.success("adult", `${meta.title} \u2014 resolved ${ref} (${opt.rawTitle})`);
    return {
      url,
      durationTicks: Math.max(0, Math.round((meta.durationSeconds ?? 0) * 1e7)),
      title: meta.title,
      posterUrl: meta.posterUrl,
      infoHash: opt.infoHash,
      fileName: detailed.name ?? opt.rawTitle
    };
  }
  if (queued) {
    logger.info("adult", `${meta.title} \u2014 nothing ready yet; reporting "downloading" (${queued.progress ?? 0}%)`);
    return queued;
  }
  logger.warn("adult", `${meta.title} \u2014 ${order.length} release(s) but none resolved to a URL`);
  return null;
}

// src/catalog.ts
var JAV_CODE2 = /\b[A-Z]{2,6}-?\d{2,5}\b/;
var alnum2 = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
function isJav(t) {
  if (t.episodeCode) return true;
  if (t.category && /jav|hentai|anime/i.test(t.category)) return true;
  const parsed = t.parsedTitle || "";
  return JAV_CODE2.test(parsed) && parsed.replace(JAV_CODE2, "").replace(/[^a-z]/gi, "").length < 3;
}
function matchesTerm(t, term) {
  const words2 = term.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
  if (!words2.length) return true;
  const hay = alnum2(t.rawTitle) + " " + alnum2(t.parsedTitle) + " " + alnum2(t.site);
  return words2.every((w) => hay.includes(w));
}
async function zileanUrls() {
  const sources = await listAdultStreamSources();
  return sources.filter((s) => s.source_type === "zilean" && s.url).map((s) => s.url);
}
async function getTorBox() {
  return getDebrid();
}
function fromKnaben(t) {
  return { ...t, parsedTitle: t.rawTitle, category: null, year: null, site: null, episodeCode: null };
}
async function harvestTerm(urls, term, signal) {
  const variants = Array.from(/* @__PURE__ */ new Set([term, term.replace(/\s+/g, "")])).filter(Boolean);
  const merged = /* @__PURE__ */ new Map();
  for (const url of urls) {
    for (const v of variants) {
      const [a, b] = await Promise.all([
        zileanFiltered(url, v, { signal, limit: 200 }).catch(() => []),
        zileanSearch(url, v, { signal, limit: 200 }).catch(() => [])
      ]);
      for (const t of [...a, ...b]) if (t.infoHash && !merged.has(t.infoHash)) merged.set(t.infoHash, t);
    }
  }
  for (const k of await knabenSearch(term, { signal, limit: 150 })) {
    if (!merged.has(k.infoHash)) merged.set(k.infoHash, fromKnaben(k));
  }
  return [...merged.values()];
}
async function ingest(torrents, term) {
  const kept = torrents.filter((t) => t.infoHash && t.rawTitle && !isJav(t) && matchesTerm(t, term));
  return upsertAdultCatalog(
    kept.map((t) => ({
      infoHash: t.infoHash,
      rawTitle: t.rawTitle,
      parsedTitle: t.parsedTitle,
      studio: t.site,
      sizeBytes: t.sizeBytes,
      year: t.year,
      sourceTerm: term
    }))
  );
}
async function liveHarvest(query, signal) {
  const q = query.trim();
  if (!q) return 0;
  const urls = await zileanUrls();
  const added = await ingest(await harvestTerm(urls, q, signal), q);
  if (added > 0) logger.info("adult", `catalog: +${added} from live search "${q}"`);
  return added;
}
function matchIsTrustworthy(rawTitle, matchedTitle, type) {
  if (type === "scenes") return true;
  const words2 = (s) => new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4));
  const a = words2(rawTitle);
  const b = words2(matchedTitle);
  for (const w of b) if (a.has(w)) return true;
  return false;
}
async function enrichOne(row, token, scenesOnly) {
  const name = row.raw_title;
  const cleaned = cleanForParse(name);
  let requestFailed = false;
  const tryParse = async (ct) => {
    try {
      let h = await tpdbBestMatch(name, { token, contentType: ct, strict: true });
      if (!h && cleaned && cleaned.toLowerCase() !== name.toLowerCase()) {
        h = await tpdbBestMatch(cleaned, { token, contentType: ct, strict: true });
      }
      return h;
    } catch {
      requestFailed = true;
      return null;
    }
  };
  let hit = await tryParse("scenes");
  let type = "scenes";
  if (!hit && !scenesOnly) {
    hit = await tryParse("movies");
    type = "movies";
  }
  if (hit && matchIsTrustworthy(name, hit.title, type)) {
    await updateAdultCatalogEnrichment(row.info_hash, {
      title: hit.title,
      studio: hit.studio,
      performers: hit.performers,
      contentType: type === "movies" ? "movie" : "scene",
      // Scenes: the landscape still (cards are landscape); movies: the cover.
      posterUrl: type === "scenes" ? hit.backgroundUrl ?? landscapeImage(hit.posterUrl) : hit.posterUrl,
      date: hit.date,
      year: hit.date ? parseInt(hit.date.slice(0, 4), 10) || null : null,
      tpdbId: hit.uuid,
      tpdbType: type
    });
    return true;
  }
  if (!scenesOnly && !requestFailed) {
    await updateAdultCatalogEnrichment(row.info_hash, {});
  }
  return false;
}
var TV_MARK = /\bS\d{1,2}[\s._-]?E\d{1,3}\b|\bS\d{2}\b|\b\d{1,2}x\d{2}\b|\b(?:season|episode)[\s._-]?\d{1,3}\b/i;
var MAINSTREAM_RIP = /\b(19|20)\d{2}\b[\s\S]*\b(blu-?ray|web-?dl|web-?rip|hdrip|brrip|bdrip|dvdrip|hdtv|x264|x265|h\.?264|h\.?265|hevc|amzn|hmax|dsnp|atvp|rarbg|yts|yify)\b/i;
var STREAMING_TAG = /\b(?:amzn|atvp|hmax|dsnp|dnsy|hulu|pcok|nf|nflx|max)\b/i;
function isAdultConfident(row) {
  if (row.tpdb_id) return true;
  if (/\bXXX\b/i.test(row.raw_title)) return true;
  if (TV_MARK.test(row.raw_title)) return false;
  if (MAINSTREAM_RIP.test(row.raw_title)) return false;
  if (STREAMING_TAG.test(row.raw_title)) return false;
  return true;
}
var PARSE_NOISE = /\b(?:\d{3,4}p|\d{1,2}k|vr|lr|sbs|tb|ou|mono|fisheye|mkx|180|360|3dh|uhd|hdr|xxx|xx|hevc|h\.?26[45]|x26[45]|aac|ac3|opus|web-?dl|web-?rip|bd-?rip|hd-?rip|dvdrip|multi|original|remux|mp4|mkv|wmv|avi|m4v|mov|webm)\b/gi;
var QUALITY_CUT = /\b(?:xxx|xx|\d{3,4}p|[48]k|uhd|hdr|hevc|h\.?26[45]|x26[45]|aac|ac3|opus|web-?dl|web-?rip|bd-?rip|hd-?rip|dvdrip|remux|mp4|mkv|wmv|avi|m4v|mov|webm|vr|sbs|fisheye|mkx)\b[\s\S]*$/i;
function cleanForParse(raw) {
  const base2 = raw.replace(/\.(mp4|mkv|wmv|avi|m4v|ts|mov|webm)$/i, "").replace(/[._\-]+/g, " ").replace(/\[[^\]]*\]/g, " ");
  const cut = base2.replace(QUALITY_CUT, " ").replace(/\s{2,}/g, " ").trim();
  if (cut.split(/\s+/).length >= 2) return cut;
  return base2.replace(PARSE_NOISE, " ").replace(/\s{2,}/g, " ").trim();
}
function cleanReleaseName(raw) {
  let s = raw.replace(/\.(mp4|mkv|avi|wmv|mov|m4v|ts)$/i, "");
  s = s.replace(/\b(XXX|1080p|2160p|720p|480p|4k|uhd|hevc|x26[45]|h\.?26[45]|aac|web-?dl|web-?rip|bdrip|dvdrip|hdrip|mp4|wmv)\b[\s\S]*$/i, "");
  s = s.replace(/^[a-z0-9]+[\s._-]+\d{2}[\s._-]\d{2}[\s._-]\d{2}[\s._-]+/i, "");
  s = s.replace(/[._]+/g, " ").replace(/\s{2,}/g, " ").trim();
  return s || raw;
}
function toCard(row, cached) {
  let performers = [];
  try {
    performers = JSON.parse(row.performers_json);
  } catch {
  }
  const title = row.title || cleanReleaseName(row.raw_title);
  return {
    id: `catalog:${row.info_hash}`,
    kind: row.content_type === "movie" ? "movie" : "scene",
    contentType: row.content_type === "movie" ? "movies" : "scenes",
    uuid: row.info_hash,
    title,
    // Rows enriched before the landscape fix hold the portrait crop.
    posterUrl: row.content_type === "movie" ? row.poster_url : landscapeImage(row.poster_url),
    backgroundUrl: null,
    date: row.date,
    year: row.year,
    performers,
    studio: row.studio,
    description: null,
    rating: null,
    durationSeconds: null,
    source: "catalog",
    code: null,
    sizeBytes: row.size_bytes,
    infoHash: row.info_hash,
    resolution: parseResolutionLabel(row.raw_title),
    isVr: detectVrRelease(row.raw_title, row.size_bytes),
    cached
  };
}
function dedupKey(row) {
  if (row.tpdb_id) return `id:${row.tpdb_id}`;
  const t = (row.title || cleanReleaseName(row.raw_title)).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const s = (row.studio || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
  return `tt:${t}|${s}`;
}
function dedupRows(rows, cachedSet) {
  const groups = /* @__PURE__ */ new Map();
  const better = (a, b) => {
    if (cachedSet) {
      const ca = cachedSet.has(a.info_hash), cb = cachedSet.has(b.info_hash);
      if (ca !== cb) return ca ? a : b;
    }
    return (a.size_bytes ?? 0) >= (b.size_bytes ?? 0) ? a : b;
  };
  for (const r of rows) {
    const k = dedupKey(r);
    const cur = groups.get(k);
    groups.set(k, cur ? better(cur, r) : r);
  }
  return [...groups.values()];
}
async function freshCachedSet(hashes, signal) {
  const out = /* @__PURE__ */ new Set();
  if (!hashes.length) return out;
  const resolver = await getTorBox();
  if (!resolver) return out;
  const candidates = hashes.map((h) => ({
    id: h,
    sourceType: "catalog",
    sourceId: "",
    name: "adult",
    description: "",
    rawTitle: "",
    infoHash: h
  }));
  const map = await resolver.checkAvailability(candidates, signal ?? AbortSignal.timeout(3e4));
  for (const [h, isCached2] of map) if (isCached2) out.add(h);
  return out;
}
var RESULTS_NS = "adult_results";
var RESULTS_TTL_S = 4 * 60 * 60;
async function cachedHashes(key) {
  const raw = await kvGet(key, RESULTS_NS).catch(() => null);
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}
async function storeHashes(key, hashes, ttlS = RESULTS_TTL_S) {
  await kvSet(key, RESULTS_NS, JSON.stringify(hashes), ttlS).catch(() => {
  });
}
async function forgetHashes(key) {
  await kvSet(key, RESULTS_NS, "", 1).catch(() => {
  });
}
async function rowsFor(hashes) {
  const rows = await Promise.all(hashes.map((h) => getAdultCatalogEntry(h).catch(() => void 0)));
  return rows.filter((r) => !!r);
}
async function cachedCards(key, cachedOnly) {
  const hashes = await cachedHashes(key);
  if (!hashes) return null;
  return (await rowsFor(hashes)).map((r) => toCard(r, cachedOnly ? true : void 0));
}
async function storeCards(key, cards, ttlS = RESULTS_TTL_S) {
  await storeHashes(key, cards.map((c) => c.infoHash).filter((h) => !!h), ttlS);
  return cards;
}
async function searchCatalog(query, opts = {}) {
  const q = query.trim();
  const cachedOnly = await adultCachedOnly();
  const key = `search:${cachedOnly ? 1 : 0}:${q.toLowerCase()}`;
  const hit = await cachedCards(key, cachedOnly);
  if (hit) return hit;
  if (q) await liveHarvest(q, opts.signal).catch(() => {
  });
  const cards = await presentRows(
    async () => (await searchAdultCatalog(q, { matchedOnly: false, limit: 240 })).filter(isAdultConfident),
    opts.signal
  );
  return opts.signal?.aborted ? cards : storeCards(key, cards);
}
async function presentRows(load, signal, opts = {}) {
  const token = (await settings()).tpdb_token;
  const cachedOnly = opts.forceCached === true || await adultCachedOnly();
  let shown = await load();
  let cachedSet = null;
  if (cachedOnly) {
    cachedSet = /* @__PURE__ */ new Set();
    const hashes = shown.map((r) => r.info_hash).slice(0, 450);
    for (let i = 0; i < hashes.length; i += 150) {
      const part = await freshCachedSet(hashes.slice(i, i + 150), signal).catch(() => /* @__PURE__ */ new Set());
      for (const h of part) cachedSet.add(h);
    }
    shown = shown.filter((r) => cachedSet.has(r.info_hash));
  }
  if (token) {
    const unmatched = dedupRows(shown, cachedSet).filter((r) => r.tpdb_id == null).slice(0, opts.enrichCount ?? ENRICH_ON_SEARCH);
    const deadline = Date.now() + (opts.enrichWaitMs ?? ENRICH_BUDGET_MS);
    let i = 0;
    for (; i < unmatched.length; i += 12) {
      if (signal?.aborted || Date.now() >= deadline) break;
      await Promise.all(unmatched.slice(i, i + 12).map((r) => enrichOne(r, token, true).catch(() => false)));
    }
    enqueueEnrich(unmatched.slice(i), token);
    if (i > 0) {
      shown = await load();
      if (cachedSet) shown = shown.filter((r) => cachedSet.has(r.info_hash));
    }
  }
  return dedupRows(shown, cachedSet).map((r) => toCard(r, cachedSet ? true : void 0));
}
var VR_STUDIOS = [
  "MilfVR",
  "WankzVR",
  "VRBangers",
  "BaDoinkVR",
  "CzechVR",
  "VRConk",
  "RealJamVR",
  "VirtualTaboo",
  "NaughtyAmericaVR",
  "VRHush",
  "SexLikeReal",
  "SLR Originals",
  "DarkRoomVR",
  "VRCosplayX",
  "18VR",
  "TmwVRnet",
  "POVR",
  "VirtualRealPorn",
  "LethalHardcoreVR",
  "Brazzers VR",
  "StasyQVR",
  "VRAllure",
  "VRSpy",
  "VRLatina",
  "HoloGirlsVR",
  "BlowVR",
  "KinkVR",
  "SinsVR",
  "VRPornJack",
  "Wankitnow VR"
];
var VR_CATALOG_TERMS = ["vr", "slr", "sexlikereal", "virtualrealporn", "virtualtaboo", "povr", "180", "mkx", "fisheye"];
var VR_HARVEST_KEY = "vr_harvest_at";
var VR_HARVEST_NS = "adult";
var VR_HARVEST_EVERY_S = 12 * 60 * 60;
var VR_HARVEST_GAP_MS = 2500;
var vrHarvestRunning = false;
async function harvestVrStudios() {
  if (vrHarvestRunning) return;
  if (await kvGet(VR_HARVEST_KEY, VR_HARVEST_NS).catch(() => null)) return;
  vrHarvestRunning = true;
  await kvSet(VR_HARVEST_KEY, VR_HARVEST_NS, (/* @__PURE__ */ new Date()).toISOString(), VR_HARVEST_EVERY_S).catch(() => {
  });
  try {
    const urls = await zileanUrls();
    let added = 0;
    for (const studio of VR_STUDIOS) {
      try {
        added += await ingest(await harvestTerm(urls, studio), studio);
      } catch {
      }
      await new Promise((r) => setTimeout(r, VR_HARVEST_GAP_MS));
    }
    logger.info("adult", `catalog: +${added} from the VR studio harvest (${VR_STUDIOS.length} studios)`);
    if (added > 0) {
      for (const c of [0, 1]) await forgetHashes(`vr-browse:${c}`);
      for (const id of ["vr-new", ...VR_STUDIOS.map((s) => `studio:${s}`)]) await forgetHashes(`rail:${id}`);
    }
  } finally {
    vrHarvestRunning = false;
  }
}
async function browseVr(opts = {}) {
  void harvestVrStudios().catch(() => {
  });
  const cachedOnly = await adultCachedOnly();
  const key = `vr-browse:${cachedOnly ? 1 : 0}`;
  const hit = await cachedCards(key, cachedOnly);
  if (hit) return hit;
  const cards = await presentRows(vrRows, opts.signal);
  return opts.signal?.aborted ? cards : storeCards(key, cards);
}
var RAIL_SIZE = 40;
var RAIL_ENRICH = RAIL_SIZE;
var RAIL_CANDIDATES = 150;
function byNewest(a, b) {
  return (b.date ?? "").localeCompare(a.date ?? "") || b.added_at - a.added_at;
}
async function vrRows() {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const term of VR_CATALOG_TERMS) {
    for (const r of await searchAdultCatalog(term, { matchedOnly: false, limit: 300 })) {
      if (seen.has(r.info_hash) || !detectVrRelease(r.raw_title, r.size_bytes) || !isAdultConfident(r)) continue;
      seen.add(r.info_hash);
      out.push(r);
    }
  }
  return out;
}
function railLoader(id) {
  if (id === "new") {
    return async () => (await searchAdultCatalog("", { matchedOnly: false, limit: 400 })).filter((r) => isAdultConfident(r) && !detectVrRelease(r.raw_title, r.size_bytes)).sort(byNewest).slice(0, RAIL_CANDIDATES);
  }
  if (id === "vr-new") return async () => (await vrRows()).sort(byNewest).slice(0, RAIL_CANDIDATES);
  if (id.startsWith("studio:")) {
    const studio = id.slice("studio:".length).trim();
    if (!studio) return null;
    return async () => (await searchAdultCatalog(studio, { matchedOnly: false, limit: 300 })).filter(isAdultConfident).sort(byNewest).slice(0, RAIL_CANDIDATES);
  }
  return null;
}
function isCatalogRail(id) {
  return railLoader(id) !== null;
}
var RAIL_IDS = [
  "vr-new",
  ...["MilfVR", "WankzVR", "VRBangers", "SexLikeReal", "BaDoinkVR", "CzechVR"].map((s) => `studio:${s}`),
  "new",
  ...["Brazzers", "Vixen", "Blacked", "Tushy", "Reality Kings", "Naughty America"].map((s) => `studio:${s}`)
];
var RAIL_TTL_S = 24 * 60 * 60;
async function buildRail(id, signal) {
  const load = railLoader(id);
  if (!load) return [];
  return (await presentRows(load, signal, { forceCached: true, enrichWaitMs: 0, enrichCount: RAIL_ENRICH })).slice(
    0,
    RAIL_SIZE
  );
}
async function catalogRail(id, opts = {}) {
  if (!railLoader(id)) return [];
  const key = `rail:${id}`;
  const hit = await cachedCards(key, true);
  if (hit) return hit;
  const cards = await buildRail(id, opts.signal);
  return opts.signal?.aborted ? cards : storeCards(key, cards, RAIL_TTL_S);
}
async function refreshCatalogRails() {
  await harvestVrStudios().catch(() => {
  });
  let rails = 0;
  let cards = 0;
  for (const id of RAIL_IDS) {
    const fresh = await buildRail(id).catch(() => []);
    if (!fresh.length) continue;
    await storeCards(`rail:${id}`, fresh, RAIL_TTL_S);
    rails++;
    cards += fresh.length;
  }
  logger.info("adult", `catalogs: refreshed ${rails}/${RAIL_IDS.length} rails, ${cards} cards`);
  return { rails, cards };
}
var ENRICH_QUEUE_CONCURRENCY = 4;
var enrichQueue = [];
var enrichQueued = /* @__PURE__ */ new Set();
var enrichWorkers = 0;
function enqueueEnrich(rows, token) {
  for (const row of rows) {
    if (row.tpdb_id != null || enrichQueued.has(row.info_hash)) continue;
    enrichQueued.add(row.info_hash);
    enrichQueue.push({ row, token });
  }
  while (enrichWorkers < ENRICH_QUEUE_CONCURRENCY && enrichQueue.length) {
    enrichWorkers++;
    void (async () => {
      try {
        for (let job = enrichQueue.shift(); job; job = enrichQueue.shift()) {
          await enrichOne(job.row, job.token, true).catch(() => false);
          enrichQueued.delete(job.row.info_hash);
        }
      } finally {
        enrichWorkers--;
      }
    })();
  }
}
var ENRICH_ON_SEARCH = 48;
var ENRICH_BUDGET_MS = 6e3;
async function adultListCatalogStreams(infoHash, signal) {
  const cachedOnly = await adultCachedOnly();
  const key = `streams:${cachedOnly ? 1 : 0}:${infoHash.toLowerCase()}`;
  const hit = await cachedHashes(key);
  if (hit) return (await rowsFor(hit)).map(toStreamOption);
  const anchor = await getAdultCatalogEntry(infoHash);
  if (!anchor) return [];
  const rows = anchor.tpdb_id ? await listAdultCatalogByTpdbId(anchor.tpdb_id) : [anchor];
  if (!rows.some((r) => r.info_hash === anchor.info_hash)) rows.unshift(anchor);
  let pool = rows.slice().sort((a, b) => (b.size_bytes ?? 0) - (a.size_bytes ?? 0));
  if (cachedOnly) {
    const cachedSet = await freshCachedSet(pool.map((r) => r.info_hash).slice(0, 60), signal).catch(() => /* @__PURE__ */ new Set());
    pool = pool.filter((r) => cachedSet.has(r.info_hash));
  }
  if (!signal?.aborted) await storeHashes(key, pool.map((r) => r.info_hash));
  return pool.map(toStreamOption);
}
function toStreamOption(r) {
  return {
    infoHash: r.info_hash,
    rawTitle: r.raw_title,
    sizeBytes: r.size_bytes,
    resolution: parseResolutionLabel(r.raw_title),
    isVr: detectVrRelease(r.raw_title, r.size_bytes)
  };
}
async function adultResolveCatalog(infoHash, signal) {
  const row = await getAdultCatalogEntry(infoHash);
  if (!row) return null;
  const resolver = await getTorBox();
  if (!resolver) {
    logger.warn("adult", "catalog resolve skipped: no add-on provides debrid");
    return null;
  }
  const title = row.title || row.parsed_title || row.raw_title;
  const candidate = {
    id: row.info_hash,
    sourceType: "catalog",
    sourceId: "",
    name: "adult",
    description: row.raw_title,
    rawTitle: row.raw_title,
    infoHash: row.info_hash,
    sizeBytes: row.size_bytes ?? void 0
  };
  if (await adultCachedOnly()) {
    const cachedSet = await freshCachedSet([row.info_hash], signal).catch(() => /* @__PURE__ */ new Set());
    if (!cachedSet.has(row.info_hash)) {
      logger.info("adult", `${title} \u2014 not cached now and cached-only is on; skipping (${row.info_hash.slice(0, 8)})`);
      return null;
    }
  }
  const detailed = await resolver.resolveDetailed(candidate, signal);
  if (detailed && "queued" in detailed) {
    logger.info("adult", `${title} \u2014 queued on TorBox (${detailed.state ?? "?"} ${detailed.progress ?? 0}%, ${detailed.seeds ?? "?"} seeds)`);
    return { queued: true, title, state: detailed.state, progress: detailed.progress };
  }
  if (!detailed?.url) {
    logger.warn("adult", `${title} \u2014 TorBox returned no URL for ${row.info_hash.slice(0, 8)}`);
    return null;
  }
  let performers = [];
  try {
    performers = JSON.parse(row.performers_json);
  } catch {
  }
  if (!fileNameMatchesMeta(
    { contentType: row.content_type === "movie" ? "movies" : "scenes", title, studio: row.studio, performers },
    detailed.name
  )) {
    logger.warn("adult", `${title} \u2014 resolved file "${detailed.name}" looks unrelated (dirty hash ${row.info_hash.slice(0, 8)}); skipping`);
    return null;
  }
  let durationSeconds = row.duration_seconds ?? 0;
  if (durationSeconds <= 0) {
    const probe = await probeMedia(detailed.url);
    const probed = Math.floor(Number(probe?.durationSeconds ?? 0));
    if (probed > 0) {
      durationSeconds = probed;
      await updateAdultCatalogDuration(row.info_hash, probed).catch(() => {
      });
    }
  }
  logger.success("adult", `catalog resolved ${row.info_hash.slice(0, 8)} (${title}) \xB7 ${durationSeconds ? Math.round(durationSeconds / 60) + "m" : "duration unknown"}`);
  return {
    url: detailed.url,
    durationTicks: Math.max(0, Math.round(durationSeconds * 1e7)),
    title,
    posterUrl: row.poster_url,
    infoHash: row.info_hash,
    fileName: detailed.name ?? row.raw_title
  };
}

// src/plugin.ts
init_db();
init_debrid();
init_host2();

// src/space.ts
init_src();

// src/apijav.ts
init_db();
var APIJAV_DEFAULT_BASE = "https://server.apijav.com";
var CAT_NS = "apijav_categories";
var CAT_TTL = 24 * 60 * 60;
var JAV_CODE3 = /\b([A-Z]{2,6})-?(\d{2,5})\b/;
function authHeaders2(apiKey) {
  const h = { Accept: "application/json" };
  if (apiKey) h["X-API-Key"] = apiKey;
  return h;
}
function base(url) {
  return (url || APIJAV_DEFAULT_BASE).replace(/\/+$/, "");
}
async function getJson2(url, opts) {
  try {
    const res = await fetch(url, { headers: authHeaders2(opts.apiKey), signal: opts.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
function parseDuration(d) {
  if (typeof d !== "string") return null;
  const parts = d.split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => !Number.isFinite(n))) return null;
  let s = 0;
  for (const p of parts) s = s * 60 + p;
  return s > 0 ? s : null;
}
function mapPost(raw) {
  const id = raw?.id;
  const title = typeof raw?.title === "string" ? raw.title : "";
  if (id == null || !title) return null;
  const date = typeof raw?.date === "string" ? raw.date.slice(0, 10) : null;
  const year = date ? parseInt(date.slice(0, 4), 10) || null : null;
  const performers = Array.isArray(raw?.actors) ? raw.actors.filter((a) => typeof a === "string") : [];
  const code = typeof raw?.code === "string" && raw.code ? raw.code : title.match(JAV_CODE3)?.[0] ?? null;
  return {
    id: `apijav:${id}`,
    kind: "jav",
    contentType: "jav",
    uuid: String(id),
    title,
    posterUrl: typeof raw?.thumbnail === "string" ? raw.thumbnail : null,
    backgroundUrl: null,
    date,
    year,
    performers,
    studio: typeof raw?.studio === "string" ? raw.studio : null,
    description: Array.isArray(raw?.categories) ? raw.categories.join(", ") : null,
    rating: null,
    durationSeconds: parseDuration(raw?.duration),
    source: "apijav",
    code
  };
}
async function apijavSearch(baseUrl, opts) {
  const params = new URLSearchParams();
  params.set("per_page", String(opts.perPage ?? 60));
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  if (opts.query?.trim()) params.set("search", opts.query.trim());
  if (opts.category?.trim()) params.set("category", opts.category.trim());
  const json = await getJson2(`${base(baseUrl)}/wp-json/myvideo/v1/posts?${params.toString()}`, opts);
  if (!Array.isArray(json)) return [];
  return json.map(mapPost).filter((c) => c !== null);
}
async function apijavCategories(baseUrl, opts = {}) {
  const b = base(baseUrl);
  const cached = await kvGet(b, CAT_NS).catch(() => null);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
    }
  }
  const json = await getJson2(
    `${b}/wp-json/wp/v2/categories?per_page=100&orderby=count&order=desc&_fields=name,slug,count`,
    opts
  );
  if (!Array.isArray(json)) return [];
  const cats = json.map((c) => ({
    name: typeof c?.name === "string" ? c.name : "",
    slug: typeof c?.slug === "string" ? c.slug : "",
    count: typeof c?.count === "number" ? c.count : 0
  })).filter((c) => c.name && c.slug);
  if (cats.length) await kvSet(b, CAT_NS, JSON.stringify(cats), CAT_TTL).catch(() => {
  });
  return cats;
}
function deobfuscate(obf, nonce) {
  const bin = Buffer.from(obf, "base64").toString("binary");
  let out = "";
  for (let i = 0; i < bin.length; i++) {
    out += String.fromCharCode(bin.charCodeAt(i) ^ nonce.charCodeAt(i % nonce.length));
  }
  return out;
}
function extractHlsVariants(html) {
  const nonce = html.match(/NONCE\s*=\s*["']([^"']+)["']/)?.[1];
  const srcRaw = html.match(/SOURCES\s*=\s*(\[[\s\S]*?\]);/)?.[1];
  if (!nonce || !srcRaw) return [];
  let sources;
  try {
    sources = JSON.parse(srcRaw);
  } catch {
    return [];
  }
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const s of sources) {
    const url = s.obf ? deobfuscate(s.obf, nonce).trim() : "";
    if (!/^https?:\/\/\S+\.m3u8/i.test(url) || seen.has(url)) continue;
    seen.add(url);
    const label = (s.label ?? "").trim();
    const height = parseInt(/(\d{3,4})p/.exec(label)?.[1] ?? "0", 10);
    out.push({ label: label || (height ? `${height}p` : "Auto"), url, height });
  }
  out.sort((a, b) => b.height - a.height);
  return out;
}
async function apijavResolve(baseUrl, postId, opts = {}) {
  const b = base(baseUrl);
  const post = await getJson2(`${b}/wp-json/myvideo/v1/posts/${encodeURIComponent(postId)}`, opts);
  const embedUrl = typeof post?.embed_url === "string" ? post.embed_url.replace(/&#0*38;/g, "&").replace(/&amp;/g, "&") : null;
  if (!embedUrl) return null;
  let html = "";
  try {
    const res = await fetch(embedUrl, {
      headers: { "User-Agent": "Mozilla/5.0", Referer: `${b}/`, ...authHeaders2(opts.apiKey) },
      signal: opts.signal
    });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }
  const variants = extractHlsVariants(html);
  if (!variants.length) return null;
  const renditions = variants.filter((v) => v.height > 0 && !/auto|master/i.test(v.label));
  const ladder = renditions.length ? renditions : variants;
  const primary = ladder.find((v) => v.height === 1080) ?? ladder[0];
  return {
    url: primary.url,
    quality: primary.label,
    qualities: ladder.map((v) => ({ height: v.height, vcodec: "h264", videoUrl: v.url, label: v.label })),
    title: typeof post?.title === "string" ? post.title : "",
    posterUrl: typeof post?.thumbnail === "string" ? post.thumbnail : null,
    durationSeconds: parseDuration(post?.duration)
  };
}

// src/space.ts
init_db();
init_host2();

// src/searxng.ts
init_host2();
async function webSearch(query, opts = {}) {
  if (!hasVaultHost() || opts.signal?.aborted) return [];
  return getVaultHost().services.webSearch(query, { limit: opts.limit, page: opts.page });
}

// src/playback.ts
init_log();
async function probeAdultStream(url, timeoutMs = 12e3) {
  try {
    const p = await Promise.race([probeMedia(url), new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs))]);
    if (!p) return null;
    const streamInfo = {
      container: p.container ?? null,
      videoCodec: p.videoCodec ?? null,
      audioCodec: p.audioCodec ?? null,
      resolution: p.width && p.height ? `${p.width}x${p.height}` : null,
      bitrate: p.bitrate ?? null,
      videoFrameRate: p.framerate ?? null,
      audioChannels: p.audioChannels ?? null
    };
    return { durationSeconds: p.durationSeconds || 0, streamInfo, hasVideo: !!p.videoCodec && (p.width ?? 0) > 0 };
  } catch (e) {
    logger.warn("adult", `probe failed: ${e?.message ?? e}`);
    return null;
  }
}

// src/rapidgator.ts
init_log();
var DEAD_NS = "rapidgator_dead";
var DEAD_TTL = 7 * 24 * 3600;
async function markDeadLink(fileUrl) {
  const parsed = parseRapidgatorUrl(fileUrl);
  if (!parsed) return;
  try {
    const { kvSet: kvSet2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    await kvSet2(parsed.hash, DEAD_NS, "1", DEAD_TTL);
  } catch {
  }
}
async function deadHashes(hashes) {
  const dead = /* @__PURE__ */ new Set();
  if (hashes.length === 0) return dead;
  try {
    const { kvGet: kvGet2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    await Promise.all(
      hashes.map(async (h) => {
        if (await kvGet2(h, DEAD_NS).catch(() => null)) dead.add(h);
      })
    );
  } catch {
  }
  return dead;
}
var VIDEO_EXT4 = /\.(mp4|mkv|avi|wmv|mov|m4v|ts|webm|mpg|mpeg|flv)$/i;
var ARCHIVE_EXT = /\.(rar|zip|7z|tar|gz|part\d*|r\d{2}|\d{3}|z\d{2})$/i;
var RES_RE = /\b(2160p|1440p|1080p|720p|480p|360p|4k|uhd)\b/i;
var VR_RE = /\b(vr|180x180|360x180|3dh|sbs|fisheye|mkx200|tb180|180_180)\b/i;
var DATE_RE = /\b((?:20)?\d{2})[.\-_ ](\d{2})[.\-_ ](\d{2})\b/;
function parseRapidgatorUrl(rawUrl) {
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    return null;
  }
  if (!/(^|\.)rapidgator\.net$/i.test(u.hostname)) return null;
  const m = u.pathname.match(/^\/file\/([a-f0-9]{16,})(?:\/(.*))?$/i);
  if (!m) return null;
  const hash = m[1];
  let filename = "";
  if (m[2]) {
    try {
      filename = decodeURIComponent(m[2]);
    } catch {
      filename = m[2];
    }
    filename = filename.replace(/\.html?$/i, "").replace(/\/+$/, "").trim();
  }
  return { hash, filename };
}
function titleToFilename(title) {
  return title.replace(/^download file\s*/i, "").replace(/\s*[-–]\s*rapidgator.*$/i, "").replace(/…|\.\.\./g, "").trim();
}
function parseReleaseName2(rawName) {
  const name = rawName.replace(VIDEO_EXT4, "").trim();
  const resM = name.match(RES_RE);
  let resolution = resM ? resM[1].toLowerCase() : null;
  if (resolution === "4k" || resolution === "uhd") resolution = "2160p";
  const isVr = VR_RE.test(name);
  const dateM = name.match(DATE_RE);
  let date = null;
  if (dateM) {
    let [, y, mo, d] = dateM;
    if (y.length === 2) y = `20${y}`;
    date = `${y}-${mo}-${d}`;
  }
  let studio = null;
  const beforeDate = dateM ? name.slice(0, dateM.index ?? 0) : name;
  const lead = beforeDate.split(/[.\s_]+/).filter(Boolean)[0];
  if (lead && /^[A-Za-z][A-Za-z0-9&]+$/.test(lead)) studio = lead;
  const title = name.replace(/[._]+/g, " ").replace(/\b(x264|x265|h264|h265|hevc|aac|mp4|web|dl|webrip|hd|sd|kvr|oculus|smartphone)\b/gi, "").replace(RES_RE, "").replace(/\s{2,}/g, " ").replace(/\s*-\s*$/, "").trim();
  return { title: title || rawName, studio, date, resolution, isVr };
}
function encodeId(url) {
  return `rapidgator:${Buffer.from(url, "utf8").toString("base64url")}`;
}
function decodeRapidgatorId(id) {
  if (!id.startsWith("rapidgator:")) return null;
  try {
    const url = Buffer.from(id.slice("rapidgator:".length), "base64url").toString("utf8");
    return /^https?:\/\/(?:[a-z0-9-]+\.)?rapidgator\.net\//i.test(url) ? url : null;
  } catch {
    return null;
  }
}
async function rapidgatorAvailable() {
  try {
    const { canUnrestrict: canUnrestrict2 } = await Promise.resolve().then(() => (init_debrid(), debrid_exports));
    return await canUnrestrict2();
  } catch {
    return false;
  }
}
var JUNK_TITLE_RE = /^(file|file ?size|filesize|download(ing)?|free download|copy to my files|rapidgator|folder|premium|fast,? safe)\b/i;
function isPlausibleRelease(name) {
  const n = name.trim();
  if (n.length < 6) return false;
  if (JUNK_TITLE_RE.test(n)) return false;
  const tokens = n.split(/[.\s_\-]+/).filter((t) => /[a-z0-9]/i.test(t));
  return tokens.length >= 2;
}
async function mapLimit2(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  const worker = async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length || 1) }, worker));
  return out;
}
var TPDB_NS = "rapidgator_tpdb";
var TPDB_HIT_TTL = 7 * 24 * 3600;
var TPDB_MISS_TTL = 24 * 3600;
async function enrichWithTpdb(card2, releaseName, token, signal) {
  if (!token) return card2;
  const key = releaseName.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 200);
  if (!key) return card2;
  let match = null;
  try {
    const { kvGet: kvGet2, kvSet: kvSet2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const cached = await kvGet2(key, TPDB_NS).catch(() => null);
    if (cached != null) {
      match = cached === "" ? null : JSON.parse(cached);
    } else {
      match = await tpdbBestMatch(releaseName, { token, contentType: "scenes", signal }).catch(() => null);
      if (!match) {
        match = await tpdbBestMatch(releaseName, { token, contentType: "movies", signal }).catch(() => null);
      }
      await kvSet2(key, TPDB_NS, match ? JSON.stringify(match) : "", match ? TPDB_HIT_TTL : TPDB_MISS_TTL).catch(() => {
      });
    }
  } catch {
    return card2;
  }
  if (!match) return card2;
  return {
    ...card2,
    // Keep the rapidgator: id (resolve unrestricts THAT file) — only the display
    // metadata comes from TPDB.
    title: match.title || card2.title,
    posterUrl: match.posterUrl ?? card2.posterUrl,
    backgroundUrl: match.backgroundUrl ?? card2.backgroundUrl,
    date: match.date ?? card2.date,
    year: match.date ? Number(match.date.slice(0, 4)) : card2.year,
    performers: match.performers.length ? match.performers : card2.performers,
    studio: match.studio ?? card2.studio,
    description: match.description ?? card2.description,
    rating: match.rating ?? card2.rating,
    durationSeconds: match.durationSeconds ?? card2.durationSeconds,
    contentType: match.contentType ?? card2.contentType
  };
}
async function rapidgatorSearch(query, opts = {}) {
  const q = query.trim();
  if (!q) return [];
  const dork = `site:rapidgator.net ${q}`;
  const pages = await Promise.all(
    [1, 2, 3].map(
      (page) => webSearch(dork, { limit: 40, page, signal: opts.signal }).catch(() => [])
    )
  );
  const results = pages.flat();
  const raw = [];
  const seen = /* @__PURE__ */ new Set();
  const seenUrls = /* @__PURE__ */ new Set();
  for (const r of results) {
    if (seenUrls.has(r.url)) continue;
    seenUrls.add(r.url);
    const parsed = parseRapidgatorUrl(r.url);
    if (!parsed) continue;
    if (seen.has(parsed.hash)) continue;
    const filename = parsed.filename || titleToFilename(r.title);
    if (!filename || !isPlausibleRelease(filename)) continue;
    const hasExt = /\.[a-z0-9]{2,4}$/i.test(filename);
    if (ARCHIVE_EXT.test(filename)) continue;
    if (hasExt && !VIDEO_EXT4.test(filename)) continue;
    seen.add(parsed.hash);
    raw.push({ url: r.url, hash: parsed.hash, filename });
  }
  const dead = await deadHashes(raw.map((r) => r.hash));
  const live = dead.size ? raw.filter((r) => !dead.has(r.hash)) : raw;
  let token = "";
  try {
    const { settings: settings2 } = await Promise.resolve().then(() => (init_host2(), host_exports));
    token = (await settings2()).tpdb_token;
  } catch {
  }
  const cards = await mapLimit2(live, 6, async ({ url, hash, filename }) => {
    const meta = parseReleaseName2(filename);
    const base2 = {
      id: encodeId(url),
      kind: "scene",
      contentType: null,
      uuid: hash,
      title: meta.title,
      posterUrl: null,
      backgroundUrl: null,
      date: meta.date,
      year: meta.date ? Number(meta.date.slice(0, 4)) : null,
      performers: [],
      studio: meta.studio,
      description: null,
      rating: null,
      durationSeconds: null,
      source: "rapidgator",
      resolution: meta.resolution,
      isVr: meta.isVr
    };
    return enrichWithTpdb(base2, filename, token, opts.signal);
  });
  const CARDS_NS = "rapidgator_cards";
  const CARDS_TTL = 90 * 60;
  const CARDS_CAP = 60;
  let merged = cards;
  try {
    const { kvGet: kvGet2, kvSet: kvSet2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const cacheKey = q.toLowerCase().replace(/\s+/g, " ").trim();
    const prevRaw = await kvGet2(cacheKey, CARDS_NS).catch(() => null);
    if (prevRaw) {
      const prev = JSON.parse(prevRaw);
      const byHash = /* @__PURE__ */ new Map();
      for (const c of [...prev, ...cards]) {
        const ex = byHash.get(c.uuid);
        if (!ex || !ex.posterUrl && c.posterUrl) byHash.set(c.uuid, c);
      }
      merged = Array.from(byHash.values()).slice(0, CARDS_CAP);
    }
    if (dead.size) merged = merged.filter((c) => !dead.has(c.uuid));
    await kvSet2(cacheKey, CARDS_NS, JSON.stringify(merged), CARDS_TTL).catch(() => {
    });
  } catch {
  }
  const enriched = merged.filter((c) => !!c.posterUrl).length;
  logger.info(
    "adult",
    `Rapidgator search "${q}": ${results.length} hits \u2192 ${cards.length} fresh / ${merged.length} merged cards (${enriched} with TPDB poster)`
  );
  return merged;
}
async function rapidgatorResolve(id) {
  const url = decodeRapidgatorId(id);
  if (!url) return null;
  const { unrestrict: unrestrict2 } = await Promise.resolve().then(() => (init_debrid(), debrid_exports));
  const r = await unrestrict2(url).catch((e) => ({ status: "failed", message: e?.message }));
  if (r.status !== "ready") {
    logger.warn("adult", `Rapidgator unrestrict failed: ${r.status === "failed" ? r.message ?? "" : r.status}`);
    if (r.status === "failed" && r.message === "gone") await markDeadLink(url);
    return null;
  }
  const data = { download: r.url, filename: r.fileName };
  if (!data?.download) return null;
  const filename = data.filename ?? parseRapidgatorUrl(url)?.filename ?? "";
  if (ARCHIVE_EXT.test(filename)) {
    logger.warn("adult", `Rapidgator resolve skipped archive file: ${filename}`);
    return null;
  }
  const probe = await probeAdultStream(data.download);
  if (probe && !probe.hasVideo) {
    logger.warn("adult", `Rapidgator resolve skipped non-video file: ${filename}`);
    return null;
  }
  const durationSeconds = probe?.durationSeconds ?? 0;
  const streamInfo = probe?.streamInfo ?? null;
  const meta = parseReleaseName2(filename);
  return {
    url: data.download,
    durationTicks: Math.max(0, Math.round(durationSeconds * 1e7)),
    title: meta.title || filename,
    posterUrl: null,
    infoHash: null,
    streamInfo
  };
}

// manifest.json
var manifest_default = {
  id: "zero.vault",
  name: "Vault",
  version: "2.0.2",
  description: "A locked space of its own \u2014 catalog and search with ThePornDB metadata (Zilean / Torznab / Knaben / apiJAV / Rapidgator sources), played through the debrid service.",
  resources: [
    "catalog",
    "stream",
    "space",
    "automation"
  ],
  types: [
    "video"
  ],
  idPrefixes: [
    "catalog:",
    "tpdb:",
    "rapidgator:",
    "apijav:"
  ],
  provides: {
    content: [
      "adult"
    ]
  },
  zero: {
    kind: "adult",
    sdk: 3,
    repo: "j4ckgrey/zero_vault",
    branch: "main",
    bundlePath: "dist/index.mjs",
    bundleUrl: "https://raw.githubusercontent.com/j4ckgrey/zero_vault/release/dist/index.mjs",
    settings: [
      {
        key: "tpdb_token",
        type: "secret",
        label: "ThePornDB API token",
        description: "From api.theporndb.net \u2192 API tokens. Search, titles and pictures need it."
      },
      {
        key: "content_types",
        type: "list",
        label: "What ThePornDB search covers",
        description: "None picked searches scenes.",
        default: [
          "scenes",
          "movies",
          "jav"
        ],
        options: [
          {
            value: "scenes",
            label: "Scenes"
          },
          {
            value: "movies",
            label: "Movies"
          },
          {
            value: "jav",
            label: "JAV"
          }
        ]
      },
      {
        key: "zilean_url",
        type: "url",
        label: "Zilean",
        description: "A Zilean instance (DMM hashlists) \u2014 the main source of releases for the catalog.",
        placeholder: "https://zilean.example.com"
      },
      {
        key: "torznab_url",
        type: "url",
        label: "Torznab (Prowlarr / Jackett)",
        description: "Your indexer with adult (XXX) trackers."
      },
      {
        key: "torznab_key",
        type: "secret",
        label: "Torznab API key"
      },
      {
        key: "torznab_categories",
        type: "list",
        label: "Torznab categories",
        default: [
          "6000",
          "6010",
          "6020",
          "6030",
          "6040",
          "6050",
          "6060",
          "6070",
          "6080",
          "6090"
        ],
        options: [
          {
            value: "6000",
            label: "All XXX (6000)"
          },
          {
            value: "6010",
            label: "DVD (6010)"
          },
          {
            value: "6020",
            label: "WMV (6020)"
          },
          {
            value: "6030",
            label: "XviD (6030)"
          },
          {
            value: "6040",
            label: "x264 (6040)"
          },
          {
            value: "6045",
            label: "UHD (6045)"
          },
          {
            value: "6050",
            label: "Packs (6050)"
          },
          {
            value: "6060",
            label: "Image sets (6060)"
          },
          {
            value: "6070",
            label: "Other (6070)"
          },
          {
            value: "6080",
            label: "SD (6080)"
          },
          {
            value: "6090",
            label: "WEB-DL (6090)"
          }
        ],
        description: "Newznab XXX categories your indexer is searched in."
      },
      {
        key: "apijav_enabled",
        type: "toggle",
        label: "apiJAV",
        description: "JAV catalog with its own player (direct HLS, no debrid).",
        default: false
      },
      {
        key: "apijav_url",
        type: "url",
        label: "apiJAV address",
        default: "https://server.apijav.com",
        showIf: {
          key: "apijav_enabled",
          equals: true
        }
      },
      {
        key: "apijav_key",
        type: "secret",
        label: "apiJAV key (optional)",
        showIf: {
          key: "apijav_enabled",
          equals: true
        }
      },
      {
        key: "cached_only",
        type: "toggle",
        label: "Cached on debrid only",
        description: "On: only releases the debrid has ready play. Off: picking one that isn't cached starts the download.",
        default: true
      },
      {
        key: "home_rails",
        type: "list",
        label: "Start-page rows",
        default: []
      }
    ],
    actions: [
      {
        id: "status"
      },
      {
        id: "rails-list"
      },
      {
        id: "rails-toggle"
      },
      {
        id: "refresh-catalogs"
      }
    ],
    ui: {
      tabs: [
        {
          id: "vault",
          label: "Vault",
          icon: "lock",
          group: "content",
          description: "A locked space with its own catalog and search \u2014 ThePornDB metadata, played through debrid.",
          sections: [
            {
              kind: "status",
              id: "status",
              title: "Status",
              source: "status"
            },
            {
              kind: "form",
              id: "metadata",
              title: "Metadata",
              fields: [
                "tpdb_token",
                "content_types"
              ]
            },
            {
              kind: "form",
              id: "sources",
              title: "Sources",
              description: "Knaben is always searched; add the ones you have.",
              fields: [
                "zilean_url",
                "torznab_url",
                "torznab_key",
                "torznab_categories",
                "apijav_enabled",
                "apijav_url",
                "apijav_key"
              ]
            },
            {
              kind: "form",
              id: "playback",
              title: "Playback",
              fields: [
                "cached_only"
              ]
            },
            {
              kind: "table",
              id: "rails",
              title: "Start-page rows",
              description: "Lists shown when the space opens (releases cached on the debrid only).",
              rows: "rails-list",
              columns: [
                {
                  key: "title",
                  label: "List"
                },
                {
                  key: "group",
                  label: "Group"
                },
                {
                  key: "enabled",
                  label: "Shown",
                  format: "bool"
                }
              ],
              rowButtons: [
                {
                  action: "rails-toggle",
                  label: "Show / hide"
                }
              ]
            },
            {
              kind: "buttons",
              id: "tools",
              title: "Tools",
              buttons: [
                {
                  action: "refresh-catalogs",
                  label: "Refresh lists now"
                }
              ]
            }
          ]
        }
      ]
    },
    spaces: [
      {
        id: "library",
        name: "Vault",
        icon: "lock",
        layout: "video",
        locked: true,
        render: "addon",
        proxyImages: true
      }
    ],
    services: {
      uses: [
        "debrid"
      ]
    },
    automations: [
      {
        id: "refresh-catalogs",
        name: "Refresh adult catalogs",
        description: "Rebuilds Vault's lists (New in VR, VR studios, New releases, studios \u2014 releases cached on the debrid only) and pulls new VR studio releases.",
        intervalMinutes: 240
      }
    ]
  },
  catalogs: [
    {
      id: "vr-new",
      type: "video",
      name: "New in VR",
      names: {
        en: "New in VR",
        de: "Neu in VR",
        fr: "Nouveaut\xE9s VR",
        it: "Novit\xE0 in VR",
        es: "Novedades en VR",
        nl: "Nieuw in VR",
        pt: "Novidades em VR",
        zh: "\u6700\u65B0 VR"
      },
      group: "vr",
      groupNames: {
        en: "VR",
        de: "VR",
        fr: "VR",
        it: "VR",
        es: "VR",
        nl: "VR",
        pt: "VR",
        zh: "VR"
      },
      vr: true
    },
    {
      id: "studio:MilfVR",
      type: "video",
      name: "MilfVR",
      group: "vr",
      groupNames: {
        en: "VR",
        de: "VR",
        fr: "VR",
        it: "VR",
        es: "VR",
        nl: "VR",
        pt: "VR",
        zh: "VR"
      },
      vr: true
    },
    {
      id: "studio:WankzVR",
      type: "video",
      name: "WankzVR",
      group: "vr",
      groupNames: {
        en: "VR",
        de: "VR",
        fr: "VR",
        it: "VR",
        es: "VR",
        nl: "VR",
        pt: "VR",
        zh: "VR"
      },
      vr: true
    },
    {
      id: "studio:VRBangers",
      type: "video",
      name: "VRBangers",
      group: "vr",
      groupNames: {
        en: "VR",
        de: "VR",
        fr: "VR",
        it: "VR",
        es: "VR",
        nl: "VR",
        pt: "VR",
        zh: "VR"
      },
      vr: true
    },
    {
      id: "studio:SexLikeReal",
      type: "video",
      name: "SexLikeReal",
      group: "vr",
      groupNames: {
        en: "VR",
        de: "VR",
        fr: "VR",
        it: "VR",
        es: "VR",
        nl: "VR",
        pt: "VR",
        zh: "VR"
      },
      vr: true
    },
    {
      id: "studio:BaDoinkVR",
      type: "video",
      name: "BaDoinkVR",
      group: "vr",
      groupNames: {
        en: "VR",
        de: "VR",
        fr: "VR",
        it: "VR",
        es: "VR",
        nl: "VR",
        pt: "VR",
        zh: "VR"
      },
      vr: true
    },
    {
      id: "studio:CzechVR",
      type: "video",
      name: "CzechVR",
      group: "vr",
      groupNames: {
        en: "VR",
        de: "VR",
        fr: "VR",
        it: "VR",
        es: "VR",
        nl: "VR",
        pt: "VR",
        zh: "VR"
      },
      vr: true
    },
    {
      id: "new",
      type: "video",
      name: "New releases",
      names: {
        en: "New releases",
        de: "Neuerscheinungen",
        fr: "Nouveaut\xE9s",
        it: "Nuove uscite",
        es: "Novedades",
        nl: "Nieuw verschenen",
        pt: "Lan\xE7amentos",
        zh: "\u6700\u65B0\u53D1\u5E03"
      },
      group: "new",
      groupNames: {
        en: "New",
        de: "Neu",
        fr: "Nouveau",
        it: "Nuovo",
        es: "Nuevo",
        nl: "Nieuw",
        pt: "Novo",
        zh: "\u6700\u65B0"
      }
    },
    {
      id: "studio:Brazzers",
      type: "video",
      name: "Brazzers",
      group: "studios",
      groupNames: {
        en: "Studios",
        de: "Studios",
        fr: "Studios",
        it: "Studi",
        es: "Estudios",
        nl: "Studio's",
        pt: "Est\xFAdios",
        zh: "\u5236\u4F5C\u5546"
      }
    },
    {
      id: "studio:Vixen",
      type: "video",
      name: "Vixen",
      group: "studios",
      groupNames: {
        en: "Studios",
        de: "Studios",
        fr: "Studios",
        it: "Studi",
        es: "Estudios",
        nl: "Studio's",
        pt: "Est\xFAdios",
        zh: "\u5236\u4F5C\u5546"
      }
    },
    {
      id: "studio:Blacked",
      type: "video",
      name: "Blacked",
      group: "studios",
      groupNames: {
        en: "Studios",
        de: "Studios",
        fr: "Studios",
        it: "Studi",
        es: "Estudios",
        nl: "Studio's",
        pt: "Est\xFAdios",
        zh: "\u5236\u4F5C\u5546"
      }
    },
    {
      id: "studio:Tushy",
      type: "video",
      name: "Tushy",
      group: "studios",
      groupNames: {
        en: "Studios",
        de: "Studios",
        fr: "Studios",
        it: "Studi",
        es: "Estudios",
        nl: "Studio's",
        pt: "Est\xFAdios",
        zh: "\u5236\u4F5C\u5546"
      }
    },
    {
      id: "studio:Reality Kings",
      type: "video",
      name: "Reality Kings",
      group: "studios",
      groupNames: {
        en: "Studios",
        de: "Studios",
        fr: "Studios",
        it: "Studi",
        es: "Estudios",
        nl: "Studio's",
        pt: "Est\xFAdios",
        zh: "\u5236\u4F5C\u5546"
      }
    },
    {
      id: "studio:Naughty America",
      type: "video",
      name: "Naughty America",
      group: "studios",
      groupNames: {
        en: "Studios",
        de: "Studios",
        fr: "Studios",
        it: "Studi",
        es: "Estudios",
        nl: "Studio's",
        pt: "Est\xFAdios",
        zh: "\u5236\u4F5C\u5546"
      }
    }
  ]
};

// src/space.ts
var TEXT = {
  catalog: { en: "Movies & scenes", de: "Filme & Szenen", fr: "Films et sc\xE8nes", it: "Film e scene", es: "Pel\xEDculas y escenas", nl: "Films & sc\xE8nes", pt: "Filmes e cenas", zh: "\u7535\u5F71\u548C\u573A\u666F" },
  jav: { en: "JAV", de: "JAV", fr: "JAV", it: "JAV", es: "JAV", nl: "JAV", pt: "JAV", zh: "JAV" },
  files: { en: "Files", de: "Dateien", fr: "Fichiers", it: "File", es: "Archivos", nl: "Bestanden", pt: "Arquivos", zh: "\u6587\u4EF6" },
  all: { en: "All", de: "Alle", fr: "Tout", it: "Tutto", es: "Todo", nl: "Alles", pt: "Tudo", zh: "\u5168\u90E8" },
  vrOnly: { en: "VR only", de: "Nur VR", fr: "VR uniquement", it: "Solo VR", es: "Solo VR", nl: "Alleen VR", pt: "S\xF3 VR", zh: "\u4EC5 VR" },
  category: { en: "Category", de: "Kategorie", fr: "Cat\xE9gorie", it: "Categoria", es: "Categor\xEDa", nl: "Categorie", pt: "Categoria", zh: "\u5206\u7C7B" },
  noResults: { en: "No results.", de: "Keine Ergebnisse.", fr: "Aucun r\xE9sultat.", it: "Nessun risultato.", es: "Sin resultados.", nl: "Geen resultaten.", pt: "Nenhum resultado.", zh: "\u6CA1\u6709\u7ED3\u679C\u3002" },
  start: {
    en: "Search to get started \u2014 or pick home rows in Dashboard \u2192 Vault.",
    de: "Suche, um loszulegen \u2014 oder w\xE4hle Startreihen unter Dashboard \u2192 Vault.",
    fr: "Lancez une recherche \u2014 ou choisissez les rang\xE9es d'accueil dans Tableau de bord \u2192 Vault.",
    it: "Cerca per iniziare \u2014 oppure scegli le righe iniziali in Dashboard \u2192 Vault.",
    es: "Busca para empezar \u2014 o elige filas de inicio en Panel \u2192 Vault.",
    nl: "Zoek om te beginnen \u2014 of kies startrijen via Dashboard \u2192 Vault.",
    pt: "Pesquise para come\xE7ar \u2014 ou escolha as linhas iniciais em Painel \u2192 Vault.",
    zh: "\u641C\u7D22\u4EE5\u5F00\u59CB \u2014 \u6216\u5728 \u63A7\u5236\u53F0 \u2192 Vault \u4E2D\u9009\u62E9\u9996\u9875\u884C\u3002"
  },
  setup: {
    en: "Set up Vault first: a ThePornDB token and a source (Dashboard \u2192 Vault).",
    de: "Richte Vault zuerst ein: ThePornDB-Token und eine Quelle (Dashboard \u2192 Vault).",
    fr: "Configurez d'abord Vault : un jeton ThePornDB et une source (Tableau de bord \u2192 Vault).",
    it: "Configura prima Vault: un token ThePornDB e una fonte (Dashboard \u2192 Vault).",
    es: "Configura Vault primero: un token de ThePornDB y una fuente (Panel \u2192 Vault).",
    nl: "Stel Vault eerst in: een ThePornDB-token en een bron (Dashboard \u2192 Vault).",
    pt: "Configure o Vault primeiro: um token do ThePornDB e uma fonte (Painel \u2192 Vault).",
    zh: "\u8BF7\u5148\u8BBE\u7F6E Vault\uFF1AThePornDB \u4EE4\u724C\u548C\u4E00\u4E2A\u6765\u6E90\uFF08\u63A7\u5236\u53F0 \u2192 Vault\uFF09\u3002"
  }
};
var localeOf = (req) => req.context?.user?.locale ?? "en";
var known = /* @__PURE__ */ new Map();
function remember(id, k) {
  known.delete(id);
  known.set(id, k);
  if (known.size > 5e3) known.delete(known.keys().next().value);
}
var joinMeta = (...parts) => parts.filter((p) => p !== null && p !== void 0 && p !== "").join(" \xB7 ") || void 0;
function card(r) {
  const id = String(r.id);
  remember(id, { title: r.title, image: r.posterUrl ?? null, isVr: r.isVr === true });
  if (r.kind === "performer") {
    return { id, type: "person", title: r.title, image: r.posterUrl, shape: "portrait", open: `performer:${r.title}` };
  }
  const badges = [r.resolution, r.isVr ? "VR" : null].filter((b) => !!b);
  return {
    id,
    type: "video",
    title: r.title,
    subtitle: joinMeta(r.studio, r.date ?? r.year),
    meta: Array.isArray(r.performers) && r.performers.length ? r.performers.slice(0, 3).join(", ") : void 0,
    image: r.posterUrl ?? r.backgroundUrl,
    shape: "landscape",
    duration: r.durationSeconds ?? void 0,
    badges: badges.length ? badges : void 0,
    playable: true
  };
}
async function backends(locale) {
  const s = await settings();
  const sources = await listAdultStreamSources();
  const list = [];
  if (s.tpdb_token && sources.some((x) => x.source_type === "zilean")) list.push({ id: "catalog", label: uiText(TEXT.catalog, locale) });
  if (s.apijav_enabled) list.push({ id: "apijav", label: uiText(TEXT.jav, locale) });
  if (await rapidgatorAvailable().catch(() => false)) list.push({ id: "rapidgator", label: uiText(TEXT.files, locale) });
  return list;
}
async function homeRails(locale, vrOnly) {
  const picked = new Set((await settings()).home_rails);
  const lists = manifest_default.catalogs.filter((c) => picked.has(c.id) && (!vrOnly || c.vr === true));
  const rails = await mapLimit3(lists, 4, async (c) => {
    const items = (await catalogRail(c.id).catch(() => [])).filter((r) => !vrOnly || r.isVr === true).slice(0, 40).map(card);
    return items.length ? { id: c.id, title: uiText(c.names ?? c.name, locale), subtitle: c.groupNames ? uiText(c.groupNames, locale) : c.group, display: "rail", items } : null;
  });
  return rails.filter((r) => r !== null);
}
async function mapLimit3(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}
async function spaceView(req) {
  const locale = localeOf(req);
  const t = (k) => uiText(TEXT[k], locale);
  const extra = req.extra;
  const filtersIn = extra.filters ?? {};
  const path4 = req.id || "home";
  const list = await backends(locale);
  if (!list.length) return { view: { path: path4, sections: [], empty: t("setup") } };
  const selected = list.find((b) => b.id === filtersIn.source)?.id ?? list[0].id;
  const category = selected === "apijav" ? filtersIn.category ?? "" : "";
  const vrOnly = filtersIn.vr === "1";
  const filters = [];
  if (list.length > 1) filters.push({ id: "source", display: "chips", value: selected, options: list.map((b) => ({ value: b.id, label: b.label })) });
  filters.push({ id: "vr", display: "chips", value: vrOnly ? "1" : "", options: [{ value: "", label: t("all") }, { value: "1", label: t("vrOnly") }] });
  const s = await settings();
  const javOpts = { apiKey: s.apijav_key || void 0 };
  if (selected === "apijav") {
    const cats = await apijavCategories(s.apijav_url, javOpts).catch(() => []);
    if (cats.length) {
      filters.push({
        id: "category",
        label: t("category"),
        display: "select",
        value: category,
        options: [{ value: "", label: t("all") }, ...cats.map((x) => ({ value: x.slug, label: x.name }))]
      });
    }
  }
  const q = (path4.startsWith("performer:") ? path4.slice("performer:".length) : extra.query ?? "").trim();
  const page = Math.max(1, Number(extra.cursor) || 1);
  let results = [];
  let more = false;
  if (selected === "apijav") {
    results = await apijavSearch(s.apijav_url, { query: q, category, page, apiKey: s.apijav_key || void 0 }).catch(() => []);
    more = results.length > 0;
  } else if (!q && vrOnly && extra.submitted && selected === "catalog" && page === 1) {
    results = await browseVr().catch(() => []);
  } else if (q && page === 1) {
    const queries = vrOnly && !/\bvr\b/i.test(q) ? [q, `${q} vr`] : [q];
    const run = (sq) => selected === "catalog" ? searchCatalog(sq).catch(() => []) : selected === "rapidgator" ? rapidgatorSearch(sq).catch(() => []) : Promise.resolve([]);
    const seen = /* @__PURE__ */ new Set();
    results = (await Promise.all(queries.map(run))).flat().filter((r) => {
      const id = String(r.id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }
  if (vrOnly) results = results.filter((r) => r.kind !== "performer" && r.isVr === true);
  const header = path4.startsWith("performer:") ? { title: q } : void 0;
  if (!q && !extra.submitted && page === 1 && selected === "catalog" && !path4.startsWith("performer:")) {
    const rails = await homeRails(locale, vrOnly);
    if (rails.length) return { view: { path: path4, filters, header, sections: rails } };
  }
  return {
    view: {
      path: path4,
      filters,
      header,
      sections: results.length ? [{ id: "results", display: "grid", items: results.map(card), next: more ? String(page + 1) : void 0 }] : [],
      empty: q || selected === "apijav" ? t("noResults") : t("start")
    }
  };
}
var BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
function vrOf(id, title, fileName) {
  const k = known.get(id);
  if (fileName) {
    const f = detectProjection(fileName);
    if (f.isVr || f.is3d) return { stereo: f.stereo, screenType: f.screenType, fov: f.fov };
  }
  const d = detectProjection(title || k?.title || "", { assumeVrWhenHinted: k?.isVr !== false });
  if (d.isVr || d.is3d) return { stereo: d.stereo, screenType: d.screenType, fov: d.fov };
  return k?.isVr ? { stereo: "sbs", screenType: "dome", fov: 180 } : null;
}
function fromPlayback(id, pb) {
  if (!pb) return { status: "error", code: "stream_unavailable" };
  if ("queued" in pb) return { status: "preparing", progress: pb.progress ?? null };
  const k = known.get(id);
  const duration = pb.durationTicks ? Math.round(pb.durationTicks / 1e7) : void 0;
  return {
    status: "ready",
    media: "video",
    stream: { url: pb.url, behaviorHints: { notWebReady: true, ...duration ? { durationSeconds: duration } : {} } },
    title: pb.title || k?.title,
    image: pb.posterUrl ?? k?.image ?? null,
    duration,
    streamInfo: pb.streamInfo ?? null,
    vr: vrOf(id, pb.title, pb.fileName)
  };
}
async function playApijav(id) {
  const s = await settings();
  if (!s.apijav_enabled) return { status: "error", code: "source_unreachable" };
  const pb = await apijavResolve(s.apijav_url, id.slice("apijav:".length), { apiKey: s.apijav_key || void 0 }).catch(() => null);
  if (!pb) return { status: "error", code: "stream_unavailable" };
  const headers = { "User-Agent": BROWSER_UA, Referer: `${new URL(pb.url).origin}/` };
  const reachable = await fetch(pb.url, { headers: { ...headers, Range: "bytes=0-1" }, signal: AbortSignal.timeout(7e3) }).then((r) => {
    r.body?.cancel().catch(() => {
    });
    return r.ok;
  }).catch(() => false);
  if (!reachable) return { status: "error", code: "stream_unavailable" };
  const k = known.get(id);
  const stream = {
    url: pb.url,
    behaviorHints: { proxy: true, proxyHeaders: headers, ...pb.durationSeconds ? { durationSeconds: pb.durationSeconds } : {} },
    qualities: pb.qualities.map((x) => ({ label: x.label, height: x.height, url: x.videoUrl })),
    display: { title: pb.quality }
  };
  return {
    status: "ready",
    media: "video",
    stream,
    title: pb.title || k?.title,
    image: pb.posterUrl ?? k?.image ?? null,
    duration: pb.durationSeconds ?? void 0,
    vr: vrOf(id, pb.title)
  };
}
async function playItem(id, option) {
  if (id.startsWith("apijav:")) return playApijav(id);
  if (id.startsWith("rapidgator:")) return fromPlayback(id, await rapidgatorResolve(id).catch(() => null));
  const isCatalog = id.startsWith("catalog:");
  if (!isCatalog && !/^tpdb:(scenes|movies|jav):.+/.test(id)) return { status: "error", code: "not_found" };
  const resolve = (hash) => isCatalog ? adultResolveCatalog(hash ?? id.slice("catalog:".length)).catch(() => null) : adultResolveItem(id, void 0, hash ? { hash } : void 0).catch(() => null);
  if (option) return fromPlayback(id, await resolve(option));
  const streams = isCatalog ? await adultListCatalogStreams(id.slice("catalog:".length)).catch(() => []) : await adultListStreams(id).catch(() => []);
  if (streams.length === 0) return { status: "error", code: "stream_unavailable" };
  if (streams.length === 1) return fromPlayback(id, await resolve(streams[0].infoHash));
  return {
    status: "choose",
    title: known.get(id)?.title ?? "",
    options: streams.map((s) => {
      const vr = detectProjection(s.rawTitle, { assumeVrWhenHinted: true });
      const gb = s.sizeBytes ? `${(s.sizeBytes / 1024 ** 3).toFixed(1)} GB` : void 0;
      return { id: s.infoHash, label: s.rawTitle, detail: joinMeta(s.resolution, gb), badges: s.isVr || vr.isVr ? ["VR"] : vr.is3d ? ["3D"] : void 0 };
    })
  };
}
async function spacePlay(req) {
  const option = typeof req.extra.option === "string" ? req.extra.option : void 0;
  return { play: await playItem(req.id, option) };
}
async function streamsFor(id) {
  const play = await playItem(id);
  if (play.status === "ready") return [play.stream];
  if (play.status === "choose" && play.options[0]) {
    const first = await playItem(id, play.options[0].id);
    return first.status === "ready" ? [first.stream] : [];
  }
  return [];
}

// src/resources.ts
function resultMeta(r) {
  return {
    ...r,
    id: r.id,
    type: "video",
    name: r.title,
    poster: r.posterUrl,
    background: r.backgroundUrl,
    description: r.description,
    releaseInfo: r.date ?? (r.year ? String(r.year) : null),
    duration: r.durationSeconds,
    posterShape: r.kind === "performer" ? "portrait" : "landscape"
  };
}
var resources = {
  space: (req) => req.type === "play" ? spacePlay(req) : spaceView(req),
  catalog: async (req) => ({
    metas: isCatalogRail(req.id) ? (await catalogRail(req.id)).map(resultMeta) : []
  }),
  stream: async ({ id }) => ({ streams: await streamsFor(id) }),
  automation: async ({ id }) => {
    if (id === "refresh-catalogs") {
      const r = await refreshCatalogRails();
      return { ok: true, message: `${r.rails} lists, ${r.cards} cached releases` };
    }
    throw new Error(`unknown automation "${id}"`);
  }
};

// src/plugin.ts
async function status() {
  const [s, sources, debrid, stats] = await Promise.all([settings(), listAdultStreamSources(), getDebrid(), adultCatalogStats().catch(() => null)]);
  const item = (label, value, tone) => ({ label, value, tone });
  return {
    ok: true,
    items: [
      item("ThePornDB", s.tpdb_token ? "Token set" : "No token \u2014 search and pictures need one", s.tpdb_token ? "success" : "warning"),
      item("Debrid", debrid ? "Available" : "No add-on provides debrid (install Forge with a debrid account)", debrid ? "success" : "error"),
      item("Sources", sources.length ? sources.map((x) => x.source_type).join(", ") : "Knaben only \u2014 add Zilean for the catalog", sources.length ? "success" : "info"),
      item("Catalog", stats ? `${stats.total} releases \xB7 ${stats.matched} matched` : "Empty", stats?.total ? "success" : "info"),
      item("Home rows", s.home_rails.length ? `${s.home_rails.length} shown` : "None picked", s.home_rails.length ? "success" : "info")
    ]
  };
}
var addon = defineAddon({
  manifest: manifest_default,
  async setup(host2) {
    setVaultHost(host2);
    await migrateStorage();
    return {
      resources,
      actions: {
        status: async () => status(),
        "rails-list": async () => {
          const shown = new Set((await settings()).home_rails);
          return {
            ok: true,
            rows: manifest_default.catalogs.map((c) => ({ id: c.id, title: c.name, group: c.group ?? "", enabled: shown.has(c.id) }))
          };
        },
        "rails-toggle": async ({ row }) => {
          const r = row;
          if (!r?.id || !manifest_default.catalogs.some((c) => c.id === r.id)) return { ok: false, message: "No list given" };
          const shown = new Set((await settings()).home_rails);
          const on = !shown.has(r.id);
          if (on) shown.add(r.id);
          else shown.delete(r.id);
          await saveSettings({ home_rails: manifest_default.catalogs.map((c) => c.id).filter((id) => shown.has(id)) });
          return { ok: true, message: on ? "Shown on the start page" : "Hidden" };
        },
        "refresh-catalogs": async () => {
          const r = await refreshCatalogRails();
          return { ok: true, message: `${r.rails} lists, ${r.cards} cached releases` };
        }
      }
    };
  }
});
var manifest = addon.manifest;
var register = addon.register;
export {
  addon,
  manifest,
  register
};
