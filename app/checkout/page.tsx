"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { getAddresses, createAddress, checkout } from "@/lib/api";
import { formatBDT } from "@/lib/utils";
import type { Address, ApiError } from "@/types";

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery" },
//   { value: "bkash", label: "bKash" },
//   { value: "nagad", label: "Nagad" },
//   { value: "card", label: "Credit / Debit Card" },
//   { value: "bank_transfer", label: "Bank Transfer" },
];

type AddressFormData = Omit<Address, "id" | "user_id" | "created_at" | "updated_at">;

const EMPTY_ADDR_FORM: AddressFormData = {
  label: "",
  recipient_name: "",
  phone: "",
  address_line_1: "",
  address_line_2: null,
  city: "",
  district: null,
  postal_code: null,
  is_default: false,
};

export default function CheckoutPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const { items, subtotal, discountAmount, total, isLoading: cartLoading } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [addrForm, setAddrForm] = useState<AddressFormData>(EMPTY_ADDR_FORM);
  const [addrSaving, setAddrSaving] = useState(false);
  const [addrError, setAddrError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");
  const [redeemPoints, setRedeemPoints] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setAddrLoading(true);
    getAddresses()
      .then((addrs) => {
        setAddresses(addrs);
        const def = addrs.find((a) => a.is_default) ?? addrs[0];
        if (def) setSelectedAddressId(def.id);
      })
      .catch(() => {})
      .finally(() => setAddrLoading(false));
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-river-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    setAddrError("");
    setAddrSaving(true);
    try {
      const created = await createAddress(addrForm);
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowNewAddr(false);
      setAddrForm(EMPTY_ADDR_FORM);
    } catch (err: unknown) {
      setAddrError((err as ApiError).message ?? "Failed to save address.");
    } finally {
      setAddrSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAddressId) {
      setSubmitError("Please select a delivery address.");
      return;
    }
    if (items.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      const order = await checkout({
        address_id: selectedAddressId,
        payment_method: paymentMethod,
        notes: notes.trim() || null,
        redeem_points: redeemPoints,
      });
      router.push(`/orders/${order.id}`);
    } catch (err: unknown) {
      setSubmitError((err as ApiError).message ?? "Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Delivery Address</h2>
                {!showNewAddr && (
                  <button
                    type="button"
                    onClick={() => setShowNewAddr(true)}
                    className="text-sm text-river-blue hover:underline transition-colors"
                  >
                    + New Address
                  </button>
                )}
              </div>

              {addrLoading ? (
                <div className="flex items-center justify-center min-h-[60px]">
                  <div className="w-6 h-6 border-4 border-river-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {addresses.map((addr) => (
                    <label key={addr.id} className={`flex gap-3 border rounded-xl p-3 cursor-pointer transition-colors ${selectedAddressId === addr.id ? "border-river-blue bg-river-blue/5" : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"}`}>
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-0.5 accent-river-blue"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{addr.label} — {addr.recipient_name}</p>
                        <p className="text-gray-500 dark:text-gray-400">{addr.phone}</p>
                        <p className="text-gray-500 dark:text-gray-400">{addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ""}, {addr.city}{addr.district ? `, ${addr.district}` : ""}</p>
                      </div>
                    </label>
                  ))}
                  {addresses.length === 0 && !showNewAddr && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">No addresses saved. Please add one.</p>
                  )}
                </div>
              )}

              {showNewAddr && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">New Address</h3>
                  {addrError && <p className="text-xs text-red-600">{addrError}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(
                      [
                        ["Label", "label", "text", "Home / Work"],
                        ["Recipient Name", "recipient_name", "text", ""],
                        ["Phone", "phone", "tel", ""],
                        ["Address Line 1", "address_line_1", "text", ""],
                        ["City", "city", "text", ""],
                        ["District", "district", "text", ""],
                      ] as [string, keyof AddressFormData, string, string][]
                    ).map(([lbl, field, type, ph]) => (
                      <div key={field} className={field === "address_line_1" ? "sm:col-span-2" : ""}>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">{lbl}</label>
                        <input
                          type={type}
                          placeholder={ph}
                          value={(addrForm[field] as string) ?? ""}
                          onChange={(e) => setAddrForm((p) => ({ ...p, [field]: e.target.value || null }))}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-river-blue focus:ring-2 focus:ring-river-blue/20 bg-white dark:bg-gray-700 text-foreground"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      disabled={addrSaving}
                      className="bg-river-blue text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-river-blue/90 disabled:opacity-60 transition-colors"
                    >
                      {addrSaving ? "Saving…" : "Save Address"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowNewAddr(false); setAddrForm(EMPTY_ADDR_FORM); setAddrError(""); }}
                      className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Method</h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.value}
                    className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-colors ${paymentMethod === pm.value ? "border-river-blue bg-river-blue/5" : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"}`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={pm.value}
                      checked={paymentMethod === pm.value}
                      onChange={() => setPaymentMethod(pm.value)}
                      className="accent-river-blue"
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{pm.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Notes */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Order Notes (optional)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special instructions for your order?"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-river-blue focus:ring-2 focus:ring-river-blue/20 bg-white dark:bg-gray-700 text-foreground dark:placeholder:text-gray-500"
              />
            </section>

            {/* Loyalty Points */}
            {user && user.loyalty_points > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={redeemPoints}
                    onChange={(e) => setRedeemPoints(e.target.checked)}
                    className="rounded border-gray-300 accent-river-blue"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    Redeem loyalty points ({user.loyalty_points} pts available)
                  </span>
                </label>
              </section>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-3">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Order Summary</h2>

              {cartLoading ? (
                <div className="flex items-center justify-center min-h-[60px]">
                  <div className="w-6 h-6 border-4 border-river-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                    {items.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between gap-2">
                        <span className="text-gray-600 dark:text-gray-300 truncate flex-1">
                          {item.product?.name ?? `Product #${item.product_id}`}
                          <span className="text-gray-400 dark:text-gray-500"> ×{item.quantity}</span>
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 flex-shrink-0">
                          {formatBDT(Number(item.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Subtotal</span><span>{formatBDT(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span><span>-{formatBDT(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 border-t border-gray-100 dark:border-gray-700 pt-2">
                      <span>Total</span><span>{formatBDT(total)}</span>
                    </div>
                  </div>
                </>
              )}

              {submitError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-700">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || cartLoading || items.length === 0}
                className="w-full bg-river-blue text-white text-sm font-semibold py-3 rounded-xl hover:bg-river-blue/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
