'use client'

import { EmpForm } from '@/app/auth/signup/test'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const SignUpForm = () => {
  // const {
  //   handleSubmit,
  //   formState: { errors },
  // } = methods

  // console.log('errors', errors)

  // const onSubmit = async (data: SignUpValues) => {
  //   try {
  //     const res = await post('/signup', {
  //       method: 'POST',
  //       data,
  //     })
  //     console.log('result:', res)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  return (
    <section className="">
      <div className="my-10 flex min-h-full flex-col items-center justify-center">
        <div className="w-4/12">
          <Card>
            <CardHeader>
              <CardTitle>Employee Information Form</CardTitle>
              <CardDescription>Please fill out all the required information.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmpForm />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      {/* <EmployeeForm /> */}
    </section>
  )
}

export default SignUpForm
