'use client'

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
import { getCurrentAddress } from '@/lib/geolocation'
import { authUrl } from '@/lib/urls'

export default function LoginForm() {
  const { push } = useRouter()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      device_info: null,
      location_info: null,
    },
  })

  const { isLoading, submit, startLoader } = useSubmit<LoginResponse>({
    onError: (error) => {
      toast.error(error?.message || 'Login Failed')
    },
    onSuccess(res) {
      if (res?.data?.access_token) {
        setCookie(
          'access_token',
          res?.data?.access_token
          // process.env.NODE_ENV !== 'production' ? {} : { httpOnly: true, secure: true, sameSite: 'strict' }
        )

        return push('/dashboard')
      }
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    startLoader()
    const location_info = await getCurrentAddress()
    // for android and ios
    const device_info = await getDeviceInfo()
    const bodyData: LoginSchema = {
      username: data?.username,
      password: data?.password,
      device_info,
      location_info,
    }

    return submit({
      url: authUrl.login,
      data: bodyData,
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
