"use client"

import { useState } from "react"
import Link from "next/link"
import { Filter, MapPin, Search, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [zipcode, setZipcode] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  // Filter resources based on search, zipcode, categories, and status
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(resource.category)

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(resource.status)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#333333]">Find Resources</h1>
        <p className="text-[#555555] text-base">Search for resources by name, category, or location</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#555555]" />
              <Input
                placeholder="Search resources..."
                className="pl-10 h-[48px] border-[#CCCCCC] focus:border-[#007BFF] focus:ring-[#007BFF]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full sm:w-[180px]">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#555555]" />
              <Input
                placeholder="Zipcode"
                className="pl-10 h-[48px] border-[#CCCCCC] focus:border-[#007BFF] focus:ring-[#007BFF]"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto h-[48px] border-[#CCCCCC]">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Resources</SheetTitle>
                  <SheetDescription>Narrow down resources by category and availability</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Categories</h3>
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                          className="h-5 w-5 rounded border-[#CCCCCC] text-[#007BFF]"
                        />
                        <Label htmlFor={`category-${category}`} className="text-[#555555]">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Availability Status</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-available"
                        checked={statusFilter.includes("available")}
                        onCheckedChange={() => handleStatusChange("available")}
                        className="h-5 w-5 rounded border-[#CCCCCC] text-[#28A745]"
                      />
                      <Label htmlFor="status-available" className="text-[#555555]">
                        Available
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-limited"
                        checked={statusFilter.includes("limited")}
                        onCheckedChange={() => handleStatusChange("limited")}
                        className="h-5 w-5 rounded border-[#CCCCCC] text-[#FFC107]"
                      />
                      <Label htmlFor="status-limited" className="text-[#555555]">
                        Limited
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-unavailable"
                        checked={statusFilter.includes("unavailable")}
                        onCheckedChange={() => handleStatusChange("unavailable")}
                        className="h-5 w-5 rounded border-[#CCCCCC] text-[#DC3545]"
                      />
                      <Label htmlFor="status-unavailable" className="text-[#555555]">
                        Unavailable
                      </Label>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#666666]">{filteredResources.length} resources found</p>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[150px] border-[#CCCCCC]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Updated</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Zipcode Prompt */}
      {!zipcode && (
        <div className="mb-4 text-center">
          <p className="text-[#666666] text-sm">Enter a zipcode to see resources near you</p>
        </div>
      )}

      {/* Resources List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  )
}

interface Resource {
  id: string
  name: string
  category: string
  status: "available" | "limited" | "unavailable"
  address: string
  description: string
  phone: string
  lastUpdated: string
}

interface ResourceCardProps {
  resource: Resource
}

// Update the ResourceCard component in the resources page for better text handling
function ResourceCard({ resource }: ResourceCardProps) {
  const statusColors = {
    available: "text-[#28A745] bg-[#28A74510]",
    limited: "text-[#FFC107] bg-[#FFC10710]",
    unavailable: "text-[#DC3545] bg-[#DC354510]",
  }

  const statusText = {
    available: "Available",
    limited: "Limited",
    unavailable: "Unavailable",
  }

  return (
    <Card className="border border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-[#333333] line-clamp-2">{resource.name}</CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0 ml-1 flex-shrink-0">
            <Star className="h-4 w-4 text-[#CCCCCC] hover:text-[#FFC107]" />
            <span className="sr-only">Save resource</span>
          </Button>
        </div>
        <CardDescription className="text-sm text-[#666666]">{resource.category}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2 flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[resource.status]}`}>
            {statusText[resource.status]}
          </span>
        </div>
        <p className="text-sm text-[#555555] line-clamp-2 mb-2">{resource.description}</p>
        <p className="text-sm text-[#555555] line-clamp-1">{resource.address}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between mt-auto">
        <p className="text-xs text-[#999999]">Updated {resource.lastUpdated}</p>
        <Button variant="ghost" size="sm" className="text-[#007BFF] hover:text-[#0056D2] p-0 h-auto" asChild>
          <Link href={`/app/resources/${resource.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Sample data
const categories = [
  "Housing & Shelter",
  "Food & Nutrition",
  "Healthcare & Mental Health",
  "Employment & Education",
  "Legal & Financial Assistance",
  "Transportation",
  "Childcare & Family Services",
  "Substance Abuse & Recovery",
]

const resources: Resource[] = [
  {
    id: "1",
    name: "Community Shelter",
    category: "Housing & Shelter",
    status: "limited",
    address: "123 Main St, Anytown, USA",
    description:
      "Emergency shelter providing temporary housing for individuals and families experiencing homelessness. Currently has limited bed availability.",
    phone: "(555) 123-4567",
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    name: "Food Bank Central",
    category: "Food & Nutrition",
    status: "available",
    address: "456 Oak Ave, Anytown, USA",
    description: "Provides emergency food assistance to individuals and families in need. Open Monday-Friday 9am-5pm.",
    phone: "(555) 234-5678",
    lastUpdated: "1 day ago",
  },
  {
    id: "3",
    name: "Mental Health Clinic",
    category: "Healthcare & Mental Health",
    status: "unavailable",
    address: "789 Pine Rd, Anytown, USA",
    description:
      "Offers counseling, therapy, and psychiatric services. Currently closed for renovations until next week.",
    phone: "(555) 345-6789",
    lastUpdated: "3 hours ago",
  },
  {
    id: "4",
    name: "Job Training Center",
    category: "Employment & Education",
    status: "available",
    address: "101 Work Blvd, Anytown, USA",
    description:
      "Provides job training, resume assistance, and employment placement services. Currently accepting new clients.",
    phone: "(555) 456-7890",
    lastUpdated: "5 days ago",
  },
  {
    id: "5",
    name: "Legal Aid Society",
    category: "Legal & Financial Assistance",
    status: "available",
    address: "202 Justice Ave, Anytown, USA",
    description:
      "Offers free legal assistance for low-income individuals. Specializes in housing, family, and immigration law.",
    phone: "(555) 567-8901",
    lastUpdated: "1 week ago",
  },
  {
    id: "6",
    name: "Transit Assistance Program",
    category: "Transportation",
    status: "available",
    address: "303 Transit Way, Anytown, USA",
    description: "Provides bus passes and transportation vouchers for medical appointments and job interviews.",
    phone: "(555) 678-9012",
    lastUpdated: "3 days ago",
  },
  {
    id: "7",
    name: "Family Support Center",
    category: "Childcare & Family Services",
    status: "limited",
    address: "404 Family Circle, Anytown, USA",
    description:
      "Offers childcare subsidies, parenting classes, and family counseling. Limited spots available for childcare program.",
    phone: "(555) 789-0123",
    lastUpdated: "2 days ago",
  },
  {
    id: "8",
    name: "Recovery Support Network",
    category: "Substance Abuse & Recovery",
    status: "available",
    address: "505 Healing Path, Anytown, USA",
    description: "Provides substance abuse treatment, recovery support groups, and sober living resources.",
    phone: "(555) 890-1234",
    lastUpdated: "4 days ago",
  },
  {
    id: "9",
    name: "Women's Shelter",
    category: "Housing & Shelter",
    status: "limited",
    address: "606 Safe Haven, Anytown, USA",
    description:
      "Emergency shelter for women and children fleeing domestic violence. Currently has very limited space.",
    phone: "(555) 901-2345",
    lastUpdated: "12 hours ago",
  },
]

