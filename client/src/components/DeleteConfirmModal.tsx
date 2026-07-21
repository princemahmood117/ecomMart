"use client";

import { motion } from "motion/react";
import { useState } from "react";

export default function DeleteConfirmModal({
  productName,
  onClose,
  onConfirm,
}: {
  productName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4"
      >
        <h3 className="text-lg font-semibold">Delete Product</h3>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete <span className="font-medium">{productName}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 text-white rounded-lg py-2 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}