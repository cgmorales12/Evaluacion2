import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitaService } from '../../services/cita.service';
import { Cita, CreateCita } from '../../models/cita.model';

type AlertType = 'success' | 'danger' | 'info';

interface CitaView extends Cita {
  fecha_cita: string;
  hora_inicio: string;
  hora_fin: string;
}

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class CitasComponent implements OnInit {
  citas: CitaView[] = [];
  fechasTrabajo: string[] = [];
  horasDisponibles: string[] = [];
  citaForm: FormGroup;
  loading = false;
  submitting = false;
  message: { type: AlertType; text: string } | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly citaService: CitaService
  ) {
    this.citaForm = this.fb.group({
      fecha_cita: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
      motivo: ['', [Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.generarHorasDisponibles();
    this.cargarFechasTrabajo();
    this.cargarCitas();
    this.citaForm.get('hora_inicio')?.valueChanges.subscribe(value => {
      this.actualizarHoraFin(value);
    });
  }

  submit(): void {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    }

    const rawValue = this.citaForm.getRawValue();
    const fecha = rawValue.fecha_cita;
    const horaInicio = rawValue.hora_inicio;
    const horaFin = rawValue.hora_fin;

    if (!fecha || !horaInicio || !horaFin) {
      this.mostrarMensaje('danger', 'Debe completar la información de la cita.');
      return;
    }

    const existe = this.citas.some(cita =>
      cita.fecha_cita === fecha && cita.hora_inicio === horaInicio
    );

    if (existe) {
      this.mostrarMensaje('danger', 'Ya existe una cita programada en esa fecha y hora.');
      return;
    }

    const payload: CreateCita = {
      fecha_cita: fecha,
      hora_inicio: this.formatearHoraEnvio(horaInicio),
      hora_fin: this.formatearHoraEnvio(horaFin),
      motivo: rawValue.motivo?.trim() ? rawValue.motivo.trim() : null
    };

    this.submitting = true;
    this.citaService.createCita(payload).subscribe({
      next: citaCreada => {
        const citaVista = this.mapearCita(citaCreada);
        this.citas = [...this.citas, citaVista].sort(this.ordenarCitas);
        this.citaForm.reset();
        this.citaForm.markAsPristine();
        this.citaForm.markAsUntouched();
        this.citaForm.get('hora_fin')?.setValue('');
        this.submitting = false;
        this.mostrarMensaje('success', 'Cita registrada correctamente.');
      },
      error: (error) => {
        this.submitting = false;
        if (error?.status === 409) {
          this.mostrarMensaje('danger', 'Ya existe una cita programada en esa fecha y hora.');
          return;
        }
        this.mostrarMensaje('danger', 'No se pudo registrar la cita. Intente nuevamente.');
      }
    });
  }

  cargarCitas(): void {
    this.loading = true;
    this.citaService.getCitas().subscribe({
      next: citas => {
        this.citas = citas.map(cita => this.mapearCita(cita)).sort(this.ordenarCitas);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.mostrarMensaje('danger', 'No se pudieron cargar las citas. Intente nuevamente.');
      }
    });
  }

  cargarFechasTrabajo(): void {
    this.citaService.getFechasDisponibles().subscribe({
      next: fechas => {
        this.fechasTrabajo = fechas
          .map(fecha => this.normalizarFecha(fecha))
          .filter((valor, indice, arreglo) => valor && arreglo.indexOf(valor) === indice)
          .sort();
      },
      error: () => {
        this.mostrarMensaje('danger', 'No se pudieron obtener los días habilitados para citas.');
      }
    });
  }

  actualizarHoraFin(valor: string): void {
    if (!valor) {
      this.citaForm.get('hora_fin')?.setValue('');
      return;
    }

    const partes = valor.split(':').map(part => Number(part));
    const horas = partes[0];
    const minutos = partes[1];

    if (Number.isNaN(horas) || Number.isNaN(minutos)) {
      this.citaForm.get('hora_fin')?.setValue('');
      return;
    }

    const minutosTotales = horas * 60 + minutos + 30;
    const horasFin = Math.floor(minutosTotales / 60) % 24;
    const minutosFin = minutosTotales % 60;
    this.citaForm.get('hora_fin')?.setValue(this.formatearHora(horasFin, minutosFin));
  }

  generarHorasDisponibles(): void {
    const inicio = 8 * 60; // 08:00
    const fin = 18 * 60; // 18:00
    const paso = 30;
    const opciones: string[] = [];

    for (let minutos = inicio; minutos <= fin - paso; minutos += paso) {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      opciones.push(this.formatearHora(horas, mins));
    }

    this.horasDisponibles = opciones;
  }

  get fechaCita() {
    return this.citaForm.get('fecha_cita');
  }

  get horaInicio() {
    return this.citaForm.get('hora_inicio');
  }

  get motivo() {
    return this.citaForm.get('motivo');
  }

  private mapearCita(cita: Cita): CitaView {
    return {
      ...cita,
      fecha_cita: this.normalizarFecha(cita.fecha_cita),
      hora_inicio: this.formatearHoraVista(cita.hora_inicio),
      hora_fin: this.formatearHoraVista(cita.hora_fin),
      motivo: cita.motivo ?? null
    };
  }

  private ordenarCitas = (a: CitaView, b: CitaView): number => {
    const fechaDiff = a.fecha_cita.localeCompare(b.fecha_cita);
    if (fechaDiff !== 0) {
      return fechaDiff;
    }
    return a.hora_inicio.localeCompare(b.hora_inicio);
  };

  private normalizarFecha(valor: string): string {
    if (!valor) {
      return '';
    }

    const fecha = new Date(valor);
    if (!Number.isNaN(fecha.getTime())) {
      return fecha.toISOString().split('T')[0];
    }

    return valor.split('T')[0];
  }

  private formatearHoraEnvio(valor: string): string {
    const partes = valor.split(':').map(Number);
    const horas = partes[0] ?? 0;
    const minutos = partes[1] ?? 0;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:00`;
  }

  private formatearHoraVista(valor: string): string {
    if (!valor) {
      return '';
    }

    const partes = valor.split(':');
    const horas = partes[0] ?? '00';
    const minutos = partes[1] ?? '00';
    return `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}`;
  }

  private formatearHora(horas: number, minutos: number): string {
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  }

  private mostrarMensaje(type: AlertType, text: string): void {
    this.message = { type, text };
    setTimeout(() => {
      if (this.message?.text === text) {
        this.message = null;
      }
    }, 5000);
  }
}
