#!/usr/bin/env node
/**
 * Extracts ```java code blocks from solutions/*.md into compilable Java files.
 *
 * Each solution file contains one (or more) fenced ```java blocks with multiple
 * top-level classes. Java requires one public top-level class per file, so this
 * script splits each block at top-level declarations (class/interface/enum/record
 * at column 0), writes every class into build/java/<slug>/<ClassName>.java with an
 * injected `package <slug>;` header, and emits build/java/main-classes.txt listing
 * every runnable `<slug>.Main` entry point.
 *
 * Output: build/java/<slug>/<Class>.java files and build/java/main-classes.txt
 */
const fs = require("fs");
const path = require("path");

const SOLUTIONS_DIR = path.join(__dirname, "..", "solutions");
const OUT_DIR = path.join(__dirname, "..", "build", "java");

const DECL_RE =
  /^(?:(?:public|protected|private|abstract|final|sealed|non-sealed|static)\s+)*(class|interface|enum|record)\s+([A-Za-z_][A-Za-z0-9_]*)/;

function extractJavaBlocks(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  let inBlock = false;
  let current = null;
  for (const line of lines) {
    if (!inBlock && /^```java\s*$/.test(line)) {
      inBlock = true;
      current = [];
      continue;
    }
    if (inBlock && /^```\s*$/.test(line)) {
      inBlock = false;
      blocks.push(current.join("\n"));
      current = null;
      continue;
    }
    if (inBlock) current.push(line);
  }
  return blocks;
}

function splitTopLevelDeclarations(blockText) {
  const chunks = [];
  const imports = [];
  let pendingAnnotations = [];
  let currentLines = null;
  let currentName = null;
  let sawDecl = false;

  const isSeparator = (l) =>
    l.trim() === "" || /^\s*(\/\/|\/\*|\*|@)/.test(l);

  const flush = () => {
    if (currentLines && currentName) {
      // Trailing blanks/comments/annotations belong to the NEXT declaration
      // (e.g. a section header followed by @FunctionalInterface) — peel and carry.
      const carried = [];
      while (currentLines.length && isSeparator(currentLines[currentLines.length - 1])) {
        carried.unshift(currentLines.pop());
      }
      while (carried.length && carried[0].trim() === "") carried.shift();
      chunks.push({ name: currentName, text: currentLines.join("\n") });
      pendingAnnotations = carried;
    }
    currentLines = null;
    currentName = null;
  };

  for (const line of blockText.split("\n")) {
    const match = line.match(DECL_RE);
    if (match) {
      flush();
      sawDecl = true;
      currentName = match[2];
      currentLines = [...pendingAnnotations, line];
      pendingAnnotations = [];
    } else if (currentLines === null) {
      if (line.trim() === "") continue; // blank line between declarations
      if (!sawDecl && /^import\s/.test(line.trim())) {
        imports.push(line.trim());
      } else if (!line.startsWith(" ") && line.trimStart().startsWith("@")) {
        pendingAnnotations.push(line);
      } else if (/^\s*(\/\/|\/\*|\*)/.test(line)) {
        pendingAnnotations.push(line); // comments attach to the next declaration
      } else {
        throw new Error(`Unexpected top-level content: "${line}"`);
      }
    } else {
      currentLines.push(line);
    }
  }
  flush();
  return { chunks, imports };
}

// Slugs like "vending-machine" are not valid Java packages; sanitize to identifiers.
function toPackageName(slug) {
  const sanitized = slug.replace(/[^A-Za-z0-9_]/g, "_");
  return /^[0-9]/.test(sanitized) ? "_" + sanitized : sanitized;
}

function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const mdFiles = fs
    .readdirSync(SOLUTIONS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .sort();

  const mainClasses = [];
  const seen = new Set();
  let fileCount = 0;
  let classCount = 0;

  for (const mdFile of mdFiles) {
    const slug = mdFile.replace(/\.md$/, "");
    const pkg = toPackageName(slug);
    const markdown = fs.readFileSync(path.join(SOLUTIONS_DIR, mdFile), "utf8");
    const blocks = extractJavaBlocks(markdown);
    if (blocks.length === 0) {
      console.warn('WARN: no ```java block found in ' + mdFile);
      continue;
    }
    const pkgDir = path.join(OUT_DIR, pkg);
    fs.mkdirSync(pkgDir, { recursive: true });

    for (const block of blocks) {
      const { chunks, imports } = splitTopLevelDeclarations(block);
      const importBlock = imports.length ? imports.join("\n") + "\n" : "";
      for (const chunk of chunks) {
        const key = `${pkg}.${chunk.name}`;
        if (seen.has(key)) {
          throw new Error(`Duplicate class ${chunk.name} in ${mdFile}`);
        }
        seen.add(key);
        const fileName = path.join(pkgDir, `${chunk.name}.java`);
        fs.writeFileSync(fileName, `package ${pkg};\n\n${importBlock}\n${chunk.text}\n`, "utf8");
        fileCount += 1;
        if (chunk.name === "Main") mainClasses.push(`${pkg}.Main`);
      }
    }
    classCount += 1;
    console.log(`extracted ${mdFile} -> ${slug} (${blocks.length} block(s))`);
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "main-classes.txt"),
    mainClasses.join("\n") + (mainClasses.length ? "\n" : ""),
    "utf8"
  );
  console.log(`\nDone: ${classCount}/${mdFiles.length} solutions, ${fileCount} classes, ${mainClasses.length} Main entry points`);
  if (mainClasses.length === 0) {
    console.error("ERROR: no Main entry points found");
    process.exit(1);
  }
}

main();
