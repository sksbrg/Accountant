using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Accountant.Web.Models
{
    public class FileTransactionRepository : ITransactionRepository
    {
        private readonly IList<Transaction> _transactions = new List<Transaction>();
        private readonly string _filePath;

        public IEnumerable<Transaction> AllItems
        {
            get
            {
                return _transactions;
            }
        }

        public FileTransactionRepository(string filePath)
        {
            _filePath = filePath;

            if (!File.Exists(_filePath))
            {
                File.Create(_filePath).Dispose();
            }
            
            JsonSerializer serializer = new JsonSerializer();
            _transactions = JsonConvert.DeserializeObject<IList<Transaction>>(File.ReadAllText(_filePath));
        }

        public Transaction GetById(int id)
        {
            return _transactions.FirstOrDefault(x => x.Id == id);
        }

        public void Add(Transaction item)
        {
            item.Id = 1 + _transactions.Max(x => (int?)x.Id) ?? 0;
            _transactions.Add(item);
            SaveData();
        }

        public bool TryDelete(int id)
        {
            var transaction = GetById(id);
            if (transaction == null)
            {
                return false;
            }

            _transactions.Remove(transaction);
            SaveData();

            return true;
        }

        public bool TryUpdate(int id, Transaction updatedTransaction)
        {
            var originalTransaction = GetById(id);
            if (originalTransaction == null)
            {
                return false;
            }

            originalTransaction.AccountId = updatedTransaction.AccountId;
            originalTransaction.Amount = updatedTransaction.Amount;
            originalTransaction.Date = updatedTransaction.Date;
            originalTransaction.Notes = updatedTransaction.Notes;
            originalTransaction.Type = updatedTransaction.Type;
            originalTransaction.Tags = updatedTransaction.Tags;

            SaveData();

            return true;
        }

        private void SaveData()
        {
            var data = JsonConvert.SerializeObject(_transactions, Formatting.Indented);
            File.WriteAllText(_filePath, data);
        }
    }
}