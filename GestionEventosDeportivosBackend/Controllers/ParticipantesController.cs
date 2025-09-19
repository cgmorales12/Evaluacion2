using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionEventosDeportivos.Data;
using GestionEventosDeportivos.Models;
using GestionEventosDeportivos.Models.Dtos;

namespace GestionEventosDeportivos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantesController : ControllerBase
    {
        private readonly EventosDbContext _context;

        public ParticipantesController(EventosDbContext context)
        {
            _context = context;
        }

        // GET: api/Participantes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParticipanteDto>>> GetParticipantes()
        {
            var participantes = await _context.Participantes
                .Select(p => new ParticipanteDto
                {
                    participante_id = p.participante_id,
                    nombre = p.nombre,
                    apellido = p.apellido,
                    email = p.email,
                    telefono = p.telefono
                })
                .ToListAsync();

            return Ok(participantes);
        }

        // GET: api/Participantes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ParticipanteDto>> GetParticipante(int id)
        {
            var participante = await _context.Participantes
                .Where(p => p.participante_id == id)
                .Select(p => new ParticipanteDto
                {
                    participante_id = p.participante_id,
                    nombre = p.nombre,
                    apellido = p.apellido,
                    email = p.email,
                    telefono = p.telefono
                })
                .FirstOrDefaultAsync();

            if (participante == null)
            {
                return NotFound();
            }

            return Ok(participante);
        }

        // POST: api/Participantes
        [HttpPost]
        public async Task<ActionResult<ParticipanteDto>> CreateParticipante(CreateParticipanteDto createParticipanteDto)
        {
            // Verificar si el email ya existe
            var existeEmail = await _context.Participantes
                .AnyAsync(p => p.email == createParticipanteDto.email);

            if (existeEmail)
            {
                return BadRequest("Ya existe un participante con este email");
            }

            var participante = new ParticipanteModel
            {
                nombre = createParticipanteDto.nombre,
                apellido = createParticipanteDto.apellido,
                email = createParticipanteDto.email,
                telefono = createParticipanteDto.telefono
            };

            _context.Participantes.Add(participante);
            await _context.SaveChangesAsync();

            var participanteDto = new ParticipanteDto
            {
                participante_id = participante.participante_id,
                nombre = participante.nombre,
                apellido = participante.apellido,
                email = participante.email,
                telefono = participante.telefono
            };

            return CreatedAtAction(nameof(GetParticipante), new { id = participante.participante_id }, participanteDto);
        }

        // PUT: api/Participantes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateParticipante(int id, UpdateParticipanteDto updateParticipanteDto)
        {
            var participante = await _context.Participantes.FindAsync(id);

            if (participante == null)
            {
                return NotFound();
            }

            // Verificar si el nuevo email ya existe (excepto para el mismo participante)
            var existeEmail = await _context.Participantes
                .AnyAsync(p => p.email == updateParticipanteDto.email && p.participante_id != id);

            if (existeEmail)
            {
                return BadRequest("Ya existe un participante con este email");
            }

            participante.nombre = updateParticipanteDto.nombre;
            participante.apellido = updateParticipanteDto.apellido;
            participante.email = updateParticipanteDto.email;
            participante.telefono = updateParticipanteDto.telefono;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParticipanteExists(id))
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

        // DELETE: api/Participantes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParticipante(int id)
        {
            var participante = await _context.Participantes.FindAsync(id);
            if (participante == null)
            {
                return NotFound();
            }

            _context.Participantes.Remove(participante);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ParticipanteExists(int id)
        {
            return _context.Participantes.Any(p => p.participante_id == id);
        }
    }
}
