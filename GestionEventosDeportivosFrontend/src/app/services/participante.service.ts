import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Participante, CreateParticipante, UpdateParticipante } from '../models/participante.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {
  private apiUrl = 'https://localhost:7154/api/Participantes'; // Cambia el puerto si es diferente

  constructor(private http: HttpClient) { }

  // Obtener todos los participantes
  getParticipantes(): Observable<Participante[]> {
    return this.http.get<Participante[]>(this.apiUrl);
  }

  // Obtener participante por ID
  getParticipante(id: number): Observable<Participante> {
    return this.http.get<Participante>(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo participante
  createParticipante(participante: CreateParticipante): Observable<Participante> {
    return this.http.post<Participante>(this.apiUrl, participante);
  }

  // Actualizar participante
  updateParticipante(id: number, participante: UpdateParticipante): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, participante);
  }

  // Eliminar participante
  deleteParticipante(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}