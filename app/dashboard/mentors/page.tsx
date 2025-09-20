"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Star, Users, Search, Filter, Calendar, Clock, Globe } from "lucide-react"
import Link from "next/link"
import { MENTORS, type Mentor } from "@/lib/mentor-data"

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>(MENTORS)
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>(MENTORS)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")
  const [selectedStream, setSelectedStream] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")

  useEffect(() => {
    filterMentors()
  }, [mentors, searchQuery, selectedSpecialization, selectedStream, priceRange, ratingFilter, availabilityFilter])

  const filterMentors = () => {
    let filtered = mentors

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.specialization.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
          mentor.expertise.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Stream filter
    if (selectedStream !== "all") {
      filtered = filtered.filter((mentor) => mentor.streams.includes(selectedStream as any))
    }

    // Specialization filter
    if (selectedSpecialization !== "all") {
      filtered = filtered.filter((mentor) =>
        mentor.specialization.some((spec) => spec.toLowerCase().includes(selectedSpecialization.toLowerCase())),
      )
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter((mentor) => {
        const rate = Number.parseInt(mentor.price.replace(/[^\d]/g, ""))
        switch (priceRange) {
          case "budget":
            return rate < 1500
          case "mid":
            return rate >= 1500 && rate < 2000
          case "premium":
            return rate >= 2000
          default:
            return true
        }
      })
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = Number.parseFloat(ratingFilter)
      filtered = filtered.filter((mentor) => mentor.rating >= minRating)
    }

    // Availability filter
    if (availabilityFilter !== "all") {
      filtered = filtered.filter((mentor) => mentor.availability === availabilityFilter)
    }

    setFilteredMentors(filtered)
  }

  const getSpecializations = () => {
    const specs = new Set<string>()
    mentors.forEach((mentor) => {
      mentor.specialization.forEach((spec) => specs.add(spec))
    })
    return Array.from(specs)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Busy":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Offline":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStreamColor = (stream: string) => {
    switch (stream) {
      case "PCB":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "PCM":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Commerce":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "Arts":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Your Mentor</h1>
        <p className="text-muted-foreground">Connect with industry experts to accelerate your career growth</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter Mentors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select value={selectedStream} onValueChange={setSelectedStream}>
              <SelectTrigger>
                <SelectValue placeholder="Stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Streams</SelectItem>
                <SelectItem value="PCB">PCB</SelectItem>
                <SelectItem value="PCM">PCM</SelectItem>
                <SelectItem value="Commerce">Commerce</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger>
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {getSpecializations().map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Budget (&lt; ₹1,500)</SelectItem>
                <SelectItem value="mid">Mid-range (₹1,500-2,000)</SelectItem>
                <SelectItem value="premium">Premium (₹2,000+)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Busy">Busy</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredMentors.length} of {mentors.length} mentors
        </p>
      </div>

      {/* Mentors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="card-enhanced hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={mentor.photo || "/placeholder.svg"} alt={mentor.name} />
                  <AvatarFallback className="text-lg">
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">{mentor.name}</h3>
                    <Badge className={getAvailabilityColor(mentor.availability)} variant="secondary">
                      {mentor.availability}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{mentor.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{mentor.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{mentor.reviews} reviews</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{mentor.experience} experience</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{mentor.bio}</p>

              <div>
                <p className="text-sm font-medium mb-2">Streams</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.streams.map((stream, index) => (
                    <Badge key={index} className={getStreamColor(stream)} variant="outline">
                      {stream}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Specializations</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.specialization.slice(0, 3).map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {mentor.specialization.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{mentor.specialization.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Languages</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-lg font-bold">{mentor.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/mentors/${mentor.id}`}>View Profile</Link>
                  </Button>
                  <Button size="sm" asChild disabled={mentor.availability !== "Available"}>
                    <Link href={`/dashboard/bookings/new?mentor=${mentor.id}`}>
                      <Calendar className="w-4 h-4 mr-1" />
                      Book Session
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No mentors found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more mentors.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedSpecialization("all")
                setSelectedStream("all")
                setPriceRange("all")
                setRatingFilter("all")
                setAvailabilityFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
