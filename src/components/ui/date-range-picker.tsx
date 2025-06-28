
export function DateRangePicker() {
  return (
    <div className="flex items-center gap-2">
      <input type="date" className="border px-3 py-2 rounded-md" />
      <span className="text-gray-500">to</span>
      <input type="date" className="border px-3 py-2 rounded-md" />
    </div>
  );
}
export function DateRangePickerWithLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
      <DateRangePicker />
    </div>
  );
}