using System;

namespace GestionEventosDeportivos.Models.Dtos
{
    public class CitaDto
    {
        public int cita_id { get; set; }
        public DateTime fecha_cita { get; set; }
        public TimeSpan hora_inicio { get; set; }
        public TimeSpan hora_fin { get; set; }
        public string? motivo { get; set; }
    }
}
