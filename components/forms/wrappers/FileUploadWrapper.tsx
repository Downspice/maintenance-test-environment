"use client"

import type React from "react"

import { useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Upload, FileText } from "lucide-react"
import type { Control } from "react-hook-form"

interface FileUploadWrapperProps {
  control: Control<any>
  name: string
  name: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  disabled?: boolean
  required?: boolean
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FileUploadWrapper({
  control,
  name,
  label,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  required = false,
  className,
  onChange,
}: FileUploadWrapperProps) {
  const [fileNames, setFileNames] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)

      // Check file size if maxSize is provided
      if (maxSize) {
        const oversizedFiles = files.filter((file) => file.size > maxSize)
        if (oversizedFiles.length > 0) {
          alert(`Some files exceed the maximum size of ${maxSize / 1024 / 1024}MB`)
          return
        }
      }

      setFileNames(files.map((file) => file.name))
      onChange(multiple ? files : files[0])

      // Call external onChange if provided
      if (typeof onChange === "function") {
        onChange(e)
      }
    }
  }

  const clearFiles = (e: React.MouseEvent, onChange: (...event: any[]) => void) => {
    e.preventDefault()
    setFileNames([])
    onChange(multiple ? [] : null)
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem>
          <FormLabel>
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </FormLabel>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, onChange)}
                    {...fieldProps}
                  />
                  <Button type="button" variant="outline" className={`w-full ${className}`} disabled={disabled}>
                    <Upload className="mr-2 h-4 w-4" />
                    {multiple ? "Upload Files" : "Upload File"}
                  </Button>
                </div>
              </FormControl>
              {fileNames.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => clearFiles(e, onChange)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {fileNames.length > 0 && (
              <div className="space-y-1">
                {fileNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[200px]">{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
