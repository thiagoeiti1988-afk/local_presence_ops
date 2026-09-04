"use client";

import { useState, useTransition } from "react";
import type { LocalPresenceAudit } from "@local-presence-ops/audit";
import { runManualAudit } from "./actions";

export function AuditForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<LocalPresenceAudit | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <form
        className="audit-form"
        action={(formData: FormData) => {
          setError(null);
          startTransition(async () => {
            const outcome = await runManualAudit(formData);
            if ("error" in outcome) {
              setError(outcome.error);
              setResult(null);
            } else {
              setResult(outcome.audit);
            }
          });
        }}
      >
        <label>
          Business name *
          <input name="businessName" required />
        </label>
        <label>
          City *
          <input name="city" required />
        </label>
        <label>
          Website
          <input name="website" type="url" />
        </label>
        <label>
          Google Business Profile URL
          <input name="googleProfileUrl" type="url" />
        </label>
        <label>
          Category
          <input name="category" />
        </label>
        <label>
          Address
          <input name="address" />
        </label>
        <label>
          Phone
          <input name="phone" />
        </label>
        <label>
          Opening hours complete on the profile?
          <select name="openingHoursComplete" defaultValue="">
            <option value="">Not observed</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label>
          Photo count
          <input name="photoCount" type="number" min={0} />
        </label>
        <label>
          Review count
          <input name="reviewCount" type="number" min={0} />
        </label>
        <label>
          Average rating (0-5)
          <input name="averageRating" type="number" min={0} max={5} step="0.1" />
        </label>
        <label>
          Unanswered reviews
          <input name="unansweredReviews" type="number" min={0} />
        </label>
        <label>
          Days since latest post
          <input name="latestPostDaysAgo" type="number" min={0} />
        </label>
        <label>
          Booking URL
          <input name="bookingUrl" type="url" />
        </label>
        <button className="primary" type="submit" disabled={isPending}>
          {isPending ? "Running audit..." : "Run audit"}
        </button>
      </form>

      {error ? <p style={{ color: "var(--fail)" }}>{error}</p> : null}

      {result ? (
        <div className="card" style={{ marginTop: "1.5rem", maxWidth: 480 }}>
          <div className="stat-label">Local Presence Score</div>
          <div className="stat-value">{result.score}/100</div>
          <ul>
            {Object.values(result.sections).map((section) => (
              <li key={section.section}>
                {section.section}: {section.score}/100
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
