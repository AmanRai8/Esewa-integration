import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import GitHubCorner from "./components/GitHubCorner";

const App = () => {
  const [formData, setFormData] = useState({
    amount: "",
    tax_amount: "0",
    total_amount: "",
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/paymentsuccess",
    failure_url: "http://localhost:5173/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(false); // For showing message
  const [shake, setShake] = useState({
    amount: false,
    firstName: false,
    lastName: false,
  });

  const secret = "8gBm/:&EnhH.1/q";

  const generateSignature = (total_amount, transaction_uuid, product_code) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  useEffect(() => {
    const { total_amount, transaction_uuid, product_code } = formData;
    if (total_amount) {
      const hashedSignature = generateSignature(
        total_amount,
        transaction_uuid,
        product_code
      );
      setFormData((prev) => ({ ...prev, signature: hashedSignature }));
    }
  }, [formData.total_amount, formData.transaction_uuid]);

  const handleSubmit = (e) => {
    if (!formData.amount || !firstName.trim() || !lastName.trim()) {
      e.preventDefault();
      setError(true);

      setShake({
        amount: !formData.amount,
        firstName: !firstName.trim(),
        lastName: !lastName.trim(),
      });

      setTimeout(
        () => setShake({ amount: false, firstName: false, lastName: false }),
        500
      );
      return;
    }
    setError(false);
  };

  return (
    <div>
      {/* Github corner button */}
      <GitHubCorner
        repoUrl="https://github.com/AmanRai8/Esewa-integration"
        position="left"
      />
      <form
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
        onSubmit={handleSubmit}
      >
        {/* Amount field */}
        <div className={`field ${shake.amount ? "shake" : ""}`}>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={({ target }) =>
              setFormData((prev) => ({
                ...prev,
                amount: target.value,
                total_amount: target.value,
              }))
            }
          />
        </div>

        {/* First name */}
        <div className={`field ${shake.firstName ? "shake" : ""}`}>
          <label htmlFor="fname">First Name</label>
          <input
            type="text"
            id="fname"
            value={firstName}
            onChange={({ target }) => setFirstName(target.value)}
          />
        </div>

        {/* Last name */}
        <div className={`field ${shake.lastName ? "shake" : ""}`}>
          <label htmlFor="lname">Last Name</label>
          <input
            type="text"
            id="lname"
            value={lastName}
            onChange={({ target }) => setLastName(target.value)}
          />
        </div>

        {/* Hidden fields */}
        <input type="hidden" name="tax_amount" value={formData.tax_amount} />
        <input
          type="hidden"
          name="total_amount"
          value={formData.total_amount}
        />
        <input
          type="hidden"
          name="transaction_uuid"
          value={formData.transaction_uuid}
        />
        <input
          type="hidden"
          name="product_code"
          value={formData.product_code}
        />
        <input
          type="hidden"
          name="product_service_charge"
          value={formData.product_service_charge}
        />
        <input
          type="hidden"
          name="product_delivery_charge"
          value={formData.product_delivery_charge}
        />
        <input type="hidden" name="success_url" value={formData.success_url} />
        <input type="hidden" name="failure_url" value={formData.failure_url} />
        <input
          type="hidden"
          name="signed_field_names"
          value={formData.signed_field_names}
        />
        <input type="hidden" name="signature" value={formData.signature} />

        {/* Error message */}
        {error && (
          <div className="error-message">All input fields are required</div>
        )}

        <button type="submit" className="btn">
          Pay via E-Sewa
        </button>
      </form>
    </div>
  );
};

export default App;
