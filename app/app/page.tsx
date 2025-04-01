"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Search, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const [zipcode, setZipcode] = useState("")

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#333333]">Welcome back, Case Manager</h1>
        <p className="text-[#555555] text-base">
          Find and update resources to help your clients get the support they need.
        </p>
      </div>

      {/* Quick Search */}
      <div className="w-full flex justify-center mb-8">
        <div className="w-[80%] relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#555555]" />
          <Input
            placeholder="Search resources by name, category, or zipcode"
            className="pl-10 h-[48px] border-[#CCCCCC] focus:border-[#007BFF] focus:ring-[#007BFF]"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
          />
          <Button
            className="absolute right-0 top-0 h-[48px] bg-[#007BFF] hover:bg-[#0056D2]"
            onClick={() => (window.location.href = `/app/resources${zipcode ? `?zipcode=${zipcode}` : ""}`)}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="recent" className="mt-6">
        <TabsList className="border-b mb-6">
          <TabsTrigger
            value="recent"
            className="text-[#555555] data-[state=active]:text-[#007BFF] data-[state=active]:border-b-2 data-[state=active]:border-[#007BFF]"
          >
            Recently Updated
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="text-[#555555] data-[state=active]:text-[#007BFF] data-[state=active]:border-b-2 data-[state=active]:border-[#007BFF]"
          >
            Saved Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4" style={{ minWidth: "max-content" }}>
              {recentResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50" asChild>
              <Link href="/app/resources">
                View All Resources <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface Resource {
  id: string
  name: string
  category: string
  status: "available" | "limited" | "unavailable"
  address: string
  lastUpdated: string
}

interface ResourceCardProps {
  resource: Resource
}

// Update the ResourceCard component to have better text handling and more flexible height
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
    <Card className="w-[250px] min-h-[150px] border border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-bold text-[#333333] line-clamp-2">{resource.name}</CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0 ml-1 flex-shrink-0">
            <Star className="h-4 w-4 text-[#CCCCCC] hover:text-[#FFC107]" />
            <span className="sr-only">Save resource</span>
          </Button>
        </div>
        <CardDescription className="text-sm text-[#666666] mt-1">{resource.category}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-1 pb-3 flex-grow flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[resource.status]}`}>
            {statusText[resource.status]}
          </span>
        </div>
        <p className="text-xs text-[#999999]">Updated {resource.lastUpdated}</p>
      </CardContent>
    </Card>
  )
}

// Sample data
const recentResources: Resource[] = [
  {
    id: "1",
    name: "Community Shelter",
    category: "Housing & Shelter",
    status: "limited",
    address: "123 Main St, Anytown, USA",
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    name: "Food Bank Central",
    category: "Food & Nutrition",
    status: "available",
    address: "456 Oak Ave, Anytown, USA",
    lastUpdated: "1 day ago",
  },
  {
    id: "3",
    name: "Mental Health Clinic",
    category: "Healthcare & Mental Health",
    status: "unavailable",
    address: "789 Pine Rd, Anytown, USA",
    lastUpdated: "3 hours ago",
  },
  {
    id: "4",
    name: "Job Training Center",
    category: "Employment & Education",
    status: "available",
    address: "101 Work Blvd, Anytown, USA",
    lastUpdated: "5 days ago",
  },
  {
    id: "5",
    name: "Legal Aid Society",
    category: "Legal & Financial Assistance",
    status: "available",
    address: "202 Justice Ave, Anytown, USA",
    lastUpdated: "1 week ago",
  },
]

const savedResources: Resource[] = [
  {
    id: "4",
    name: "Job Training Center",
    category: "Employment & Education",
    status: "available",
    address: "101 Work Blvd, Anytown, USA",
    lastUpdated: "5 days ago",
  },
  {
    id: "5",
    name: "Legal Aid Society",
    category: "Legal & Financial Assistance",
    status: "available",
    address: "202 Justice Ave, Anytown, USA",
    lastUpdated: "1 week ago",
  },
]

