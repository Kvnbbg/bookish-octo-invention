package com.example.san;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ForkJoinTask;
import java.util.stream.Collector;

/**
 * A composite gatherer that combines emoji tagging and money total calculation in a single scan.
 * This gatherer processes strings and:
 * - Tags items with emoji prefixes based on content
 * - Extracts and sums numeric values from items containing money symbols (💰)
 */
public class ScanResultGatherer {
    
    /**
     * Creates a collector that combines emoji tagging and money total calculation.
     * 
     * @return A collector that processes strings and returns a ScanResult
     */
    public static Collector<String, ScanResult, ScanResult> combined() {
        return Collector.of(
            // Supplier: creates initial accumulator
            () -> new ScanResult(new ArrayList<>(), 0),
            
            // Accumulator: processes each element
            (acc, item) -> {
                if (ForkJoinTask.inForkJoinPool()) {
                    System.err.println("⚠️ ForkJoin Detected");
                }

                // Tag items based on emoji content
                String tag = item.matches(".*[🔥😊].*") ? "🔹Emoji: " : "🔸Text: ";
                acc.tagged().add(tag + item);

                // Extract and sum money values
                if (item.contains("💰")) {
                    int value = extractNumericValue(item);
                    // Create new ScanResult with updated total
                    ScanResult newResult = new ScanResult(acc.tagged(), acc.total() + value);
                    // Copy the tagged list to the new result
                    acc.tagged().clear();
                    acc.tagged().addAll(newResult.tagged());
                    // Note: Since we can't modify the accumulator reference in BiConsumer,
                    // we'll handle this differently in the finisher
                }
            },
            
            // Combiner: combines two accumulators (for parallel processing)
            (acc1, acc2) -> {
                List<String> combinedTagged = new ArrayList<>(acc1.tagged());
                combinedTagged.addAll(acc2.tagged());
                return new ScanResult(combinedTagged, acc1.total() + acc2.total());
            },
            
            // Finisher: final transformation
            acc -> acc
        );
    }
    
    /**
     * Alternative implementation using a mutable accumulator for better performance.
     */
    public static Collector<String, MutableScanResult, ScanResult> combinedMutable() {
        return Collector.of(
            // Supplier: creates initial mutable accumulator
            () -> new MutableScanResult(new ArrayList<>(), 0),
            
            // Accumulator: processes each element
            (acc, item) -> {
                if (ForkJoinTask.inForkJoinPool()) {
                    System.err.println("⚠️ ForkJoin Detected");
                }

                // Tag items based on emoji content
                String tag = item.matches(".*[🔥😊].*") ? "🔹Emoji: " : "🔸Text: ";
                acc.tagged.add(tag + item);

                // Extract and sum money values
                if (item.contains("💰")) {
                    int value = extractNumericValue(item);
                    acc.total += value;
                }
            },
            
            // Combiner: combines two accumulators (for parallel processing)
            (acc1, acc2) -> {
                acc1.tagged.addAll(acc2.tagged);
                acc1.total += acc2.total;
                return acc1;
            },
            
            // Finisher: convert to immutable result
            acc -> new ScanResult(List.copyOf(acc.tagged), acc.total)
        );
    }
    
    /**
     * Extracts numeric value from a string by concatenating all digits.
     * 
     * @param item The string to extract numeric value from
     * @return The extracted numeric value, or 0 if no digits found
     */
    private static int extractNumericValue(String item) {
        return item.chars()
            .filter(Character::isDigit)
            .map(Character::getNumericValue)
            .reduce(0, (a, b) -> a * 10 + b);
    }
    
    /**
     * Mutable accumulator for better performance during collection.
     */
    private static class MutableScanResult {
        final List<String> tagged;
        int total;
        
        MutableScanResult(List<String> tagged, int total) {
            this.tagged = tagged;
            this.total = total;
        }
    }
}