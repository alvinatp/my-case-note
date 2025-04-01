"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Edit, MapPin, Phone, Save, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const resource = resources.find((r) => r.id === params.id)
  const [updateStatus, setUpdateStatus] = useState(resource?.status || "available")
  const [updateNote, setUpdateNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestRemoval, setSuggestRemoval] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // For editable details
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [editableServices, setEditableServices] = useState(resource?.services || [])
  const [newService, setNewService] = useState("")
  const [editableEligibility, setEditableEligibility] = useState(resource?.eligibility || [])
  const [newEligibility, setNewEligibility] = useState("")
  const [editableHours, setEditableHours] = useState(resource?.hours || [])

  if (!resource) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold text-[#333333]">Resource not found</h1>
          <p className="text-[#555555] mt-2">The resource you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4 bg-[#007BFF] hover:bg-[#0056D2]" asChild>
            <Link href="/app/resources">Back to Resources</Link>
          </Button>
        </div>
      </div>
    )
  }

  const statusColors = {
    available: "text-[#28A745] bg-[#28A74510]",
    limited: "text-[#FFC107] bg-[#FFC10710]",
    unavailable: "text-[#DC3545] bg-[#DC354510]",
  }

  const statusText = {
    available: "Available",
    limited: "Limited Availability",
    unavailable: "Unavailable",
  }

  const handleSubmitUpdate = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setUpdateNote("")
      setSuggestRemoval(false)
      setSuccessMessage("Resource status updated successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }, 1000)
  }

  const handleSubmitNote = () => {
    if (!newNote.trim()) return

    setIsSubmittingNote(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingNote(false)
      setNewNote("")
      setSuccessMessage("Note added successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }, 500)
  }

  const handleSaveDetails = () => {
    setIsEditingDetails(false)
    setSuccessMessage("Resource details updated successfully!")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const addService = () => {
    if (newService.trim()) {
      setEditableServices([...editableServices, newService])
      setNewService("")
    }
  }

  const removeService = (index: number) => {
    setEditableServices(editableServices.filter((_, i) => i !== index))
  }

  const addEligibility = () => {
    if (newEligibility.trim()) {
      setEditableEligibility([...editableEligibility, newEligibility])
      setNewEligibility("")
    }
  }

  const removeEligibility = (index: number) => {
    setEditableEligibility(editableEligibility.filter((_, i) => i !== index))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/app/resources" className="flex items-center text-[#555555]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>
        </Button>
      </div>

      {successMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-[#E0E0E0] shadow-sm">
            <CardHeader className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-[#333333]">{resource.name}</CardTitle>
                  <CardDescription className="text-[#666666]">{resource.category}</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Star className="h-5 w-5 text-[#CCCCCC] hover:text-[#FFC107]" />
                  <span className="sr-only">Save resource</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    statusColors[resource.status as keyof typeof statusColors]
                  }`}
                >
                  {statusText[resource.status as keyof typeof statusText]}
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-[#555555]">{resource.description}</p>

                <div className="grid gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#666666]" />
                    <span className="text-[#555555]">{resource.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#666666]" />
                    <span className="text-[#555555]">{resource.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#666666]" />
                    <span className="text-[#555555]">Last updated {resource.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="notes">
            <TabsList className="border-b">
              <TabsTrigger
                value="notes"
                className="text-[#555555] data-[state=active]:text-[#007BFF] data-[state=active]:border-b-2 data-[state=active]:border-[#007BFF]"
              >
                Case Manager Notes
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="text-[#555555] data-[state=active]:text-[#007BFF] data-[state=active]:border-b-2 data-[state=active]:border-[#007BFF]"
              >
                Additional Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="mt-4">
              <Card className="border border-[#E0E0E0] shadow-sm">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-lg font-bold text-[#333333]">Resource Updates</CardTitle>
                  <CardDescription className="text-[#666666]">
                    Recent updates and notes about this resource
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  {/* Add Note Form - Always visible for easier commenting */}
                  <div className="mb-6 p-4 border border-[#E0E0E0] rounded-md bg-[#F9F9F9]">
                    <h3 className="font-medium text-[#333333] mb-2">Add a Note</h3>
                    <Textarea
                      placeholder="Add your note about this resource..."
                      className="mb-3 h-[80px] border-[#CCCCCC]"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        className="bg-[#007BFF] hover:bg-[#0056D2]"
                        onClick={handleSubmitNote}
                        disabled={isSubmittingNote || !newNote.trim()}
                      >
                        {isSubmittingNote ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                            Submitting...
                          </>
                        ) : (
                          "Add Note"
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {notes.map((note, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={note.author} />
                          <AvatarFallback>{note.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#333333]">{note.author}</span>
                            <span className="text-xs text-[#999999]">{note.time}</span>
                          </div>
                          <p className="text-sm text-[#555555]">{note.content}</p>
                          {note.statusChange && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-[#666666]">Status changed to:</span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  statusColors[note.statusChange as keyof typeof statusColors]
                                }`}
                              >
                                {statusText[note.statusChange as keyof typeof statusText]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <Card className="border border-[#E0E0E0] shadow-sm">
                <CardHeader className="p-6 pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold text-[#333333]">Resource Details</CardTitle>
                      <CardDescription className="text-[#666666]">
                        Last updated: {resource.detailsLastUpdated || resource.lastUpdated}
                      </CardDescription>
                    </div>
                    {isEditingDetails ? (
                      <Button className="bg-[#28A745] hover:bg-[#218838]" onClick={handleSaveDetails}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
                        onClick={() => setIsEditingDetails(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  <div className="space-y-6">
                    {/* Services Section */}
                    <div>
                      <h3 className="font-medium text-[#333333] mb-2">Services Offered</h3>
                      {isEditingDetails ? (
                        <div className="space-y-3">
                          <ul className="space-y-2">
                            {editableServices.map((service, index) => (
                              <li key={index} className="flex items-center justify-between">
                                <span className="text-[#555555]">{service}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#DC3545] hover:text-[#C82333] h-6 px-2"
                                  onClick={() => removeService(index)}
                                >
                                  Remove
                                </Button>
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add new service"
                              value={newService}
                              onChange={(e) => setNewService(e.target.value)}
                              className="border-[#CCCCCC]"
                            />
                            <Button
                              onClick={addService}
                              disabled={!newService.trim()}
                              className="bg-[#007BFF] hover:bg-[#0056D2]"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <ul className="mt-2 list-disc list-inside text-[#555555]">
                          {editableServices.map((service, index) => (
                            <li key={index}>{service}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <Separator className="my-4" />

                    {/* Eligibility Section */}
                    <div>
                      <h3 className="font-medium text-[#333333] mb-2">Eligibility Requirements</h3>
                      {isEditingDetails ? (
                        <div className="space-y-3">
                          <ul className="space-y-2">
                            {editableEligibility.map((item, index) => (
                              <li key={index} className="flex items-center justify-between">
                                <span className="text-[#555555]">{item}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#DC3545] hover:text-[#C82333] h-6 px-2"
                                  onClick={() => removeEligibility(index)}
                                >
                                  Remove
                                </Button>
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add new eligibility requirement"
                              value={newEligibility}
                              onChange={(e) => setNewEligibility(e.target.value)}
                              className="border-[#CCCCCC]"
                            />
                            <Button
                              onClick={addEligibility}
                              disabled={!newEligibility.trim()}
                              className="bg-[#007BFF] hover:bg-[#0056D2]"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <ul className="mt-2 list-disc list-inside text-[#555555]">
                          {editableEligibility.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <Separator className="my-4" />

                    {/* Hours Section */}
                    <div>
                      <h3 className="font-medium text-[#333333] mb-2">Hours of Operation</h3>
                      {isEditingDetails ? (
                        <div className="space-y-3">
                          {editableHours.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 gap-2">
                              <Input
                                value={item.day}
                                onChange={(e) => {
                                  const updatedHours = [...editableHours]
                                  updatedHours[index] = { ...item, day: e.target.value }
                                  setEditableHours(updatedHours)
                                }}
                                className="border-[#CCCCCC]"
                              />
                              <Input
                                value={item.hours}
                                onChange={(e) => {
                                  const updatedHours = [...editableHours]
                                  updatedHours[index] = { ...item, hours: e.target.value }
                                  setEditableHours(updatedHours)
                                }}
                                className="border-[#CCCCCC]"
                              />
                            </div>
                          ))}
                          <Button
                            onClick={() => setEditableHours([...editableHours, { day: "", hours: "" }])}
                            className="bg-[#007BFF] hover:bg-[#0056D2]"
                          >
                            Add Hours
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-2 grid grid-cols-2 gap-2 text-[#555555]">
                          {editableHours.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{item.day}:</span>
                              <span>{item.hours}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border border-[#E0E0E0] shadow-sm">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-lg font-bold text-[#333333]">Update Resource Status</CardTitle>
              <CardDescription className="text-[#666666]">Share updates with other case managers</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-3">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-[#333333]">
                    Current Status
                  </Label>
                  <Select value={updateStatus} onValueChange={setUpdateStatus}>
                    <SelectTrigger id="status" className="border-[#CCCCCC]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="limited">Limited Availability</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note" className="text-[#333333]">
                    Add Note
                  </Label>
                  <Textarea
                    id="note"
                    placeholder="Share important updates about this resource..."
                    className="h-[100px] border-[#CCCCCC]"
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="suggest-removal"
                    checked={suggestRemoval}
                    onCheckedChange={(checked) => setSuggestRemoval(checked === true)}
                  />
                  <Label htmlFor="suggest-removal" className="text-sm text-[#555555]">
                    Suggest removal (resource no longer exists)
                  </Label>
                </div>
                <Button
                  className="w-full bg-[#007BFF] hover:bg-[#0056D2]"
                  onClick={handleSubmitUpdate}
                  disabled={isSubmitting || !updateNote.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Update"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Sample data
const resources = [
  {
    id: "1",
    name: "Community Shelter",
    category: "Housing & Shelter",
    status: "limited",
    address: "123 Main St, Anytown, USA",
    description:
      "Emergency shelter providing temporary housing for individuals and families experiencing homelessness. Offers meals, showers, and case management services. Priority is given to families with children and individuals with disabilities.",
    phone: "(555) 123-4567",
    lastUpdated: "2 hours ago",
    detailsLastUpdated: "March 28, 2025",
    services: ["Emergency shelter", "Meals provided", "Case management", "Housing assistance", "Shower facilities"],
    eligibility: [
      "Must be 18+ or accompanied by guardian",
      "Photo ID required",
      "Sobriety required on premises",
      "Background check required",
    ],
    hours: [
      { day: "Monday-Friday", hours: "24 hours" },
      { day: "Saturday", hours: "24 hours" },
      { day: "Sunday", hours: "24 hours" },
    ],
  },
  {
    id: "2",
    name: "Food Bank Central",
    category: "Food & Nutrition",
    status: "available",
    address: "456 Oak Ave, Anytown, USA",
    description:
      "Provides emergency food assistance to individuals and families in need. Offers both pre-packaged food boxes and client-choice pantry options. Also provides nutrition education and SNAP application assistance.",
    phone: "(555) 234-5678",
    lastUpdated: "1 day ago",
    detailsLastUpdated: "March 25, 2025",
    services: [
      "Emergency food boxes",
      "Client-choice pantry",
      "SNAP application assistance",
      "Nutrition education",
      "Home delivery for seniors and disabled",
    ],
    eligibility: [
      "Proof of address required",
      "Income verification may be required",
      "Can visit once per month",
      "Must live in service area (zip codes: 12345, 12346, 12347)",
    ],
    hours: [
      { day: "Monday-Friday", hours: "9:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
  },
]

const notes = [
  {
    author: "Sarah Johnson",
    time: "2 hours ago",
    content:
      "Called today and they confirmed they only have 3 beds available tonight. They're prioritizing families with children.",
    statusChange: "limited",
  },
  {
    author: "Michael Chen",
    time: "Yesterday at 3:45 PM",
    content: "They now require photo ID for all services. Clients should bring any form of identification they have.",
    statusChange: null,
  },
  {
    author: "Emily Rodriguez",
    time: "3 days ago",
    content: "They've expanded their hours to include weekends. Saturday hours are now 10am-2pm.",
    statusChange: null,
  },
]

