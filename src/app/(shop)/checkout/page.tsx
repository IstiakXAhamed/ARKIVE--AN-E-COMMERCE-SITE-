"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Truck, CreditCard, MapPin, CheckCircle, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/sonner"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/stores/cartStore"

interface Address {
  id: string
  name: string
  phone: string
  address: string
  city: string
  district: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  name: string
  icon: string
  enabled: boolean
  description?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, totalPrice, clearCart } = useCartStore()
  
  const [step, setStep] = useState<"address" | "payment" | "review">("address")
  const [isLoading, setIsLoading] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("cod")
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  
  const shippingCost = totalPrice() > 2000 ? 0 : 60
  const total = totalPrice() + shippingCost - discount

  useEffect(() => {
    if (session?.user) {
      fetchAddresses()
    }
  }, [session])

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/user/addresses")
      const data = await response.json()
      setAddresses(data.addresses || [])
      const defaultAddress = data.addresses?.find((a: Address) => a.isDefault)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id)
      }
    } catch (error) {
      console.error("Failed to load addresses")
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    
    try {
      const response = await fetch(`/api/coupons/validate?code=${couponCode}&total=${totalPrice()}`)
      const data = await response.json()
      
      if (data.valid) {
        setDiscount(data.discount)
        toast.success(`Coupon applied! You saved ${formatPrice(data.discount)}`)
      } else {
        toast.error(data.error || "Invalid coupon code")
      }
    } catch (error) {
      toast.error("Failed to apply coupon")
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress,
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variantInfo: item.variant ? JSON.stringify(item.variant) : null,
          })),
          subtotal: totalPrice(),
          shippingCost,
          discount,
          total,
          couponCode: discount > 0 ? couponCode : null,
          paymentMethod,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Order placed successfully!")
        clearCart()
        router.push(`/account/orders/${data.order.id}`)
      } else {
        toast.error("Failed to place order")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <Link href="/shop">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`flex items-center gap-2 ${step === "address" ? "text-emerald-600" : "text-gray-500"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "address" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <MapPin className="h-4 w-4" />
            </div>
            <span className="font-medium">Address</span>
          </div>
          <ChevronRight className="h-5 w-5 mx-4 text-gray-300" />
          <div className={`flex items-center gap-2 ${step === "payment" ? "text-emerald-600" : "text-gray-500"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="font-medium">Payment</span>
          </div>
          <ChevronRight className="h-5 w-5 mx-4 text-gray-300" />
          <div className={`flex items-center gap-2 ${step === "review" ? "text-emerald-600" : "text-gray-500"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "review" ? "bg-emerald-100" : "bg-gray-100"}`}>
              <CheckCircle className="h-4 w-4" />
            </div>
            <span className="font-medium">Review</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Step */}
          {step === "address" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No saved addresses</p>
                    <Link href="/account/addresses/new">
                      <Button>Add New Address</Button>
                    </Link>
                  </div>
                ) : (
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-3 border rounded-lg p-4">
                        <RadioGroupItem value={address.id} id={address.id} />
                        <div className="flex-1">
                          <Label htmlFor={address.id} className="font-medium">
                            {address.name}
                            {address.isDefault && (
                              <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.address}, {address.city}, {address.district}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                <div className="flex justify-between pt-4">
                  <Link href="/account/addresses/new">
                    <Button variant="outline">Add New Address</Button>
                  </Link>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => selectedAddress && setStep("payment")}
                    disabled={!selectedAddress}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when you receive your order</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="bkash" id="bkash" />
                    <Label htmlFor="bkash" className="flex-1">
                      <div className="font-medium">bKash</div>
                      <div className="text-sm text-gray-500">Pay via bKash mobile banking</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="nagad" id="nagad" />
                    <Label htmlFor="nagad" className="flex-1">
                      <div className="font-medium">Nagad</div>
                      <div className="text-sm text-gray-500">Pay via Nagad mobile banking</div>
                    </Label>
                  </div>
                </RadioGroup>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep("address")}>
                    Back
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setStep("review")}
                  >
                    Review Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Step */}
          {step === "review" && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      {item.variant && (
                        <p className="text-sm text-gray-500">
                          {item.variant.size} {item.variant.color}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep("payment")}>
                    Back
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      `Place Order - ${formatPrice(total)}`
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-xl text-emerald-600">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Coupon Code */}
              <div className="pt-4">
                <Label htmlFor="coupon">Promo Code</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="coupon"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 pt-4">
                <Truck className="h-4 w-4" />
                {totalPrice() > 2000 ? (
                  <span>Free shipping applied!</span>
                ) : (
                  <span>Add {formatPrice(2000 - totalPrice())} more for free shipping</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
