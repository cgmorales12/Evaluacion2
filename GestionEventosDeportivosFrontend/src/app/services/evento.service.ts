import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento, CreateEvento, UpdateEvento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = 'http://localhost:5016/api/Eventos'; // el puerto

  constructor(private http: HttpClient) { }

  // Obtener todos los eventos
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  // Obtener evento por ID
  getEvento(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo evento
  createEvento(evento: CreateEvento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento);
  }

  // Actualizar evento
  updateEvento(id: number, evento: UpdateEvento): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, evento);
  }

  // Eliminar evento
  deleteEvento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}