"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

 

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
  framework: z.string().min(1, {
    message: "Please select a framework.",
  }),
  language: z.string().min(1, {
    message: "Please select a programming language.",
  }),
  country: z.string().min(1, {
    message: "Please select a country.",
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

type FormData = z.infer<typeof FormSchema>

export default function FormSheet() {
  const [open, setOpen] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      framework: "",
      language: "",
      country: "",
      skills: [],
      interests: [],
    },
  })

  function onSubmit(data: FormData) {
    console.log("Form submitted with VALUES:", data)

    const getLabel = (options: ComboboxOption[], value: string) =>
      options.find((option) => option.value === value)?.label || value

    const getLabels = (options: ComboboxOption[], values: string[]) =>
      values.map((value) => options.find((option) => option.value === value)?.label || value)

    toast("Project created successfully!", {
      
      duration: 10000,
    })

    setOpen(false)
    form.reset()
  }

  return ( 
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button  >
              <Plus   />
              Create New Project
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Create New Project</SheetTitle>
              <SheetDescription>Fill out the form below to set up your new development project.</SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <InputWrapper
                    control={form.control}
                    name="name"
                    label="Project Name"
                    type="text"
                    required={true}
                    warning="This will be the name of your project." value={""}                  />

                  <InputWrapper
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                    required={true}
                    warning="We'll use this to send you project updates." value={""}                  />

                  <ComboboxField
                    control={form.control}
                    name="framework"
                    label="Framework"
                    options={frameworks}
                    required={true}
                    placeholder="Select framework"
                    searchPlaceholder="Search frameworks..."
                    emptyText="No framework found."
                    warning="Choose the framework for your project."
                  />

                  <ComboboxField
                    control={form.control}
                    name="language"
                    label="Programming Language"
                    options={languages}
                    required={true}
                    placeholder="Select language"
                    searchPlaceholder="Search languages..."
                    emptyText="No language found."
                    warning="Choose your preferred programming language."
                  />

                  <ComboboxField
                    control={form.control}
                    name="country"
                    label="Country"
                    options={countries}
                    required={true}
                    placeholder="Select country"
                    searchPlaceholder="Search countries..."
                    emptyText="No country found."
                    warning="Choose your country for localization."
                  />

                  <MultiComboboxField
                    control={form.control}
                    name="skills"
                    label="Technical Skills"
                    options={skills}
                    required={true}
                    placeholder="Select your skills"
                    searchPlaceholder="Search skills..."
                    emptyText="No skills found."
                    minSelections={2}
                    maxSelections={5}
                    warning="Choose 2-5 technical skills you're proficient in."
                  />

                  <MultiComboboxField
                    control={form.control}
                    name="interests"
                    label="Areas of Interest"
                    options={interests}
                    required={true}
                    placeholder="Select your interests"
                    searchPlaceholder="Search interests..."
                    emptyText="No interests found."
                    minSelections={1}
                    warning="Choose areas you're interested in working with."
                  />

                  <div className="flex gap-3 pt-4 pb-6">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Create Project
                    </Button>
                  </div>
                </form>
              </Form>
            </ScrollArea>
          </SheetContent>
        </Sheet>
   
  )
}
