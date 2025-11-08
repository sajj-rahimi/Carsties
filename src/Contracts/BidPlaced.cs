namespace Contracts;

public class BidPlaced
{
    public string ID { get; set; }
    public string AuctionID { get; set; }
    public string Bidder { get; set; }
    public DateTime BidTime { get; set; }
    public int Amount { get; set; }
    public string Status { get; set; }
}