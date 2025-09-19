using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionEventosDeportivos.Data;
using GestionEventosDeportivos.Models;
using GestionEventosDeportivos.Models.Dtos;

namespace GestionEventosDeportivos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventosController : ControllerBase
    {
        private readonly EventosDbContext _context;

        public EventosController(EventosDbContext context)
        {
            _context = context;
        }

        // GET: api/Eventos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventoDto>>> GetEventos()
        {
            var eventos = await _context.Eventos
                .Include(e => e.Inscripciones)
                .Select(e => new EventoDto
                {
                    evento_id = e.evento_id,
                    nombre = e.nombre,
                    fecha = e.fecha,
                    ubicacion = e.ubicacion,
                    descripcion = e.descripcion ?? string.Empty,
                    total_participantes = e.Inscripciones.Count(i => i.estado == "Activa")
                })
                .ToListAsync();

            return Ok(eventos);
        }

        // GET: api/Eventos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EventoDto>> GetEvento(int id)
        {
            var evento = await _context.Eventos
                .Include(e => e.Inscripciones)
                .Where(e => e.evento_id == id)
                .Select(e => new EventoDto
                {
                    evento_id = e.evento_id,
                    nombre = e.nombre,
                    fecha = e.fecha,
                    ubicacion = e.ubicacion,
                    descripcion = e.descripcion ?? string.Empty,
                    total_participantes = e.Inscripciones.Count(i => i.estado == "Activa")
                })
                .FirstOrDefaultAsync();

            if (evento == null)
            {
                return NotFound();
            }

            return Ok(evento);
        }

        // POST: api/Eventos
        [HttpPost]
        public async Task<ActionResult<EventoDto>> CreateEvento(CreateEventoDto createEventoDto)
        {
            var evento = new EventoModel
            {
                nombre = createEventoDto.nombre,
                fecha = createEventoDto.fecha,
                ubicacion = createEventoDto.ubicacion,
                descripcion = string.IsNullOrWhiteSpace(createEventoDto.descripcion)
                    ? null
                    : createEventoDto.descripcion.Trim()
            };

            _context.Eventos.Add(evento);
            await _context.SaveChangesAsync();

            var eventoDto = new EventoDto
            {
                evento_id = evento.evento_id,
                nombre = evento.nombre,
                fecha = evento.fecha,
                ubicacion = evento.ubicacion,
                descripcion = evento.descripcion ?? string.Empty,
                total_participantes = 0
            };

            return CreatedAtAction(nameof(GetEvento), new { id = evento.evento_id }, eventoDto);
        }

        // PUT: api/Eventos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvento(int id, UpdateEventoDto updateEventoDto)
        {
            var evento = await _context.Eventos.FindAsync(id);

            if (evento == null)
            {
                return NotFound();
            }

            evento.nombre = updateEventoDto.nombre;
            evento.fecha = updateEventoDto.fecha;
            evento.ubicacion = updateEventoDto.ubicacion;
            evento.descripcion = string.IsNullOrWhiteSpace(updateEventoDto.descripcion)
                ? null
                : updateEventoDto.descripcion.Trim();

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Eventos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvento(int id)
        {
            var evento = await _context.Eventos.FindAsync(id);
            if (evento == null)
            {
                return NotFound();
            }

            _context.Eventos.Remove(evento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventoExists(int id)
        {
            return _context.Eventos.Any(e => e.evento_id == id);
        }
    }
}
