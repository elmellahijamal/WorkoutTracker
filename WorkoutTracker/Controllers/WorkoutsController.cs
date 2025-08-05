using MediatR;
using Microsoft.AspNetCore.Mvc;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Application.Queries;
using WorkoutTracker.Domain.Events;
using WorkoutTracker.Domain.Exceptions;

[ApiController]
[Route("api/[controller]")]
public class WorkoutsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WorkoutsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateWorkout(CreateWorkoutCommand command)
    {
        try
        {
            var workoutId = await _mediator.Send(command);
            return Ok(new { Id = workoutId });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetWorkouts(int userId)
    {
        try
        {
            var query = new GetWorkoutsQuery(userId);
            var workouts = await _mediator.Send(query);
            return Ok(workouts);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetWorkout(int id)
    {
        try
        {
            var query = new GetWorkoutByIdQuery { Id = id };
            var workout = await _mediator.Send(query);
            return Ok(workout);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkout(int id, UpdateWorkoutCommand command)
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
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkout(int id)
    {
        try
        {
            var command = new DeleteWorkoutCommand { Id = id };
            await _mediator.Send(command);
            return Ok();
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }

    [HttpPost("{workoutId}/exercises")]
    public async Task<IActionResult> AddExerciseToWorkout(int workoutId, AddExerciseToWorkoutCommand command)
    {
        try
        {
            command.WorkoutId = workoutId;
            var workoutExerciseId = await _mediator.Send(command);
            return Ok(new { Id = workoutExerciseId });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }

    [HttpPut("exercises/{workoutExerciseId}")]
    public async Task<IActionResult> UpdateWorkoutExercise(int workoutExerciseId, UpdateWorkoutExerciseCommand command)
    {
        try
        {
            command.Id = workoutExerciseId;
            await _mediator.Send(command);
            return Ok();
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }

    [HttpDelete("exercises/{workoutExerciseId}")]
    public async Task<IActionResult> RemoveExerciseFromWorkout(int workoutExerciseId)
    {
        try
        {
            var command = new RemoveExerciseFromWorkoutCommand { WorkoutExerciseId = workoutExerciseId };
            await _mediator.Send(command);
            return Ok();
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }

    [HttpPost("{workoutId}/complete")]
    public async Task<IActionResult> CompleteWorkout(int workoutId)
    {
        try
        {
            var getQuery = new GetWorkoutByIdQuery { Id = workoutId };
            var workout = await _mediator.Send(getQuery);

            if (workout == null)
                return NotFound(new { message = "Workout not found." });

            if (!workout.UserId.HasValue)
                return BadRequest(new { message = "Cannot complete workout: no user assigned." });

            var updateCommand = new UpdateWorkoutCommand
            {
                Id = workoutId,
                Name = workout.Name,
                Date = workout.Date,
                IsCompleted = true
            };

            await _mediator.Send(updateCommand);

            var workoutCompletedEvent = new WorkoutCompletedEvent(workoutId, workout.UserId.Value, workout.Name);
            await _mediator.Publish(workoutCompletedEvent);

            return Ok(new { Message = "Workout completed successfully!" });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
        }
    }


    [HttpPost("{workoutId}/start")]
    public async Task<IActionResult> StartWorkout(int workoutId)
    {
        try
        {
            var getQuery = new GetWorkoutByIdQuery { Id = workoutId };
            var workout = await _mediator.Send(getQuery);

            if (workout == null)
                return NotFound(new { message = "Workout not found." });

            if (!workout.UserId.HasValue)
                return BadRequest(new { message = "Cannot start workout: no user assigned." });

            var workoutStartedEvent = new WorkoutStartedEvent(workoutId, workout.UserId.Value, workout.Name);
            await _mediator.Publish(workoutStartedEvent);

            return Ok(new { Message = "Workout started successfully!" });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
        }
    }

    [HttpGet("unassigned")]
    public async Task<IActionResult> GetUnassignedWorkouts()
    {
        try
        {
            // Get workouts where UserId = 0 (unassigned)
            var query = new GetWorkoutsQuery(0); // UserId = 0 means unassigned
            var unassignedWorkouts = await _mediator.Send(query);
            return Ok(unassignedWorkouts);
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }

    [HttpPost("{workoutId}/assign")]
    public async Task<IActionResult> AssignWorkout(int workoutId, AssignWorkoutCommand command)
    {
        try
        {
            command.WorkoutId = workoutId;
            await _mediator.Send(command);
            return Ok(new { Message = "Workout assigned successfully!" });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }


    [HttpPost("create-and-assign")]
    public async Task<IActionResult> CreateAndAssignWorkout([FromBody] CreateWorkoutCommand command)
    {
        try
        {
            var workoutId = await _mediator.Send(command);
            return Ok(new { WorkoutId = workoutId, message = "Workout created and assigned successfully!" });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (BusinessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Unexpected error occurred", detail = ex.Message });
        }
    }


}
