export const authUrl = {
  login: '/auth/login',
  logout: '/auth/logout',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
}

export const activityUrl = {
  clockedStatus: `/clockStatus`,
  punchClock: '/punchClock',
  attendance: (id: string) => `/attendance/${id}`,
  punchInfo: (id: number | string) => `/punchInfo/${id}`,
}

export const userUrl = {
  register: '/register',
  userList: '/users',
  user: `/user`,
}
