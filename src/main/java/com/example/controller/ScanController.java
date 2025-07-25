package com.example.controller;

import com.example.san.ScanResult;
import com.example.san.ScanResultGatherer;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Controller for handling text scanning operations.
 */
@Controller
@RequestMapping("/scan")
public class ScanController {

    /**
     * Displays the scan page.
     *
     * @param model the model
     * @return the scan page view
     */
    @GetMapping
    public String scanPage(Model model) {
        model.addAttribute("title", "Bookish Octo Invention - Text Scanner");
        return "scan";
    }

    /**
     * Analyzes the given text items sequentially.
     *
     * @param request the request containing the text items
     * @return the scan result
     */
    @PostMapping("/analyze")
    @ResponseBody
    public ResponseEntity<ScanResult> analyzeText(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<String> items = (List<String>) request.get("items");
            
            if (items == null || items.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            ScanResult result = items.stream()
                .collect(ScanResultGatherer.combined());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Analyzes the given text items in parallel.
     *
     * @param request the request containing the text items
     * @return the scan result
     */
    @PostMapping("/analyze-parallel")
    @ResponseBody
    public ResponseEntity<ScanResult> analyzeTextParallel(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<String> items = (List<String>) request.get("items");
            
            if (items == null || items.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            ScanResult result = items.parallelStream()
                .collect(ScanResultGatherer.combined());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Provides a demo scan with sample data.
     *
     * @return the scan result for the demo data
     */
    @GetMapping("/demo")
    @ResponseBody
    public ResponseEntity<ScanResult> demoScan() {
        List<String> demoItems = Arrays.asList(
            "💰100",
            "Text 😊",
            "🔥 Emergency",
            "💰50",
            "Note"
        );

        ScanResult result = demoItems.stream()
            .collect(ScanResultGatherer.combined());

        return ResponseEntity.ok(result);
    }
}