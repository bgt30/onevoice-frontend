#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Files to create/update
const setupTasks = [
  {
    name: 'Create environment file',
    action: () => {
      const envPath = path.join(process.cwd(), '.env.local')
      if (!fs.existsSync(envPath)) {
        const envExamplePath = path.join(process.cwd(), '.env.example')
        if (fs.existsSync(envExamplePath)) {
          fs.copyFileSync(envExamplePath, envPath)
          console.log('  ✓ Created .env.local from .env.example')
        } else {
          console.log('  ⚠️  .env.example not found - please create .env.local manually')
        }
      } else {
        console.log('  - .env.local already exists')
      }
    }
  },
  {
    name: 'Update root layout',
    action: () => {
      const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx')
      if (fs.existsSync(layoutPath)) {
        let content = fs.readFileSync(layoutPath, 'utf8')
        
        // Check if AppProviders is already imported
        if (!content.includes('AppProviders')) {
          // Add import
          const importLine = "import { AppProviders } from '@/providers/app-providers'"
          const firstImportMatch = content.match(/^import.*$/m)
          if (firstImportMatch) {
            const insertPos = content.indexOf(firstImportMatch[0])
            content = content.slice(0, insertPos) + importLine + '\n' + content.slice(insertPos)
          }
          
          // Wrap children with AppProviders
          content = content.replace(
            /(<body[^>]*>)\s*({children})\s*(<\/body>)/,
            '$1\n        <AppProviders>\n          $2\n        </AppProviders>\n      $3'
          )
          
          // Create backup
          fs.copyFileSync(layoutPath, layoutPath + '.backup')
          fs.writeFileSync(layoutPath, content)
          console.log('  ✓ Updated layout.tsx with AppProviders')
          console.log('  ✓ Created backup: layout.tsx.backup')
        } else {
          console.log('  - AppProviders already configured in layout.tsx')
        }
      } else {
        console.log('  ⚠️  layout.tsx not found')
      }
    }
  },
  {
    name: 'Update package.json scripts',
    action: () => {
      const packagePath = path.join(process.cwd(), 'package.json')
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
        
        if (!packageJson.scripts) {
          packageJson.scripts = {}
        }
        
        let hasChanges = false
        
        // Add migration script
        if (!packageJson.scripts['migrate-to-api']) {
          packageJson.scripts['migrate-to-api'] = 'node scripts/migrate-to-api.js'
          hasChanges = true
        }
        
        // Add test script if not present
        if (!packageJson.scripts.test) {
          packageJson.scripts.test = 'jest'
          hasChanges = true
        }
        
        if (hasChanges) {
          fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
          console.log('  ✓ Updated package.json scripts')
        } else {
          console.log('  - package.json scripts already configured')
        }
      }
    }
  },
  {
    name: 'Create jest configuration',
    action: () => {
      const jestConfigPath = path.join(process.cwd(), 'jest.config.js')
      if (!fs.existsSync(jestConfigPath)) {
        const jestConfig = `const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
`
        fs.writeFileSync(jestConfigPath, jestConfig)
        console.log('  ✓ Created jest.config.js')
      } else {
        console.log('  - jest.config.js already exists')
      }
    }
  },

]

function checkDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json')
  if (!fs.existsSync(packagePath)) {
    console.error('Error: package.json not found')
    return false
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

  const requiredDeps = [
    '@tanstack/react-query',
    '@tanstack/react-query-devtools',
    '@testing-library/react',
    '@testing-library/jest-dom'
  ]

  const missingDeps = requiredDeps.filter(dep => !dependencies[dep])

  if (missingDeps.length > 0) {
    console.log('⚠️  Missing dependencies:')
    missingDeps.forEach(dep => console.log(`  - ${dep}`))
    console.log('\nPlease install them first:')
    console.log(`npm install ${missingDeps.join(' ')}`)
    return false
  }

  return true
}

function main() {
  console.log('🚀 Setting up FastAPI integration...\n')

  // Check if we're in the right directory
  if (!fs.existsSync(path.join(process.cwd(), 'src', 'app'))) {
    console.error('Error: This script should be run from the Next.js project root')
    process.exit(1)
  }

  // Check dependencies
  if (!checkDependencies()) {
    process.exit(1)
  }

  console.log('📋 Running setup tasks...\n')

  setupTasks.forEach(task => {
    console.log(`${task.name}:`)
    try {
      task.action()
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`)
    }
    console.log('')
  })

  console.log('✅ Setup complete!\n')
  console.log('📚 Next steps:')
  console.log('  1. Configure your API URL in .env.local')
  console.log('  2. Run "npm run migrate-to-api" to migrate existing pages')
  console.log('  3. Start your development server and test the integration')
  console.log('  4. Review the FASTAPI_INTEGRATION_GUIDE.md for detailed instructions')
}

if (require.main === module) {
  main()
}
