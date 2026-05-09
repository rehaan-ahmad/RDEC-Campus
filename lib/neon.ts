import postgres from 'postgres'

declare global {
  // eslint-disable-next-line no-var
  var rdecSql: postgres.Sql | undefined
}

export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL)

export function getSql(): postgres.Sql {
  if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL in .env.local')
  }

  if (!globalThis.rdecSql) {
    globalThis.rdecSql = postgres(process.env.DATABASE_URL, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    })
  }

  return globalThis.rdecSql
}

export const sql = new Proxy(function sqlProxy() {} as unknown as postgres.Sql, {
  get(_target, prop, receiver) {
    return Reflect.get(getSql(), prop, receiver)
  },
  apply(_target, thisArg, argArray) {
    return Reflect.apply(getSql() as unknown as (...args: unknown[]) => unknown, thisArg, argArray)
  },
})

export async function closeDb() {
  if (globalThis.rdecSql) {
    await globalThis.rdecSql.end()
    globalThis.rdecSql = undefined
  }
}
