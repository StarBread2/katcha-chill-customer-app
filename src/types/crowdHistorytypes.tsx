export type CrowdHistoryPoint = 
{
    time: string;
    value: number;
}

export type CrowdHistoryDay   = 
{
    date: string; //"2026-01-01"
    data: CrowdHistoryPoint[];
}

export const FULL_DAY_TIMES: CrowdHistoryPoint[] = [
    { time: "01:00 AM", value: 0 },
    { time: "02:00 AM", value: 0 },
    { time: "03:00 AM", value: 0 },
    { time: "04:00 AM", value: 0 },
    { time: "05:00 AM", value: 0 },
    { time: "06:00 AM", value: 0 },
    { time: "07:00 AM", value: 0 },
    { time: "08:00 AM", value: 0 },
    { time: "09:00 AM", value: 0 },
    { time: "10:00 AM", value: 0 },
    { time: "11:00 AM", value: 0 },
    { time: "12:00 PM", value: 0 },
    { time: "01:00 PM", value: 0 },
    { time: "02:00 PM", value: 0 },
    { time: "03:00 PM", value: 0 },
    { time: "04:00 PM", value: 0 },
    { time: "05:00 PM", value: 0 },
    { time: "06:00 PM", value: 0 },
    { time: "07:00 PM", value: 0 },
    { time: "08:00 PM", value: 0 },
    { time: "09:00 PM", value: 0 },
    { time: "10:00 PM", value: 0 },
    { time: "11:00 PM", value: 0 },
    { time: "12:00 AM", value: 0 },
];