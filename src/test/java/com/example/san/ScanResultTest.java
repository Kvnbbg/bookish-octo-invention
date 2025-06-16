package com.example.san;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.util.List;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.*;

/**
 * Unit tests for ScanResult record.
 */
class ScanResultTest {

    @Test
    @DisplayName("Should create ScanResult with tagged list and total")
    void shouldCreateScanResultWithTaggedListAndTotal() {
        List<String> tagged = List.of("🔹Emoji: Test 😊", "🔸Text: Regular");
        int total = 100;
        
        ScanResult result = new ScanResult(tagged, total);
        
        assertThat(result.tagged()).isEqualTo(tagged);
        assertThat(result.total()).isEqualTo(total);
    }

    @Test
    @DisplayName("Should handle empty tagged list")
    void shouldHandleEmptyTaggedList() {
        List<String> emptyTagged = List.of();
        int total = 0;
        
        ScanResult result = new ScanResult(emptyTagged, total);
        
        assertThat(result.tagged()).isEmpty();
        assertThat(result.total()).isZero();
    }

    @Test
    @DisplayName("Should handle null tagged list")
    void shouldHandleNullTaggedList() {
        ScanResult result = new ScanResult(null, 50);
        
        assertThat(result.tagged()).isNull();
        assertThat(result.total()).isEqualTo(50);
    }

    @Test
    @DisplayName("Should support equality comparison")
    void shouldSupportEqualityComparison() {
        List<String> tagged1 = List.of("🔹Emoji: Test 😊");
        List<String> tagged2 = List.of("🔹Emoji: Test 😊");
        
        ScanResult result1 = new ScanResult(tagged1, 100);
        ScanResult result2 = new ScanResult(tagged2, 100);
        ScanResult result3 = new ScanResult(tagged1, 200);
        
        assertThat(result1).isEqualTo(result2);
        assertThat(result1).isNotEqualTo(result3);
        assertThat(result1.hashCode()).isEqualTo(result2.hashCode());
    }

    @Test
    @DisplayName("Should provide meaningful toString representation")
    void shouldProvideMeaningfulToStringRepresentation() {
        List<String> tagged = List.of("🔹Emoji: Test 😊", "🔸Text: Regular");
        ScanResult result = new ScanResult(tagged, 150);
        
        String toString = result.toString();
        
        assertThat(toString).contains("ScanResult");
        assertThat(toString).contains("tagged");
        assertThat(toString).contains("total");
        assertThat(toString).contains("150");
    }

    @Test
    @DisplayName("Should work with mutable lists")
    void shouldWorkWithMutableLists() {
        List<String> mutableTagged = new ArrayList<>();
        mutableTagged.add("🔹Emoji: Test 😊");
        
        ScanResult result = new ScanResult(mutableTagged, 100);
        
        // Modifying the original list should affect the record (since records store references)
        mutableTagged.add("🔸Text: Added later");
        
        assertThat(result.tagged()).hasSize(2);
        assertThat(result.tagged()).contains("🔸Text: Added later");
    }

    @Test
    @DisplayName("Should handle negative totals")
    void shouldHandleNegativeTotals() {
        List<String> tagged = List.of("🔸Text: Negative test");
        ScanResult result = new ScanResult(tagged, -50);
        
        assertThat(result.total()).isEqualTo(-50);
    }

    @Test
    @DisplayName("Should handle large totals")
    void shouldHandleLargeTotals() {
        List<String> tagged = List.of("🔸Text: Large number test");
        int largeTotal = Integer.MAX_VALUE;
        
        ScanResult result = new ScanResult(tagged, largeTotal);
        
        assertThat(result.total()).isEqualTo(largeTotal);
    }
}