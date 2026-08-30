"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownTimerProps = {
  launchAt?: string;
};

type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const ISO_WITH_TIMEZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

function parseLaunchTime(value?: string): number | null {
  const cleanValue = value?.trim();

  if (!cleanValue || !ISO_WITH_TIMEZONE.test(cleanValue)) {
    return null;
  }

  const timestamp = Date.parse(cleanValue);

  return Number.isFinite(timestamp) ? timestamp : null;
}

function remainingUntil(
  target: number,
  currentTime: number,
): RemainingTime {
  const difference = Math.max(
    0,
    target - currentTime,
  );

  const totalSeconds = Math.floor(
    difference / 1000,
  );

  return {
    days: Math.floor(totalSeconds / 86_400),

    hours: Math.floor(
      (totalSeconds % 86_400) / 3_600,
    ),

    minutes: Math.floor(
      (totalSeconds % 3_600) / 60,
    ),

    seconds: totalSeconds % 60,
  };
}

function formatValue(value: number): string {
  return String(value).padStart(2, "0");
}

export function CountdownTimer({
  launchAt,
}: CountdownTimerProps) {
  const target = useMemo(
    () => parseLaunchTime(launchAt),
    [launchAt],
  );

  /*
   * Keep the initial server render and first client render identical.
   * The countdown starts only after the component mounts.
   */
  const [currentTime, setCurrentTime] =
    useState<number | null>(null);

  useEffect(() => {
    if (target === null) {
      return;
    }

    const initialTimer = window.setTimeout(() => {
      setCurrentTime(Date.now());
    }, 0);

    const interval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [target]);

  const remaining =
    target !== null && currentTime !== null
      ? remainingUntil(target, currentTime)
      : null;

  const hasTimeRemaining =
    remaining !== null &&
    Object.values(remaining).some(
      (value) => value > 0,
    );

  return (
    <div
      className="construction-countdown"
      aria-live="polite"
    >
      {hasTimeRemaining && remaining ? (
        <div
          className="construction-countdown-grid"
          aria-label="Time remaining until launch"
        >
          {(
            [
              ["days", remaining.days],
              ["hours", remaining.hours],
              ["minutes", remaining.minutes],
              ["seconds", remaining.seconds],
            ] as const
          ).map(([label, value]) => (
            <div
              className="construction-time-block"
              key={label}
            >
              <strong>
                {formatValue(value)}
              </strong>

              <span>{label}</span>
            </div>
          ))}
        </div>
      ) : null}

      <p>Launching soon</p>
    </div>
  );
}