using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABTestReal.Data;
using ABTestReal.Models;
using ABTestReal.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ABTestReal.Controllers
{
    [Route("api/[controller]")]
    public class RecordController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecordController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Record> Get()
        {
            return _context.Records;
        }
        
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]List<Record> data)
        {
            foreach (var record in data)
            {
                if (record.UserId < 0)
                {
                    ModelState.AddModelError("UserId", "UserID must be greater than or equal to 0");
                }

                if (record.DateRegistration == DateTime.MinValue)
                {
                    ModelState.AddModelError("DateRegistration", "DateRegistration must be non-empty");
                }
                
                if (record.DateLastActivity == DateTime.MinValue)
                {
                    ModelState.AddModelError("DateLastActivity", "DateLastActivity must be non-empty");
                }
            }

            if (ModelState.IsValid)
            {
                foreach (var record in _context.Records)
                {
                    if (!data.Contains(record))
                    {
                        _context.Records.Remove(record);
                    }
                }

                foreach (var record in data)
                {
                    if (!_context.Records.Contains(record))
                    {
                        await _context.Records.AddAsync(record);
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(_context.Records);
            }

            return StatusCode(500);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            Record record =  await _context.Records.FirstOrDefaultAsync(x => x.UserId == id);
            if (record == null)
            {
                return NotFound();
            }
            _context.Records.Remove(record);
            await _context.SaveChangesAsync();
            return Ok(record);
        }
    }
}