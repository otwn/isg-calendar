import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(__dirname, '../index.css'), 'utf8').replace(/\r\n/g, '\n')

describe('calendar grid styling', () => {
  it('uses a desktop-visible tint for available (shift) dates', () => {
    expect(css).toContain(
      '.fc .fc-daygrid-day:not(.no-shift-day) {\n  background-color: #fef3c7;\n}'
    )
    expect(css).toContain(
      '.fc .fc-daygrid-day:not(.no-shift-day):hover {\n  background-color: #fde68a;\n}'
    )
  })
})
