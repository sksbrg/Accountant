using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Accountant.Web.Models;

namespace Accountant.Controllers.Controllers
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
        public IActionResult Get(int id)
        {
            var transaction = _repository.GetById(id);

            if (transaction == null)
            {
                return NotFound();
            }

            return new ObjectResult(transaction);
        }

        [HttpPost]
        public void Post([FromBody]Transaction transaction)
        {
            if (!ModelState.IsValid)
            {
                HttpContext.Response.StatusCode = 400;
            }
            else
            {
                _repository.Add(transaction);

                string url = Url.RouteUrl("GetByIdRoute", new { id = transaction.Id },
                    Request.Scheme, Request.Host.ToUriComponent());

                HttpContext.Response.StatusCode = 201;
                HttpContext.Response.Headers["Location"] = url;
            }
        }

        [HttpPut("{id:int}")]
        public IActionResult Put(int id, [FromBody]Transaction updatedTransaction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            else
            {
                if (_repository.TryUpdate(id, updatedTransaction))
                {
                    return NoContent();
                }
                else
                {
                    return NotFound();
                }
            }
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            if (_repository.TryDelete(id))
            {
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }
    }
}
