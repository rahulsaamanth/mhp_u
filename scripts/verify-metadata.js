#!/usr/bin/env node

/**
 * Metadata Verification Tool
 * --------------------------
 * This script checks all metadata.ts files in the project to ensure they conform to SEO best practices.
 * It identifies missing fields, suboptimal descriptions, and potential SEO issues.
 *
 * Usage:
 *   node scripts/verify-metadata.js
 *
 * The script will output a report of issues found and recommendations for improvement.
 */

const fs = require("fs")
const path = require("path")
const glob = require("glob")
const { parse } = require("@typescript-eslint/typescript-estree")

// Configuration
const MIN_DESCRIPTION_LENGTH = 50
const MAX_DESCRIPTION_LENGTH = 160
const MIN_TITLE_LENGTH = 10
const MAX_TITLE_LENGTH = 60

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
}

// Find all metadata files
const metadataFiles = glob.sync("app/**/metadata.ts", {
  ignore: "app/**/node_modules/**",
})

console.log(`${colors.bright}SEO Metadata Verification Tool${colors.reset}`)
console.log(`Found ${metadataFiles.length} metadata files to check\n`)

let issuesFound = 0
let filesWithIssues = 0

metadataFiles.forEach((filePath) => {
  const relativePath = filePath.split("app/")[1]
  let fileHasIssues = false

  console.log(`${colors.blue}Checking: ${relativePath}${colors.reset}`)

  try {
    const content = fs.readFileSync(filePath, "utf-8")
    const ast = parse(content, {
      jsx: true,
      range: true,
      loc: true,
    })

    let metadata = {}

    // Find the metadata object in the AST
    ast.body.forEach((node) => {
      if (
        node.type === "ExportNamedDeclaration" &&
        node.declaration &&
        node.declaration.type === "VariableDeclaration" &&
        node.declaration.declarations.some((d) => d.id.name === "metadata")
      ) {
        const declaration = node.declaration.declarations.find(
          (d) => d.id.name === "metadata"
        )

        // For direct metadata object (not using the utility function)
        if (declaration.init.type === "ObjectExpression") {
          metadata = extractObjectProperties(declaration.init)
        }
        // For metadata created with utility function
        else if (declaration.init.type === "CallExpression") {
          // Get arguments from the utility function call
          if (
            declaration.init.arguments.length > 0 &&
            declaration.init.arguments[0].type === "ObjectExpression"
          ) {
            metadata = extractObjectProperties(declaration.init.arguments[0])
          }
        }
      }
    })

    // Check for issues
    let localIssues = 0

    // Title checks
    if (!metadata.title) {
      console.log(`  ${colors.red}✗ Missing title${colors.reset}`)
      localIssues++
    } else {
      const titleLength =
        typeof metadata.title === "string"
          ? metadata.title.length
          : metadata.title.default
          ? metadata.title.default.length
          : 0

      if (titleLength < MIN_TITLE_LENGTH) {
        console.log(
          `  ${colors.yellow}⚠ Title is too short (${titleLength} chars)${colors.reset}`
        )
        localIssues++
      } else if (titleLength > MAX_TITLE_LENGTH) {
        console.log(
          `  ${colors.yellow}⚠ Title is too long (${titleLength} chars)${colors.reset}`
        )
        localIssues++
      }
    }

    // Description checks
    if (!metadata.description) {
      console.log(`  ${colors.red}✗ Missing description${colors.reset}`)
      localIssues++
    } else {
      const descLength = metadata.description.length
      if (descLength < MIN_DESCRIPTION_LENGTH) {
        console.log(
          `  ${colors.yellow}⚠ Description is too short (${descLength} chars)${colors.reset}`
        )
        localIssues++
      } else if (descLength > MAX_DESCRIPTION_LENGTH) {
        console.log(
          `  ${colors.yellow}⚠ Description is too long (${descLength} chars)${colors.reset}`
        )
        localIssues++
      }
    }

    // Keywords check
    if (
      !metadata.keywords ||
      !Array.isArray(metadata.keywords) ||
      metadata.keywords.length === 0
    ) {
      console.log(`  ${colors.yellow}⚠ Missing keywords${colors.reset}`)
      localIssues++
    }

    // OpenGraph checks
    if (!metadata.openGraph) {
      console.log(
        `  ${colors.yellow}⚠ Missing OpenGraph metadata${colors.reset}`
      )
      localIssues++
    } else {
      if (!metadata.openGraph.title) {
        console.log(
          `  ${colors.yellow}⚠ Missing OpenGraph title${colors.reset}`
        )
        localIssues++
      }
      if (!metadata.openGraph.description) {
        console.log(
          `  ${colors.yellow}⚠ Missing OpenGraph description${colors.reset}`
        )
        localIssues++
      }
      if (!metadata.openGraph.url) {
        console.log(`  ${colors.yellow}⚠ Missing OpenGraph URL${colors.reset}`)
        localIssues++
      }
    }

    // Canonical checks
    if (!metadata.alternates || !metadata.alternates.canonical) {
      console.log(`  ${colors.yellow}⚠ Missing canonical URL${colors.reset}`)
      localIssues++
    }

    if (localIssues === 0) {
      console.log(`  ${colors.green}✓ No issues found${colors.reset}`)
    } else {
      fileHasIssues = true
      issuesFound += localIssues
    }
  } catch (error) {
    console.log(
      `  ${colors.red}✗ Error parsing file: ${error.message}${colors.reset}`
    )
    fileHasIssues = true
    issuesFound++
  }

  if (fileHasIssues) {
    filesWithIssues++
  }

  console.log("")
})

// Summary
console.log(`${colors.bright}Summary:${colors.reset}`)
console.log(`Total files checked: ${metadataFiles.length}`)
console.log(`Files with issues: ${filesWithIssues}`)
console.log(`Total issues found: ${issuesFound}`)

if (issuesFound === 0) {
  console.log(`\n${colors.green}All metadata files look good!${colors.reset}`)
} else {
  console.log(
    `\n${colors.yellow}Some metadata files need improvement.${colors.reset}`
  )
  console.log(
    "Run this script again after fixing the issues to ensure all metadata is optimized for SEO."
  )
}

// Helper function to extract properties from an object expression
function extractObjectProperties(objectExpr) {
  const result = {}

  if (!objectExpr.properties) {
    return result
  }

  objectExpr.properties.forEach((prop) => {
    if (prop.key && prop.key.name) {
      const name = prop.key.name

      if (prop.value.type === "Literal") {
        result[name] = prop.value.value
      } else if (prop.value.type === "ArrayExpression") {
        result[name] = prop.value.elements.map((el) =>
          el.type === "Literal"
            ? el.value
            : el.type === "ObjectExpression"
            ? {}
            : null
        )
      } else if (prop.value.type === "ObjectExpression") {
        result[name] = extractObjectProperties(prop.value)
      } else if (prop.value.type === "TemplateLiteral") {
        // Simple handling for template literals
        result[name] = prop.value.quasis[0]?.value?.raw || ""
      }
    }
  })

  return result
}
