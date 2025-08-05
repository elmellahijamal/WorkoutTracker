using MediatR;
using Microsoft.AspNetCore.Mvc;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Application.Queries;
using WorkoutTracker.Domain.Exceptions;

namespace WorkoutTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoachController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CoachController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var query = new GetUsersQuery();
                var users = await _mediator.Send(query);
                var regularUsers = users.Where(u => u.Role == "User");

                return Ok(regularUsers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        
    }
}