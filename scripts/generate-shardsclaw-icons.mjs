import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const mode = args.has("--write") ? "write" : "check";
const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
const only = onlyArg?.slice("--only=".length) ?? "all";
const allowed = new Set(["all", "web", "android", "ios", "linux", "macos"]);
if (!allowed.has(only)) throw new Error(`Unknown icon target: ${only}`);

const canonical = readFileSync(join(root, "ui/public/favicon.svg"), "utf8");
const body = canonical.match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/u)?.[1];
const outerPath = body?.match(/<path d="([^"]+)" fill="#0D1628"\/>/u)?.[1];
if (!body || !outerPath) throw new Error("Canonical Shardsclaw mark is not a readable SVG.");

const styles = {
  original: { background: "#0D1628", colors: ["#0D1628", "#24D6C1", "#0E9B91", "#D3DCE7"] },
  light: { background: "#EAF1F8", colors: ["#102238", "#0E9B91", "#167F7E", "#71899E"] },
  dark: { background: "#0A1828", colors: ["#071421", "#42E2D0", "#1CA99D", "#E1E9F0"] },
  sea: { background: "#0E9B91", colors: ["#0B1A29", "#D3DCE7", "#AFC0CE", "#F4F7FA"] },
  slate: { background: "#DDE7EF", colors: ["#0D1628", "#168D88", "#0E766F", "#71899E"] },
  midnight: { background: "#102238", colors: ["#071421", "#31DCC9", "#149B91", "#E1E9F0"] },
};

function recolor(mark, colors) {
  return mark
    .replaceAll("#0D1628", colors[0])
    .replaceAll("#24D6C1", colors[1])
    .replaceAll("#0E9B91", colors[2])
    .replaceAll("#D3DCE7", colors[3]);
}

function svgDocument(size, background, scale, colors = styles.original.colors) {
  const offset = (120 * (1 - scale)) / 2;
  const rect = background ? `<rect width="120" height="120" fill="${background}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 120 120">${rect}<g transform="translate(${offset} ${offset}) scale(${scale})">${recolor(body, colors)}</g></svg>`;
}

function renderIcon(size, background, scale, colors = styles.original.colors) {
  return Buffer.from(new Resvg(svgDocument(size, background, scale, colors)).render().asPng());
}

function renderMonochrome(size, color = "#FFFFFF", scale = 0.66) {
  const offset = (120 * (1 - scale)) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 120 120"><g transform="translate(${offset} ${offset}) scale(${scale})"><path d="${outerPath}" fill="${color}"/></g></svg>`;
  return Buffer.from(new Resvg(svg).render().asPng());
}

