using MediatR;
using Microsoft.AspNetCore.Mvc;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Application.Queries;
using WorkoutTracker.Domain.Exceptions;

namespace WorkoutTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExercisesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ExercisesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> CreateExercise(CreateExerciseCommand command)
        {
            try
            {
                var exerciseId = await _mediator.Send(command);
                return Ok(new { Id = exerciseId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetExercises()
        {
            try
            {
                var query = new GetExercisesQuery();
                var exercises = await _mediator.Send(query);
                return Ok(exercises);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExercise(int id)
        {
            try
            {
                var query = new GetExerciseByIdQuery { Id = id };
                var exercise = await _mediator.Send(query);
                return Ok(exercise);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExercise(int id, UpdateExerciseCommand command)
        {
            try
            {
                command.Id = id;
                await _mediator.Send(command);
                return Ok();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


    [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExercise(int id)
        {
            try
            {
                var command = new DeleteExerciseCommand { Id = id };
                await _mediator.Send(command);
                return Ok();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
