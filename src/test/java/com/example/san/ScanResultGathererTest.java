package com.example.san;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.stream.Stream;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.*;

/**
 * Unit tests for ScanResultGatherer composite behavior.
 * Tests cover emoji tagging, money total calculation, edge cases, and parallel stream handling.
 */
class ScanResultGathererTest {

    @Test
    @DisplayName("Should handle empty input stream")
    void shouldHandleEmptyInput() {
        List<String> emptyList = List.of();
        
        ScanResult result = emptyList.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.tagged()).isEmpty();
        assertThat(result.total()).isZero();
    }

    @Test
    @DisplayName("Should tag items with emojis correctly")
    void shouldTagItemsWithEmojis() {
        List<String> items = List.of("Text 😊", "🔥 Emergency", "Regular text", "I ❤️ you", "Let's 🎉", "👍 good job");
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.tagged()).containsExactly(
            "🔹Emoji: Text 😊",
            "🔹Emoji: 🔥 Emergency", 
            "🔸Text: Regular text",
            "🔹Emoji: I ❤️ you",
            "🔹Emoji: Let's 🎉",
            "🔹Emoji: 👍 good job"
        );
        assertThat(result.total()).isZero();
    }

    @Test
    @DisplayName("Should calculate money total correctly")
    void shouldCalculateMoneyTotal() {
        List<String> items = List.of("💰100", "€50", "£25");
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.total()).isEqualTo(175);
        assertThat(result.tagged()).containsExactly(
            "🔸Text: 💰100",
            "🔸Text: €50",
            "🔸Text: £25"
        );
    }

    @Test
    @DisplayName("Should handle mixed emoji and money items")
    void shouldHandleMixedEmojiAndMoney() {
        List<String> items = List.of("💰100", "Text 😊", "🔥 Emergency", "💰50", "Note");
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.tagged()).containsExactly(
            "🔸Text: 💰100",
            "🔹Emoji: Text 😊",
            "🔹Emoji: 🔥 Emergency",
            "🔸Text: 💰50",
            "🔸Text: Note"
        );
        assertThat(result.total()).isEqualTo(150);
    }

    @Test
    @DisplayName("Should handle items with no emojis")
    void shouldHandleItemsWithNoEmojis() {
        List<String> items = List.of("Plain text", "Another text", "More text");
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.tagged()).containsExactly(
            "🔸Text: Plain text",
            "🔸Text: Another text",
            "🔸Text: More text"
        );
        assertThat(result.total()).isZero();
    }

    @ParameterizedTest
    @DisplayName("Should handle malformed money tags")
    @ValueSource(strings = {
        "💰", // No digits
        "💰abc", // No digits, only letters
        "💰!@#", // No digits, only symbols
        "💰 ", // No digits, only space
        "💰💰", // Multiple money symbols, no digits
        "Money 💰 here", // Money symbol but no digits
        "💰0", // Zero value
        "💰00", // Leading zeros
        "💰000" // Multiple leading zeros
    })
    void shouldHandleMalformedMoneyTags(String malformedTag) {
        List<String> items = List.of(malformedTag);
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.tagged()).hasSize(1);
        assertThat(result.tagged().get(0)).startsWith("🔸Text: ");
        assertThat(result.total()).isZero();
    }

    @ParameterizedTest
    @DisplayName("Should extract numeric values correctly from various formats")
    @MethodSource("provideMoneyFormats")
    void shouldExtractNumericValuesCorrectly(String input, int expectedValue) {
        List<String> items = List.of(input);
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.total()).isEqualTo(expectedValue);
    }

    static Stream<Arguments> provideMoneyFormats() {
        return Stream.of(
            Arguments.of("💰123", 123),
            Arguments.of("💰1", 1),
            Arguments.of("💰999", 999),
            Arguments.of("💰1a2b3", 123), // Mixed with letters
            Arguments.of("💰1!2@3#", 123), // Mixed with symbols
            Arguments.of("💰 1 2 3 ", 123), // Mixed with spaces
            Arguments.of("💰12.34", 1234), // Decimal point ignored
            Arguments.of("💰$123", 123), // Mixed with currency symbol
            Arguments.of("Price: 💰456 dollars", 456), // Embedded in text
            Arguments.of("💰1000000", 1000000) // Large number
        );
    }

    @Test
    @DisplayName("Should handle items with both emoji and money symbols")
    void shouldHandleItemsWithBothEmojiAndMoney() {
        List<String> items = List.of("😊💰100", "🔥💰50");
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.tagged()).containsExactly(
            "🔹Emoji: 😊💰100",
            "🔹Emoji: 🔥💰50"
        );
        assertThat(result.total()).isEqualTo(150);
    }

    @Test
    @DisplayName("Should handle multiple money symbols in single item")
    void shouldHandleMultipleMoneySymbolsInSingleItem() {
        List<String> items = List.of("💰100💰50");
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.total()).isEqualTo(10050); // Concatenated: 100 + 50 = 10050
        assertThat(result.tagged()).hasSize(1);
    }

    @Test
    @DisplayName("Should work with parallel streams")
    void shouldWorkWithParallelStreams() {
        List<String> items = List.of("💰100", "Text 😊", "🔥 Emergency", "💰50", "Note", "💰25");
        
        ScanResult result = items.parallelStream()
            .collect(ScanResultGatherer.combinedMutable());
        
        // Note: Order might be different with parallel streams, so we check contents
        assertThat(result.tagged()).hasSize(6);
        assertThat(result.total()).isEqualTo(175);
        
        // Verify all expected tags are present (order may vary)
        assertThat(result.tagged()).contains(
            "🔸Text: 💰100",
            "🔹Emoji: Text 😊",
            "🔹Emoji: 🔥 Emergency",
            "🔸Text: 💰50",
            "🔸Text: Note",
            "🔸Text: 💰25"
        );
    }

    @Test
    @DisplayName("Should handle concurrent execution in ForkJoinPool")
    void shouldHandleConcurrentExecutionInForkJoinPool() {
        List<String> items = List.of("💰100", "Text 😊", "💰50");
        
        CompletableFuture<ScanResult> future = CompletableFuture.supplyAsync(() -> 
            items.stream().collect(ScanResultGatherer.combinedMutable())
        );
        
        ScanResult result = future.join();
        
        assertThat(result.tagged()).hasSize(3);
        assertThat(result.total()).isEqualTo(150);
    }

    @Test
    @DisplayName("Should handle large datasets efficiently")
    void shouldHandleLargeDatasetsEfficiently() {
        // Create a large dataset
        List<String> items = Stream.concat(
            Stream.generate(() -> "💰10").limit(1000),
            Stream.generate(() -> "Text 😊").limit(1000)
        ).toList();
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.tagged()).hasSize(2000);
        assertThat(result.total()).isEqualTo(10000); // 1000 * 10
        
        // Verify correct tagging distribution
        long emojiCount = result.tagged().stream()
            .filter(tag -> tag.startsWith("🔹Emoji: "))
            .count();
        long textCount = result.tagged().stream()
            .filter(tag -> tag.startsWith("🔸Text: "))
            .count();
        
        assertThat(emojiCount).isEqualTo(1000);
        assertThat(textCount).isEqualTo(1000);
    }

    @Test
    @DisplayName("Should handle Unicode edge cases")
    void shouldHandleUnicodeEdgeCases() {
        List<String> items = List.of(
            "💰123🔥", // Money with fire emoji
            "😊💰456", // Smile with money
            "🔥😊💰789", // Multiple emojis with money
            "Text with 💰999 and 😊", // Mixed content
            "💰0️⃣1️⃣2️⃣" // Money with number emojis (should extract 0, 1, 2 = 012)
        );
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(result.tagged()).hasSize(5);
        assertThat(result.total()).isEqualTo(123 + 456 + 789 + 999 + 12); // Note: 0️⃣1️⃣2️⃣ extracts as 12, not 012
        
        // All items with 🔥 or 😊 should be tagged as emoji
        assertThat(result.tagged().get(0)).startsWith("🔹Emoji: ");
        assertThat(result.tagged().get(1)).startsWith("🔹Emoji: ");
        assertThat(result.tagged().get(2)).startsWith("🔹Emoji: ");
        assertThat(result.tagged().get(3)).startsWith("🔹Emoji: ");
        // Note: The number emojis are considered emojis, so this is tagged as an emoji.
        assertThat(result.tagged().get(4)).startsWith("🔹Emoji: ");
    }

    @Test
    @DisplayName("Should maintain immutability of ScanResult")
    void shouldMaintainImmutabilityOfScanResult() {
        List<String> items = List.of("💰100", "Text 😊");
        
        ScanResult result = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        // Verify that the result is immutable by checking record properties
        assertThat(result.tagged()).isNotNull();
        assertThat(result.total()).isEqualTo(100);
        
        // The tagged list should be immutable (as returned by List.copyOf)
        List<String> originalTagged = List.copyOf(result.tagged());
        
        // Verify that the list is immutable
        assertThatThrownBy(() -> result.tagged().add("New item"))
            .isInstanceOf(UnsupportedOperationException.class);
        
        // Create another result to verify independence
        ScanResult newResult = items.stream()
            .collect(ScanResultGatherer.combinedMutable());
        
        assertThat(newResult.tagged()).isEqualTo(originalTagged);
    }
}