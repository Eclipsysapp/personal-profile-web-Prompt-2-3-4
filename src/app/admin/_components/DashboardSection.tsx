import type { ReactNode } from "react";

type DashboardSectionProps = {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

/**
 * Reusable panel used for every dashboard block: a titled surface with
 * an optional description and an optional header action (e.g. "View all").
 */
export default function DashboardSection({
  id,
  title,
  description,
  action,
  children,
}: DashboardSectionProps) {
  return (
    <section className="adx-panel" id={id}>
      <div className="adx-panel-head">
        <div className="adx-title-group">
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
