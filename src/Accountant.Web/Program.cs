using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace Accountant.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var webHost = new WebHostBuilder()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseKestrel()
                .UseIISIntegration()
                .ConfigureLogging((hostingContext, logging) => {
                    logging.AddConsole();
                })
                .UseStartup<Startup>()
                .Build();

            webHost.Run();
        }
    }
}
