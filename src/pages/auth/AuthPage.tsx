import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@/schemas/auth.schema'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { toastMessages } from '@/utils/toast-messages'
import { extractErrorMessage } from '@/utils/error-handler'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock, User, CreditCard, Phone } from 'lucide-react'
import { AppLogo } from '@/components/ui/app-logo'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const isLogin = mode === 'login'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput | RegisterInput>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success(toastMessages.auth.loginSuccess)
      navigate('/my-lists')
    },
    onError: (error) => {
      console.log('🚀 ~ AuthPage ~ error:', error)
      toast.error(extractErrorMessage(error, toastMessages.auth.loginError))
    },
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async (_, variables) => {
      toast.success(toastMessages.auth.registerSuccess)
      // Após registro bem-sucedido, fazer login automaticamente
      const registerData = variables as RegisterInput
      loginMutation.mutate({
        email: registerData.email,
        password: registerData.password,
      })
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, toastMessages.auth.registerError))
    },
  })

  const onSubmit = (data: LoginInput | RegisterInput) => {
    if (isLogin) {
      loginMutation.mutate(data as LoginInput)
    } else {
      registerMutation.mutate(data as RegisterInput)
    }
  }

  const isLoading = loginMutation.isPending || registerMutation.isPending

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Hero Section (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-primary/80 to-blue-400/30 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200')",
          }}
        />
        <div className="relative z-10 flex flex-col justify-center items-start p-12 lg:p-24 max-w-lg">
          <div className="inline-flex items-center gap-2 mb-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 shadow-sm">
            <AppLogo className="h-5 w-5 text-primary" />
            <span className="text-primary font-bold tracking-wide text-sm">
              Colabora-AI
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight mb-6">
            Gerencie listas de eventos sem esforço.
          </h1>
          <p className="text-lg text-primary font-medium leading-relaxed max-w-md">
            Simplifique a organização de seus eventos colaborativos. Junte-se a
            milhares de organizadores que usam o Colabora-AI.
          </p>
          <div className="flex flex-wrap gap-3 mt-10">
            {['Tempo Real', 'Seguro', 'Rápido'].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 bg-black/20 text-primary px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10"
              >
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-primary/30">
              <AppLogo className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Colabora-AI</h2>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin
                ? 'Gerencie seus eventos e contribuições de forma simples.'
                : 'Preencha os campos abaixo para começar a organizar seus eventos.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-muted rounded-xl mb-8">
            <button
              onClick={() => setMode('login')}
              className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                isLogin
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                !isLogin
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Registrar-se
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      className="pl-10"
                      {...register('name')}
                    />
                  </div>
                  {'name' in errors && errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      className="pl-10"
                      maxLength={14}
                      {...register('cpf', {
                        onChange: (e) => {
                          let value = e.target.value.replace(/\D/g, '')
                          if (value.length > 11) value = value.slice(0, 11)
                          if (value.length > 9) {
                            value = value.replace(
                              /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
                              '$1.$2.$3-$4',
                            )
                          } else if (value.length > 6) {
                            value = value.replace(
                              /(\d{3})(\d{3})(\d{1,3})/,
                              '$1.$2.$3',
                            )
                          } else if (value.length > 3) {
                            value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2')
                          }
                          e.target.value = value
                        },
                        setValueAs: (value: string) => value.replace(/\D/g, ''),
                      })}
                    />
                  </div>
                  {'cpf' in errors && errors.cpf && (
                    <p className="text-sm text-destructive">
                      {errors.cpf.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      maxLength={15}
                      {...register('phone', {
                        onChange: (e) => {
                          let value = e.target.value.replace(/\D/g, '')
                          if (value.length > 11) value = value.slice(0, 11)
                          if (value.length > 10) {
                            value = value.replace(
                              /(\d{2})(\d{5})(\d{4})/,
                              '($1) $2-$3',
                            )
                          } else if (value.length > 6) {
                            value = value.replace(
                              /(\d{2})(\d{4,5})(\d{0,4})/,
                              '($1) $2-$3',
                            )
                          } else if (value.length > 2) {
                            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2')
                          }
                          e.target.value = value
                        },
                        setValueAs: (value: string) => value.replace(/\D/g, ''),
                      })}
                    />
                  </div>
                  {'phone' in errors && errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    CPF e telefone sao necessarios para pagamentos via PIX.
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                {isLogin && (
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Esqueceu a senha?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
              {!isLogin && (
                <p className="text-xs text-muted-foreground mt-1">
                  Sua senha deve ter no mínimo 8 caracteres.
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : isLogin ? 'Entrar' : 'Registrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
