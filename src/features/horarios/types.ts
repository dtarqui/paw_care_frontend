export interface Horario {
  id: number;
  veterinarioId: number;
  diaSemana: number; // 0 = domingo ... 6 = sábado
  horaInicio: string; // "HH:mm"
  horaFin: string;
}

export interface BloqueHorarioInput {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}
