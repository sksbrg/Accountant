using System.Collections.Generic;

namespace Accountant.Web.Models
{
    public interface ITransactionRepository
    {
        IEnumerable<Transaction> AllItems { get; }
        void Add(Transaction item);
        Transaction GetById(int id);
        bool TryDelete(int id);
        bool TryUpdate(int id, Transaction updatedTransaction);
    }
}
