export interface Evento {
  evento_id: number;
  nombre: string;
  fecha: Date;
  ubicacion: string;
  descripcion: string;
  total_participantes: number;
}

export interface CreateEvento {
  nombre: string;
  fecha: Date;
  ubicacion: string;
  descripcion: string;
}

export interface UpdateEvento {
  nombre: string;
  fecha: Date;
  ubicacion: string;
  descripcion: string;
}