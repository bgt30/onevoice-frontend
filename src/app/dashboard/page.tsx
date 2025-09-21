"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Plus, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { VideoCard } from "@/components/dashboard/video-card"
import { DashboardStatsComponent } from "@/components/dashboard/dashboard-stats"
import { EmptyState } from "@/components/dashboard/empty-state"
import { mockVideoProjects, mockDashboardStats } from "@/lib/mock-data"
import { ViewMode, SortOption, FilterStatus } from "@/types/api"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
  const [sortBy, setSortBy] = React.useState<SortOption>("dateCreated")
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all")

  // Filter and sort videos
  const filteredAndSortedVideos = React.useMemo(() => {
    let filtered = mockVideoProjects

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(video => video.status === filterStatus)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "duration":
          return b.duration - a.duration
        case "dateCreated":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [searchQuery, filterStatus, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-h1 text-black">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage your video dubbing projects
              </p>
            </div>
            <Button asChild size="lg" className="group relative px-8 py-3 bg-black text-white hover:bg-gray-900 transition-all duration-200 shadow-sm hover:shadow-md">
              <Link href="/#upload-section" className="flex items-center gap-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-200">
                  <Plus className="h-3 w-3 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-semibold tracking-tight">Create Project</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <DashboardStatsComponent stats={mockDashboardStats} />
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters and View Controls */}
            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
                <option value="draft">Draft</option>
              </Select>

              {/* Sort */}
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="dateCreated">Date Created</option>
                <option value="title">Title</option>
                <option value="duration">Duration</option>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-r-none border-r",
                    viewMode === "grid" && "bg-gray-100"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-l-none",
                    viewMode === "list" && "bg-gray-100"
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {filteredAndSortedVideos.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {filteredAndSortedVideos.length} video{filteredAndSortedVideos.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Video Grid/List */}
        {filteredAndSortedVideos.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}
          >
            {filteredAndSortedVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
