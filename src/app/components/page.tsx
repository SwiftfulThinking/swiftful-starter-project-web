"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AlertCircle, ChevronDown, Home, Calendar as CalendarIcon, Bold, Italic, Underline, Package, Settings, LogOut, User } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
}

const components = [
  { id: "accordion", name: "Accordion" },
  { id: "alert", name: "Alert" },
  { id: "alert-dialog", name: "Alert Dialog" },
  { id: "aspect-ratio", name: "Aspect Ratio" },
  { id: "avatar", name: "Avatar" },
  { id: "badge", name: "Badge" },
  { id: "breadcrumb", name: "Breadcrumb" },
  { id: "button", name: "Button" },
  { id: "calendar", name: "Calendar" },
  { id: "card", name: "Card" },
  { id: "carousel", name: "Carousel" },
  { id: "chart", name: "Chart" },
  { id: "checkbox", name: "Checkbox" },
  { id: "collapsible", name: "Collapsible" },
  { id: "command", name: "Command" },
  { id: "context-menu", name: "Context Menu" },
  { id: "dialog", name: "Dialog" },
  { id: "drawer", name: "Drawer" },
  { id: "dropdown-menu", name: "Dropdown Menu" },
  { id: "form", name: "Form" },
  { id: "hover-card", name: "Hover Card" },
  { id: "input", name: "Input" },
  { id: "input-otp", name: "Input OTP" },
  { id: "label", name: "Label" },
  { id: "menubar", name: "Menubar" },
  { id: "navigation-menu", name: "Navigation Menu" },
  { id: "pagination", name: "Pagination" },
  { id: "popover", name: "Popover" },
  { id: "progress", name: "Progress" },
  { id: "radio-group", name: "Radio Group" },
  { id: "resizable", name: "Resizable" },
  { id: "scroll-area", name: "Scroll Area" },
  { id: "select", name: "Select" },
  { id: "separator", name: "Separator" },
  { id: "sheet", name: "Sheet" },
  { id: "sidebar", name: "Sidebar" },
  { id: "skeleton", name: "Skeleton" },
  { id: "slider", name: "Slider" },
  { id: "switch", name: "Switch" },
  { id: "table", name: "Table" },
  { id: "tabs", name: "Tabs" },
  { id: "textarea", name: "Textarea" },
  { id: "toggle", name: "Toggle" },
  { id: "toggle-group", name: "Toggle Group" },
  { id: "tooltip", name: "Tooltip" },
  { id: "toast", name: "Toast" },
]

