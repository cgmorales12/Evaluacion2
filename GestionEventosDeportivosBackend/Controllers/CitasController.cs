using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GestionEventosDeportivos.Data;
using GestionEventosDeportivos.Models;
using GestionEventosDeportivos.Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestionEventosDeportivos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitasController : ControllerBase
    {
        private static readonly DayOfWeek[] DiasTrabajo =
            { DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday };

        private static readonly TimeSpan DuracionCita = TimeSpan.FromMinutes(30);
        private readonly EventosDbContext _context;

        public CitasController(EventosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CitaDto>>> GetCitas()
        {
            var citas = await _context.Citas
                .OrderBy(c => c.fecha_cita)
                .ThenBy(c => c.hora_inicio)
                .Select(c => MapToDto(c))
                .ToListAsync();

            return Ok(citas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CitaDto>> GetCita(int id)
        {
            var cita = await _context.Citas.FindAsync(id);

            if (cita is null)
            {
                return NotFound();
            }

            return Ok(MapToDto(cita));
        }

        [HttpGet("fechas-disponibles")]
        public ActionResult<IEnumerable<DateTime>> GetFechasDisponibles()
        {
            var fechas = new List<DateTime>();
            var cursor = DateTime.Today;
            var limite = cursor.AddMonths(3);

            while (cursor <= limite && fechas.Count < 60)
            {
                if (EsDiaHabil(cursor))
                {
                    fechas.Add(cursor);
                }

                cursor = cursor.AddDays(1);
            }

            return Ok(fechas);
        }

        [HttpPost]
        public async Task<ActionResult<CitaDto>> CrearCita([FromBody] CitaDto citaDto)
        {
            if (citaDto is null)
            {
                return BadRequest("Los datos de la cita son obligatorios.");
            }

            var fecha = citaDto.fecha_cita.Date;
            var horaInicio = NormalizeTime(citaDto.hora_inicio);
            var horaFinEsperada = horaInicio.Add(DuracionCita);

            if (!EsDiaHabil(fecha))
            {
                return BadRequest("La fecha seleccionada no está disponible para trabajar.");
            }

            if (!EsIntervaloValido(horaInicio))
            {
                return BadRequest("La hora de inicio debe estar en intervalos de 30 minutos.");
            }

            if (citaDto.hora_fin != TimeSpan.Zero && citaDto.hora_fin != horaFinEsperada)
            {
                return BadRequest("La hora de fin debe ser 30 minutos después de la hora de inicio.");
            }

            var existe = await _context.Citas.AnyAsync(c => c.fecha_cita == fecha && c.hora_inicio == horaInicio);
            if (existe)
            {
                return Conflict("Ya existe una cita programada en esa fecha y hora de inicio.");
            }

            var cita = new CitaModel
            {
                fecha_cita = fecha,
                hora_inicio = horaInicio,
                hora_fin = horaFinEsperada,
                motivo = string.IsNullOrWhiteSpace(citaDto.motivo) ? null : citaDto.motivo.Trim()
            };

            _context.Citas.Add(cita);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCita), new { id = cita.cita_id }, MapToDto(cita));
        }

        private static CitaDto MapToDto(CitaModel cita)
        {
            return new CitaDto
            {
                cita_id = cita.cita_id,
                fecha_cita = cita.fecha_cita,
                hora_inicio = cita.hora_inicio,
                hora_fin = cita.hora_fin,
                motivo = cita.motivo
            };
        }

        private static TimeSpan NormalizeTime(TimeSpan value)
        {
            return new TimeSpan(value.Hours, value.Minutes, 0);
        }

        private static bool EsIntervaloValido(TimeSpan horaInicio)
        {
            return horaInicio >= TimeSpan.Zero
                   && horaInicio < TimeSpan.FromHours(24)
                   && horaInicio.Minutes % 30 == 0;
        }

        private static bool EsDiaHabil(DateTime fecha)
        {
            return DiasTrabajo.Contains(fecha.DayOfWeek);
        }
    }
}
