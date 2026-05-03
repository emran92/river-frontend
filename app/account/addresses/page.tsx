"use client";

import { useState, useEffect } from "react";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "@/lib/api";
import type { Address, ApiError } from "@/types";

type AddressFormData = Omit<Address, "id" | "user_id" | "created_at" | "updated_at">;

const EMPTY_FORM: AddressFormData = {
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

const FIELDS: [string, keyof AddressFormData, string, string, string?][] = [
  ["Label", "label", "text", "Home / Office / Other", ""],
  ["Recipient Name", "recipient_name", "text", "Full name", ""],
  ["Phone", "phone", "tel", "+880...", ""],
  ["Address Line 1", "address_line_1", "text", "Street address", "sm:col-span-2"],
  ["Address Line 2", "address_line_2", "text", "Apartment, floor, etc.", "sm:col-span-2"],
  ["City", "city", "text", "", ""],
  ["District", "district", "text", "", ""],
  ["Postal Code", "postal_code", "text", "", ""],
];

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: AddressFormData;
  onSave: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AddressFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(form);
    } catch (err: unknown) {
      setError((err as ApiError).message ?? "Failed to save address.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4"
    >
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.map(([label, field, type, placeholder, colSpan]) => (
          <div key={field} className={colSpan ?? ""}>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={(form[field] as string) ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, [field]: e.target.value || (field === "address_line_2" || field === "district" || field === "postal_code" ? null : e.target.value) }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 bg-white outline-none transition focus:border-river-blue focus:ring-2 focus:ring-river-blue/20"
            />
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 accent-river-blue"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              Set as default address
            </span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-river-blue text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-river-blue/90 disabled:opacity-60 transition-all shadow-sm shadow-river-blue/20"
        >
          {saving ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </>
          ) : (
            "Save Address"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-500 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"idle" | "add" | { edit: Address }>("idle");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    getAddresses()
      .then(setAddresses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveNew(data: AddressFormData) {
    const created = await createAddress(data);
    setAddresses((prev) =>
      data.is_default ? [created, ...prev.map((a) => ({ ...a, is_default: false }))] : [...prev, created]
    );
    setMode("idle");
  }

  async function handleSaveEdit(addr: Address, data: AddressFormData) {
    const updated = await updateAddress(addr.id, data);
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === updated.id) return updated;
        if (data.is_default) return { ...a, is_default: false };
        return a;
      })
    );
    setMode("idle");
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your delivery addresses</p>
        </div>
        {mode === "idle" && (
          <button
            onClick={() => setMode("add")}
            className="inline-flex items-center gap-2 bg-river-blue text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-river-blue/90 transition-all shadow-sm shadow-river-blue/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Address
          </button>
        )}
      </div>

      {mode === "add" && (
        <AddressForm
          initial={EMPTY_FORM}
          onSave={handleSaveNew}
          onCancel={() => setMode("idle")}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[120px]">
          <div className="w-7 h-7 border-4 border-river-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : addresses.length === 0 && mode === "idle" ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="font-semibold text-gray-900 mb-1">No addresses yet</p>
          <p className="text-sm text-gray-400">Add a delivery address to speed up checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) =>
            typeof mode === "object" && mode.edit.id === addr.id ? (
              <div key={addr.id} className="sm:col-span-2">
                <AddressForm
                  initial={{
                    label: addr.label,
                    recipient_name: addr.recipient_name,
                    phone: addr.phone,
                    address_line_1: addr.address_line_1,
                    address_line_2: addr.address_line_2,
                    city: addr.city,
                    district: addr.district,
                    postal_code: addr.postal_code,
                    is_default: addr.is_default,
                  }}
                  onSave={(data) => handleSaveEdit(addr, data)}
                  onCancel={() => setMode("idle")}
                />
              </div>
            ) : (
              <div
                key={addr.id}
                className={`bg-white rounded-2xl border shadow-sm p-5 relative transition-all ${
                  addr.is_default ? "border-river-blue/40 ring-1 ring-river-blue/20" : "border-gray-100"
                }`}
              >
                {addr.is_default && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-river-blue bg-river-blue/10 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-river-blue/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-river-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{addr.label}</p>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-800">{addr.recipient_name}</p>
                  <p>{addr.phone}</p>
                  <p className="text-gray-500">
                    {addr.address_line_1}
                    {addr.address_line_2 ? `, ${addr.address_line_2}` : ""}
                  </p>
                  <p className="text-gray-500">
                    {addr.city}
                    {addr.district ? `, ${addr.district}` : ""}
                    {addr.postal_code ? ` — ${addr.postal_code}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setMode({ edit: addr })}
                    className="text-xs font-medium text-river-blue hover:underline transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    disabled={deletingId === addr.id}
                    className="text-xs font-medium text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                  >
                    {deletingId === addr.id ? "Removing…" : "Remove"}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
