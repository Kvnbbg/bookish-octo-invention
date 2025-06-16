import com.example.san.ScanResult;
import com.example.san.ScanResultGatherer;

import java.util.*;
import java.util.concurrent.ForkJoinTask;
import java.util.stream.*;

public class SAN {
    public static void main(String[] args) {
        List<String> items = List.of("💰100", "Text 😊", "🔥 Emergency", "💰50", "Note");

        // Original separate collectors for comparison
        var emojiScan = Collector.<String, List<String>>of(
            ArrayList::new,
            (acc, item) -> {
                if (ForkJoinTask.inForkJoinPool())
                    System.err.println("⚠️ Join/Fork Detected");

                String tag = item.matches(".*[🔥😊].*") ? "🔹Emoji: " : "🔸Text: ";
                acc.add(tag + item);
            },
            (acc1, acc2) -> { acc1.addAll(acc2); return acc1; }
        );

        var moneySum = Collector.<String, int[], Integer>of(
            () -> new int[1],
            (acc, item) -> acc[0] += item.chars()
                .filter(Character::isDigit)
                .map(Character::getNumericValue)
                .reduce(0, (a, b) -> a * 10 + b),
            (acc1, acc2) -> { acc1[0] += acc2[0]; return acc1; },
            acc -> acc[0]
        );

        // Using separate collectors
        var tagged = items.stream().collect(emojiScan);
        int total = items.stream().collect(moneySum);

        System.out.println("=== Separate Collectors ===");
        tagged.forEach(System.out::println);
        System.out.println("💰 Total: " + total);

        // Using combined collector
        System.out.println("\n=== Combined Collector ===");
        var result = items.stream().collect(ScanResultGatherer.combinedMutable());
        result.tagged().forEach(System.out::println);
        System.out.println("💰 Total: " + result.total());
    }
}

