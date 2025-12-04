"use client"

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import RegisterForm from './register-form';
import { CompanyPayload } from '@/types/company/module';
import LoginForm from './login-form';
import { LoginSchema } from '@/schemas/authentication/authentication';
import z from 'zod';
import { setAuthToken } from '@/lib/cookies/cookies';
import { setCookie } from 'cookies-next';
import { loginAction, registerAction } from '@/actions/authentication';
import { toast } from 'sonner';

type ModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function Modal({ open, onOpenChange }: ModalProps) {
    const [isLogin, setIsLogin] = useState<boolean>(false);

    const onRegisterSubmit = async (data: CompanyPayload) => {
        const response = await registerAction(data);

        if (!("error" in response)) {
            setAuthToken(response.token);
            toast.success("Sign Up Successful");
            onOpenChange(false);
        } else {
            toast.error(response.error)
        }
    }

    const onLoginSubmit = async (data: z.infer<typeof LoginSchema>) => {
        const response = await loginAction(data);

        if (!("error" in response)) {
            setAuthToken(response.token);
            toast.success("Sign In Successful");
            onOpenChange(false);
        } else {
            toast.error(response.error)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className='bg-white border-none'>
                <DialogHeader>
                    <DialogTitle>{isLogin ? "Sign In" : "Sign Up"}</DialogTitle>
                    <DialogDescription>
                        {isLogin ?
                            <label className='text-sm text-slate-600'>Sign in to your account using your email and password.</label> :
                            <label className='text-sm text-slate-600'>Create a new account using your email and password.</label>
                        }
                    </DialogDescription>
                </DialogHeader>

                {isLogin ?
                    <div>
                        <LoginForm onLoginSubmit={onLoginSubmit} />
                        <label className='text-sm text-slate-600'>Don't have an account ? <button
                            onClick={() => setIsLogin(false)}
                            className='font-semibold underline hover:cursor-pointer'>Sign Up</button> </label>
                    </div> :
                    <div>
                        <RegisterForm onRegisterSubmit={onRegisterSubmit} />
                        <label className='text-sm text-slate-600'>Already have an account ? <button
                            onClick={() => setIsLogin(true)}
                            className='font-semibold underline hover:cursor-pointer'>Sign In</button> </label>
                    </div>
                }
            </DialogContent>
        </Dialog>
    )
}

export default Modal