"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import {
  Gift,
  Star,
  Crown,
  Award,
  Sparkles,
  ShoppingCart,
  Clock,
  CheckCircle,
  Zap,
  Target,
  Trophy,
  Heart,
  BookOpen,
  Video,
  Users,
  Calendar,
  FileText,
  Lock,
  Unlock,
} from "lucide-react"

interface EnhancedRewardsStoreProps {
  userData: any
  userPoints: number
  userLevel: number
}

const rewardCategories = {
  premium: {
    name: "Premium Features",
    icon: Crown,
    color: "text-yellow-500",
    description: "Unlock exclusive premium features and tools",
  },
  learning: {
    name: "Learning Resources",
    icon: BookOpen,
    color: "text-blue-500",
    description: "Access premium courses and educational content",
  },
  career: {
    name: "Career Services",
    icon: Target,
    color: "text-green-500",
    description: "Professional career guidance and services",
  },
  cosmetic: {
    name: "Profile & Themes",
    icon: Sparkles,
    color: "text-purple-500",
    description: "Customize your profile and interface",
  },
}

const rewardsInventory = [
  // Premium Features
  {
    id: "premium-resume-templates",
    name: "Premium Resume Templates",
    description: "Access to 50+ professional resume templates with ATS optimization",
    category: "premium",
    cost: 500,
    originalCost: 750,
    discount: 33,
    rarity: "common",
    icon: FileText,
    benefits: ["50+ Templates", "ATS Optimized", "Industry Specific", "Download as PDF"],
    estimatedValue: "₹2,000",
    popularity: 95,
    timesSold: 1247,
  },
  {
    id: "ai-career-coach",
    name: "AI Career Coach (1 Month)",
    description: "Personal AI assistant for career guidance, interview prep, and skill recommendations",
    category: "career",
    cost: 1200,
    originalCost: 1500,
    discount: 20,
    rarity: "rare",
    icon: Zap,
    benefits: ["24/7 AI Support", "Personalized Advice", "Interview Practice", "Skill Roadmaps"],
    estimatedValue: "₹5,000",
    popularity: 88,
    timesSold: 892,
  },
  {
    id: "expert-counseling",
    name: "1-on-1 Expert Career Counseling",
    description: "60-minute session with industry expert for personalized career guidance",
    category: "career",
    cost: 2000,
    originalCost: 2000,
    discount: 0,
    rarity: "legendary",
    icon: Users,
    benefits: ["60 Min Session", "Industry Expert", "Personalized Plan", "Follow-up Support"],
    estimatedValue: "₹8,000",
    popularity: 92,
    timesSold: 456,
  },
  {
    id: "certification-voucher",
    name: "Industry Certification Voucher",
    description: "Free voucher for popular industry certifications (Google, Microsoft, AWS)",
    category: "learning",
    cost: 1500,
    originalCost: 1800,
    discount: 17,
    rarity: "epic",
    icon: Award,
    benefits: ["Multiple Options", "Industry Recognized", "Career Boost", "Lifetime Valid"],
    estimatedValue: "₹15,000",
    popularity: 90,
    timesSold: 678,
  },
  {
    id: "linkedin-optimization",
    name: "LinkedIn Profile Optimization",
    description: "Professional LinkedIn profile review and optimization by experts",
    category: "career",
    cost: 800,
    originalCost: 1000,
    discount: 20,
    rarity: "uncommon",
    icon: Star,
    benefits: ["Expert Review", "Keyword Optimization", "Profile Rewrite", "Networking Tips"],
    estimatedValue: "₹3,500",
    popularity: 85,
    timesSold: 934,
  },
  {
    id: "premium-courses",
    name: "Premium Course Bundle",
    description: "Access to 20+ premium courses in your field for 6 months",
    category: "learning",
    cost: 1800,
    originalCost: 2200,
    discount: 18,
    rarity: "epic",
    icon: Video,
    benefits: ["20+ Courses", "6 Month Access", "Certificates", "Expert Instructors"],
    estimatedValue: "₹12,000",
    popularity: 87,
    timesSold: 567,
  },
  {
    id: "golden-theme",
    name: "Golden Premium Theme",
    description: "Exclusive golden theme with premium animations and effects",
    category: "cosmetic",
    cost: 300,
    originalCost: 400,
    discount: 25,
    rarity: "rare",
    icon: Crown,
    benefits: ["Golden UI", "Premium Animations", "Exclusive Badges", "Priority Support"],
    estimatedValue: "₹1,500",
    popularity: 78,
    timesSold: 1123,
  },
  {
    id: "priority-support",
    name: "Priority Support (3 Months)",
    description: "Get priority customer support with faster response times",
    category: "premium",
    cost: 600,
    originalCost: 750,
    discount: 20,
    rarity: "uncommon",
    icon: Heart,
    benefits: ["Priority Queue", "24/7 Support", "Dedicated Agent", "Faster Resolution"],
    estimatedValue: "₹2,500",
    popularity: 82,
    timesSold: 789,
  },
  {
    id: "skill-assessment-pro",
    name: "Advanced Skill Assessment Suite",
    description: "Comprehensive skill testing with detailed analytics and improvement plans",
    category: "learning",
    cost: 900,
    originalCost: 1100,
    discount: 18,
    rarity: "rare",
    icon: Target,
    benefits: ["50+ Assessments", "Detailed Analytics", "Improvement Plans", "Industry Benchmarks"],
    estimatedValue: "₹4,000",
    popularity: 89,
    timesSold: 723,
  },
  {
    id: "networking-events",
    name: "Exclusive Networking Events Access",
    description: "VIP access to premium networking events and industry meetups",
    category: "career",
    cost: 1000,
    originalCost: 1200,
    discount: 17,
    rarity: "epic",
    icon: Calendar,
    benefits: ["VIP Access", "Industry Leaders", "Networking Opportunities", "Event Materials"],
    estimatedValue: "₹6,000",
    popularity: 91,
    timesSold: 445,
  },
]

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "border-gray-300 bg-gray-50"
    case "uncommon":
      return "border-green-300 bg-green-50"
    case "rare":
      return "border-blue-300 bg-blue-50"
    case "epic":
      return "border-purple-300 bg-purple-50"
    case "legendary":
      return "border-yellow-300 bg-yellow-50"
    default:
      return "border-gray-300 bg-gray-50"
  }
}

const getRarityBadgeColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "bg-gray-500"
    case "uncommon":
      return "bg-green-500"
    case "rare":
      return "bg-blue-500"
    case "epic":
      return "bg-purple-500"
    case "legendary":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

export function EnhancedRewardsStore({ userData, userPoints = 1250, userLevel = 3 }: EnhancedRewardsStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState("popularity")

  const [currentPoints, setCurrentPoints] = useState(userPoints)
  const [purchaseHistory, setPurchaseHistory] = useState<
    Array<{
      id: string
      name: string
      cost: number
      date: Date
      category: string
    }>
  >([])

  const filteredRewards = rewardsInventory
    .filter((reward) => selectedCategory === "all" || reward.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.cost - b.cost
        case "price-high":
          return b.cost - a.cost
        case "popularity":
          return b.popularity - a.popularity
        case "discount":
          return b.discount - a.discount
        default:
          return b.popularity - a.popularity
      }
    })

  const handlePurchase = async (reward: (typeof rewardsInventory)[0]) => {
    if (currentPoints < reward.cost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.cost - currentPoints} more points to purchase this item.`,
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCurrentPoints((prev) => prev - reward.cost)
      setPurchasedItems((prev) => new Set([...prev, reward.id]))
      setPurchaseHistory((prev) => [
        ...prev,
        {
          id: reward.id,
          name: reward.name,
          cost: reward.cost,
          date: new Date(),
          category: reward.category,
        },
      ])

      toast({
        title: "Purchase Successful!",
        description: `You've successfully purchased ${reward.name}. Check your profile for access.`,
      })
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const addToCart = (rewardId: string) => {
    setCart((prev) => {
      const newCart = new Set(prev)
      if (newCart.has(rewardId)) {
        newCart.delete(rewardId)
      } else {
        newCart.add(rewardId)
      }
      return newCart
    })
  }

  const getTotalCartCost = () => {
    return Array.from(cart).reduce((total, rewardId) => {
      const reward = rewardsInventory.find((r) => r.id === rewardId)
      return total + (reward?.cost || 0)
    }, 0)
  }

  const purchaseCart = async () => {
    const totalCost = getTotalCartCost()
    if (currentPoints < totalCost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${totalCost - currentPoints} more points to purchase all cart items.`,
        variant: "destructive",
      })
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setCurrentPoints((prev) => prev - totalCost)
      setPurchasedItems((prev) => new Set([...prev, ...cart]))

      const cartItems = Array.from(cart).map((id) => {
        const reward = rewardsInventory.find((r) => r.id === id)!
        return {
          id: reward.id,
          name: reward.name,
          cost: reward.cost,
          date: new Date(),
          category: reward.category,
        }
      })

      setPurchaseHistory((prev) => [...prev, ...cartItems])
      setCart(new Set())

      toast({
        title: "Cart Purchase Successful!",
        description: `You've purchased ${cartItems.length} items. Check your profile for access.`,
      })
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Gift className="w-7 h-7 text-yellow-600" />
                Enhanced Rewards Store
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Redeem your points for premium features, courses, and career services
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-yellow-600">
                <Star className="w-6 h-6" />
                {currentPoints.toLocaleString()}
              </div>
              <p className="text-sm text-yellow-600">Available Points</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="cart" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Cart ({cart.size})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Purchase History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          {/* Filters and Sort */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Items
                  </Button>
                  {Object.entries(rewardCategories).map(([key, category]) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={key}
                        variant={selectedCategory === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(key)}
                        className="flex items-center gap-1"
                      >
                        <Icon className="w-4 h-4" />
                        {category.name}
                      </Button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Highest Discount</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => {
              const Icon = reward.icon
              const categoryInfo = rewardCategories[reward.category as keyof typeof rewardCategories]
              const CategoryIcon = categoryInfo.icon
              const canAfford = currentPoints >= reward.cost
              const isPurchased = purchasedItems.has(reward.id)
              const inCart = cart.has(reward.id)

              return (
                <Card
                  key={reward.id}
                  className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${getRarityColor(reward.rarity)} ${!canAfford && !isPurchased ? "opacity-75" : ""}`}
                >
                  {/* Rarity Badge */}
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${getRarityBadgeColor(reward.rarity)}`}
                  >
                    {reward.rarity.toUpperCase()}
                  </div>

                  {/* Discount Badge */}
                  {reward.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{reward.discount}%
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-lg bg-white/80">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{reward.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryIcon className={`w-4 h-4 ${categoryInfo.color}`} />
                          <Badge variant="outline" className="text-xs">
                            {categoryInfo.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{reward.description}</p>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">What's Included:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {reward.benefits.slice(0, 4).map((benefit, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="truncate">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {reward.popularity}% liked
                      </span>
                      <span>{reward.timesSold} sold</span>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">{reward.cost}</span>
                          <Star className="w-4 h-4 text-yellow-500" />
                          {reward.originalCost > reward.cost && (
                            <span className="text-sm text-muted-foreground line-through">{reward.originalCost}</span>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Worth {reward.estimatedValue}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {isPurchased ? (
                        <Button disabled className="flex-1">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Owned
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => handlePurchase(reward)}
                            disabled={!canAfford}
                            className="flex-1"
                            variant={canAfford ? "default" : "secondary"}
                          >
                            {canAfford ? (
                              <>
                                <Unlock className="w-4 h-4 mr-2" />
                                Buy Now
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Need {reward.cost - currentPoints} more
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCart(reward.id)}
                            className={inCart ? "bg-primary/10" : ""}
                          >
                            {inCart ? <CheckCircle className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="cart" className="space-y-6">
          {cart.size > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Shopping Cart ({cart.size} items)
                  </CardTitle>
                  <CardDescription>
                    Total Cost: {getTotalCartCost()} points • You have {currentPoints} points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(cart).map((rewardId) => {
                      const reward = rewardsInventory.find((r) => r.id === rewardId)!
                      const Icon = reward.icon
                      return (
                        <div key={rewardId} className="flex items-center gap-4 p-4 border rounded-lg">
                          <Icon className="w-8 h-8 text-primary" />
                          <div className="flex-1">
                            <h4 className="font-medium">{reward.name}</h4>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{reward.cost} pts</div>
                            <Button variant="outline" size="sm" onClick={() => addToCart(rewardId)} className="mt-1">
                              Remove
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Total: {getTotalCartCost()} points</span>
                      <Badge variant={currentPoints >= getTotalCartCost() ? "default" : "destructive"}>
                        {currentPoints >= getTotalCartCost() ? "Can Afford" : "Insufficient Points"}
                      </Badge>
                    </div>
                    <Button
                      onClick={purchaseCart}
                      disabled={currentPoints < getTotalCartCost()}
                      className="w-full"
                      size="lg"
                    >
                      Purchase All Items
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground">Add items from the store to get started</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {purchaseHistory.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Purchase History
                </CardTitle>
                <CardDescription>
                  Total Spent: {purchaseHistory.reduce((sum, item) => sum + item.cost, 0)} points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {purchaseHistory.map((purchase, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{purchase.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {purchase.date.toLocaleDateString()} •{" "}
                          {rewardCategories[purchase.category as keyof typeof rewardCategories]?.name}
                        </p>
                      </div>
                      <Badge variant="outline">{purchase.cost} pts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                <p className="text-muted-foreground">Your purchase history will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
