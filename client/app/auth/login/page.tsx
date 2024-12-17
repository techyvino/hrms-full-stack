'use client'

import { Capacitor } from '@capacitor/core'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader, Form } from '@nextui-org/react'
import { setCookie } from 'cookies-next/client'
import { Key, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import type { LoginResponse, LoginSchema } from '@/app/auth/login/schemas'
import { loginSchema } from '@/app/auth/login/schemas'
import { InputForm } from '@/components/form/InputForm'
import { useSubmit } from '@/hooks/useSubmit'
import { getDeviceInfo } from '@/lib/device'
import { formateLocationInfo, getAddressFromCoordinates, getCurrentLocation } from '@/lib/geolocation'
import { authUrl } from '@/lib/urls'

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
    // for android and ios
    if (Capacitor.isNativePlatform()) {
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
    }

    return submit({
      url: authUrl.login,
      data,
    })
  })

  return (
    <section className="z-10 flex size-full flex-col justify-center md:items-center">
      <Card className="mx-12 my-40 flex h-full flex-col border-none bg-transparent shadow-none">
        <CardHeader className="flex-col items-start gap-1">
          <div className="text-4xl font-bold md:text-center">Sign in</div>
          <div className="text-sm text-gray-400">Please fill the credentials</div>
        </CardHeader>
        <CardBody>
          <FormProvider {...form}>
            <Form onSubmit={onSubmit}>
              <InputForm
                name="username"
                placeholder="Username"
                startContent={<UserRound className="stroke-gray-400" />}
              />
              <InputForm
                name="password"
                placeholder="Password"
                startContent={<Key className="stroke-gray-400" />}
                type="password"
              />
              <Button className="mt-4 w-full" color="primary" isLoading={isLoading} type="submit" variant="solid">
                Login
              </Button>
            </Form>
          </FormProvider>
        </CardBody>
        {/* <CardFooter className="flex justify-center">
          <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </CardFooter> */}
      </Card>
    </section>
  )
}
