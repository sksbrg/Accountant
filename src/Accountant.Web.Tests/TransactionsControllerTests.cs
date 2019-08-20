using System;
using System.Collections.Generic;
using Accountant.Web.Controllers;
using Accountant.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Accountant.Web.Tests
{
    public class TransactionsControllerTests
    {
        [Fact]
        public void Get_ReturnsAListWithAllTransactions()
        {
            // arrange
            var mockRepo = new Mock<ITransactionRepository>();
            mockRepo.Setup(repo => repo.AllItems)
                .Returns(GetTestTransactions());
            
            var controller = new TransactionsController(mockRepo.Object);

            // act
            var result = controller.Get();

            // assert
            var transactions = Assert.IsType<List<Transaction>>(result);
            Assert.Equal(2, transactions.Count);
        }

        [Fact]
        public void Get_ReturnsNotFoundObjectResult_GivenNonexistentTransactionId()
        {
            // arrange
            var mockRepo = new Mock<ITransactionRepository>();
            var controller = new TransactionsController(mockRepo.Object);
            var nonExistentTransactionId = 999;

            // act
            var result = controller.Get(nonExistentTransactionId);

            // assert
            var actionResult = Assert.IsType<ActionResult<Transaction>>(result);
            Assert.IsType<NotFoundObjectResult>(actionResult.Result);
        }

        [Fact]
        public void Get_ReturnsTransaction_GivenExistentTransactionId()
        {
            // arrange
            int existentTransactionId = 123;

            var mockRepo = new Mock<ITransactionRepository>();
            mockRepo.Setup(repo => repo.GetById(existentTransactionId))
                .Returns(GetTestTransaction());

            var controller = new TransactionsController(mockRepo.Object);

            // act
            var result = controller.Get(existentTransactionId);

            // assert
            var actionResult = Assert.IsType<ActionResult<Transaction>>(result);
            var transaction = Assert.IsType<Transaction>(actionResult.Value);
            Assert.Equal(20, transaction.Amount);
        }

        [Fact]
        public void Post_ReturnsBadRequestObjectResult_GivenInvalidModel()
        {
            // arrange
            var mockRepo = new Mock<ITransactionRepository>();
            var controller = new TransactionsController(mockRepo.Object);
            controller.ModelState.AddModelError("error", "some error");

            // act
            var result = controller.Post(transaction: null);

            // assert
            var actionResult = Assert.IsType<ActionResult<Transaction>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public void Post_ReturnsNewlyCreatedTransaction()
        {
            // arrange
            var mockRepo = new Mock<ITransactionRepository>();
            var controller = new TransactionsController(mockRepo.Object);

            // act
            var result = controller.Post(new Transaction());

            // assert
            var actionResult = Assert.IsType<ActionResult<Transaction>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            Assert.IsType<Transaction>(createdAtActionResult.Value);
        }

        [Fact]
        public void Put_ReturnsBadRequestObjectResult_GivenInvalidModel()
        {
            // arrange
            var mockRepo = new Mock<ITransactionRepository>();
            var controller = new TransactionsController(mockRepo.Object);
            controller.ModelState.AddModelError("error", "some error");

            // act
            var result = controller.Put(id: 0, updatedTransaction: null);

            // assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void Put_ReturnsNotFoundObjectResult_GivenNonexistentTransactionId()
        {
            // arrange
            var nonExistentTransactionId = 999;
            var updatedTransaction = new Transaction();

            var mockRepo = new Mock<ITransactionRepository>();
            mockRepo.Setup(repo => repo.TryUpdate(nonExistentTransactionId, updatedTransaction))
                .Returns(false);

            var controller = new TransactionsController(mockRepo.Object);

            // act
            var result = controller.Put(nonExistentTransactionId, updatedTransaction);

            // assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public void Put_ReturnsNoContentResult_WhenUpdateOfTransactionWasSuccessful()
        {
            // arrange
            var existentTransactionId = 42;
            var updatedTransaction = new Transaction();

            var mockRepo = new Mock<ITransactionRepository>();
            mockRepo.Setup(repo => repo.TryUpdate(existentTransactionId, updatedTransaction))
                .Returns(true);

            var controller = new TransactionsController(mockRepo.Object);
            

            // act
            var result = controller.Put(existentTransactionId, updatedTransaction);

            // assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public void Delete_ReturnsNotFoundObjectResult_GivenNonexistentTransactionId()
        {
            // arrange
            var nonExistentTransactionId = 999;

            var mockRepo = new Mock<ITransactionRepository>();
            mockRepo.Setup(repo => repo.TryDelete(nonExistentTransactionId))
                .Returns(false);

            var controller = new TransactionsController(mockRepo.Object);

            // act
            var result = controller.Delete(nonExistentTransactionId);

            // assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public void Delete_ReturnsNoContentResult_WhenUpdateOfTransactionWasSuccessful()
        {
            // arrange
            var existentTransactionId = 42;

            var mockRepo = new Mock<ITransactionRepository>();
            mockRepo.Setup(repo => repo.TryDelete(existentTransactionId))
                .Returns(true);

            var controller = new TransactionsController(mockRepo.Object);


            // act
            var result = controller.Delete(existentTransactionId);

            // assert
            Assert.IsType<NoContentResult>(result);
        }


        private Transaction GetTestTransaction()
        {
            return new Transaction { Amount = 20 };
        }

        private IEnumerable<Transaction> GetTestTransactions()
        {
            /*var transactions = new List<Transaction>
            {
                new Transaction()
                {
                    AccountId = 1,
                    Amount = 5,
                    Date = new DateTime(2016, 7, 2).ToFileTimeUtc(),
                    Notes = "a remark",
                    Tags = { "foo", "bar" },
                    TypeId = 1
                },

                new Transaction()
                {
                    AccountId = 1,
                    Amount = 5,
                    Date = new DateTime(2016, 7, 2).ToFileTimeUtc(),
                    Notes = "a remark",
                    Tags = { "foo", "bar" },
                    TypeId = 1
                }
            };*/
            return new List<Transaction>
            {
                new Transaction(),
                new Transaction()
            };

            //return transactions;
        }
    }
}
