import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita, CreateCita } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://localhost:5016/api/Citas';

  constructor(private http: HttpClient) {}

  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  getFechasDisponibles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/fechas-disponibles`);
  }

  createCita(cita: CreateCita): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }
}
