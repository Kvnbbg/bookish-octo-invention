import de.svenwoltmann.streamgatherers.Gatherer;
import de.svenwoltmann.streamgatherers.Gatherers;

import java.util.*;
import java.util.concurrent.ForkJoinTask;
import java.util.stream.*;

public class SAN {
    public static void main(String[] args) {
        List<String> items = List.of("💰100", "Text 😊", "🔥 Emergency", "💰50", "Note");

        var emojiScan = Gatherers.sequential(
            (List<String> acc, String item) -> {
                if (ForkJoinTask.inForkJoinPool())
                    System.err.println("⚠️ Join/Fork Detected");

                String tag = item.matches(".*[🔥😊].*") ? "🔹Emoji: " : "🔸Text: ";
                acc.add(tag + item);
            }, ArrayList::new
        );

        var moneySum = Gatherers.sequential(
            (Integer acc, String item) -> acc + item.chars()
                .filter(Character::isDigit)
                .map(Character::getNumericValue)
                .reduce(0, (a, b) -> a * 10 + b),
            () -> 0
        );

        var tagged = items.stream().collect(emojiScan);
        int total = items.stream().collect(moneySum);

        tagged.forEach(System.out::println);
        System.out.println("💰 Total: " + total);
    }
}
record ScanResult(List<String> tagged, int total) {}

Gatherer<String, ScanResult> combined = Gatherers.sequential(
    (ScanResult acc, String item) -> {
        if (ForkJoinTask.inForkJoinPool())
            System.err.println("⚠️ ForkJoin Detected");

        String tag = item.matches(".*[🔥😊].*") ? "🔹Emoji: " : "🔸Text: ";
        acc.tagged().add(tag + item);

        if (item.contains("💰")) {
            int value = item.chars().filter(Character::isDigit)
                .map(Character::getNumericValue).reduce(0, (a, b) -> a * 10 + b);
            acc = new ScanResult(acc.tagged(), acc.total() + value);
        }
    },
    () -> new ScanResult(new ArrayList<>(), 0)
);

