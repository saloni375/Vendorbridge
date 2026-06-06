import { Inbox } from "lucide-react";

export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white px-6 py-10 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}
