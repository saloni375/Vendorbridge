export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase text-brand-600">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-2xl font-bold text-gray-950">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
