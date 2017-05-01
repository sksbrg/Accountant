using System.Collections.Generic;

namespace Accountant.Web.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public long Date { get; set; }
        public string Notes { get; set; }
        public int AccountId { get; set; }
        public TransactionType Type { get; set; }
        public IList<string> Tags { get; set; }
    }
}
