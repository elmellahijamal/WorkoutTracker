using FluentValidation;
using WorkoutTracker.Application.Commands;

namespace WorkoutTracker.Application.Validators
{
    public class CreateWorkoutCommandValidator : AbstractValidator<CreateWorkoutCommand>
    {
        public CreateWorkoutCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Workout name is required")
                .MaximumLength(100).WithMessage("Workout name cannot exceed 100 characters");

            RuleFor(x => x.Date)
                .NotEmpty().WithMessage("Workout date is required")
                .Must(date => date >= DateTime.Today.AddDays(-30))
                .WithMessage("Workout date cannot be more than 30 days in the past");

            /*RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("Valid user ID is required");*/
        }
    }

    public class UpdateWorkoutCommandValidator : AbstractValidator<UpdateWorkoutCommand>
    {
        public UpdateWorkoutCommandValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid workout ID is required");
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Workout name is required")
                .MaximumLength(100).WithMessage("Workout name cannot exceed 100 characters");
            RuleFor(x => x.Date)
                .NotEmpty().WithMessage("Workout date is required");
        }
    }
}