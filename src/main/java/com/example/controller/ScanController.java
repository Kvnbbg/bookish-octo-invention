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

@Controller
@RequestMapping("/scan")
public class ScanController {

    @GetMapping
    public String scanPage(Model model) {
        model.addAttribute("title", "Bookish Octo Invention - Text Scanner");
        return "scan";
    }

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