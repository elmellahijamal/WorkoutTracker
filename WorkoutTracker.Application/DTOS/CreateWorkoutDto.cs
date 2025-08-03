using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkoutTracker.Application.DTOS
{
    public class CreateWorkoutDto
    {
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
    }
}
