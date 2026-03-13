using ParkingManagementAPI.Entities;

namespace ParkingManagementAPI.Data;

public static class DataSeeder
{
    public static void Seed(AppDbContext context)
    {
        // Seed Admin User
        if (!context.AdminUsers.Any(u => u.Username == "admin"))
        {
            context.AdminUsers.Add(new AdminUser
            {
                Id = Guid.NewGuid().ToString(),
                Username = "admin",
                PasswordHash = Controllers.AuthController.HashPassword("0000"),
                DisplayName = "System Admin",
                CreatedAt = DateTime.UtcNow
            });
            context.SaveChanges();
        }

        if (context.ParkingSlots.Any()) return; // Already seeded

        var now = DateTime.UtcNow;

        // 20 parking slots (A-01 to E-04)
        var slots = new List<ParkingSlot>();
        var blocks = new[] { "A", "B", "C", "D", "E" };
        var slotTypes = new[] { "compact", "compact", "standard", "standard", "large", "large", "standard", "handicapped" };
        int slotIndex = 0;

        foreach (var block in blocks)
        {
            for (int i = 1; i <= 4; i++)
            {
                slots.Add(new ParkingSlot
                {
                    Id = "S" + (slotIndex + 1).ToString("D3"),
                    SlotNumber = $"{block}-{i:D2}",
                    SlotType = slotTypes[slotIndex % slotTypes.Length],
                    IsAvailable = true,
                    CreatedAt = now.AddDays(-30),
                    UpdatedAt = now,
                });
                slotIndex++;
            }
        }

        context.ParkingSlots.AddRange(slots);
        context.SaveChanges();

        // 25 parking sessions (6 active, 19 completed)
        var vehicleTypes = new[] { "car", "motorcycle", "suv", "truck" };
        var feeRates = new Dictionary<string, decimal>
        {
            { "car", 0.50m }, { "motorcycle", 0.33m }, { "suv", 0.65m }, { "truck", 0.70m }
        };

        var names = new[] { "Ramesh Patil", "Suresh Deshmukh", "Priya Sharma", "Amit Kulkarni", "Neha Singh" };
        var phones = new[] { "+919876543210", "+918765432109", "+917654321098", "+919988776655", "+918877665544" };
        var licenses = new[] { "MH1220101234567", "MH1420159876543", "MH0920184561237", "MH0120197894561", "MH0420213216549" };

        var sessions = new List<ParkingSession>();

        // 19 completed sessions spread over last 7 days
        for (int i = 0; i < 19; i++)
        {
            var vType = vehicleTypes[i % vehicleTypes.Length];
            var slotNum = slots[i % slots.Count].SlotNumber;
            var entry = now.AddDays(-((i % 7) + 1)).AddHours(8 + (i % 10));
            var durationMin = 30 + (i * 17) % 240;
            
            // Generate a fake fine for a specific past session (e.g. index 5)
            var expected = (i == 5) ? 60 : (durationMin > 120 ? 120 : durationMin + 30);
            if (i == 5) durationMin = 180; // 3 hours parked, but 1 hour expected -> 2 hours fine!
            
            var fee = Math.Round(durationMin * feeRates[vType], 2);
            var fine = durationMin > expected ? Math.Round((durationMin - expected) * (feeRates[vType] * 2), 2) : 0m;

            sessions.Add(new ParkingSession
            {
                Id = "PS" + (i + 1).ToString("D3"),
                VehicleNumber = $"MH-{10 + i}-{(char)('A' + i % 26)}{(char)('A' + (i * 3) % 26)}-{1000 + i * 111}",
                VehicleType = vType,
                AssignedSlot = slotNum,
                DriverName = names[i % names.Length],
                PhoneNumber = phones[i % phones.Length],
                LicenseNumber = licenses[i % licenses.Length],
                EntryTime = entry,
                ExitTime = entry.AddMinutes(durationMin),
                Duration = durationMin,
                ExpectedDuration = expected,
                Fee = fee,
                Fine = fine,
                Status = "completed",
            });
        }

        // 6 active sessions — occupy 6 slots
        var activeSlots = new[] { "A-02", "A-04", "B-03", "C-02", "D-02", "E-01" };
        var activeVehicles = new[]
        {
            ("MH-12-AB-1234", "car", "Karan Joshi", "+919012345678", "MH1220224567890", 60), // Active 1
            ("MH-14-CD-5678", "suv", "Priya Sharma", "+917654321098", "MH0920184561237", 120),
            ("MH-01-EF-9012", "motorcycle", "Rahul Verma", "+918098765432", "MH0120151234567", 30),
            ("MH-43-GH-3456", "car", "Sneha Rao", "+919988112233", "MH4320199876543", 240),
            ("MH-20-IJ-7890", "truck", "Vikram Singh", "+918877665544", "MH2020104567891", 480), // Long stay
            ("MH-05-KL-2345", "suv", "Anjali Mehta", "+917766554433", "MH0520211234567", 60) // Will be in fine mode if parked > 1 hr
        };

        for (int i = 0; i < 6; i++)
        {
            // For the last vehicle (index 5), manually set entry time to 3 hours ago, but expected is 60m to demo fine calculation on active exit.
            var activeEntryTime = (i == 5) ? now.AddHours(-3) : now.AddHours(-(1 + i * 0.5));

            sessions.Add(new ParkingSession
            {
                Id = "PS" + (20 + i).ToString("D3"),
                VehicleNumber = activeVehicles[i].Item1,
                VehicleType = activeVehicles[i].Item2,
                AssignedSlot = activeSlots[i],
                DriverName = activeVehicles[i].Item3,
                PhoneNumber = activeVehicles[i].Item4,
                LicenseNumber = activeVehicles[i].Item5,
                EntryTime = activeEntryTime,
                ExitTime = null,
                Duration = null,
                ExpectedDuration = activeVehicles[i].Item6,
                Fee = null,
                Fine = null,
                Status = "active",
            });

            // Mark those slots as occupied
            var slot = slots.First(s => s.SlotNumber == activeSlots[i]);
            slot.IsAvailable = false;
            slot.UpdatedAt = now;
        }

        context.ParkingSessions.AddRange(sessions);
        context.SaveChanges();

        // Update occupied slots
        context.ParkingSlots.UpdateRange(slots.Where(s => !s.IsAvailable));
        context.SaveChanges();
    }
}
