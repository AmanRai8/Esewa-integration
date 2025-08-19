import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const dataQuery = search.get("data");
  const [data, setData] = useState({});

  useEffect(() => {
    const resData = atob(dataQuery);
    const resObject = JSON.parse(resData);
    console.log(resObject);

    setData(resObject);
  }, [search]);

  return (
    <div className="payment-container">
      <img src="/check.png" alt="Payment Success" />
      <p className="price">Rs. {data.total_amount}</p>
      <p className="status">Payment Successful</p>
    </div>
  );
};

export default PaymentSuccess;
