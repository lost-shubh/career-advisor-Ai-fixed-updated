"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, MapPin, BookOpen, Target, Award, Edit3, Save, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface UserProfileProps {
  userData: any
}

export function UserProfile({ userData }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    full_name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    location: userData.location || "",
    bio: userData.bio || "",
    career_field: userData.careerField || "",
    experience_level: userData.experienceLevel || "beginner",
    skills: userData.skills || [],
    interests: userData.interests || [],
    education: userData.education || "",
    linkedin_url: userData.linkedinUrl || "",
    github_url: userData.githubUrl || "",
  })
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const addSkill = (skill: string) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const addInterest = (interest: string) => {
    if (interest && !profile.interests.includes(interest)) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }))
    }
  }

  const removeInterest = (interestToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((interest) => interest !== interestToRemove),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {profile.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile.full_name || "Your Name"}</CardTitle>
                <CardDescription className="text-base">
                  {profile.career_field || "Career Field"} • {profile.experience_level || "Experience Level"}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {profile.location || "Location"}
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, full_name: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{profile.full_name || "Not specified"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{profile.email || "Not specified"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{profile.phone || "Not specified"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{profile.location || "Not specified"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{profile.bio || "No bio added yet"}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Career Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="career_field">Career Field</Label>
              {isEditing ? (
                <Select
                  value={profile.career_field}
                  onValueChange={(value) => setProfile((prev) => ({ ...prev, career_field: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select career field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical & Healthcare</SelectItem>
                    <SelectItem value="engineering">Engineering & Technology</SelectItem>
                    <SelectItem value="business">Business & Management</SelectItem>
                    <SelectItem value="arts">Arts & Creative</SelectItem>
                    <SelectItem value="science">Science & Research</SelectItem>
                    <SelectItem value="education">Education & Teaching</SelectItem>
                    <SelectItem value="law">Law & Legal</SelectItem>
                    <SelectItem value="finance">Finance & Banking</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">{profile.career_field || "Not specified"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="experience_level">Experience Level</Label>
              {isEditing ? (
                <Select
                  value={profile.experience_level}
                  onValueChange={(value) => setProfile((prev) => ({ ...prev, experience_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">{profile.experience_level || "Not specified"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="education">Education</Label>
              {isEditing ? (
                <Input
                  id="education"
                  value={profile.education}
                  onChange={(e) => setProfile((prev) => ({ ...prev, education: e.target.value }))}
                  placeholder="e.g., B.Tech Computer Science, MBBS"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">{profile.education || "Not specified"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              {isEditing ? (
                <Input
                  id="linkedin_url"
                  value={profile.linkedin_url}
                  onChange={(e) => setProfile((prev) => ({ ...prev, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">{profile.linkedin_url || "Not specified"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              {isEditing ? (
                <Input
                  id="github_url"
                  value={profile.github_url}
                  onChange={(e) => setProfile((prev) => ({ ...prev, github_url: e.target.value }))}
                  placeholder="https://github.com/yourusername"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">{profile.github_url || "Not specified"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    {isEditing && (
                      <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addSkill(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      addSkill(input.value)
                      input.value = ""
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {interest}
                    {isEditing && (
                      <button onClick={() => removeInterest(interest)} className="ml-1 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an interest..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addInterest(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      addInterest(input.value)
                      input.value = ""
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
