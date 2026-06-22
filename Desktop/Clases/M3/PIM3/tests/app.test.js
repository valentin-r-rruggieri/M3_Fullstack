import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendToAI } from '../chat.js'

global.fetch = vi.fn()

describe('sendToAI', () => {

  beforeEach(() => {
    fetch.mockClear()
  })

  it('debería llamar a /api/functions con POST y el historial', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Elemental, mi querido Watson.' }),
    })

    const messages = [{ role: 'user', content: '¿Quién sos?' }]

    await sendToAI(messages)

    expect(fetch).toHaveBeenCalledWith(
      '/api/functions',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    )
  })

  it('debería retornar el reply cuando la respuesta es exitosa', async () => {
    const mockReply = 'Observo que usted es nuevo en esto.'
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: mockReply }),
    })

    const messages = [{ role: 'user', content: 'Hola' }]

    const result = await sendToAI(messages)

    expect(result.reply).toBe(mockReply)
  })

  it('debería lanzar error cuando response.ok es false (ej: 429 rate limit)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({
        error: 'Límite de peticiones alcanzado. Esperá unos segundos.',
      }),
    })

    const messages = [{ role: 'user', content: 'Hola' }]

    await expect(sendToAI(messages)).rejects.toThrow(
      'Límite de peticiones alcanzado. Esperá unos segundos.'
    )
  })

  it('debería lanzar error con mensaje genérico si la respuesta de error no tiene campo error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const messages = [{ role: 'user', content: 'Hola' }]

    await expect(sendToAI(messages)).rejects.toThrow('500')
  })

  it('debería propagar errores de red (fetch rechazado)', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error: Failed to fetch'))

    const messages = [{ role: 'user', content: 'Hola' }]

    await expect(sendToAI(messages)).rejects.toThrow('Network error: Failed to fetch')
  })

  it('debería incluir solo messages en el body (sin systemPrompt)', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'respuesta' }),
    })

    const messages = [{ role: 'user', content: 'test' }]

    await sendToAI(messages)

    const calledWith = fetch.mock.calls[0][1]
    const body = JSON.parse(calledWith.body)
    expect(body).toHaveProperty('messages')
    expect(Array.isArray(body.messages)).toBe(true)
    expect(body).not.toHaveProperty('systemPrompt')
  })

  it('debería incluir el array de messages en el body', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'ok' }),
    })

    const messages = [
      { role: 'user',  content: 'primera pregunta' },
      { role: 'model', content: 'primera respuesta' },
      { role: 'user',  content: 'segunda pregunta' },
    ]

    await sendToAI(messages)

    const calledWith = fetch.mock.calls[0][1]
    const body = JSON.parse(calledWith.body)
    expect(body).toHaveProperty('messages')
    expect(Array.isArray(body.messages)).toBe(true)
  })

})
