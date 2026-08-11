const std = @import("std");
const input = @embedFile("inputs/d01.txt");

pub fn countIncreases(ns: []u16) u32 {
    const lanes = std.simd.suggestVectorLength(u16).?;

    const Vec = @Vector(lanes, u16);

    var total: u32 = 0;

    // Using SIMD for 8x parallel comparisons
    // https://mitchellh.com/writing/everyone-should-know-simd
    // On my mac, 100000 iterations :
    // - without SIMD: 0.85s
    // - with SIMD: 0.3s
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

    return total;
}

pub fn part1(ns: []u16) !u32 {
    return countIncreases(ns);
}

pub fn part2(ns: []u16) !u32 {
    for (ns, 0..) |_, i| {
        if (i > ns.len - 3) {
            ns[i] = 0;
            continue;
        }
        ns[i] = ns[i] + ns[i + 1] + ns[i + 2];
    }
    return countIncreases(ns);
}

pub fn getResults() ![2]u32 {
    var da: std.heap.DebugAllocator(.{}) = .init;
    defer {
        if (da.deinit() == .leak) {
            std.debug.print("MEMORY LEAKED!\n", .{});
        }
    }
    const allocator = da.allocator();

    var lines = std.mem.tokenizeScalar(u8, input, '\n');

    var list: std.ArrayList(u16) = .empty;
    defer list.deinit(allocator);

    while (lines.next()) |line| {
        const n = try std.fmt.parseInt(u16, line, 10);
        try list.append(allocator, n);
    }

    const ns = try list.toOwnedSlice(allocator);
    defer allocator.free(ns);

    return .{
        try part1(ns),
        try part2(ns),
    };
}

pub fn main() !void {
    const results = try getResults();
    std.debug.print("part1 = {}\n", .{results[0]});
    std.debug.print("part2 = {}\n", .{results[1]});
}

test "d01" {
    const results = try getResults();
    try std.testing.expect(results[0] == 1527);
    try std.testing.expect(results[1] == 1575);
}
