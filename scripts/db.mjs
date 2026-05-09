import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import postgres from 'postgres'

const root = process.cwd()
const command = process.argv[2]

loadDotEnvLocal()

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local')
  process.exit(1)
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  idle_timeout: 5,
  connect_timeout: 10,
  prepare: false,
})

try {
  if (command === 'migrate') {
    await runSqlFile('db/schema.sql')
  } else if (command === 'seed') {
    await runSqlFile('db/seed.sql')
  } else if (command === 'setup') {
    await runSqlFile('db/schema.sql')
    await runSqlFile('db/seed.sql')
  } else {
    console.error('Usage: node scripts/db.mjs <migrate|seed|setup>')
    process.exitCode = 1
  }
} finally {
  await sql.end()
}

async function runSqlFile(path) {
  const sqlText = await readFile(resolve(root, path), 'utf8')
  await sql.unsafe(sqlText)
  console.log(`Executed ${path}`)
}

async function loadDotEnvLocal() {
  try {
    const envText = await readFile(resolve(root, '.env.local'), 'utf8')

    for (const line of envText.split(/\r?\n/)) {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      const separatorIndex = trimmed.indexOf('=')

      if (separatorIndex === -1) {
        continue
      }

      const key = trimmed.slice(0, separatorIndex)
      const rawValue = trimmed.slice(separatorIndex + 1)
      const value = rawValue.replace(/^["']|["']$/g, '')

      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  } catch {
    // The caller will receive a specific missing DATABASE_URL error below.
  }
}
