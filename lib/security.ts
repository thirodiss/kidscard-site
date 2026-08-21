import { createHash, randomBytes } from "node:crypto"

export function normalizeDigits(value: string) {
  return value.replace(/\D/g, "")
}

export function isValidCpf(value: string) {
  const cpf = normalizeDigits(value)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  const calculateDigit = (length: number) => {
    let sum = 0
    for (let index = 0; index < length; index += 1) {
      sum += Number(cpf[index]) * (length + 1 - index)
    }
    const remainder = (sum * 10) % 11
    return remainder === 10 ? 0 : remainder
  }

  return calculateDigit(9) === Number(cpf[9]) && calculateDigit(10) === Number(cpf[10])
}

export function createSecureToken() {
  return randomBytes(32).toString("base64url")
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function getAppBaseUrl() {
  return (process.env.APP_BASE_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "")
}

export function isStrongPassword(password: string) {
  return password.length >= 12 && password.length <= 128 && /[A-Za-z]/.test(password) && /\d/.test(password)
}