function addSrgbChunk(png) {
  const signature = png.subarray(0, 8);
  let offset = 8;
  const chunks = [];
  while (offset + 12 <= png.length) {
    const length = png.readUInt32BE(offset);
    const end = offset + 12 + length;
    const type = png.toString("ascii", offset + 4, offset + 8);
    chunks.push(png.subarray(offset, end));
    if (type === "sRGB") return png;
    offset = end;
    if (type === "IHDR") {
      const data = Buffer.from([0]);
      const typeBytes = Buffer.from("sRGB");
      const crc = crc32(Buffer.concat([typeBytes, data]));
      const chunk = Buffer.alloc(12 + data.length);
      chunk.writeUInt32BE(data.length, 0);
      typeBytes.copy(chunk, 4);
      data.copy(chunk, 8);
      chunk.writeUInt32BE(crc, 8 + data.length);
      chunks.push(chunk);
    }
  }
  return Buffer.concat([signature, ...chunks]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const value of buffer) {
    crc ^= value;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createIcns(render) {
  const entries = [
    ["icp4", 16],
    ["icp5", 32],
    ["icp6", 64],
    ["ic07", 128],
    ["ic08", 256],
    ["ic09", 512],
    ["ic10", 1024],
  ].map(([type, size]) => {
    const data = render(size);
    const chunk = Buffer.alloc(8 + data.length);
    chunk.write(type, 0, 4, "ascii");
    chunk.writeUInt32BE(chunk.length, 4);
    data.copy(chunk, 8);
    return chunk;
  });
  const length = 8 + entries.reduce((sum, chunk) => sum + chunk.length, 0);
  const header = Buffer.alloc(8);
  header.write("icns", 0, 4, "ascii");
  header.writeUInt32BE(length, 4);
  return Buffer.concat([header, ...entries]);
}

function createIco(render) {
  const sizes = [16, 32, 48, 64, 128, 256];
  const images = sizes.map((size) => render(size));
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((image, index) => {
    const base = 6 + index * 16;
    const size = sizes[index];
    header.writeUInt8(size === 256 ? 0 : size, base);
    header.writeUInt8(size === 256 ? 0 : size, base + 1);
    header.writeUInt8(0, base + 2);
    header.writeUInt8(0, base + 3);
    header.writeUInt16LE(1, base + 4);
    header.writeUInt16LE(32, base + 6);
    header.writeUInt32LE(image.length, base + 8);
    header.writeUInt32LE(offset, base + 12);
    offset += image.length;
  });
  return Buffer.concat([header, ...images]);
}

const outputs = new Map();
function add(path, data) {
  outputs.set(path, Buffer.isBuffer(data) ? data : Buffer.from(data));
}

function generateWeb() {
  add("ui/public/favicon-32.png", renderIcon(32, null, 1));
  add("ui/public/apple-touch-icon.png", renderIcon(180, styles.original.background, 0.82));
}

function generateAndroid() {
  const densities = [
    ["mdpi", 48, 108],
    ["hdpi", 72, 162],
    ["xhdpi", 96, 216],
    ["xxhdpi", 144, 324],
    ["xxxhdpi", 192, 432],
  ];
  for (const [density, legacySize, adaptiveSize] of densities) {
    const dir = `apps/android/app/src/main/res/mipmap-${density}`;
    add(`${dir}/ic_launcher.png`, renderIcon(legacySize, styles.original.background, 0.82));
    add(`${dir}/ic_launcher_foreground.png`, renderIcon(adaptiveSize, null, 0.66));
    add(`${dir}/ic_launcher_monochrome.png`, renderMonochrome(adaptiveSize));
  }
}

function generateIosSet(relativePath, background, colors) {
  const manifestPath = join(root, relativePath, "Contents.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const sizes = new Map();
  for (const image of manifest.images) {
    if (image.filename)
      sizes.set(image.filename, Number.parseInt(image["expected-size"] ?? "1024", 10));
  }
  for (const [filename, size] of sizes) {
    const target = `${relativePath}/${filename}`;
    if (filename.endsWith("-dark.png")) {
      add(target, addSrgbChunk(renderIcon(size, null, 0.82, styles.dark.colors)));
    } else {
      add(target, renderIcon(size, background, 0.82, colors));
    }
  }
}

function generateIos() {
  generateIosSet(
    "apps/ios/Sources/Assets.xcassets/AppIcon.appiconset",
    styles.original.background,
    styles.original.colors,
  );
  generateIosSet(
    "apps/ios/Sources/Assets.xcassets/AppIconDebug.appiconset",
    styles.midnight.background,
    styles.midnight.colors,
  );
}

function generateLinux() {
  const dir = "apps/linux/src-tauri/icons";
  const sizes = new Map([
    ["32x32.png", 32],
    ["128x128.png", 128],
    ["128x128@2x.png", 256],
    ["icon.png", 512],
    ["tray-template.png", 32],
  ]);
  for (const [filename, size] of sizes) {
    add(
      `${dir}/${filename}`,
      filename === "tray-template.png"
        ? renderMonochrome(size, "#000000", 0.78)
        : renderIcon(size, styles.original.background, 0.82),
    );
  }
  add(
    `${dir}/icon.ico`,
    createIco((size) => renderIcon(size, styles.original.background, 0.82)),
  );
  add(
    `${dir}/icon.icns`,
    createIcns((size) => renderIcon(size, styles.original.background, 0.82)),
  );
  add(`${dir}/icon.svg`, svgDocument(120, styles.original.background, 0.82));
  add(
    `${dir}/icon-tile.svg`,
    svgDocument(120, styles.midnight.background, 0.82, styles.midnight.colors),
  );
  add(
    `${dir}/tray-template.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><path d="${outerPath}" fill="#000000"/></svg>\n`,
  );
}

function generateMacos() {
  const appIcons = "apps/macos/Sources/OpenClaw/Resources/AppIcons";
  const variants = [
    ["paper-light", styles.original],
    ["paper-dark", styles.dark],
    ["heritage-light", styles.light],
    ["heritage-dark", styles.dark],
    ["clawmark-light", styles.slate],
    ["clawmark-dark", styles.midnight],
    ["origami-light", styles.light],
    ["origami-dark", styles.midnight],
    ["pincer-light", styles.sea],
    ["pincer-dark", styles.dark],
    ["openC-light", styles.slate],
    ["openC-dark", styles.midnight],
  ];
  for (const [name, style] of variants) {
    add(
      `${appIcons}/${name}.icns`,
      createIcns((size) => renderIcon(size, style.background, 0.82, style.colors)),
    );
  }
  add(
    "apps/macos/Sources/OpenClaw/Resources/OpenClaw.icns",
    outputs.get(`${appIcons}/paper-light.icns`),
  );

  const iconRoots = [join(root, "apps/macos")];
  while (iconRoots.length) {
    const current = iconRoots.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) iconRoots.push(path);
      else if (entry.name === "molty.svg" && path.includes(".icon"))
        add(
          path.slice(root.length + 1),
          canonical.replace(
            /<svg\b[^>]*>/u,
            '<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">',
          ),
        );
    }
  }
}

const generators = {
  web: generateWeb,
  android: generateAndroid,
  ios: generateIos,
  linux: generateLinux,
  macos: generateMacos,
};
for (const [target, generate] of Object.entries(generators)) {
  if (only === "all" || only === target) generate();
}

const problems = [];
for (const [relativePath, expected] of outputs) {
  const path = join(root, relativePath);
  if (mode === "write") {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, expected);
  } else {
    let actual;
    try {
      actual = readFileSync(path);
    } catch {
      problems.push(`${relativePath} is missing`);
      continue;
    }
    if (!actual.equals(expected)) problems.push(`${relativePath} is stale`);
  }
}

if (problems.length) {
  console.error(`${problems.length} Shardsclaw icon asset(s) need generation:`);
  for (const problem of problems) console.error(`- ${problem}`);
  console.error("Run: node scripts/generate-shardsclaw-icons.mjs --write");
  process.exitCode = 1;
} else {
  console.log(
    `${mode === "write" ? "Generated" : "Verified"} ${outputs.size} Shardsclaw icon assets (${only}).`,
  );
}
