import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockHistoryOrder = vi.fn()
const mockHistoryLimit = vi.fn()

vi.mock('../../supabase', () => ({
  supabase: {
    from: vi.fn((table) => {
      if (table === 'history') {
        return { select: vi.fn().mockReturnValue({ order: mockHistoryOrder }) }
      }
      return { select: vi.fn() }
    }),
  },
}))

import HistoryPage from '../HistoryPage'

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHistoryOrder.mockReturnValue({ limit: mockHistoryLimit })
    mockHistoryLimit.mockResolvedValue({
      data: [{
        id: 'h1',
        member_name: 'Alice',
        action: 'assigned',
        shift_date: '2026-07-12',
        created_at: '2026-07-12T12:00:00Z',
      }],
    })
  })

  it('loads and renders history entries', async () => {
    render(<HistoryPage />)

    await waitFor(() => {
      expect(mockHistoryOrder).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(mockHistoryLimit).toHaveBeenCalledWith(100)
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })
  })
})
