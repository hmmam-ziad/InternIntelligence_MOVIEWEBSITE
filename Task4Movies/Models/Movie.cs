using System.ComponentModel.DataAnnotations;

namespace Task4Movies.Models
{
    public class Movie
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Title { get; set; }
        [Required]
        public string? Description { get; set; }
        public string? VidUrl { get; set; }
        public string? Director { get; set; }
        public string? Genre { get; set; }
        public int? Year { get; set; }
        public double? Rating { get; set; }
        public string? PosterUrl { get; set; }
    }
}
