using System;
using System.Collections;
using System.Collections.Generic;
using ABTestReal.Data;
using ABTestReal.Service;
using Microsoft.AspNetCore.Mvc;

namespace ABTestReal.Controllers
{
    [Route("api/[controller]")]
    public class RollingRetentionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private IServiceProvider Provider { get; set; }
        private IRollingRetentionService RollingRetentionService { get; set; }

        public RollingRetentionController(ApplicationDbContext context, IRollingRetentionService rollingRetentionService)
        {
            _context = context;
            RollingRetentionService = rollingRetentionService;
        }
        
        [HttpGet]
        public IEnumerable<double> Get()
        {
            return RollingRetentionService.CalculateRollingRetention(_context.Records, 7);
        }
    }
}