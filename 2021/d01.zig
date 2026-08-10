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

    const T = u16;

    var list: std.ArrayList(T) = .empty;
    defer list.deinit(allocator);

    while (lines.next()) |line| {
        const n = try std.fmt.parseInt(T, line, 10);
        try list.append(allocator, n);
    }

    const ns = try list.toOwnedSlice(allocator);
    defer allocator.free(ns);

    const lanes = std.simd.suggestVectorLength(T).?;
    std.debug.print("Using {} lanes\n", .{lanes});

    const Vec = @Vector(lanes, T);

    var total: u32 = 0;
    var x: u32 = 100000; // For perf analysis

    // Using SIMD for 8x parallel comparisons
    // https://mitchellh.com/writing/everyone-should-know-simd
    // On my mac :
    // - without SIMD: 0.85s
    // - with SIMD: 0.3s
    while (x > 0) : (x -= 1) {
        var end: u32 = 0;
        while (end + lanes < ns.len) : (end += lanes) {
            const v1: Vec = ns[(end + 1)..][0..lanes].*;
            const v2: Vec = ns[end..][0..lanes].*;
            const mask: std.meta.Int(.unsigned, lanes) = @bitCast(v1 > v2);
            total += @popCount(mask);
        }

        while (end < ns.len) : (end += 1) {
            if (ns[end] > ns[end - 1]) {
                total += 1;
            }
        }
    }

    std.debug.print("total = {any}\n", .{total / 100000});
}
