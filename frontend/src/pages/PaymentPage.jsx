import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/api.js";
export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Get payment amount from location state or use default
  const amount = location.state?.amount || 500;
  const service = location.state?.service || "Medical Consultation";
  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: "📱",
      description: "Google Pay, PhonePe, Paytm, BHIM",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: "🏦",
      description: "All major banks supported",
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: "💰",
      description: "Paytm, PhonePe, Amazon Pay",
    },
  ];
  const handleCardInput = (field, value) => {
    let formattedValue = value;
    if (field === "number") {
      // Format card number with spaces
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19)
        formattedValue = formattedValue.slice(0, 19);
    } else if (field === "expiry") {
      // Format expiry date MM/YY
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length >= 2) {
        formattedValue =
          formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
      }
    } else if (field === "cvv") {
      // Limit CVV to 3-4 digits
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }
    setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));
  };
  const validateCardDetails = () => {
    const { number, expiry, cvv, name } = cardDetails;
    // Basic card number validation (Luhn algorithm would be better)
    if (number.replace(/\s/g, "").length < 13) {
      alert("Please enter a valid card number");
      return false;
    }
    // Expiry date validation
    const [month, year] = expiry.split("/");
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      alert("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      alert("Card has expired");
      return false;
    }
    // CVV validation
    if (cvv.length < 3) {
      alert("Please enter a valid CVV");
      return false;
    }
    // Name validation
    if (name.trim().length < 2) {
      alert("Please enter the cardholder name");
      return false;
    }
    return true;
  };
  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }
    if (selectedMethod === "card") {
      if (!validateCardDetails()) {
        return;
      }
    }
    if (selectedMethod === "upi") {
      if (!upiId) {
        alert("Please enter your UPI ID");
        return;
      }
      // Basic UPI ID validation
      if (!upiId.includes("@") || upiId.length < 5) {
        alert("Please enter a valid UPI ID (e.g., yourname@paytm)");
        return;
      }
    }
    setIsProcessing(true);
    try {
      // If we have an appointmentId, process payment through backend
      if (location.state?.appointmentId) {
        const response = await api.post(
          `/appointments/${location.state.appointmentId}/pay`,
          {
            paymentMethod: selectedMethod,
            amount: amount,
            service: service,
          }
        );
        const {
          transactionId,
          amount: paidAmount,
          paymentMethod,
        } = response.data;
        setIsProcessing(false);
        navigate("/payment-success", {
          state: {
            amount: paidAmount,
            method: paymentMethod,
            service,
            transactionId,
          },
        });
      } else {
        // For standalone payments (no appointment), simulate processing
        setTimeout(() => {
          setIsProcessing(false);
          navigate("/payment-success", {
            state: {
              amount,
              method: selectedMethod,
              service,
              transactionId: "TXN" + Date.now(),
            },
          });
        }, 2000);
      }
    } catch (error) {
      setIsProcessing(false);
      console.error("Payment error:", error);
      alert(
        error.response?.data?.message || "Payment failed. Please try again."
      );
    }
  };
  return (
    <div className="page-soft">
      <div className="container-app max-w-4xl">
        <section className="hero mb-8">
          <div className="text-sm opacity-90">Secure Payment</div>
          <div className="text-2xl font-bold mt-1">Complete Your Payment</div>
          <p className="mt-2 text-white/80">
            Choose your preferred payment method to proceed with the
            transaction.
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Summary */}
          <div className="panel p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">{service}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">₹{amount}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">GST (18%)</span>
                <span className="font-medium">
                  ₹{(amount * 0.18).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary">
                  ₹{(amount * 1.18).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {/* Payment Methods */}
          <div className="space-y-6">
            <div className="panel p-6">
              <h3 className="text-lg font-semibold mb-4">
                Select Payment Method
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-600">
                          {method.description}
                        </div>
                      </div>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
            {/* Card Details Form */}
            {selectedMethod === "card" && (
              <div className="panel p-6">
                <h3 className="text-lg font-semibold mb-4">Card Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) =>
                        handleCardInput("number", e.target.value)
                      }
                      className="input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          handleCardInput("expiry", e.target.value)
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInput("cvv", e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) =>
                        setCardDetails((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="input"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* UPI Details Form */}
            {selectedMethod === "upi" && (
              <div className="panel p-6">
                <h3 className="text-lg font-semibold mb-4">UPI Details</h3>
                <div>
                  <label className="label">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="input"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Enter your UPI ID to receive payment request
                  </p>
                </div>
              </div>
            )}
            {/* Other Payment Methods Info */}
            {(selectedMethod === "netbanking" ||
              selectedMethod === "wallet") && (
              <div className="panel p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedMethod === "netbanking"
                    ? "Net Banking"
                    : "Digital Wallet"}
                </h3>
                <p className="text-gray-600">
                  {selectedMethod === "netbanking"
                    ? "You will be redirected to your bank's secure payment gateway to complete the transaction."
                    : "You will be redirected to your digital wallet app to complete the payment."}
                </p>
              </div>
            )}
            {/* Payment Button */}
            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={isProcessing || !selectedMethod}
                className="w-full btn btn-brand text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ₹${(amount * 1.18).toFixed(2)}`
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
