"use client"

import { useState } from "react"
import { Bell, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSaveProfile = () => {
    setIsUpdating(true)
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      alert("Profile updated successfully!")
    }, 1000)
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#333333]">Settings</h1>
        <p className="text-[#555555] text-base">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        <Card className="border border-[#E0E0E0] shadow-sm">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-lg font-bold text-[#333333]">Profile</CardTitle>
            <CardDescription className="text-[#666666]">Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#333333]">
                  Full Name
                </Label>
                <Input id="name" defaultValue="Case Manager" className="border-[#CCCCCC]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#333333]">
                  Email
                </Label>
                <Input id="email" type="email" defaultValue="case.manager@example.com" className="border-[#CCCCCC]" />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={isUpdating} className="bg-[#007BFF] hover:bg-[#0056D2]">
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-[#E0E0E0] shadow-sm">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-lg font-bold text-[#333333]">Notifications</CardTitle>
            <CardDescription className="text-[#666666]">Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#666666]" />
                <Label htmlFor="email-notifications" className="font-normal text-[#555555]">
                  Email notifications
                </Label>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#666666]" />
                <Label htmlFor="app-notifications" className="font-normal text-[#555555]">
                  In-app notifications
                </Label>
              </div>
              <Switch id="app-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E0E0E0] shadow-sm">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-lg font-bold text-[#333333]">Privacy</CardTitle>
            <CardDescription className="text-[#666666]">Control your data sharing preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-4">
            <div className="space-y-3">
              <Label className="text-[#333333]">Share anonymous usage data</Label>
              <RadioGroup defaultValue="yes">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="share-yes" className="text-[#007BFF]" />
                  <Label htmlFor="share-yes" className="text-[#555555]">
                    Yes, help improve the platform
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="share-no" className="text-[#007BFF]" />
                  <Label htmlFor="share-no" className="text-[#555555]">
                    No, don't share my data
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E0E0E0] shadow-sm">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-lg font-bold text-[#333333]">Account</CardTitle>
            <CardDescription className="text-[#666666]">Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-4">
            <Button variant="outline" className="text-[#007BFF] border-[#007BFF]">
              Change Password
            </Button>
            <Separator />
            <Button variant="destructive" className="bg-[#DC3545] hover:bg-[#C82333]">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

