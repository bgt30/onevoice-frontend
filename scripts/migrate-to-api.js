#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Migration patterns
const migrations = [
  {
    name: 'Replace mock data imports',
    pattern: /import.*mockVideoProjects.*from.*mock-data/g,
    replacement: "// Removed mock data import - now using API",
  },
  {
    name: 'Replace mock dashboard stats',
    pattern: /import.*mockDashboardStats.*from.*mock-data/g,
    replacement: "// Removed mock data import - now using API",
  },
  {
    name: 'Add useVideos hook',
    pattern: /const.*videos.*=.*mockVideoProjects/g,
    replacement: "const { data: videosResponse, isLoading: videosLoading, error: videosError } = useVideos()",
  },
  {
    name: 'Add dashboard stats hook',
    pattern: /const.*stats.*=.*mockDashboardStats/g,
    replacement: "const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useDashboardStats()",
  },
  {
    name: 'Add auth requirement',
    pattern: /export default function.*Page\(\)/g,
    replacement: (match) => {
      return match + '\n  const { isAuthenticated, isLoading } = useRequireAuth()'
    },
  },
]

// Required imports to add
const requiredImports = [
  "import { useRequireAuth } from '@/contexts/auth-context'",
  "import { ErrorDisplay } from '@/components/ui/error-display'",
  "import { SectionLoading } from '@/components/ui/loading-states'",
]

function migrateFile(filePath) {
  console.log(`Migrating ${filePath}...`)
  
  let content = fs.readFileSync(filePath, 'utf8')
  let hasChanges = false

  // Apply migrations
  migrations.forEach(migration => {
    if (migration.pattern.test(content)) {
      content = content.replace(migration.pattern, migration.replacement)
      hasChanges = true
      console.log(`  ✓ Applied: ${migration.name}`)
    }
  })

  // Add required imports if not present
  requiredImports.forEach(importStatement => {
    if (!content.includes(importStatement)) {
      // Find the last import statement
      const importLines = content.split('\n').filter(line => line.trim().startsWith('import'))
      if (importLines.length > 0) {
        const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1])
        const insertPosition = content.indexOf('\n', lastImportIndex) + 1
        content = content.slice(0, insertPosition) + importStatement + '\n' + content.slice(insertPosition)
        hasChanges = true
        console.log(`  ✓ Added import: ${importStatement}`)
      }
    }
  })

  if (hasChanges) {
    // Create backup
    const backupPath = filePath + '.backup'
    fs.copyFileSync(filePath, backupPath)
    console.log(`  ✓ Created backup: ${backupPath}`)

    // Write migrated content
    fs.writeFileSync(filePath, content)
    console.log(`  ✓ Migration complete`)
  } else {
    console.log(`  - No changes needed`)
  }

  return hasChanges
}

function findPageFiles(dir) {
  const files = []
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir)
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath)
      } else if (item === 'page.tsx' || item === 'page.ts') {
        files.push(fullPath)
      }
    })
  }
  
  traverse(dir)
  return files
}

function main() {
  const appDir = path.join(process.cwd(), 'src', 'app')
  
  if (!fs.existsSync(appDir)) {
    console.error('Error: src/app directory not found')
    process.exit(1)
  }

  console.log('🚀 Starting FastAPI integration migration...\n')

  const pageFiles = findPageFiles(appDir)
  console.log(`Found ${pageFiles.length} page files to migrate:\n`)

  let migratedCount = 0
  pageFiles.forEach(file => {
    if (migrateFile(file)) {
      migratedCount++
    }
    console.log('')
  })

  console.log(`\n✅ Migration complete!`)
  console.log(`📊 Summary:`)
  console.log(`  - Files processed: ${pageFiles.length}`)
  console.log(`  - Files migrated: ${migratedCount}`)
  console.log(`  - Files unchanged: ${pageFiles.length - migratedCount}`)

  if (migratedCount > 0) {
    console.log(`\n⚠️  Next steps:`)
    console.log(`  1. Review the migrated files for any manual adjustments needed`)
    console.log(`  2. Add specific API hooks for each page (useVideos, useUser, etc.)`)
    console.log(`  3. Add loading and error states`)
    console.log(`  4. Test the pages with your FastAPI backend`)
    console.log(`  5. Remove backup files when satisfied with the migration`)
  }
}

if (require.main === module) {
  main()
}
