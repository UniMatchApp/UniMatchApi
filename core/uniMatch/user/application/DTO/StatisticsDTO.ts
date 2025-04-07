import { Stats } from "./Stats";

export interface StatisticsDTO {
    title: string;
    columns: string[];
    stats: Stats[];
}

