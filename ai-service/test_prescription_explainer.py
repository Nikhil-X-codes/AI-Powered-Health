#!/usr/bin/env python3
"""
Test script for Prescription Explainer endpoints.
Tests FastAPI prescription explanation endpoints.
"""

import requests
import json
import time
from pathlib import Path

BASE_URL = "http://localhost:8000"

def test_prescription_explain():
    """Test prescription explanation endpoint."""
    print("\n=== Testing Prescription Explanation ===")
    
    # Sample OCR text from prescription
    sample_prescription = """
    Rx
    Patient: John Doe
    Date: 2024-01-15
    
    1. Tab. Paracetamol 500mg - BD (Twice daily) after meals
    2. Cap. Amoxicillin 250mg - TDS (Three times daily) with water
    3. Tab. Ibuprofen 400mg - OD (Once daily) at night
    4. Vitamin B12 1000 mcg - Weekly injection
    5. Omeprazole 20mg - OD before breakfast
    
    Duration: 7 days for antibiotics, ongoing for others
    Follow-up: 1 week
    """
    
    payload = {
        "ocr_text": sample_prescription,
        "prescription_id": "test-prescription-001"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/prescriptions/explain",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Prescription Explanation Success")
            print(f"  Medicines extracted: {len(data.get('medicines', []))}")
            
            for med in data.get('medicines', [])[:3]:
                print(f"\n  💊 {med['name']}")
                print(f"     Dosage: {med['dosage']}")
                print(f"     Usage: {med['usage_instructions']}")
                print(f"     Side Effects: {med['side_effects']}")
            
            if len(data.get('medicines', [])) > 3:
                print(f"\n  ... and {len(data.get('medicines', [])) - 3} more medicines")
            
            print(f"\n  Pharmacy Notes: {data.get('pharmacy_notes', 'None')}")
            
            return data
        else:
            print(f"❌ Explanation failed with status {response.status_code}")
            print(f"  Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Explanation request failed: {e}")
        return None


def test_prescription_from_url():
    """Test OCR extraction from prescription URL."""
    print("\n=== Testing OCR from URL ===")
    
    # Example URL (replace with actual prescription image URL)
    test_url = "https://example.com/prescription.pdf"
    
    payload = {
        "file_url": test_url,
        "description": "Prescription document"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/ocr/from-url",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ OCR Success")
            print(f"  Text length: {len(data.get('text', ''))} chars")
            return data.get('text')
        else:
            print(f"❌ OCR failed with status {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ OCR request failed: {e}")
        return None


def test_full_workflow():
    """Test the complete prescription explanation workflow."""
    print("\n=== Testing Full Prescription Workflow ===")
    
    # Sample prescription data
    sample_text = """
    Rx
    Dr. Smith
    Date: 2024-01-15
    
    1. Aspirin 100mg - OD with breakfast
    2. Metformin 500mg - BD after meals
    3. Lisinopril 10mg - OD at bedtime
    4. Vitamin D3 1000 IU - OD
    """
    
    print("\n1. Extracting prescription...")
    print(f"   Input: {len(sample_text)} chars")
    
    print("\n2. Calling explanation endpoint...")
    payload = {"ocr_text": sample_text, "prescription_id": "test-123"}
    
    try:
        response = requests.post(
            f"{BASE_URL}/prescriptions/explain",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Success: {len(data.get('medicines', []))} medicines found")
            
            print("\n3. Medicines explained:")
            for i, med in enumerate(data.get('medicines', []), 1):
                print(f"\n   {i}. {med['name']}")
                print(f"      • What it does: {med['purpose']}")
                print(f"      • Dosage: {med['dosage']}")
                print(f"      • How to take: {med['usage_instructions']}")
                print(f"      • Side effects: {med['side_effects']}")
            
            return True
        else:
            print(f"   ❌ Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def test_edge_cases():
    """Test edge cases and error handling."""
    print("\n=== Testing Edge Cases ===")
    
    test_cases = [
        {
            "name": "Empty prescription",
            "payload": {"ocr_text": "", "prescription_id": "test"},
            "expect_error": True
        },
        {
            "name": "No medicines detected",
            "payload": {"ocr_text": "Just some random text", "prescription_id": "test"},
            "expect_error": False
        },
    ]
    
    for test in test_cases:
        print(f"\n  Testing: {test['name']}")
        try:
            response = requests.post(
                f"{BASE_URL}/prescriptions/explain",
                json=test["payload"],
                timeout=30
            )
            
            if test["expect_error"]:
                if response.status_code >= 400:
                    print(f"    ✓ Correctly returned error: {response.status_code}")
                else:
                    print(f"    ⚠️ Expected error but got {response.status_code}")
            else:
                if response.status_code == 200:
                    print(f"    ✓ Successfully handled")
                else:
                    print(f"    ⚠️ Got error: {response.status_code}")
        except Exception as e:
            print(f"    ❌ Exception: {e}")


def run_all_tests():
    """Run all prescription explainer tests."""
    print("=" * 60)
    print("Prescription Explainer - Integration Tests")
    print("=" * 60)
    
    # Check if server is running
    try:
        requests.get(f"{BASE_URL}/health", timeout=2)
    except:
        print("\n❌ FastAPI server not running at", BASE_URL)
        print("Start it with: python main.py")
        return
    
    print("\n✓ FastAPI server is running")
    
    # Run tests
    print("\n--- Prescription Endpoints ---")
    prescription_data = test_prescription_explain()
    
    print("\n--- Edge Cases ---")
    test_edge_cases()
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    print("✓ All tests completed")
    print("\nNext steps:")
    print("1. Verify FastAPI endpoints are working")
    print("2. Test Express routes at http://localhost:3000/api/v1/prescriptions")
    print("3. Upload a prescription image through the Express API")
    print("4. Call the explain endpoint to process it")
    print("5. Check database for stored medicines")
    print("\nExample Express workflow:")
    print("  1. POST /prescriptions/upload → get prescriptionId")
    print("  2. POST /prescriptions/explain/:id → get medicines with explanations")
    print("  3. GET /prescriptions → see all prescriptions with medicines")


if __name__ == "__main__":
    run_all_tests()
