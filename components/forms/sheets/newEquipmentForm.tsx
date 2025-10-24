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
 
import InputWrapper from "../wrappers/InputWrapper"
import { ComboboxFieldWrapper, ComboboxOption, MultiComboboxWrapper } from "../wrappers/ComboboxWrapper"
 
// Define your options
const frameworks: ComboboxOption[] = [
  { id: "next.js", name: "Next.js" },
  { id: "sveltekit", name: "SvelteKit" },
  { id: "nuxt.js", name: "Nuxt.js" },
  { id: "remix", name: "Remix" },
  { id: "astro", name: "Astro" },
  { id: "react", name: "React" },
  { id: "vue", name: "Vue.js" },
  { id: "angular", name: "Angular" },
  { id: "svelte", name: "Svelte" },
  { id: "gatsby", name: "Gatsby" },
]

const languages: ComboboxOption[] = [
  { id: "typescript", name: "TypeScript" },
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "php", name: "PHP" },
]

const countries: ComboboxOption[] = [
  { id: "us", name: "United States" },
  { id: "uk", name: "United Kingdom" },
  { id: "ca", name: "Canada" },
  { id: "au", name: "Australia" },
  { id: "de", name: "Germany" },
  { id: "fr", name: "France" },
  { id: "jp", name: "Japan" },
  { id: "br", name: "Brazil" },
]

const skills: ComboboxOption[] = [
  { id: "react", name: "React" },
  { id: "vue", name: "Vue.js" },
  { id: "angular", name: "Angular" },
  { id: "svelte", name: "Svelte" },
  { id: "typescript", name: "TypeScript" },
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "php", name: "PHP" },
]

const interests: ComboboxOption[] = [
  { id: "web-dev", name: "Web Development" },
  { id: "mobile-dev", name: "Mobile Development" },
  { id: "ai-ml", name: "AI/Machine Learning" },
  { id: "data-science", name: "Data Science" },
  { id: "devops", name: "DevOps" },
  { id: "cybersecurity", name: "Cybersecurity" },
  { id: "blockchain", name: "Blockchain" },
  { id: "game-dev", name: "Game Development" },
  { id: "ui-ux", name: "UI/UX Design" },
  { id: "cloud", name: "Cloud Computing" },
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

export default function NewEquipmentSheet() {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      skills: [],
      interests: [],
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Log the full data to console for debugging
    console.log("Form submitted with VALUES:", data)

    // Helper function to get labels for display
    const getLabel = (options: ComboboxOption[], id: string) =>
      options.find((option) => option.value === value)?.label || value

    const getLabels = (options: ComboboxOption[], values: string[]) =>
      values.map((value) => options.find((option) => option.value === value)?.label || value)

    toast("Project created successfully!", {
      description: (
        <div className="mt-2 space-y-3">
          <div>
            <p className="font-medium">{data.name}</p>
            <p className="text-xs text-muted-foreground">{data.email}</p>
          </div>

          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">Framework:</span>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">id: {data.framework}</p>
                <p>{getLabel(frameworks, data.framework)}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Language:</span>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">id: {data.language}</p>
                <p>{getLabel(languages, data.language)}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Country:</span>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">id: {data.country}</p>
                <p>{getLabel(countries, data.country)}</p>
              </div>
            </div>
          </div>

          <div className="text-sm space-y-1">
            <div>
              <p className="font-medium">Skills (Values):</p>
              <p className="text-xs text-muted-foreground">[{data.skills.map((s) => `"${s}"`).join(", ")}]</p>
              <p className="text-xs">{getLabels(skills, data.skills).join(", ")}</p>
            </div>

            <div>
              <p className="font-medium">Interests (Values):</p>
              <p className="text-xs text-muted-foreground">[{data.interests.map((i) => `"${i}"`).join(", ")}]</p>
              <p className="text-xs">{getLabels(interests, data.interests).join(", ")}</p>
            </div>
          </div>
        </div>
      ),
      duration: 10000, // Show longer so user can read all the data
    })

    // Close sheet and reset form
    setOpen(false)
    form.reset()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <p className="text-muted-foreground">Create and manage your development projects</p>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="mt-6">
              <Plus className="mr-2 h-4 w-4" />
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
                    required={true} value={""} 
                    warning="We'll use this to send you project updates."
                  />

                  <ComboboxFieldWrapper
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

                  <ComboboxFieldWrapper
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

                  <MultiComboboxWrapper
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

                  <MultiComboboxWrapper
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

                  <MultiComboboxWrapper
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
      </div>

      {/* Example of existing projects */}
      <div className="mt-12 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-medium">E-commerce Platform</h3>
            <p className="text-sm text-muted-foreground mt-1">Next.js • TypeScript • United States</p>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="text-xs bg-secondary px-2 py-1 rounded">React</span>
              <span className="text-xs bg-secondary px-2 py-1 rounded">TypeScript</span>
              <span className="text-xs bg-secondary px-2 py-1 rounded">Web Dev</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-muted-foreground">2 days ago</span>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </div>

          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-medium">Mobile App</h3>
            <p className="text-sm text-muted-foreground mt-1">React • JavaScript • Canada</p>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="text-xs bg-secondary px-2 py-1 rounded">React</span>
              <span className="text-xs bg-secondary px-2 py-1 rounded">JavaScript</span>
              <span className="text-xs bg-secondary px-2 py-1 rounded">Mobile Dev</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-muted-foreground">1 week ago</span>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </div>

          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-medium">AI Dashboard</h3>
            <p className="text-sm text-muted-foreground mt-1">Vue.js • Python • Germany</p>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="text-xs bg-secondary px-2 py-1 rounded">Vue</span>
              <span className="text-xs bg-secondary px-2 py-1 rounded">Python</span>
              <span className="text-xs bg-secondary px-2 py-1 rounded">AI/ML</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-muted-foreground">2 weeks ago</span>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