export default function ComponentsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [progress, setProgress] = useState(45)
  const [sliderValue, setSliderValue] = useState([50])
  const [commandOpen, setCommandOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Successfully signed out!")
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out")
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast.success("Form submitted successfully!")
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5, rootMargin: "-20% 0px -70% 0px" }
    )

    components.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Global Sidebar */}
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Navigation</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/home">
                        <Home className="mr-2 h-4 w-4" />
                        Home
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="/components">
                        <Package className="mr-2 h-4 w-4" />
                        Components
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <div className="p-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || user?.email || 'User'} />
                      <AvatarFallback>
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left text-sm min-w-0 flex-1">
                      <span className="font-medium truncate w-full text-left">{user?.displayName || 'User'}</span>
                      <span className="text-xs text-muted-foreground truncate w-full text-left">{user?.email}</span>
                    </div>
                    <Settings className="h-4 w-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end" side="right">
                  <div className="grid gap-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Page Content */}
        <div className="flex-1 flex flex-col">
          <TooltipProvider>
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center justify-between px-8">
                <div className="flex items-center">
                  <SidebarTrigger className="mr-4" />
                  <h1 className="text-2xl font-bold">shadcn/ui Components</h1>
                </div>
                <ThemeSwitcher />
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex gap-8 p-8">
          {/* Table of Contents */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <h2 className="font-semibold mb-4">Table of Contents</h2>
              <nav className="space-y-1">
                {components.map(({ id, name }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                      activeSection === id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Components Grid */}
          <main className="flex-1 space-y-8 pb-20">
            {/* Accordion */}
            <section id="accordion" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Accordion</CardTitle>
                  <CardDescription>A vertically stacked set of interactive headings that each reveal an associated section of content.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Is it accessible?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Is it styled?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It comes with default styles that matches the other components&apos; aesthetic.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            {/* Alert */}
            <section id="alert" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Alert</CardTitle>
                  <CardDescription>Displays a callout for user attention.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                      You can add components to your app using the cli.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </section>

            {/* Alert Dialog */}
            <section id="alert-dialog" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Dialog</CardTitle>
                  <CardDescription>A modal dialog that interrupts the user with important content and expects a response.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Show Dialog</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </section>

            {/* Aspect Ratio */}
            <section id="aspect-ratio" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Aspect Ratio</CardTitle>
                  <CardDescription>Displays content within a desired ratio.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full max-w-md">
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&dpr=2&q=80"
                        alt="Photo by Alvaro Pinot"
                        className="rounded-md object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Avatar */}
            <section id="avatar" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Avatar</CardTitle>
                  <CardDescription>An image element with a fallback for representing the user.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Badge */}
            <section id="badge" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Badge</CardTitle>
                  <CardDescription>Displays a badge or a component that looks like a badge.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Breadcrumb */}
            <section id="breadcrumb" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Breadcrumb</CardTitle>
                  <CardDescription>Displays the path to the current resource using a hierarchy of links.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </CardContent>
              </Card>
            </section>

            {/* Button */}
            <section id="button" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Button</CardTitle>
                  <CardDescription>Displays a button or a component that looks like a button.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Calendar */}
            <section id="calendar" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>A date field component that allows users to enter and edit date.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </section>

            {/* Card */}
            <section id="card" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Card</CardTitle>
                  <CardDescription>Displays a card with header, content, and footer.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                      <p>Card Footer</p>
                    </CardFooter>
                  </Card>
                </CardContent>
              </Card>
            </section>

            {/* Carousel */}
            <section id="carousel" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Carousel</CardTitle>
                  <CardDescription>A carousel with motion and swipe built using Embla.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-4xl font-semibold">{index + 1}</span>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
            </section>

            {/* Chart */}
            <section id="chart" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Chart</CardTitle>
                  <CardDescription>Beautiful charts built using Recharts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </section>

            {/* Checkbox */}
            <section id="checkbox" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Checkbox</CardTitle>
                  <CardDescription>A control that allows the user to toggle between checked and not checked.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Collapsible */}
            <section id="collapsible" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Collapsible</CardTitle>
                  <CardDescription>An interactive component which expands/collapses a panel.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <span>Can I use this in my project?</span>
                        <ChevronDown className="h-4 w-4 ml-auto" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="rounded-md border px-4 py-3 text-sm">
                        Yes. Free to use for personal and commercial projects. No attribution required.
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </section>

            {/* Command */}
            <section id="command" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Command</CardTitle>
                  <CardDescription>Fast, composable, unstyled command menu for React.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setCommandOpen(true)}>Open Command Menu</Button>
                  <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Suggestions">
                        <CommandItem>Calendar</CommandItem>
                        <CommandItem>Search Emoji</CommandItem>
                        <CommandItem>Calculator</CommandItem>
                      </CommandGroup>
                      <CommandSeparator />
                      <CommandGroup heading="Settings">
                        <CommandItem>Profile</CommandItem>
                        <CommandItem>Billing</CommandItem>
                        <CommandItem>Settings</CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </CommandDialog>
                </CardContent>
              </Card>
            </section>

            {/* Context Menu */}
            <section id="context-menu" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Context Menu</CardTitle>
                  <CardDescription>Displays a menu to the user — such as a set of actions or functions — triggered by a button.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContextMenu>
                    <ContextMenuTrigger className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed text-sm">
                      Right click here
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-64">
                      <ContextMenuItem>Back</ContextMenuItem>
                      <ContextMenuItem disabled>Forward</ContextMenuItem>
                      <ContextMenuItem>Reload</ContextMenuItem>
                      <ContextMenuItem>Save as...</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </CardContent>
              </Card>
            </section>

            {/* Dialog */}
            <section id="dialog" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Dialog</CardTitle>
                  <CardDescription>A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit Profile</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input id="name" value="Pedro Duarte" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <Input id="username" value="@peduarte" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </section>

            {/* Drawer */}
            <section id="drawer" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Drawer</CardTitle>
                  <CardDescription>A drawer component for React.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline">Open Drawer</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </CardContent>
              </Card>
            </section>

            {/* Dropdown Menu */}
            <section id="dropdown-menu" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Dropdown Menu</CardTitle>
                  <CardDescription>Displays a menu to the user — such as a set of actions or functions — triggered by a button.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Open</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            </section>

            {/* Form */}
            <section id="form" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Form</CardTitle>
                  <CardDescription>Building forms with React Hook Form and Zod.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Submit</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </section>

            {/* Hover Card */}
            <section id="hover-card" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Hover Card</CardTitle>
                  <CardDescription>For sighted users to preview content available behind a link.</CardDescription>
                </CardHeader>
                <CardContent>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link">@nextjs</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <Avatar>
                          <AvatarImage src="https://github.com/vercel.png" />
                          <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">@nextjs</h4>
                          <p className="text-sm">
                            The React Framework – created and maintained by @vercel.
                          </p>
                          <div className="flex items-center pt-2">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">
                              Joined December 2021
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </CardContent>
              </Card>
            </section>

            {/* Input */}
            <section id="input" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Input</CardTitle>
                  <CardDescription>Displays a form input field or a component that looks like an input field.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-w-md">
                    <Input type="email" placeholder="Email" />
                    <Input type="password" placeholder="Password" />
                    <Input disabled placeholder="Disabled input" />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Input OTP */}
            <section id="input-otp" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Input OTP</CardTitle>
                  <CardDescription>Accessible one-time password component with copy paste functionality.</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputOTP maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </CardContent>
              </Card>
            </section>

            {/* Label */}
            <section id="label" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Label</CardTitle>
                  <CardDescription>Renders an accessible label associated with controls.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="email">Your email address</Label>
                    <Input type="email" id="email" placeholder="Email" />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Menubar */}
            <section id="menubar" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Menubar</CardTitle>
                  <CardDescription>A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger>File</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>
                          New Tab
                        </MenubarItem>
                        <MenubarItem>New Window</MenubarItem>
                        <MenubarItem disabled>New Incognito Window</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Share</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Print</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                      <MenubarTrigger>Edit</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>Undo</MenubarItem>
                        <MenubarItem>Redo</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Cut</MenubarItem>
                        <MenubarItem>Copy</MenubarItem>
                        <MenubarItem>Paste</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </CardContent>
              </Card>
            </section>

            {/* Navigation Menu */}
            <section id="navigation-menu" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Navigation Menu</CardTitle>
                  <CardDescription>A collection of links for navigating websites.</CardDescription>
                </CardHeader>
                <CardContent>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <a
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                  href="/"
                                >
                                  <Home className="h-6 w-6" />
                                  <div className="mb-2 mt-4 text-lg font-medium">
                                    shadcn/ui
                                  </div>
                                  <p className="text-sm leading-tight text-muted-foreground">
                                    Beautifully designed components built with Radix UI and
                                    Tailwind CSS.
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <a href="/">Introduction</a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <a href="/">Installation</a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <a href="/">Typography</a>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </CardContent>
              </Card>
            </section>

            {/* Pagination */}
            <section id="pagination" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Pagination</CardTitle>
                  <CardDescription>Pagination with page navigation, next and previous links.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          2
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardContent>
              </Card>
            </section>

            {/* Popover */}
            <section id="popover" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Popover</CardTitle>
                  <CardDescription>Displays rich content in a portal, triggered by a button.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Open popover</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Dimensions</h4>
                          <p className="text-sm text-muted-foreground">
                            Set the dimensions for the layer.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width">Width</Label>
                            <Input
                              id="width"
                              defaultValue="100%"
                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxWidth">Max. width</Label>
                            <Input
                              id="maxWidth"
                              defaultValue="300px"
                              className="col-span-2 h-8"
                            />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
            </section>

            {/* Progress */}
            <section id="progress" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                  <CardDescription>Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <Button onClick={() => setProgress((prev) => (prev + 10) % 110)}>
                      Increase Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Radio Group */}
            <section id="radio-group" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Radio Group</CardTitle>
                  <CardDescription>A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="comfortable">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="r1" />
                      <Label htmlFor="r1">Default</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="comfortable" id="r2" />
                      <Label htmlFor="r2">Comfortable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="compact" id="r3" />
                      <Label htmlFor="r3">Compact</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </section>

            {/* Resizable */}
            <section id="resizable" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Resizable</CardTitle>
                  <CardDescription>Accessible resizable panel groups and layouts with keyboard support.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border">
                    <ResizablePanel defaultSize={50}>
                      <div className="flex h-[200px] items-center justify-center p-6">
                        <span className="font-semibold">One</span>
                      </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={50}>
                      <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={25}>
                          <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Two</span>
                          </div>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={75}>
                          <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Three</span>
                          </div>
                        </ResizablePanel>
                      </ResizablePanelGroup>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </CardContent>
              </Card>
            </section>

            {/* Scroll Area */}
            <section id="scroll-area" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Scroll Area</CardTitle>
                  <CardDescription>Augments native scroll functionality for custom, cross-browser styling.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72 w-48 rounded-md border">
                    <div className="p-4">
                      <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="text-sm">
                          v1.2.0-beta.{i}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>

            {/* Select */}
            <section id="select" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Select</CardTitle>
                  <CardDescription>Displays a list of options for the user to pick from—triggered by a button.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </section>

            {/* Separator */}
            <section id="separator" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Separator</CardTitle>
                  <CardDescription>Visually or semantically separates content.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
                      <p className="text-sm text-muted-foreground">
                        An open-source UI component library.
                      </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex h-5 items-center space-x-4 text-sm">
                      <div>Blog</div>
                      <Separator orientation="vertical" />
                      <div>Docs</div>
                      <Separator orientation="vertical" />
                      <div>Source</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sheet */}
            <section id="sheet" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Sheet</CardTitle>
                  <CardDescription>Extends the Dialog component to display content that complements the main content of the screen.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Open Sheet</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Edit profile</SheetTitle>
                        <SheetDescription>
                          Make changes to your profile here. Click save when you&apos;re done.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input id="name" value="Pedro Duarte" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <Input id="username" value="@peduarte" className="col-span-3" />
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>
            </section>

            {/* Sidebar */}
            <section id="sidebar" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Sidebar</CardTitle>
                  <CardDescription>A composable sidebar component for navigation menus.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-[400px] border rounded-lg overflow-hidden sidebar-demo">
                    <SidebarProvider defaultOpen={true} className="!min-h-[400px] !w-full !flex">
                      <div className="flex h-full w-full">
                        <Sidebar className="border-r !relative !h-full">
                          <SidebarContent>
                            <SidebarGroup>
                              <SidebarGroupLabel>Application</SidebarGroupLabel>
                              <SidebarGroupContent>
                                <SidebarMenu>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <a href="#">
                                        <Home className="mr-2 h-4 w-4" />
                                        <span>Home</span>
                                      </a>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <a href="#">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <span>Calendar</span>
                                      </a>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                </SidebarMenu>
                              </SidebarGroupContent>
                            </SidebarGroup>
                          </SidebarContent>
                        </Sidebar>
                        <div className="flex-1 p-4">
                          <SidebarTrigger />
                          <p className="mt-4">Main content area</p>
                        </div>
                      </div>
                    </SidebarProvider>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Skeleton */}
            <section id="skeleton" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Skeleton</CardTitle>
                  <CardDescription>Use to show a placeholder while content is loading.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Slider */}
            <section id="slider" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Slider</CardTitle>
                  <CardDescription>An input where the user selects a value from within a given range.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">Value: {sliderValue[0]}</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Switch */}
            <section id="switch" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Switch</CardTitle>
                  <CardDescription>A control that allows the user to toggle between checked and not checked.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Airplane Mode</Label>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Table */}
            <section id="table" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Table</CardTitle>
                  <CardDescription>A responsive table component.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">INV002</TableCell>
                        <TableCell>Pending</TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell className="text-right">$150.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

            {/* Tabs */}
            <section id="tabs" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Tabs</CardTitle>
                  <CardDescription>A set of layered sections of content—known as tab panels—that are displayed one at a time.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="account" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="account">Account</TabsTrigger>
                      <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                      <Card>
                        <CardHeader>
                          <CardTitle>Account</CardTitle>
                          <CardDescription>
                            Make changes to your account here.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue="Pedro Duarte" />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="password">
                      <Card>
                        <CardHeader>
                          <CardTitle>Password</CardTitle>
                          <CardDescription>
                            Change your password here.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="current">Current password</Label>
                            <Input id="current" type="password" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="new">New password</Label>
                            <Input id="new" type="password" />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Textarea */}
            <section id="textarea" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Textarea</CardTitle>
                  <CardDescription>Displays a form textarea or a component that looks like a textarea.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea placeholder="Type your message here." className="max-w-md" />
                </CardContent>
              </Card>
            </section>

            {/* Toggle */}
            <section id="toggle" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Toggle</CardTitle>
                  <CardDescription>A two-state button that can be either on or off.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Toggle aria-label="Toggle italic">
                      <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label="Toggle bold">
                      <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label="Toggle underline">
                      <Underline className="h-4 w-4" />
                    </Toggle>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Toggle Group */}
            <section id="toggle-group" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Toggle Group</CardTitle>
                  <CardDescription>A set of two-state buttons that can be toggled on or off.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ToggleGroup type="multiple">
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                      <Bold className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                      <Italic className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="underline" aria-label="Toggle underline">
                      <Underline className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </CardContent>
              </Card>
            </section>

            {/* Tooltip */}
            <section id="tooltip" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Tooltip</CardTitle>
                  <CardDescription>A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to library</p>
                    </TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>
            </section>

            {/* Toast */}
            <section id="toast" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle>Toast</CardTitle>
                  <CardDescription>A succinct message that is displayed temporarily.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => {
                      toast("Event has been created", {
                        description: "Sunday, December 03, 2023 at 9:00 AM",
                        action: {
                          label: "Undo",
                          onClick: () => console.log("Undo"),
                        },
                      })
                    }}
                  >
                    Show Toast
                  </Button>
                </CardContent>
              </Card>
            </section>
          </main>
            </div>
          </TooltipProvider>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}