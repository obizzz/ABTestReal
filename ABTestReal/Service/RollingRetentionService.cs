using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using ABTestReal.Models;

namespace ABTestReal.Service
{
    public class RollingRetentionService : IRollingRetentionService
    {
        public IEnumerable<double> CalculateRollingRetention(IEnumerable<Record> records, int retentionLength)
        {
            var retentionEnd = DateTime.Now.Date;
            var retentionStart = retentionEnd.AddDays(retentionLength * (-1));

            var activityDays = new int[retentionLength];
            var regDays = new int[retentionLength];
            var statistics = new double[retentionLength];

            foreach (var record in records)
            {
                if (record.DateLastActivity < retentionStart)
                {
                    continue;
                }

                if (record.DateLastActivity <= retentionEnd)
                {
                    var lastActivityDay = retentionLength - (retentionEnd - record.DateLastActivity).Days - 1;
                    var regDay = retentionLength - (retentionEnd - record.DateRegistration).Days - 1;
                    if (regDay < 0)
                    {
                        regDay = 0;
                    }
                    
                    for (int i = regDay; i <= lastActivityDay; i++)
                    {
                        activityDays[i]++;
                    }

                    for (int i = regDay; i < retentionLength; i++)
                    {
                        regDays[i]++;
                    }
                }
            }

            for (int i = 0; i < retentionLength; i++)
            {
                statistics[i] = (double) activityDays[i] / regDays[i];
                if (double.IsNaN(statistics[i]))
                {
                    statistics[i] = 0;
                }
            }

            return statistics;
        }
    }
}