"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Edit, MapPin, Phone, Save, Star, Globe, Info, CalendarDays, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getResourceById, updateResourceDetails, addResourceNote, Resource } from "@/services/resources"
import { format, parseISO } from 'date-fns'

// Helper function to format date
const formatDate = (dateString: string | Date): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, "MM/dd/yyyy 'at' h:mm a");
  } catch (e) {
    return "Invalid date";
  }
};

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const resourceId = unwrappedParams.id;

  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for Update Status form
  const [updateStatus, setUpdateStatus] = useState<Resource['status']>('AVAILABLE')
  const [statusUpdateNote, setStatusUpdateNote] = useState("")
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false)
  const [suggestRemoval, setSuggestRemoval] = useState(false)

  // State for Add Note form
  const [newStandaloneNote, setNewStandaloneNote] = useState("")
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)

  // State for Editing Details
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [editableContactDetails, setEditableContactDetails] = useState<Resource['contactDetails']>({})
  const [newService, setNewService] = useState("")
  const [newEligibility, setNewEligibility] = useState("")
  const [newHourDay, setNewHourDay] = useState("")
  const [newHourTime, setNewHourTime] = useState("")
  const [isSavingDetails, setIsSavingDetails] = useState(false)

  const [successMessage, setSuccessMessage] = useState("")

  // Fetch resource data
  const fetchResource = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getResourceById(resourceId)
      setResource(data)
      setUpdateStatus(data.status)
      setEditableContactDetails(data.contactDetails || {})
    } catch (err) {
      setError("Failed to load resource details")
      console.error("Error fetching resource:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResource()
  }, [resourceId])

  // Handle Status Update
  const handleSubmitStatusUpdate = async () => {
    if (!resource) return;

    setIsSubmittingStatus(true);
    try {
      const updatePayload = {
        status: updateStatus,
        suggest_removal: suggestRemoval
      };

      await updateResourceDetails(resourceId, updatePayload);

      // If a note was added with the status change, add it separately
      if (statusUpdateNote.trim()) {
        await addResourceNote(resourceId, { content: statusUpdateNote.trim() });
      }

      setStatusUpdateNote("");
      setSuggestRemoval(false);
      setSuccessMessage("Resource status updated successfully!");
      await fetchResource();
    } catch (err) {
      setError("Failed to update resource status");
      console.error("Error updating resource status:", err);
    } finally {
      setIsSubmittingStatus(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }

  // Handle Adding Standalone Note
  const handleSubmitStandaloneNote = async () => {
    if (!newStandaloneNote.trim() || !resource) return;

    setIsSubmittingNote(true);
    try {
      await addResourceNote(resourceId, { content: newStandaloneNote.trim() });
      setNewStandaloneNote("");
      setSuccessMessage("Note added successfully!");
      await fetchResource();
    } catch (err) {
      setError("Failed to add note");
      console.error("Error adding note:", err);
    } finally {
      setIsSubmittingNote(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }

  // Handle Editing Details
  const handleDetailChange = (field: keyof Resource['contactDetails'], value: any) => {
    setEditableContactDetails(prev => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    if (newService.trim()) {
      const currentServices = editableContactDetails.services || [];
      handleDetailChange('services', [...currentServices, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    const currentServices = editableContactDetails.services || [];
    handleDetailChange('services', currentServices.filter((_, i) => i !== index));
  };

  const addEligibility = () => {
    if (newEligibility.trim()) {
      const currentEligibility = editableContactDetails.eligibility || [];
      handleDetailChange('eligibility', [...currentEligibility, newEligibility.trim()]);
      setNewEligibility("");
    }
  };

  const removeEligibility = (index: number) => {
    const currentEligibility = editableContactDetails.eligibility || [];
    handleDetailChange('eligibility', currentEligibility.filter((_, i) => i !== index));
  };

  const addHour = () => {
    if (newHourDay.trim() && newHourTime.trim()) {
      const currentHours = editableContactDetails.hours || [];
      handleDetailChange('hours', [...currentHours, { day: newHourDay.trim(), hours: newHourTime.trim() }]);
      setNewHourDay("");
      setNewHourTime("");
    }
  };

  const removeHour = (index: number) => {
    const currentHours = editableContactDetails.hours || [];
    handleDetailChange('hours', currentHours.filter((_, i) => i !== index));
  };

  // Handle Saving Edited Details
  const handleSaveDetails = async () => {
    if (!resource) return;
    setIsSavingDetails(true);
    try {
      await updateResourceDetails(resourceId, {
        contactDetails: editableContactDetails
      });
      setIsEditingDetails(false);
      setSuccessMessage("Resource details updated successfully!");
      await fetchResource();
    } catch (err) {
      setError("Failed to save resource details");
      console.error("Error saving details:", err);
    } finally {
      setIsSavingDetails(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-[#555555]">Loading resource details...</p>
        </div>
      </div>
    )
  }

  if (error || !resource) {
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
    AVAILABLE: "text-[#28A745] bg-[#28A74510]",
    LIMITED: "text-[#FFC107] bg-[#FFC10710]",
    UNAVAILABLE: "text-[#DC3545] bg-[#DC354510]"
  }

  const statusText = {
    AVAILABLE: "Available",
    LIMITED: "Limited Availability",
    UNAVAILABLE: "Unavailable"
  }

  const currentContactDetails = resource.contactDetails || {};
  const currentNotes = Array.isArray(resource.notes) ? resource.notes : [];

  return (
    <div className="p-6">
      {/* Back Button */}
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

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Resource Header Card */}
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
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[resource.status]}`}>
                  {statusText[resource.status]}
                </span>
              </div>
              <p className="text-[#555555] mb-4">{currentContactDetails.description || 'No description available.'}</p>
              <div className="grid gap-3 mt-4 text-sm">
                {currentContactDetails.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#666666]" />
                    <span className="text-[#555555]">{currentContactDetails.address}</span>
                  </div>
                )}
                {currentContactDetails.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#666666]" />
                    <span className="text-[#555555]">{currentContactDetails.phone}</span>
                  </div>
                )}
                {currentContactDetails.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#666666]" />
                    <a
                      href={currentContactDetails.website.startsWith('http') ? currentContactDetails.website : `https://${currentContactDetails.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#007BFF] hover:underline truncate"
                    >
                      {currentContactDetails.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#666666]" />
                  <span className="text-[#555555]">Last updated: {formatDate(resource.lastUpdated)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Notes and Details */}
          <Tabs defaultValue="notes">
            <TabsList className="border-b">
              <TabsTrigger
                value="notes"
                className="text-[#555555] data-[state=active]:text-[#007BFF] data-[state=active]:border-b-2 data-[state=active]:border-[#007BFF]"
              >
                Case Manager Notes ({currentNotes.length})
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="text-[#555555] data-[state=active]:text-[#007BFF] data-[state=active]:border-b-2 data-[state=active]:border-[#007BFF]"
              >
                Additional Details
              </TabsTrigger>
            </TabsList>

            {/* Notes Tab */}
            <TabsContent value="notes" className="mt-4">
              <Card className="border border-[#E0E0E0] shadow-sm">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-lg font-bold text-[#333333]">Resource Updates & Notes</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  {/* Add Standalone Note Form */}
                  <div className="mb-6 p-4 border border-[#E0E0E0] rounded-md bg-[#F9F9F9]">
                    <h3 className="font-medium text-[#333333] mb-2">Add a New Note</h3>
                    <Textarea
                      placeholder="Share your latest finding about this resource..."
                      className="mb-3 h-[80px] border-[#CCCCCC]"
                      value={newStandaloneNote}
                      onChange={(e) => setNewStandaloneNote(e.target.value)}
                      maxLength={1000}
                    />
                    <div className="flex justify-end">
                      <Button
                        className="bg-[#007BFF] hover:bg-[#0056D2]"
                        onClick={handleSubmitStandaloneNote}
                        disabled={isSubmittingNote || !newStandaloneNote.trim()}
                      >
                        {isSubmittingNote ? "Adding..." : "Add Note"}
                      </Button>
                    </div>
                  </div>

                  {/* Display Notes */}
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {currentNotes.length > 0 ? currentNotes.map((note, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{note.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-[#333333]">{note.username || 'Unknown User'}</span>
                            <span className="text-xs text-[#999999]"> - {formatDate(note.timestamp)}</span>
                          </div>
                          <p className="text-sm text-[#555555] whitespace-pre-wrap">{note.content}</p>
                        </div>
                      </div>
                    )).reverse() // Show newest first
                      : <p className="text-sm text-center text-gray-500 py-4">No notes added yet.</p>
                    }
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-4">
              <Card className="border border-[#E0E0E0] shadow-sm">
                <CardHeader className="p-6 pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold text-[#333333]">Resource Details</CardTitle>
                      <CardDescription className="text-[#666666]">
                        Last updated: {formatDate(resource.lastUpdated)}
                      </CardDescription>
                    </div>
                    {isEditingDetails ? (
                      <Button
                        className="bg-[#28A745] hover:bg-[#218838]"
                        onClick={handleSaveDetails}
                        disabled={isSavingDetails}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSavingDetails ? "Saving..." : "Save Changes"}
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
                    {/* Services */}
                    <div>
                      <h3 className="font-medium text-[#333333] mb-2 flex items-center gap-2">
                        <List size={16} /> Services Offered
                      </h3>
                      {isEditingDetails ? (
                        <div className="space-y-2">
                          {(editableContactDetails.services || []).map((service, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm text-[#555555]">{service}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#DC3545] hover:text-[#C82333] h-6 px-1"
                                onClick={() => removeService(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2 pt-2">
                            <Input
                              placeholder="Add new service"
                              value={newService}
                              onChange={(e) => setNewService(e.target.value)}
                              className="border-[#CCCCCC] h-9"
                            />
                            <Button
                              onClick={addService}
                              disabled={!newService.trim()}
                              className="bg-[#007BFF] hover:bg-[#0056D2] h-9"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ) : (
                        (editableContactDetails.services && editableContactDetails.services.length > 0) ?
                          <ul className="mt-1 list-disc list-inside text-[#555555] text-sm space-y-1">
                            {editableContactDetails.services.map((service, index) => (
                              <li key={index}>{service}</li>
                            ))}
                          </ul>
                          : <p className="text-sm text-gray-500 italic">No services listed.</p>
                      )}
                    </div>

                    <Separator />

                    {/* Eligibility */}
                    <div>
                      <h3 className="font-medium text-[#333333] mb-2 flex items-center gap-2">
                        <Info size={16} /> Eligibility Requirements
                      </h3>
                      {isEditingDetails ? (
                        <div className="space-y-2">
                          {(editableContactDetails.eligibility || []).map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm text-[#555555]">{item}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#DC3545] hover:text-[#C82333] h-6 px-1"
                                onClick={() => removeEligibility(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2 pt-2">
                            <Input
                              placeholder="Add new requirement"
                              value={newEligibility}
                              onChange={(e) => setNewEligibility(e.target.value)}
                              className="border-[#CCCCCC] h-9"
                            />
                            <Button
                              onClick={addEligibility}
                              disabled={!newEligibility.trim()}
                              className="bg-[#007BFF] hover:bg-[#0056D2] h-9"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ) : (
                        (editableContactDetails.eligibility && editableContactDetails.eligibility.length > 0) ?
                          <ul className="mt-1 list-disc list-inside text-[#555555] text-sm space-y-1">
                            {editableContactDetails.eligibility.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                          : <p className="text-sm text-gray-500 italic">No eligibility requirements listed.</p>
                      )}
                    </div>

                    <Separator />

                    {/* Hours */}
                    <div>
                      <h3 className="font-medium text-[#333333] mb-2 flex items-center gap-2">
                        <CalendarDays size={16} /> Hours of Operation
                      </h3>
                      {isEditingDetails ? (
                        <div className="space-y-2">
                          {(editableContactDetails.hours || []).map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded gap-2">
                              <span className="text-sm text-[#555555] flex-1">
                                <strong>{item.day}:</strong> {item.hours}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#DC3545] hover:text-[#C82333] h-6 px-1"
                                onClick={() => removeHour(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2 pt-2">
                            <Input
                              placeholder="Day(s)"
                              value={newHourDay}
                              onChange={(e) => setNewHourDay(e.target.value)}
                              className="border-[#CCCCCC] h-9"
                            />
                            <Input
                              placeholder="Hours (e.g., 9am-5pm)"
                              value={newHourTime}
                              onChange={(e) => setNewHourTime(e.target.value)}
                              className="border-[#CCCCCC] h-9"
                            />
                            <Button
                              onClick={addHour}
                              disabled={!newHourDay.trim() || !newHourTime.trim()}
                              className="bg-[#007BFF] hover:bg-[#0056D2] h-9"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ) : (
                        (editableContactDetails.hours && editableContactDetails.hours.length > 0) ?
                          <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[#555555] text-sm">
                            {editableContactDetails.hours.map((item, index) => (
                              <React.Fragment key={index}>
                                <span className="font-medium">{item.day}:</span>
                                <span>{item.hours}</span>
                              </React.Fragment>
                            ))}
                          </div>
                          : <p className="text-sm text-gray-500 italic">No hours listed.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar for Status Update */}
        <div className="space-y-6">
          <Card className="border border-[#E0E0E0] shadow-sm">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-lg font-bold text-[#333333]">Update Resource Status</CardTitle>
              <CardDescription className="text-[#666666]">Share the latest availability</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-3">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-[#333333]">Current Status</Label>
                  <Select value={updateStatus} onValueChange={(value: Resource['status']) => setUpdateStatus(value)}>
                    <SelectTrigger id="status" className="border-[#CCCCCC]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="LIMITED">Limited Availability</SelectItem>
                      <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status-note" className="text-[#333333]">Add Note (Optional)</Label>
                  <Textarea
                    id="status-note"
                    placeholder="Add context for the status change (e.g., 'Only 2 beds left')..."
                    className="h-[100px] border-[#CCCCCC]"
                    value={statusUpdateNote}
                    onChange={(e) => setStatusUpdateNote(e.target.value)}
                    maxLength={1000}
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
                  onClick={handleSubmitStatusUpdate}
                  disabled={isSubmittingStatus}
                >
                  {isSubmittingStatus ? "Submitting..." : "Submit Status Update"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

