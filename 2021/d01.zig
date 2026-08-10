const std = @import("std");

pub fn main() !void {
    var da: std.heap.DebugAllocator(.{}) = .init;
    defer {
        if (da.deinit() == .leak) {
            std.debug.print("MEMORY LEAKED!\n", .{});
        }
    }
    const allocator = da.allocator();

    var threaded: std.Io.Threaded = .init(allocator, .{});
    defer threaded.deinit();
    const io = threaded.io();

    const cwd = std.Io.Dir.cwd();
    const bytes = try cwd.readFileAlloc(io, "inputs/d01.txt", allocator, .unlimited);
    defer allocator.free(bytes);

    var lines = std.mem.tokenizeScalar(u8, bytes, '\n');

    var list: std.ArrayList(u16) = .empty;
    defer list.deinit(allocator);

    while (lines.next()) |line| {
        const n = try std.fmt.parseInt(u16, line, 10);
        try list.append(allocator, n);
    }

    const ns = try list.toOwnedSlice(allocator);
    defer allocator.free(ns);

    var total: u32 = 0;
    var x: u32 = 100000;

    while (x > 0) : (x -= 1) {
        for (ns, 0..) |n, i| {
            // std.debug.print("{any} {any}\n", .{ i, n });
            if (i > 0 and n > ns[i - 1]) {
                total += 1;
            }
        }
    }

    std.debug.print("total = {any}\n", .{total / 100000});
}
