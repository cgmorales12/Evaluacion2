export interface Cita {
  cita_id: number;
  fecha_cita: string;
  hora_inicio: string;
  hora_fin: string;
  motivo: string | null;
}

export interface CreateCita {
  fecha_cita: string;
  hora_inicio: string;
  hora_fin: string;
  motivo?: string | null;
}
