import { useMemo, useState } from "react";

import { useParams } from "react-router-dom";

import {
  useIndicatorDetailQuery,
  useIndicatorHistoryQuery,
} from "../api/hooks";

import { IndicatorHistoryChart } from "../components/charts/IndicatorHistoryChart";

// 
import { Card } from "../components/ui/Card";

import { StatusBadge } from "../components/ui/StatusBadge";

import { TimeRangePicker } from "../components/ui/TimeRangePicker";

import type { IndicatorResult } from "../api/types";

import { formatIndicatorStatus } from "../lib/indicators";

import {
  TIME_RANGE_OPTIONS,
  getLookbackDays,
  type TimeRangeId,
} from "../lib/timeRanges";

import styles from "./IndicatorPage.module.css";

const DEFAULT_RANGE: TimeRangeId = "1Y";

function extractDetailRows(indicator?: IndicatorResult) {
  if (!indicator?.pure_value?.length) {
    return [];
  }

  return indicator.pure_value.map((entry, index) => {
    const label =
      (typeof entry.market === "string" && entry.market) ||
      (typeof entry.metric === "string" && entry.metric) ||
      `Value ${index + 1}`;

    const pairs = Object.entries(entry).filter(([key]) => key !== "market");

    return {
      label,

      pairs,
    };
  });
}

export function IndicatorPage() {
  const { slug } = useParams<{ slug: string }>();

  const [timeRange, setTimeRange] = useState<TimeRangeId>(DEFAULT_RANGE);

  const detailQuery = useIndicatorDetailQuery(slug);

  const lookbackDays = getLookbackDays(timeRange);

  const historyQuery = useIndicatorHistoryQuery({
    slug: slug ?? "",

    lookbackDays,
  });

  

  const indicator = detailQuery.data;

  const historySeries = historyQuery.data?.series ?? [];

  const detailRows = useMemo(() => extractDetailRows(indicator), [indicator]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <div className={styles.headingBlock}>
          <p className={styles.breadcrumb}>Dashboard / Indicator</p>

          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              {indicator?.name ?? slug ?? "Indicator"}
            </h1>

            <StatusBadge status={indicator?.status} />
          </div>

          {indicator?.description && (
            <p className={styles.subtitle}>{indicator.description}</p>
          )}
        </div>

        <div className={styles.controlsBlock}>
          <span className={styles.controlLabel}>Time range</span>

          <TimeRangePicker value={timeRange} onChange={setTimeRange} />

          {/* <Button
            variant="icon"
            onClick={() => runIndicatorRefresh(slug ?? "")}
            disabled={isRefreshing || !slug}
            title="Refresh indicator"
            className={isRefreshing ? styles.spinning : ''}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
          </Button> */}
        </div>
      </header>

      <section className={styles.layoutGrid}>
        <Card
          title="Historical trend"
          description="Daily observations from the engine"
        >
          {historyQuery.isLoading ? (
            <p className={styles.placeholderCopy}>Loading history…</p>
          ) : historyQuery.isError ? (
            <p className={styles.errorCopy}>
              Unable to load history for this indicator. Confirm the history
              JSON exists on the engine.
            </p>
          ) : historySeries.length === 0 ? (
            <p className={styles.placeholderCopy}>
              No historical data available for the selected range.
            </p>
          ) : (
            <IndicatorHistoryChart series={historySeries} height={360} />
          )}

          {indicator && (
            <div className={styles.metaSection}>
              <dl className={styles.metaList}>
                {indicator?.category && (
                  <div>
                    <dt>Category</dt>

                    <dd>{indicator.category}</dd>
                  </div>
                )}

                {indicator?.threshold && (
                  <div>
                    <dt>Threshold</dt>

                    <dd>{indicator.threshold}</dd>
                  </div>
                )}

                {indicator?.markets?.length ? (
                  <div>
                    <dt>Markets</dt>

                    <dd>{indicator.markets.join(", ")}</dd>
                  </div>
                ) : null}

                {indicator?.topics?.length ? (
                  <div>
                    <dt>Topics</dt>

                    <dd>{indicator.topics.join(", ")}</dd>
                  </div>
                ) : null}

                {indicator?.status && (
                  <div>
                    <dt>Status</dt>

                    <dd>{formatIndicatorStatus(indicator.status)}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </Card>

        <Card title="Latest breakdown" description="Most recent cleaned values">
          {detailQuery.isLoading ? (
            <p className={styles.placeholderCopy}>Loading indicator details…</p>
          ) : detailQuery.isError ? (
            <p className={styles.errorCopy}>
              Unable to load the indicator record from the engine.
            </p>
          ) : detailRows.length === 0 ? (
            <p className={styles.placeholderCopy}>
              The engine did not provide a structured breakdown for this
              indicator.
            </p>
          ) : (
            <div className={styles.detailRows}>
              {detailRows.map((row) => (
                <div key={row.label} className={styles.detailRow}>
                  <h3>{row.label}</h3>

                  <dl>
                    {row.pairs.map(([key, value]) => (
                      <div key={key} className={styles.detailPair}>
                        <dt>{key}</dt>

                        <dd>
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : String(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <footer className={styles.rangeHint}>
        {TIME_RANGE_OPTIONS.map((option) => (
          <span key={option.id}>
            {option.label} →{" "}
            {option.lookbackDays
              ? `${option.lookbackDays} days`
              : "entire available history"}
          </span>
        ))}
      </footer>
    </div>
  );
}
