import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscripcion, CreateInscripcion, UpdateInscripcion } from '../models/inscripcion.model';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private apiUrl = 'https://localhost:7154/api/Inscripciones'; // Cambia el puerto si es diferente

  constructor(private http: HttpClient) { }

  // Obtener todas las inscripciones
  getInscripciones(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.apiUrl);
  }

  // Obtener inscripción por ID
  getInscripcion(id: number): Observable<Inscripcion> {
    return this.http.get<Inscripcion>(`${this.apiUrl}/${id}`);
  }

  // Obtener inscripciones por evento
  getInscripcionesPorEvento(eventoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}/evento/${eventoId}`);
  }

  // Obtener inscripciones por participante
  getInscripcionesPorParticipante(participanteId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}/participante/${participanteId}`);
  }

  // Crear nueva inscripción
  createInscripcion(inscripcion: CreateInscripcion): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(this.apiUrl, inscripcion);
  }

  // Actualizar inscripción
  updateInscripcion(id: number, inscripcion: UpdateInscripcion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inscripcion);
  }

  // Eliminar inscripción
  deleteInscripcion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}