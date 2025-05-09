"use client"
import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { CheckIcon } from "lucide-react"

export default function PricingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

 const userEmail = user?.emailAddresses[0]?.emailAddress || ""
  const userName = user?.fullName || ""

  const INCLUDED_FEATURES = [
    "10,000 real-time events per month",
    "10 event categories",
    "Advanced analytics and insights",
    "Priority support",
  ]

  const handlePayment = async () => {
    if (!user) {
      router.push("/sign-in?intent=upgrade")
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Create Razorpay Order
      const res = await fetch('/api/payment/create-razorpay-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          userEmail: userEmail
        }),
      })

      const data = await res.json()
      
      if (!data.orderId) {
        throw new Error('Failed to create Razorpay order')
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: '100000', // ₹1000 in paise
        currency: 'INR',
        name: 'PingDora',
        description: 'Lifetime Access',
        order_id: data.orderId,
        handler: async function (response: any) {
          // Step 3: Handle Success (No webhook verification)
          console.log('Payment successful!', response)
          alert('Payment successful!')
          router.push('/dashboard?success=true')
        },
        prefill: {
          name: user.fullName || '',
          email: userEmail || '',
          contact: ''
        },
        theme: {
          color: '#00a6ff'
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-brand-25 py-24 sm:py-32">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-2xl sm:text-center">
          <Heading className="text-center">Simple no-tricks pricing</Heading>
          <p className="mt-6 text-base/7 text-gray-600 max-w-prose text-center text-pretty">
            We hate subscriptions. And chances are, you do too. That's why we
            offer lifetime access to PingPanda for a one-time payment.
          </p>
        </div>

        <div className="bg-white mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-3xl font-heading font-semibold tracking-tight text-gray-900">
              Lifetime access
            </h3>

            <p className="mt-6 text-base/7 text-gray-600">
              Invest once in PingDora and transform how you monitor your SaaS
              forever. Get instant alerts, track critical metrics and never miss
              a beat in your business growth.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-brand-600">
                What's included
              </h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6">
              {INCLUDED_FEATURES.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <CheckIcon className="h-6 w-5 flex-none text-brand-700" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs py-8">
                <p className="text-base font-semibold text-gray-600">
                  Pay once, own forever
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ₹1000
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    INR
                  </span>
                </p>

                <Button 
                  onClick={handlePayment} 
                  className="mt-6 px-20"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Get PingDora'}
                </Button>

                <p className="mt-6 text-xs leading-5 text-gray-600">
                  Secure payment. Start monitoring in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}