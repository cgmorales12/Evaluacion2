namespace GestionEventosDeportivos.Models.Dtos
{
    public class InscripcionDto
    {
        public int inscripcion_id { get; set; }
        public int evento_id { get; set; }
        public int participante_id { get; set; }
        public DateTime fecha_inscripcion { get; set; }
        public string estado { get; set; }

        // Datos adicionales para mostrar
        public string evento_nombre { get; set; }
        public string participante_nombre_completo { get; set; }
    }

    public class CreateInscripcionDto
    {
        public int evento_id { get; set; }
        public int participante_id { get; set; }
    }

    public class UpdateInscripcionDto
    {
        public string estado { get; set; }
    }
}