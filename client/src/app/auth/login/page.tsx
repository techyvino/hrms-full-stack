'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie } from 'cookies-next/client'
import { Key, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { InputForm } from '@/components/form/InputForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useSubmit } from '@/hooks/useSubmit'
import { getDeviceInfo } from '@/lib/device'
import { formateLocationInfo, getAddressFromCoordinates, getCurrentLocation } from '@/lib/geolocation'
import { authUrl } from '@/lib/urls'
import type { LoginResponse } from '@/schemas/loginSchema'
import { type LoginSchema, loginSchema } from '@/schemas/loginSchema'

export default function LoginForm() {
  const { push } = useRouter()
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const { isLoading, submit } = useSubmit<LoginResponse>({
    onError: (error) => {
      console.log('error:', error)
      toast.error(error?.message || 'Login Failed')
    },
    onSuccess(res) {
      if (res?.data?.access_token) {
        setCookie(
          'access_token',
          res?.data?.access_token,
          process.env.NODE_ENV !== 'production' ? {} : { httpOnly: true, secure: true, sameSite: 'strict' }
        )
        return push('/dashboard')
      }
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const { platform, manufacturer, operating_system, os_version, device_model, device_name } = await getDeviceInfo()

    const position = await getCurrentLocation()
    const address = await getAddressFromCoordinates(position?.coords?.latitude, position?.coords.longitude)
    const formattedLocation = formateLocationInfo({
      position,
      address,
    })

    const bodyData: LoginSchema = {
      username: data?.username,
      password: data?.password,
      platform,
      manufacturer,
      operating_system,
      os_version,
      device_name,
      device_model,

      latitude: formattedLocation?.latitude,
      longitude: formattedLocation?.longitude,
      locality: formattedLocation?.locality,
      area: formattedLocation?.area,
      postal_code: formattedLocation?.postal_code,
    }
    return submit({
      url: authUrl.login,
      data: bodyData,
    })
  })

  return (
    <section className="z-10 h-full">
      <Card className="flex h-full flex-col border-none bg-transparent px-4 py-48 shadow-none md:items-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold md:text-center">Sign in</CardTitle>
          <CardDescription className="text-sm text-gray-400">Please fill the credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputForm
                name="username"
                icon={<UserRound className="stroke-gray-400" />}
                iconPosition="left"
                placeholder="Username"
                classNames={{
                  input: 'bg-gray-100 border-0 py-5',
                }}
              />
              <InputForm
                name="password"
                type="password"
                icon={<Key className="stroke-gray-400" />}
                iconPosition="left"
                placeholder="Password"
                classNames={{
                  input: 'bg-gray-100 border-0 py-5',
                }}
              />
              <Button isLoading={isLoading} type="submit" className="mt-4 w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* <CardFooter className="flex justify-center">
          <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </CardFooter> */}
      </Card>
    </section>
  )
}
