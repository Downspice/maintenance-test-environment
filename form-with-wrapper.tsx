"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ComboboxField, MultiComboboxField, type ComboboxOption } from "./components/forms/wrappers/ComboboxWrapper"

// Define your options
const frameworks: ComboboxOption[] = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "gatsby", label: "Gatsby" },
]

const languages: ComboboxOption[] = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
]

const countries: ComboboxOption[] = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
]

const skills: ComboboxOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
]

const interests: ComboboxOption[] = [
  { value: "web-dev", label: "Web Development" },
  { value: "mobile-dev", label: "Mobile Development" },
  { value: "ai-ml", label: "AI/Machine Learning" },
  { value: "data-science", label: "Data Science" },
  { value: "devops", label: "DevOps" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "blockchain", label: "Blockchain" },
  { value: "game-dev", label: "Game Development" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "cloud", label: "Cloud Computing" },
]

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  framework: z.string({
    required_error: "Please select a framework.",
  }),
  language: z.string({
    required_error: "Please select a programming language.",
  }),
  country: z.string({
    required_error: "Please select a country.",
  }),
  skills: z
    .array(z.string())
    .min(2, {
      message: "Please select at least 2 skills.",
    })
    .max(5, {
      message: "Please select no more than 5 skills.",
    }),
  interests: z.array(z.string()).min(1, {
    message: "Please select at least 1 interest.",
  }),
})

export default function FormWithWrapper() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("Form submitted successfully!", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Project Setup</h1>
          <p className="text-muted-foreground">Fill out the form to create your new project</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormDescription>This will be the name of your project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormDescription>We'll use this to send you project updates.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Using the ComboboxField wrapper - much cleaner! */}
            <ComboboxField
              control={form.control}
              name="framework"
              label="Framework"
              placeholder="Select framework"
              description="Choose the framework for your project."
              options={frameworks}
              searchPlaceholder="Search frameworks..."
              emptyText="No framework found."
            />

            <ComboboxField
              control={form.control}
              name="language"
              label="Programming Language"
              placeholder="Select language"
              description="Choose your preferred programming language."
              options={languages}
              searchPlaceholder="Search languages..."
              emptyText="No language found."
            />

            <ComboboxField
              control={form.control}
              name="country"
              label="Country"
              placeholder="Select country"
              description="Choose your country for localization."
              options={countries}
              searchPlaceholder="Search countries..."
              emptyText="No country found."
            />

            <MultiComboboxField
              control={form.control}
              name="skills"
              label="Technical Skills"
              placeholder="Select your skills"
              description="Choose 2-5 technical skills you're proficient in."
              options={skills}
              searchPlaceholder="Search skills..."
              emptyText="No skills found."
              minSelections={2}
              maxSelections={5}
            />

            <MultiComboboxField
              control={form.control}
              name="interests"
              label="Areas of Interest"
              placeholder="Select your interests"
              description="Choose areas you're interested in working with."
              options={interests}
              searchPlaceholder="Search interests..."
              emptyText="No interests found."
              minSelections={1}
            />

            <Button type="submit" className="w-full">
              Create Project
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
