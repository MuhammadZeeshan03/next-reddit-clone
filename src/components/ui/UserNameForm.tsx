'use client'

import { usernameRequest, usernameValidator } from '@/lib/validators/username'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import React, { FC } from 'react'
import { Form, useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'
import { Label } from './Label'
import { Input } from './Input'
import { Button } from './Button'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'

interface UserNameFormProps {
    user: Pick<User, 'id' | 'username'>
}

const UserNameForm: FC<UserNameFormProps> = ({ user }) => {

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<usernameRequest>({
        resolver: zodResolver(usernameValidator),
        defaultValues: {
            name: user?.username || ''
        }
    })

    const router = useRouter()
    const { mutate: updateUser, isLoading } = useMutation({
        mutationFn: async ({ name }: usernameRequest) => {
            const payload: usernameRequest = { name }

            const { data } = await axios.patch('/api/username', payload)
            return data
        },



        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: "Username already exists",
                        description: "Please choose another name",
                        variant: "destructive",
                    });
                }

            }

            return toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive",
            });
        },

        onSuccess: () => {
            toast({
                description: 'Username changed successfully',

            })
            router.refresh()

        }


    })
    return (
        <form onSubmit={handleSubmit((e) => {
            updateUser(e)

        })}>

            <Card>
                <CardHeader>
                    <CardTitle>Username</CardTitle>
                    <CardDescription>
                        Please enter a display name you are comfortable with
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className=' relative grid gap-1'>
                        <div className=' absolute top-0 left-0 w-8 h-10 grid items-center'>
                            <span className='text-sm text-zinc-400 '>u/</span>
                        </div>

                        <Label className='sr-only' htmlFor='name'>Name</Label>
                        <Input id='name' className='w-[400] pl-6'
                            size={23}
                            {...register('name')}
                        />
                        {errors?.name && (<p className='px-1 text-xs text-red-600'></p>)}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button isLoading={isLoading}>Change Name</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default UserNameForm