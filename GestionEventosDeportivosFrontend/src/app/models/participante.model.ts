export interface Participante {
  participante_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  nombre_completo: string;
}

export interface CreateParticipante {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface UpdateParticipante {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}