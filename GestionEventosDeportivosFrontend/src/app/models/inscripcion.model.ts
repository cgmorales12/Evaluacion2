export interface Inscripcion {
  inscripcion_id: number;
  evento_id: number;
  participante_id: number;
  fecha_inscripcion: Date;
  estado: string;
  evento_nombre: string;
  participante_nombre_completo: string;
}

export interface CreateInscripcion {
  evento_id: number;
  participante_id: number;
}

export interface UpdateInscripcion {
  estado: string;
}