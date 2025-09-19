namespace GestionEventosDeportivos.Models.Dtos
{
    public class EventoDto
    {
        public int evento_id { get; set; }
        public string nombre { get; set; }
        public DateTime fecha { get; set; }
        public string ubicacion { get; set; }
        public string descripcion { get; set; }
        public int total_participantes { get; set; } = 0;
    }

    public class CreateEventoDto
    {
        public string nombre { get; set; }
        public DateTime fecha { get; set; }
        public string ubicacion { get; set; }
        public string descripcion { get; set; }
    }

    public class UpdateEventoDto
    {
        public string nombre { get; set; }
        public DateTime fecha { get; set; }
        public string ubicacion { get; set; }
        public string descripcion { get; set; }
    }
}