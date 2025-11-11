using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BiddingService.Enums;
using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Services
{
    public class CheckAuctionFinished : BackgroundService
    {
        private readonly ILogger<CheckAuctionFinished> _logger;
        private readonly IServiceProvider _serviceProvider;

        public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("CheckAuctionFinished Service is starting.");

            stoppingToken.Register(() => _logger.LogInformation("CheckAuctionFinished Service is stopping."));

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("CheckAuctionFinished Service is doing background work.");

                await CheckAuctions(stoppingToken);

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        private async Task CheckAuctions(CancellationToken stoppingToken)
        {
            var auctions = await DB.Find<Auction>()
                .Match(a => a.AutionEnd <= DateTime.UtcNow && !a.Finished)
                .ExecuteAsync(stoppingToken);

            if (auctions.Count is 0) return;

            _logger.LogInformation("Found {Count} auctions to finish.", auctions.Count);

            foreach (var auction in auctions)
            {
                try
                {
                    auction.Finished = true;
                    await auction.SaveAsync(null, stoppingToken);

                    using var scope = _serviceProvider.CreateScope();
                    var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();
                    var winningBid = await DB.Find<Bid>()
                        .Match(b => b.AuctionID == auction.ID && b.Status == BidStatus.Accepted)
                        .Sort(b => b.Descending(bid => bid.Amount))
                        .ExecuteFirstAsync(stoppingToken);

                    await endpoint.Publish(new AuctionFinished
                    {
                        AuctionID = auction.ID,
                        ItemSold = winningBid is not null,
                        Winner = winningBid?.ID,
                        Seller = auction.Seller,
                        Amount = winningBid?.Amount
                    }, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while checking and finishing auctions. AuctionID: {AuctionID}", auction.ID);
                }
            }
        }
    }
}