export interface Evento {
  evento_id: number;
  nombre: string;
  fecha: Date;
  ubicacion: string;
  descripcion: string | null;
  total_participantes: number;
}

export interface CreateEvento {
  nombre: string;
  fecha: Date;
  ubicacion: string;
  descripcion?: string | null;
}

export interface UpdateEvento {
  nombre: string;
  fecha: Date;
  ubicacion: string;
  descripcion?: string | null;
}