using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Task4Movies.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Net.WebRequestMethods;

namespace Task4Movies.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OMDBController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _url;

        public OMDBController()
        {
            _httpClient = new HttpClient();
            _url = "http://www.omdbapi.com/?i=tt3896198&apikey=f479cd88";
        }


        [HttpGet("[action]/{query}")]
        public async Task<IActionResult> GetMovie([FromRoute] string query)
        {
            var response = await _httpClient.GetAsync($"{_url}&s={query}");
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return NotFound("No movies found.");
        }

        [HttpGet("[action]/{title}")]
        public async Task<IActionResult> GetMovieByTitle([FromRoute] string title)
        {
            var response = await _httpClient.GetAsync($"{_url}&t={title}");

            if (!response.IsSuccessStatusCode)
                return NotFound("Movie not found.");

            var data = await response.Content.ReadAsStringAsync();
            return Ok(data);
        }

        [HttpGet("[action]/{imdbId}")]
        public async Task<IActionResult> GetMovieById([FromRoute]string imdbId)
        {
            string u = $"http://www.omdbapi.com/?i={imdbId}&apikey=f479cd88";
            var response = await _httpClient.GetAsync($"{u}");

            if (!response.IsSuccessStatusCode)
                return NotFound("Movie not found.");

            var data = await response.Content.ReadAsStringAsync();
            return Ok(data);
        }

    }
}
