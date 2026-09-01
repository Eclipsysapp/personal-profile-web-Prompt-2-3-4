export type DashboardStat = { key:string; label:string; value:string; hint:string; trend:"up"|"down"|"flat"; delta:string; icon:"blogs"|"published"|"pending"|"comments"|"access"|"visitors" };
import {
  AccessIcon,
  BlogsIcon,
  CommentsIcon,
  PendingIcon,
  PublishedIcon,
  TrendDownIcon,
  TrendUpIcon,
  VisitorsIcon,
} from "./icons";

const iconMap = {
  blogs: BlogsIcon,
  published: PublishedIcon,
  pending: PendingIcon,
  comments: CommentsIcon,
  access: AccessIcon,
  visitors: VisitorsIcon,
} as const;

export default function DashboardStatCard({ stat }: { stat: DashboardStat }) {
  const Icon = iconMap[stat.icon];
  const isDown = stat.trend === "down";

  return (
    <article className="adx-stat">
      <div className="adx-stat-top">
        <span className="adx-stat-icon" aria-hidden>
          <Icon />
        </span>
        {stat.trend !== "flat" ? (
          <span className={`adx-stat-delta${isDown ? " is-down" : ""}`}>
            {isDown ? <TrendDownIcon /> : <TrendUpIcon />}
            {stat.delta}
          </span>
        ) : null}
      </div>
      <p className="adx-stat-value">{stat.value}</p>
      <p className="adx-stat-label">{stat.label}</p>
      <p className="adx-stat-hint">{stat.hint}</p>
    </article>
  );
}
