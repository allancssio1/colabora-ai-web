'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface DateTimePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Selecione data e hora',
  disabled = false,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Parse value string to Date object
  const dateValue = React.useMemo(() => {
    if (!value) return undefined
    const date = new Date(value)
    return isNaN(date.getTime()) ? undefined : date
  }, [value])

  // Extract time from value
  const timeValue = React.useMemo(() => {
    if (!dateValue) return '12:00'
    const hours = dateValue.getHours().toString().padStart(2, '0')
    const minutes = dateValue.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }, [dateValue])

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    // Preserve existing time or use default
    const [hours, minutes] = timeValue.split(':').map(Number)
    date.setHours(hours, minutes, 0, 0)

    // Format as ISO string for datetime-local compatibility
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - offset * 60 * 1000)
    const isoString = localDate.toISOString().slice(0, 16)

    onChange?.(isoString)
  }

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    if (!newTime) return

    const [hours, minutes] = newTime.split(':').map(Number)
    const newDate = dateValue ? new Date(dateValue) : new Date()
    newDate.setHours(hours, minutes, 0, 0)

    // Format as ISO string for datetime-local compatibility
    const offset = newDate.getTimezoneOffset()
    const localDate = new Date(newDate.getTime() - offset * 60 * 1000)
    const isoString = localDate.toISOString().slice(0, 16)

    onChange?.(isoString)
  }

  // Format display value in Brazilian format
  const displayValue = React.useMemo(() => {
    if (!dateValue) return ''
    return format(dateValue, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }, [dateValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !dateValue && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex flex-col items-center w-auto p-0 bg-white dark:bg-black"
        align="start"
      >
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleDateSelect}
          locale={ptBR}
        />
        <div className="border-t p-3 bg-white dark:bg-black">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Horário:</span>
            <Input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className="w-auto"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
