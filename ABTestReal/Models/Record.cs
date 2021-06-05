using System;
using System.ComponentModel.DataAnnotations;

namespace ABTestReal.Models
{
    public class Record
    {
        [Key]
        [Required(ErrorMessage ="Set unique User ID")]
        [Range(0, int.MaxValue, ErrorMessage = "UserID must be greater than or equal to 0")]
        public int UserId { get; set; }
        
        [Required(ErrorMessage ="Set registration date")]
        public DateTime DateRegistration { get; set; }
        
        [Required(ErrorMessage ="Set last activity date")]
        public DateTime DateLastActivity { get; set; }
    }
}