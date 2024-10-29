import React from "react";

const Privacy = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-4">
        Last updated: November 30, 2021
      </p>

      <p className="mb-4">
        We collect your name, email, phone number, and address solely for the
        purpose of managing your orders.
      </p>

      <p className="mb-4">
        We are in the business of making your food delicious, not in trading
        your data.
      </p>

      <p className="mb-4">
        We do not sell or share your personal information with any other person
        or company.
      </p>

      <p className="mb-4">
        You can choose to close your account with us, and we will delete all
        your information.
      </p>

      <p className="mb-4">
        Please contact us at{" "}
        <a
          href="mailto:hello@themilletstore.in"
          className="text-blue-600 underline"
        >
          hello@themilletstore.in
        </a>
        . We will be happy to answer any questions you may have.
      </p>
    </div>
  );
};

export default Privacy;
