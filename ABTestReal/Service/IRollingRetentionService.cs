using System.Collections.Generic;
using ABTestReal.Models;

namespace ABTestReal.Service
{
    public interface IRollingRetentionService
    {
        IEnumerable<double> CalculateRollingRetention(IEnumerable<Record> records, int retentionLength);
    }
}