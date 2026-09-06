import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  mockMembersOrder,
  mockShiftsSelect,
  mockChannelOn,
  mockSubscribe,
  mockUnsubscribe,
} = vi.hoisted(() => ({
  mockMembersOrder: vi.fn(),
  mockShiftsSelect: vi.fn(),
  mockChannelOn: vi.fn(),
  mockSubscribe: vi.fn(),
  mockUnsubscribe: vi.fn(),
}))

vi.mock('../../supabase', () => ({
  supabase: {
    from: vi.fn((table) => {
      if (table === 'active_members') {
        return { select: vi.fn().mockReturnValue({ order: mockMembersOrder }) }
      }
      if (table === 'shifts') {
        return { select: mockShiftsSelect }
      }
      return { select: vi.fn() }
    }),
    channel: vi.fn().mockReturnValue({ on: mockChannelOn }),
  },
}))

import { supabase } from '../../supabase'

const MOCK_ACTIVE_MEMBERS = [
  { id: '1', name: 'Alice', color: '#6366f1' },
  { id: '2', name: 'Bob', color: '#ec4899' },
]

describe('SchedulePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMembersOrder.mockResolvedValue({ data: MOCK_ACTIVE_MEMBERS })
    mockShiftsSelect.mockResolvedValue({ data: [] })
    mockSubscribe.mockReturnValue({ unsubscribe: mockUnsubscribe })
    mockChannelOn.mockReturnValue({ subscribe: mockSubscribe })
  })

  it('queries active members and shifts on mount', async () => {
    const { default: SchedulePage } = await import('../SchedulePage')
    const { render, waitFor } = await import('@testing-library/react')
    const { MemoryRouter } = await import('react-router-dom')

    render(
      <MemoryRouter>
        <SchedulePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('active_members')
      expect(mockShiftsSelect).toHaveBeenCalledWith('*, members(*)')
    })
  })

  it('subscribes to realtime shift changes', async () => {
    const { default: SchedulePage } = await import('../SchedulePage')
    const { render, waitFor } = await import('@testing-library/react')
    const { MemoryRouter } = await import('react-router-dom')

    render(
      <MemoryRouter>
        <SchedulePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(supabase.channel).toHaveBeenCalledWith('shifts-changes')
      expect(mockChannelOn).toHaveBeenCalledWith(
        'postgres_changes',
        expect.objectContaining({ event: '*', schema: 'public', table: 'shifts' }),
        expect.any(Function)
      )
    })
  })
})
