export const basePath = "/api/ga4-data";

export const apiVersions = {
  v1beta: "v1beta",
  v1alpha: "v1alpha",
};

export interface GA4ReportRequest {
  property: string;
  dateRanges: {
    startDate: string;
    endDate: string;
    name: string;
  }[];
  dimensions: {
    name: string;
  }[];
  metrics: {
    name: string;
  }[];
}

export interface GA4ReportResponse {
  dimensionHeaders: {
    name: string;
  }[];
  metricHeaders: {
    name: string;
    type: string;
  }[];
  rows: {
    dimensionValues: {
      value: string;
    }[];
    metricValues: {
      value: string;
    }[];
  }[];
  totals: {
    values: string[];
  }[];
  maximums: {
    values: string[];
  }[];
  minimums: {
    values: string[];
  }[];
  rowCount: number;
}
