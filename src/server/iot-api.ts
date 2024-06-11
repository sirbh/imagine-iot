interface ProductData {
  productId: string;
  name: string;
  description: string;
  publisher: string;
  attributes: {
    id: string;
    name: string;
  }[];
}

export const getMetadata = async (orderNumber: string) => {
  const params = new URLSearchParams();
  params.append("orderNumber", orderNumber);

  const res = await fetch(
    "https://iot.tampere.fi/externaldataapi/v1/metadata?" + params.toString()
  );

  return (await res.json()) as ProductData[];
};

interface StatParams {
  orderNumber: string;
  productId: string;
  id: string[];
  startTime?: Date;
  endTime?: Date;
  limit?: number;
  period:
    | "CurrentMoment"
    | "CurrentDay"
    | "PreviousDay"
    | "CurrentWeek"
    | "PreviousWeek"
    | "CurrentMonth"
    | "PreviousMonth"
    | "CurrentQuarter"
    | "PreviousQuarter"
    | "CurrentYear"
    | "PreviousYear"
    | "Custom";
  dimension: "Minute" | "Hour" | "Day" | "Week" | "Quarter" | "Month" | "Year";
}

interface StatData {
  id: string;
  name: string;
  statistics: {
    stattime: number;
    count: number;
    sum: string;
    avg: string;
    min: string;
    max: string;
  }[];
}

export const getStat = async (params: StatParams) => {
  const urlParams = new URLSearchParams();
  urlParams.append("orderNumber", params.orderNumber);
  urlParams.append("productId", params.productId);

  for (const i of params.id) {
    urlParams.append("id", i);
  }

  if (params.startTime) {
    urlParams.append("startTime", params.startTime.getTime().toString());
  }
  if (params.endTime) {
    urlParams.append("endTime", params.endTime.getTime().toString());
  }
  if (params.limit) {
    urlParams.append("limit", params.limit.toString());
  }

  urlParams.append("period", params.period);
  urlParams.append("dimension", params.dimension);

  const res = await fetch(
    "https://iot.tampere.fi/externaldataapi/v1/meas/stat?" +
      urlParams.toString()
  );

  if (res.status !== 200) {
    throw new Error(await res.json());
  }

  return (await res.json()) as StatData[];
};

interface RangeParams {
  orderNumber: string;
  productId: string;
  id: string[];
  startTime?: Date;
  endTime?: Date;
  limit?: number;
}

interface RangeData {
  id: string;
  name: string;
  measurements: {
    timestamp: number;
    value: string;
  }[];
}

export const getRange = async (params: RangeParams) => {
  const urlParams = new URLSearchParams();
  urlParams.append("orderNumber", params.orderNumber);
  urlParams.append("productId", params.productId);

  for (const i of params.id) {
    urlParams.append("id", i);
  }

  if (params.startTime) {
    urlParams.append("startTime", params.startTime.getTime().toString());
  }
  if (params.endTime) {
    urlParams.append("endTime", params.endTime.getTime().toString());
  }
  if (params.limit) {
    urlParams.append("limit", params.limit.toString());
  }

  const res = await fetch(
    "https://iot.tampere.fi/externaldataapi/v1/meas/range?" +
      urlParams.toString()
  );

  if (res.status !== 200) {
    throw new Error(await res.json());
  }

  return (await res.json()) as RangeData[];
};
