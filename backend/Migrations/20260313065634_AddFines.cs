using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ParkingManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddFines : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ParkingSlots",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    SlotNumber = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    SlotType = table.Column<string>(type: "TEXT", maxLength: 15, nullable: false),
                    IsAvailable = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParkingSlots", x => x.Id);
                    table.UniqueConstraint("AK_ParkingSlots_SlotNumber", x => x.SlotNumber);
                });

            migrationBuilder.CreateTable(
                name: "ParkingSessions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    VehicleNumber = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    VehicleType = table.Column<string>(type: "TEXT", maxLength: 15, nullable: false),
                    AssignedSlot = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    EntryTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ExitTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Duration = table.Column<int>(type: "INTEGER", nullable: true),
                    ExpectedDuration = table.Column<int>(type: "INTEGER", nullable: true),
                    Fee = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Fine = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 15, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParkingSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ParkingSessions_ParkingSlots_AssignedSlot",
                        column: x => x.AssignedSlot,
                        principalTable: "ParkingSlots",
                        principalColumn: "SlotNumber",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ParkingSessions_AssignedSlot",
                table: "ParkingSessions",
                column: "AssignedSlot");

            migrationBuilder.CreateIndex(
                name: "IX_ParkingSessions_EntryTime",
                table: "ParkingSessions",
                column: "EntryTime");

            migrationBuilder.CreateIndex(
                name: "IX_ParkingSessions_EntryTime_Status",
                table: "ParkingSessions",
                columns: new[] { "EntryTime", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_ParkingSessions_ExitTime",
                table: "ParkingSessions",
                column: "ExitTime");

            migrationBuilder.CreateIndex(
                name: "IX_ParkingSessions_Status",
                table: "ParkingSessions",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ParkingSessions_VehicleNumber",
                table: "ParkingSessions",
                column: "VehicleNumber");

            migrationBuilder.CreateIndex(
                name: "IX_ParkingSlots_IsAvailable",
                table: "ParkingSlots",
                column: "IsAvailable");

            migrationBuilder.CreateIndex(
                name: "IX_ParkingSlots_SlotNumber",
                table: "ParkingSlots",
                column: "SlotNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ParkingSlots_SlotType",
                table: "ParkingSlots",
                column: "SlotType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ParkingSessions");

            migrationBuilder.DropTable(
                name: "ParkingSlots");
        }
    }
}
