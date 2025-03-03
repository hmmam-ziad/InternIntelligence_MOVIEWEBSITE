using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Task4Movies.Data;
using Task4Movies.DtoModels;
using Task4Movies.Models;

namespace Task4Movies.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public MoviesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetMovies()
        {
            var movies = await _context.Movies.ToListAsync();
            if (movies == null)
            {
                return NotFound();
            }
            return Ok(movies);
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            Movie? movie = await _context.Movies.FirstOrDefaultAsync(x => x.Id == id);
            if (movie == null)
            {
                return NotFound();
            }
            return Ok(movie);
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddMovie([FromBody]dtoMovie dtoMovie)
        {
            if (ModelState.IsValid)
            {
                Movie movie = new()
                {
                    Title = dtoMovie.Title,
                    Description = dtoMovie.Description,
                    VidUrl = dtoMovie.VidUrl,
                    Director = dtoMovie.Director,
                    Genre = dtoMovie.Genre,
                    Year = dtoMovie.Year,
                    Rating = dtoMovie.Rating,
                    PosterUrl = dtoMovie.PosterUrl
                };
                _context.Movies.Add(movie);
                await _context.SaveChangesAsync();
                return Ok(movie);
            }
            return BadRequest(ModelState);
        }

        [HttpPut("[action]/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] dtoMovie dtoMovie)
        {
            if (ModelState.IsValid)
            {
                Movie? movie = await _context.Movies.FirstOrDefaultAsync(x => x.Id == id);
                if (movie == null)
                {
                    return NotFound();
                }
                movie.Title = dtoMovie.Title;
                movie.Description = dtoMovie.Description;
                movie.VidUrl = dtoMovie.VidUrl;
                movie.Director = dtoMovie.Director;
                movie.Genre = dtoMovie.Genre;
                movie.Year = dtoMovie.Year;
                movie.Rating = dtoMovie.Rating;
                movie.PosterUrl = dtoMovie.PosterUrl;
                await _context.SaveChangesAsync();
                return Ok(movie);
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("[action]/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            Movie? movie = await _context.Movies.FirstOrDefaultAsync(x => x.Id == id);
            if (movie == null)
            {
                return NotFound();
            }
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
            return Ok(movie);
        }
    }
}
