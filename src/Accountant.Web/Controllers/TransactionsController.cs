using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Accountant.Web.Models;

namespace Accountant.Web.Controllers
{
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionRepository _repository;

        public TransactionsController(ITransactionRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IEnumerable<Transaction> Get()
        {
            return _repository.AllItems;
        }

        [HttpGet("{id:int}", Name = "GetByIdRoute")]
        public ActionResult<Transaction> Get(int id)
        {
            var transaction = _repository.GetById(id);

            if (transaction == null)
            {
                return NotFound(id);
            }

            return transaction;
        }

        [HttpPost]
        public ActionResult<Transaction> Post([FromBody]Transaction transaction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                _repository.Add(transaction);

                return CreatedAtAction(nameof(Get), new { id = transaction.Id }, transaction);
            }
        }

        [HttpPut("{id:int}")]
        public IActionResult Put(int id, [FromBody]Transaction updatedTransaction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                if (_repository.TryUpdate(id, updatedTransaction))
                {
                    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
                    return NoContent();
                }
                else
                {
                    return NotFound(id);
                }
            }
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            if (_repository.TryDelete(id))
            {
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
                return NoContent();
            }
            else
            {
                return NotFound(id);
            }
        }
    }
}
