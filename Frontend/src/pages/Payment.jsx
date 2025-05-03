import { useState } from "react"
import { CalendarDays, Clock, MapPin, Minus, Plus, Ticket, User } from "lucide-react"
import { load } from "@cashfreepayments/cashfree-js"

export default function CashfreePaymentModal() {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [countryCode, setCountryCode] = useState("+91") // Default to India


  const countryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "Australia" },
    { code: "+971", country: "UAE" },
    { code: "+65", country: "Singapore" },

  ]

  const ticketDetails = {
    eventName: "Night Club Experience",
    date: "April 20, 2025",
    time: "10:00 PM - 4:00 AM",
    location: "Skyline Club, Downtown",
    price: 1500,
    currency: "INR",
    description: "Join us for an unforgettable night with world-class DJs and an amazing atmosphere.",
  }

  const totalAmount = ticketDetails.price * quantity

  const showToast = (title, description) => {
    setToast({ title, description })
    setTimeout(() => setToast(null), 3000)
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "")
      setCustomerDetails((prev) => ({
        ...prev,
        [name]: numericValue,
      }))
    } else {
      setCustomerDetails((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const formatPhoneNumber = () => {

    
    const phone = customerDetails.phone;
    
    // For Indian numbers (+91)
    if (countryCode === "+91") {
      // If it's exactly a 10-digit Indian phone number
      if (phone.length === 10) {
        return "+91" + phone;
      } 
      // Return the number as is (assuming it's already properly formatted)
      return phone;
    } 
    
    // For all international numbers, ensure the + prefix
    return countryCode + phone;
  }

  // Handle payment
  const handlePayment = async () => {
    // Validate form
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      showToast("Error", "Please fill in all customer details")
      return
    }
    
    // Validate phone number - more stringent validation for Indian numbers
    if (countryCode === "+91" && customerDetails.phone.length !== 10) {
      showToast("Error", "Please enter a valid 10-digit Indian phone number")
      return
    } else if (customerDetails.phone.length < 6) {
      showToast("Error", "Please enter a valid phone number")
      return
    }

    try {
      setIsLoading(true)

      // Format the phone number correctly for Cashfree
      const formattedPhone = formatPhoneNumber()

      // Create order using your backend endpoint
      const response = await fetch("http://localhost:5000/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_amount: totalAmount,
          order_currency: ticketDetails.currency,
          customer_details: {
            customer_id: `cust_${Date.now()}`,
            customer_name: customerDetails.name,
            customer_email: customerDetails.email,
            customer_phone: formattedPhone,
          },
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Initialize Cashfree
      const cashfree = await load({
        mode: "sandbox", // Change to 'production' for live
      })

      // Open payment popup
      const result = await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      })

      if (result.error) {
        console.error("Payment failed:", result.error)
        showToast("Payment Failed", result.error.message || "Please try again.")
      } else if (result.paymentDetails) {
        console.log("Payment successful:", result.paymentDetails)
        showToast("Payment Successful", "Your tickets have been booked successfully!")
        // Reset form
        setQuantity(1)
        setCustomerDetails({ name: "", email: "", phone: "" })
      }
    } catch (error) {
      console.error("Error:", error)
      showToast("Error", error.message || "Failed to process payment")
    } finally {
      setIsLoading(false)
    }
  }

  // Button Component
  const Button = ({ onClick, children, variant = "default", size = "default", className = "", ...props }) => {
    const base =
      "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"

    const variants = {
      default: "bg-pink-600 text-white hover:bg-pink-700",
      outline: "border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    }

    return (
      <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
        {children}
      </button>
    )
  }

  // Toast Component
  const Toast = ({ title, description, onClose }) => {
    return (
      <div className="fixed bottom-4 right-4 bg-zinc-800 border border-pink-600 rounded-lg shadow-lg p-4 max-w-md animate-in fade-in slide-in-from-bottom-5 z-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-white">{title}</h3>
            <p className="text-sm text-zinc-300 mt-1">{description}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            ×
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">{ticketDetails.eventName}</h2>
          <p className="text-zinc-400 text-sm mt-1">Purchase your tickets</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Event details */}
          <div className="space-y-2 text-zinc-300">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-pink-500" /> {ticketDetails.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-pink-500" /> {ticketDetails.time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-pink-500" /> {ticketDetails.location}
            </div>
          </div>

          <div className="border-t border-zinc-800 my-4"></div>

          <p className="text-sm text-zinc-400">{ticketDetails.description}</p>

          {/* Ticket quantity selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-pink-500">
              <Ticket className="h-5 w-5" /> <span className="font-medium">Tickets</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-lg text-white">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.min(10, q + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Price summary */}
          <div className="border border-pink-600 rounded-lg p-4 bg-zinc-800">
            <div className="flex justify-between text-zinc-300">
              <span>Price per ticket</span>
              <span>₹{ticketDetails.price}</span>
            </div>
            <div className="flex justify-between font-semibold mt-2 text-white">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {/* Customer details form */}
          <div className="space-y-3 pt-2">
            <h3 className="text-pink-500 font-medium flex items-center gap-2">
              <User className="h-5 w-5" /> Customer Details
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={customerDetails.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full bg-zinc-800 border border-pink-600 focus:border-pink-500 rounded-lg px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <input
                type="email"
                name="email"
                value={customerDetails.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full bg-zinc-800 border border-pink-600 focus:border-pink-500 rounded-lg px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              
              
              <div className="flex w-full rounded-lg overflow-hidden">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-zinc-800 border-y border-l border-pink-600 text-white px-2 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-pink-500 min-w-16 text-center"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="flex-1 bg-zinc-800 border border-pink-600 rounded-r-lg px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>
        </div>

       
        <div className="p-6 border-t border-zinc-800">
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            {isLoading ? "Processing..." : `Pay ₹${totalAmount}`}
          </Button>
        </div>
      </div>

     
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}