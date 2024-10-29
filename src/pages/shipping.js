import React from "react";

const Shipping = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shipping & Returns</h1>
      <p className="text-sm text-gray-600 mb-4">
        Last updated: November 30, 2021
      </p>

      <p className="mb-4">
        We will try to deliver your order within 2 business days.
      </p>

      <p className="mb-4">
        In case of any delay due to unforeseeable issues, we will cancel your
        order and issue a refund if you wish.
      </p>

      <p className="mb-4">
        A shipping charge will apply if the order value is less than a specified
        amount.
      </p>

      <p className="mb-4">
        If you are not satisfied with the products, we will be happy to offer a
        refund or replacement.
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

export default Shipping;
