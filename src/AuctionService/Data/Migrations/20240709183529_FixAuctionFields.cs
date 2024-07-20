using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuctionService.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixAuctionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "year",
                table: "Items",
                newName: "Year");

            migrationBuilder.RenameColumn(
                name: "Mieleage",
                table: "Items",
                newName: "Mileage");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Year",
                table: "Items",
                newName: "year");

            migrationBuilder.RenameColumn(
                name: "Mileage",
                table: "Items",
                newName: "Mieleage");
        }
    }
}
