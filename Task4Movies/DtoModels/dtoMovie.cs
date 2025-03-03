using System.ComponentModel.DataAnnotations;

namespace Task4Movies.DtoModels
{
    public class dtoMovie
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? VidUrl { get; set; }
        public string? Director { get; set; }
        public string? Genre { get; set; }
        public int? Year { get; set; }
        public double? Rating { get; set; }
        public string? PosterUrl { get; set; }
    }
}
