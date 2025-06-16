package com.example.san;

import java.util.List;

/**
 * Record representing the result of a scan operation containing tagged items and a total value.
 */
public record ScanResult(List<String> tagged, int total) {
}