using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkoutTracker.Application.DTOS
{
    public class CreateUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
