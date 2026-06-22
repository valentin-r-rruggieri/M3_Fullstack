import { describe, it, expect } from 'vitest'
import {
  isValidMessage,
  parseAIResponse,
  formatTimestamp,
  truncateHistory,
  buildMessagesPayload,
  capitalize,
} from '../utils.js'

describe('isValidMessage', () => {

  it('debería retornar true para un mensaje válido', () => {
    const message = 'Hola Holmes, ¿cómo deducís lo que deduce?'
    const result = isValidMessage(message)
    expect(result).toBe(true)
  })

  it('debería retornar true para un mensaje de un solo caracter', () => {
    expect(isValidMessage('a')).toBe(true)
  })

  it('debería retornar true para un mensaje de exactamente 500 caracteres', () => {
    const longMsg = 'a'.repeat(500)
    expect(isValidMessage(longMsg)).toBe(true)
  })

  it('debería retornar false para mensaje de 501 caracteres', () => {
    const tooLong = 'a'.repeat(501)
    expect(isValidMessage(tooLong)).toBe(false)
  })

  it('debería retornar false para string vacío', () => {
    expect(isValidMessage('')).toBe(false)
  })

  it('debería retornar false para solo espacios', () => {
    expect(isValidMessage('   ')).toBe(false)
  })

  it('debería retornar false para null', () => {
    expect(isValidMessage(null)).toBe(false)
  })

  it('debería retornar false para undefined', () => {
    expect(isValidMessage(undefined)).toBe(false)
  })

})

describe('parseAIResponse', () => {

  it('debería extraer el texto de una respuesta válida', () => {
    const response = { reply: '  Elemental, mi querido Watson.  ' }
    const result = parseAIResponse(response)
    expect(result).toBe('Elemental, mi querido Watson.')
  })

  it('debería retornar fallback para respuesta null', () => {
    const result = parseAIResponse(null)
    expect(result).toBe('No pude procesar la respuesta del personaje.')
  })

  it('debería retornar fallback para respuesta sin campo reply', () => {
    const result = parseAIResponse({})
    expect(result).toBe('No pude procesar la respuesta del personaje.')
  })

  it('debería retornar fallback si reply es string vacío', () => {
    const result = parseAIResponse({ reply: '' })
    expect(result).toBe('No pude procesar la respuesta del personaje.')
  })

  it('debería retornar fallback si reply es un número (tipo incorrecto)', () => {
    const result = parseAIResponse({ reply: 42 })
    expect(result).toBe('No pude procesar la respuesta del personaje.')
  })

  it('debería preservar el texto con puntuación', () => {
    const response = { reply: '¿No lo ves? Es obvio.' }
    expect(parseAIResponse(response)).toBe('¿No lo ves? Es obvio.')
  })

})

describe('formatTimestamp', () => {

  it('debería formatear un Date válido a HH:MM', () => {
    const date = new Date(2024, 0, 15, 14, 30, 0)
    const result = formatTimestamp(date)
    expect(result).toContain(':')
    expect(result.length).toBeGreaterThanOrEqual(4)
  })

  it('debería retornar "--:--" para un Date inválido', () => {
    const invalidDate = new Date('fecha-invalida')
    expect(formatTimestamp(invalidDate)).toBe('--:--')
  })

  it('debería retornar "--:--" para null', () => {
    expect(formatTimestamp(null)).toBe('--:--')
  })

  it('debería retornar "--:--" para un string en lugar de Date', () => {
    expect(formatTimestamp('14:30')).toBe('--:--')
  })

})

describe('truncateHistory', () => {

  it('debería retornar los últimos N mensajes', () => {
    const history = [
      { role: 'user', content: 'msg1' },
      { role: 'model', content: 'msg2' },
      { role: 'user', content: 'msg3' },
      { role: 'model', content: 'msg4' },
      { role: 'user', content: 'msg5' },
    ]
    const result = truncateHistory(history, 3)
    expect(result).toHaveLength(3)
    expect(result[0].content).toBe('msg3')
    expect(result[2].content).toBe('msg5')
  })

  it('debería retornar el array completo si hay menos mensajes que el límite', () => {
    const history = [
      { role: 'user', content: 'msg1' },
      { role: 'model', content: 'msg2' },
    ]
    const result = truncateHistory(history, 20)
    expect(result).toHaveLength(2)
  })

  it('debería retornar array vacío para input null', () => {
    expect(truncateHistory(null)).toEqual([])
  })

  it('debería retornar array vacío para input vacío', () => {
    expect(truncateHistory([])).toEqual([])
  })

})

describe('buildMessagesPayload', () => {

  it('debería filtrar mensajes con roles inválidos', () => {
    const history = [
      { role: 'user',   content: 'hola' },
      { role: 'system', content: 'esto no debería pasar' },
      { role: 'model',  content: 'respuesta' },
    ]
    const result = buildMessagesPayload(history, 20)
    expect(result).toHaveLength(2)
    expect(result.every((m) => m.role === 'user' || m.role === 'model')).toBe(true)
  })

  it('debería filtrar mensajes con content vacío', () => {
    const history = [
      { role: 'user',  content: 'hola' },
      { role: 'model', content: '' },
      { role: 'user',  content: 'chau' },
    ]
    const result = buildMessagesPayload(history, 20)
    expect(result).toHaveLength(2)
  })

  it('debería retornar array vacío para input null', () => {
    expect(buildMessagesPayload(null)).toEqual([])
  })

  it('debería respetar el límite maxMessages', () => {
    const history = Array.from({ length: 30 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'model',
      content: `mensaje ${i}`,
    }))
    const result = buildMessagesPayload(history, 10)
    expect(result.length).toBeLessThanOrEqual(10)
  })

})

describe('capitalize', () => {

  it('debería capitalizar la primera letra', () => {
    expect(capitalize('hola mundo')).toBe('Hola mundo')
  })

  it('no debería cambiar texto ya capitalizado', () => {
    expect(capitalize('Holmes es brillante')).toBe('Holmes es brillante')
  })

  it('debería retornar string vacío para entrada vacía', () => {
    expect(capitalize('')).toBe('')
  })

  it('debería retornar string vacío para null', () => {
    expect(capitalize(null)).toBe('')
  })

  it('debería manejar un solo caracter', () => {
    expect(capitalize('a')).toBe('A')
  })

})
