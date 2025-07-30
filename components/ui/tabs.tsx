"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal", // Default to horizontal
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex", orientation === "vertical" ? "flex-row" : "flex-col", className)} // Flex layout control based on orientation
      {...props}
    />
  )
}

function TabsList({
  className,
  orientation = "horizontal", // Default to horizontal
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        orientation === "vertical" ? "flex flex-col text-start space-y-2 border-r border-gray-300 pr-4" : "flex flex-row space-x-2", // Conditionally change layout
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  orientation = "horizontal", // Default to horizontal
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex items-center justify-center gap-1.5 cursor-pointer",
        orientation === "vertical" // Adjust styles for vertical orientation
          ? "w-full flex py-2 text-left text-red-950 "
          : "py-1 px-4 text-sm font-medium whitespace-nowrap transition-all rounded-md ", // Horizontal styles
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 p-4", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
