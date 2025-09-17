import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas"; // Import the library
import "./App.css";

// InputField component (no changes)
const InputField = ({ label, value, onChange, placeholder, icon }) => (
  <div className="input-group">
    <label>
      {icon} {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

// --- Main App Component ---
function App() {
  const [billAmount, setBillAmount] = useState("1000");
  const [discount, setDiscount] = useState("10");
  const [tax, setTax] = useState("18");
  const [tip, setTip] = useState("5");
  const [splitCount, setSplitCount] = useState("2");

  const [receipt, setReceipt] = useState({
    base: 0,
    discountPercent: 0,
    discountValue: 0,
    subtotal: 0,
    taxPercent: 0,
    taxValue: 0,
    tipPercent: 0,
    tipValue: 0,
    total: 0,
    split: 1,
    perPerson: 0,
  });

  // Create a ref to attach to the receipt DOM element
  const receiptRef = useRef();

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Calculation logic (no changes)
  useEffect(() => {
    const numBillAmount = parseFloat(billAmount) || 0;
    const numDiscount = parseFloat(discount) || 0;
    const numTax = parseFloat(tax) || 0;
    const numTip = parseFloat(tip) || 0;
    const numSplitCount = parseInt(splitCount) || 1;

    if (
      numBillAmount < 0 ||
      numDiscount < 0 ||
      numTax < 0 ||
      numTip < 0 ||
      numSplitCount < 1
    ) {
      return;
    }

    const discountValue = (numBillAmount * numDiscount) / 100;
    const subtotal = numBillAmount - discountValue;
    const taxValue = (subtotal * numTax) / 100;
    const billAfterTax = subtotal + taxValue;
    const tipValue = (billAfterTax * numTip) / 100;
    const total = billAfterTax + tipValue;
    const perPerson = total / numSplitCount;

    setReceipt({
      base: numBillAmount,
      discountPercent: numDiscount,
      discountValue: discountValue,
      subtotal: subtotal,
      taxPercent: numTax,
      taxValue: taxValue,
      tipPercent: numTip,
      tipValue: tipValue,
      total: total,
      split: numSplitCount,
      perPerson: perPerson,
    });
  }, [billAmount, discount, tax, tip, splitCount]);

  // --- Download Handler ---
  const handleDownload = () => {
    if (!receiptRef.current) return;

    html2canvas(receiptRef.current, {
      // Use a higher scale for better image quality
      scale: 2,
    }).then((canvas) => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "bill-receipt.png";
      link.click();
    });
  };

  return (
    <div className="app-container">
      <div className="controls-card">
        <h2>Bill Details</h2>
        <div className="inputs-section">
          <InputField
            label="Bill Amount"
            icon="💵"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="1000"
          />
          <InputField
            label="Discount (%)"
            icon="🏷️"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="10"
          />
          <InputField
            label="Tax/GST (%)"
            icon="🧾"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            placeholder="18"
          />
          <InputField
            label="Tip (%)"
            icon="❤️"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            placeholder="5"
          />
          <InputField
            label="Split Between"
            icon="👥"
            value={splitCount}
            onChange={(e) => setSplitCount(e.target.value)}
            placeholder="2"
          />
        </div>
        <button className="download-button" onClick={handleDownload}>
          Download Bill
        </button>
      </div>

      {/* The Receipt - now with a ref */}
      <div className="receipt" ref={receiptRef}>
        <div className="receipt-header">
          <h3>Invoice / Bill</h3>
          <p>Date: {currentDate}</p>
        </div>

        <div className="receipt-body">
          <div className="line-item">
            <span>Base Amount</span>
            <span>₹{receipt.base.toFixed(2)}</span>
          </div>
          {receipt.discountValue > 0 && (
            <div className="line-item">
              <span>Discount ({receipt.discountPercent}%)</span>
              <span>- ₹{receipt.discountValue.toFixed(2)}</span>
            </div>
          )}

          <div className="line-item subtotal">
            <span>Subtotal</span>
            <span>₹{receipt.subtotal.toFixed(2)}</span>
          </div>

          {receipt.taxValue > 0 && (
            <div className="line-item">
              <span>GST ({receipt.taxPercent}%)</span>
              <span>+ ₹{receipt.taxValue.toFixed(2)}</span>
            </div>
          )}
          {receipt.tipValue > 0 && (
            <div className="line-item">
              <span>Tip ({receipt.tipPercent}%)</span>
              <span>+ ₹{receipt.tipValue.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="receipt-total">
          <div className="line-item total">
            <span>TOTAL AMOUNT</span>
            <span>₹{receipt.total.toFixed(2)}</span>
          </div>
        </div>

        {receipt.split > 1 && (
          <div className="receipt-footer">
            <p>Split between {receipt.split} people</p>
            <p className="per-person-amount">
              ₹{receipt.perPerson.toFixed(2)} per person
            </p>
          </div>
        )}

        <div className="thank-you-note">
          <p>Thank You!</p>
        </div>
      </div>
    </div>
  );
}

export default App;
