import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
export default function PaymentSuccess() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, method, service, transactionId } = location.state || {};
  // Calculate total with GST if amount is provided
  const totalAmount = amount ? (amount * 1.18).toFixed(2) : "0.00";
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Redirect to dashboard based on user role
          const userRole = localStorage.getItem("userRole") || "patient";
          navigate(`/${userRole}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);
  const handleRedirectNow = () => {
    const userRole = localStorage.getItem("userRole") || "patient";
    navigate(`/${userRole}`);
  };
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "card":
        return "💳";
      case "upi":
        return "📱";
      case "netbanking":
        return "🏦";
      case "wallet":
        return "💰";
      default:
        return "💳";
    }
  };
  const getPaymentMethodName = (method) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "upi":
        return "UPI Payment";
      case "netbanking":
        return "Net Banking";
      case "wallet":
        return "Digital Wallet";
      default:
        return "Payment";
    }
  };
  return (
    <div className="page-soft">
      <div className="container-app max-w-2xl">
        <div className="text-center">
          {/* Success Animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto bg-green-100 rounded-full animate-ping opacity-20"></div>
          </div>
          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your payment has been processed successfully
          </p>
          {/* Payment Details Card */}
          <div className="panel p-8 mb-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  ₹{totalAmount}
                </div>
                <p className="text-gray-600">Total Amount Paid</p>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">
                      {service || "Medical Service"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {getPaymentMethodIcon(method)}
                      </span>
                      <span className="font-medium">
                        {getPaymentMethodName(method)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {transactionId || "TXN" + Date.now()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString()} at{" "}
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Next Steps */}
          <div className="panel p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-gray-600">
                    You'll receive a payment confirmation email shortly
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Service Access</p>
                  <p className="text-sm text-gray-600">
                    Your service will be activated within 5-10 minutes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Dashboard Access</p>
                  <p className="text-sm text-gray-600">
                    You can now access your dashboard and manage your account
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleRedirectNow}
              className="btn btn-brand text-lg px-8 py-3"
            >
              Go to Dashboard
            </button>
            <div className="text-sm text-gray-600">
              Redirecting automatically in {countdown} seconds...
            </div>
          </div>
          {/* Additional Info */}
          <div className="mt-12 p-6 bg-blue-50 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                ℹ
              </div>
              <div className="text-left">
                <p className="font-medium text-blue-900 mb-2">Need Help?</p>
                <p className="text-sm text-blue-800">
                  If you have any questions about your payment or need
                  assistance, please contact our support team at
                  support@medicarepro.com or call +91-800-123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
