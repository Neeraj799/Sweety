import { useState } from "react";
import { SLOTS } from "../constants/slots.js";
import { api } from "../services/api.js";
import { getToday } from "../utils/date.js";
import { readingSchema } from "../validators/readingSchema.js";
import Button from "./Button.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import FormInput from "./FormInput.jsx";
import FormSelect from "./FormSelect.jsx";

const ReadingForm = ({ reading, onSaved, onCancel }) => {
  const isEdit = Boolean(reading);
  const [form, setForm] = useState({
    date: reading?.date ?? getToday(),
    slot: reading?.slot ?? "morning_fasting",
    value: reading ? String(reading.value) : "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const value = form.value === "" ? undefined : Number(form.value);
    const {
      success,
      data,
      error: validationError,
    } = readingSchema.safeParse({
      ...form,
      value,
    });
    if (!success) {
      setError(validationError.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/readings/${reading.id}`, data);
      } else {
        await api.post("/readings", data);
      }
      onSaved();
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white p-4 shadow dark:bg-gray-900"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <FormInput
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <FormSelect
          label="Time slot"
          name="slot"
          options={SLOTS}
          value={form.slot}
          onChange={handleChange}
        />
        <FormInput
          label="Value (mg/dl)"
          name="value"
          type="number"
          placeholder="e.g. 120"
          value={form.value}
          onChange={handleChange}
        />
      </div>

      <ErrorMessage message={error} />

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Save changes" : "Add reading"}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReadingForm;
