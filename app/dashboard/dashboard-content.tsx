"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PuzzleIcon as Chess, Crown, Gamepad2, Users, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

interface SearchResult {
  id: string;
  user_name: string;
  email: string;
  elo: number;
}

interface User {
  user_name: string;
  email: string;
  isEmailVerified: boolean;
  elo: number;
}

interface Game {
  id: string;
  opponent?: string;
  timeControl?: string;
  status?: string;
  // Add other game properties as needed
}

interface DashboardData {
  user: User;
  friendRequests: any[];
  friendsList: any[];
  games: Game[];
}

interface ProfileData {
  user: User;
  gamesPlayed?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  // Add other profile fields as needed
}

export function DashboardContent() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard')
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState<boolean>(false)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const handleLogout = async () => {
    await logout()
  }

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const response = await fetch(`${baseUrl}/users/`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data: DashboardData = await response.json()
        setDashboardData(data)
      } else {
        console.error('Failed to fetch dashboard data:', response.statusText)
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProfileData = async (userId?: string): Promise<void> => {
    try {
      setIsLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const url = userId ? `${baseUrl}/users?user_id=${userId}` : `${baseUrl}/users/`
      const response = await fetch(url, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data: ProfileData = await response.json()
        setProfileData(data)
        setIsCurrentUserProfile(!userId)
      } else {
        console.error('Failed to fetch profile data:', response.statusText)
      }
    } catch (error) {
      console.error('Profile data fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const showProfile = async (userId?: string) => {
    await fetchProfileData(userId)
    setCurrentView('profile')
  }

  const showDashboard = () => {
    setCurrentView('dashboard')
    setProfileData(null)
  }

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const searchUsers = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const response = await fetch(`${baseUrl}/users/search?partial_user_name=${encodeURIComponent(query)}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data: SearchResult[] = await response.json()
        setSearchResults(data)
      } else {
        console.error('Search failed:', response.statusText)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setSearchTerm(value)

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set new timer for 300ms delay
    debounceTimer.current = setTimeout(() => {
      searchUsers(value)
    }, 300)
  }

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return (
    <>
    { user && (
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Link href="#" className="flex items-center gap-2 font-semibold md:hidden">
          <Chess className="h-6 w-6" />
          <span className="">ChessMaster</span>
        </Link>
        <div className="w-full flex-1 relative">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search User Names ..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px] xl:w-[500px]"
              />
              {isSearching && (
                <div className="absolute right-2.5 top-2.5">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
          </form>
          
          {/* Search Results Dropdown */}
          {searchTerm && searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full md:w-[300px] lg:w-[400px] xl:w-[500px] bg-background border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={result.id || index}
                  className="px-4 py-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  onClick={() => {
                    console.log('Selected user:', result)
                    showProfile(result.id)
                    setSearchTerm('')
                    setSearchResults([])
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{result.user_name}</div>
                      <div className="text-xs text-muted-foreground">{result.email}</div>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {result.elo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* No results message */}
          {searchTerm && !isSearching && searchResults.length === 0 && searchTerm.trim() && (
            <div className="absolute top-full left-0 mt-1 w-full md:w-[300px] lg:w-[400px] xl:w-[500px] bg-background border rounded-lg shadow-lg z-50 p-4">
              <div className="text-sm text-muted-foreground">No users found</div>
            </div>
          )}
        </div>
        <ThemeToggle />
        <Avatar className="h-9 w-9 cursor-pointer" onClick={() => showProfile()}>
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>{dashboardData?.user?.user_name?.charAt(0).toUpperCase() || user?.user_name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </header>
    )}
      

      {/* Profile Component */}
      {currentView === 'profile' && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between mt-4">
            <Button variant="ghost" onClick={showDashboard} className="mb-4">
              ← Back to Dashboard
            </Button>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
            </div>
          ) : profileData ? (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                      <AvatarFallback className="text-2xl">
                        {profileData.user.user_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{profileData.user.user_name}</h2>
                      <p className="text-muted-foreground">{profileData.user.email}</p>
                      {isCurrentUserProfile && (
                        <p className="text-sm text-muted-foreground">
                          Email {profileData.user.isEmailVerified ? '✅ Verified' : '❌ Not Verified'}
                        </p>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{profileData.user.elo}</div>
                      <div className="text-sm text-muted-foreground">Current ELO</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{profileData.gamesPlayed || 0}</div>
                      <div className="text-sm text-muted-foreground">Games Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{profileData.wins || 0}</div>
                      <div className="text-sm text-muted-foreground">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{profileData.losses || 0}</div>
                      <div className="text-sm text-muted-foreground">Losses</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!isCurrentUserProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button>Challenge to Game</Button>
                      <Button variant="outline">Send Friend Request</Button>
                      <Button variant="outline">View Game History</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isCurrentUserProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button variant="outline">Edit Profile</Button>
                      <Button variant="outline">Change Password</Button>
                      <Button variant="outline">Verify Email</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">Failed to load profile data</div>
          )}
        </div>
      )}

      {/* Dashboard Content */}
      {currentView === 'dashboard' && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Create Game</CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">New Online Match</div>
              <p className="text-xs text-muted-foreground">Challenge a friend or find a random opponent.</p>
              <Link href="/game/new-10min">
                <Button className="mt-4 w-full">Create 10-min Game</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Play with Bot</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Challenge AI</div>
              <p className="text-xs text-muted-foreground">Improve your skills against different bot levels.</p>
              <Link href="/game/bot-game-1">
                <Button className="mt-4 w-full bg-transparent" variant="outline">
                  Start Bot Game
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Friend Requests</CardTitle>
              <CardDescription>Pending friend requests from other players.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>ELO</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData?.friendRequests?.length ? (
                      dashboardData.friendRequests.map((request, index) => (
                        <TableRow key={request.id || index}>
                          <TableCell className="font-medium">
                            {request.user_name || request.from_user || `User ${index + 1}`}
                          </TableCell>
                          <TableCell>{request.email || 'N/A'}</TableCell>
                          <TableCell>{request.elo || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm">
                                Accept
                              </Button>
                              <Button variant="outline" size="sm">
                                Decline
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No pending friend requests
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Games</CardTitle>
              <CardDescription>Your ongoing chess matches.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Opponent</TableHead>
                      <TableHead>Time Control</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData?.games?.length ? (
                      dashboardData.games.map((game, index) => (
                        <TableRow key={game.id || index}>
                          <TableCell className="font-medium">
                            {game.opponent || `Game ${index + 1}`}
                          </TableCell>
                          <TableCell>{game.timeControl || 'N/A'}</TableCell>
                          <TableCell>{game.status || 'In Progress'}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/game/${game.id}`}>
                              <Button variant="outline" size="sm">
                                Continue
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No active games
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      )}
    </>
  )
}