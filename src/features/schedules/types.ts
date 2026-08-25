export interface Schedule {
  id: number;
  vetId: number;
  dayOfWeek: number; // 0 = domingo ... 6 = sábado
  startTime: string; // "HH:mm"
  endTime: string;
}

export interface ScheduleBlockInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}
