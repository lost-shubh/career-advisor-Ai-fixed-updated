"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Clock, Play, Search, Filter, Video, FileText } from "lucide-react"
import { generateLectures, STREAM_SUBJECTS, type LectureContent } from "@/lib/google-ai"

export default function LecturesPage() {
  const [lectures, setLectures] = useState<LectureContent[]>([])
  const [filteredLectures, setFilteredLectures] = useState<LectureContent[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStream, setSelectedStream] = useState<keyof typeof STREAM_SUBJECTS>("PCB")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  useEffect(() => {
    loadLectures()
  }, [selectedStream])

  useEffect(() => {
    filterLectures()
  }, [lectures, searchQuery, selectedSubject, selectedDifficulty])

  const loadLectures = async () => {
    setLoading(true)
    try {
      // Generate lectures for all subjects in the selected stream
      const subjects = STREAM_SUBJECTS[selectedStream]
      const allLectures: LectureContent[] = []

      for (const subject of subjects) {
        const subjectLectures = await generateLectures(selectedStream, subject)
        allLectures.push(...subjectLectures)
      }

      setLectures(allLectures)
    } catch (error) {
      console.error("Error loading lectures:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterLectures = () => {
    let filtered = lectures

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lecture.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lecture.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Subject filter
    if (selectedSubject !== "all") {
      filtered = filtered.filter((lecture) =>
        lecture.topics.some((topic) => topic.toLowerCase().includes(selectedSubject.toLowerCase())),
      )
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((lecture) => lecture.difficulty === selectedDifficulty)
    }

    setFilteredLectures(filtered)
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Advanced":
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse h-64 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interactive Lectures</h1>
        <p className="text-muted-foreground">Stream-specific lectures tailored to your academic path</p>
      </div>

      {/* Stream Selection and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Select Your Stream & Filter Lectures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={selectedStream}
              onValueChange={(value) => setSelectedStream(value as keyof typeof STREAM_SUBJECTS)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PCB">PCB (Physics, Chemistry, Biology)</SelectItem>
                <SelectItem value="PCM">PCM (Physics, Chemistry, Math)</SelectItem>
                <SelectItem value="Commerce">Commerce</SelectItem>
                <SelectItem value="Arts">Arts & Humanities</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {STREAM_SUBJECTS[selectedStream].map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={loadLectures} disabled={loading}>
              {loading ? "Loading..." : "Refresh Lectures"}
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lectures, topics, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lectures Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {filteredLectures.length} lectures for {selectedStream} stream
          </p>
          <Badge className={getStreamColor(selectedStream)}>{selectedStream} Stream</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLectures.map((lecture) => (
            <Card key={lecture.id} className="card-enhanced hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getDifficultyColor(lecture.difficulty)}>{lecture.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{lecture.duration}</span>
                  </div>
                </div>

                <CardTitle className="text-lg line-clamp-2">{lecture.title}</CardTitle>
                <CardDescription className="line-clamp-3">{lecture.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Topics Covered</p>
                  <div className="flex flex-wrap gap-1">
                    {lecture.topics.slice(0, 3).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {lecture.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{lecture.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Learning Materials</p>
                  <div className="flex flex-wrap gap-1">
                    {lecture.materials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {material.includes("Video") && <Video className="w-3 h-3 mr-1" />}
                        {material.includes("notes") && <FileText className="w-3 h-3 mr-1" />}
                        {material.includes("exercises") && <BookOpen className="w-3 h-3 mr-1" />}
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Play className="w-4 h-4 mr-1" />
                    Start Lecture
                  </Button>
                  <Button variant="outline" size="sm">
                    <BookOpen className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLectures.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No lectures found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or select a different stream.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedSubject("all")
                  setSelectedDifficulty("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stream Information */}
      <Card>
        <CardHeader>
          <CardTitle>About {selectedStream} Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Core Subjects</h4>
              <div className="flex flex-wrap gap-1">
                {STREAM_SUBJECTS[selectedStream].map((subject) => (
                  <Badge key={subject} variant="outline">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Career Opportunities</h4>
              <p className="text-sm text-muted-foreground">
                {selectedStream === "PCB" && "Medical, healthcare, biotechnology, research careers"}
                {selectedStream === "PCM" && "Engineering, technology, research, aviation careers"}
                {selectedStream === "Commerce" && "Business, finance, accounting, management careers"}
                {selectedStream === "Arts" && "Humanities, social sciences, creative, civil services careers"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
