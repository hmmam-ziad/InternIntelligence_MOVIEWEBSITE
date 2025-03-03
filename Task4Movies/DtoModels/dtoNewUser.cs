using System.ComponentModel.DataAnnotations;

namespace Task4Movies.DtoModels
{
    public class dtoNewUser
    {
        [Required]
        public string? UserName { get; set; }
        [Required]
        public string? Email { get; set; }
        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", ErrorMessage = "Password must have at least 8 characters, one uppercase, one lowercase, one number, and one special character.")]
        public string? Password { get; set; }
    }
}
