"use client"

import { Button } from "@/components/ui/button"
import { LoginSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Social } from "./social"

interface LoginFormProps {
  callbackUrl?: string
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [_error, setError] = React.useState<string | undefined>("")
  const [_success, setSuccess] = React.useState<string | undefined>("")

  const [isPending, startTransition] = React.useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      try {
        await signIn("resend", {
          email: values.email,
          redirectTo: callbackUrl,
        })
        setSuccess("Click the link sent to your mailid")
      } catch (error) {
        setError("something went wrong! try again later.")
        console.error(error)
      }
    })
  }
  return (
    <div className="flex flex-col gap-4">
      <Social callbackUrl={callbackUrl} />

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your email address"
                    type="text"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={_error} />
          <FormSuccess message={_success} />
          <Button
            className="w-full cursor-pointer"
            type="submit"
            disabled={isPending}
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  )
}
