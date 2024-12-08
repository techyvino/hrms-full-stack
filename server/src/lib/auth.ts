import { compareSync, hashSync } from 'bcrypt-ts'
import { sign, verify } from 'hono/jwt'
import type { JWTPayload } from 'hono/utils/jwt/types'

import { envVariables } from '@/zod/env'

export interface JWTPayloadWithUser extends JWTPayload {
  id: number
  email: string
  session_id: string
}

export const generateHashedPassword = async (plain_password: string) => {
  const saltRound = Number(envVariables.SALT)
  return hashSync(plain_password, saltRound)
}

export const verifyPassword = async (
  plain_password: string,
  hashed_password: string
) => {
  const match = await compareSync(plain_password, hashed_password)
  return await match
}

export const generateToken = async (user: JWTPayload) => {
  const accessTokenPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12, // 12 hours
    iat: Math.floor(Date.now() / 1000), // Set issued-at time (iat)
  }

  return await sign(accessTokenPayload, envVariables?.ACCESS_TOKEN_SECRET)
}

export const verifyToken = async (token: string) => {
  const verified = await verify(token, envVariables?.ACCESS_TOKEN_SECRET)
  return verified as JWTPayloadWithUser
}
