using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionEventosDeportivos.Data;
using GestionEventosDeportivos.Models;
using GestionEventosDeportivos.Models.Dtos;

namespace GestionEventosDeportivos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InscripcionesController : ControllerBase
    {
        private readonly EventosDbContext _context;

        public InscripcionesController(EventosDbContext context)
        {
            _context = context;
        }

        // GET: api/Inscripciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InscripcionDto>>> GetInscripciones()
        {
            var inscripciones = await _context.Inscripciones
                .Include(i => i.Evento)
                .Include(i => i.Participante)
                .Select(i => new InscripcionDto
                {
                    inscripcion_id = i.inscripcion_id,
                    evento_id = i.evento_id,
                    participante_id = i.participante_id,
                    fecha_inscripcion = i.fecha_inscripcion,
                    estado = i.estado,
                    evento_nombre = i.Evento.nombre,
                    participante_nombre_completo = i.Participante.nombre + " " + i.Participante.apellido
                })
                .ToListAsync();

            return Ok(inscripciones);
        }

        // GET: api/Inscripciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InscripcionDto>> GetInscripcion(int id)
        {
            var inscripcion = await _context.Inscripciones
                .Include(i => i.Evento)
                .Include(i => i.Participante)
                .Where(i => i.inscripcion_id == id)
                .Select(i => new InscripcionDto
                {
                    inscripcion_id = i.inscripcion_id,
                    evento_id = i.evento_id,
                    participante_id = i.participante_id,
                    fecha_inscripcion = i.fecha_inscripcion,
                    estado = i.estado,
                    evento_nombre = i.Evento.nombre,
                    participante_nombre_completo = i.Participante.nombre + " " + i.Participante.apellido
                })
                .FirstOrDefaultAsync();

            if (inscripcion == null)
            {
                return NotFound();
            }

            return Ok(inscripcion);
        }

        // GET: api/Inscripciones/evento/5
        [HttpGet("evento/{eventoId}")]
        public async Task<ActionResult<IEnumerable<InscripcionDto>>> GetInscripcionesPorEvento(int eventoId)
        {
            var inscripciones = await _context.Inscripciones
                .Include(i => i.Evento)
                .Include(i => i.Participante)
                .Where(i => i.evento_id == eventoId)
                .Select(i => new InscripcionDto
                {
                    inscripcion_id = i.inscripcion_id,
                    evento_id = i.evento_id,
                    participante_id = i.participante_id,
                    fecha_inscripcion = i.fecha_inscripcion,
                    estado = i.estado,
                    evento_nombre = i.Evento.nombre,
                    participante_nombre_completo = i.Participante.nombre + " " + i.Participante.apellido
                })
                .ToListAsync();

            return Ok(inscripciones);
        }

        // GET: api/Inscripciones/participante/5
        [HttpGet("participante/{participanteId}")]
        public async Task<ActionResult<IEnumerable<InscripcionDto>>> GetInscripcionesPorParticipante(int participanteId)
        {
            var inscripciones = await _context.Inscripciones
                .Include(i => i.Evento)
                .Include(i => i.Participante)
                .Where(i => i.participante_id == participanteId)
                .Select(i => new InscripcionDto
                {
                    inscripcion_id = i.inscripcion_id,
                    evento_id = i.evento_id,
                    participante_id = i.participante_id,
                    fecha_inscripcion = i.fecha_inscripcion,
                    estado = i.estado,
                    evento_nombre = i.Evento.nombre,
                    participante_nombre_completo = i.Participante.nombre + " " + i.Participante.apellido
                })
                .ToListAsync();

            return Ok(inscripciones);
        }

        // POST: api/Inscripciones
        [HttpPost]
        public async Task<ActionResult<InscripcionDto>> CreateInscripcion(CreateInscripcionDto createInscripcionDto)
        {
            // Verificar que existe el evento
            var evento = await _context.Eventos.FindAsync(createInscripcionDto.evento_id);
            if (evento == null)
            {
                return BadRequest("El evento especificado no existe");
            }

            // Verificar que existe el participante
            var participante = await _context.Participantes.FindAsync(createInscripcionDto.participante_id);
            if (participante == null)
            {
                return BadRequest("El participante especificado no existe");
            }

            // Verificar que no exista ya una inscripción activa para este participante en este evento
            var inscripcionExistente = await _context.Inscripciones
                .AnyAsync(i => i.evento_id == createInscripcionDto.evento_id
                          && i.participante_id == createInscripcionDto.participante_id
                          && i.estado == "Activa");

            if (inscripcionExistente)
            {
                return BadRequest("El participante ya está inscrito en este evento");
            }

            var inscripcion = new InscripcionModel
            {
                evento_id = createInscripcionDto.evento_id,
                participante_id = createInscripcionDto.participante_id,
                fecha_inscripcion = DateTime.Now,
                estado = "Activa"
            };

            _context.Inscripciones.Add(inscripcion);
            await _context.SaveChangesAsync();

            // Cargar los datos relacionados para la respuesta
            inscripcion = await _context.Inscripciones
                .Include(i => i.Evento)
                .Include(i => i.Participante)
                .FirstAsync(i => i.inscripcion_id == inscripcion.inscripcion_id);

            var inscripcionDto = new InscripcionDto
            {
                inscripcion_id = inscripcion.inscripcion_id,
                evento_id = inscripcion.evento_id,
                participante_id = inscripcion.participante_id,
                fecha_inscripcion = inscripcion.fecha_inscripcion,
                estado = inscripcion.estado,
                evento_nombre = inscripcion.Evento.nombre,
                participante_nombre_completo = inscripcion.Participante.nombre + " " + inscripcion.Participante.apellido
            };

            return CreatedAtAction(nameof(GetInscripcion), new { id = inscripcion.inscripcion_id }, inscripcionDto);
        }

        // PUT: api/Inscripciones/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInscripcion(int id, UpdateInscripcionDto updateInscripcionDto)
        {
            var inscripcion = await _context.Inscripciones.FindAsync(id);

            if (inscripcion == null)
            {
                return NotFound();
            }

            inscripcion.estado = updateInscripcionDto.estado;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InscripcionExists(id))
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

        // DELETE: api/Inscripciones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInscripcion(int id)
        {
            var inscripcion = await _context.Inscripciones.FindAsync(id);
            if (inscripcion == null)
            {
                return NotFound();
            }

            _context.Inscripciones.Remove(inscripcion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InscripcionExists(int id)
        {
            return _context.Inscripciones.Any(i => i.inscripcion_id == id);
        }
    }
}
