#!/usr/bin/env python3
"""
Test script for Medical Report Analyzer endpoints.
Tests FastAPI endpoints for OCR and medical report analysis.
"""

import requests
import json
import time
from pathlib import Path

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Verify FastAPI is running and all services loaded."""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health: {response.json()}")
        
        response = requests.get(f"{BASE_URL}/health/detailed")
        detailed = response.json()
        print(f"Detailed Health:")
        for service, status in detailed.items():
            print(f"  {service}: {status}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False


def test_ocr_from_url():
    """Test OCR extraction from URL."""
    print("\n=== Testing OCR from URL ===")
    
    # Example Cloudinary PDF URL (you would replace with actual URL)
    # This is just to test the endpoint structure
    test_url = "https://example.com/sample.pdf"
    
    payload = {
        "file_url": test_url,
        "description": "Sample blood test report"
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
            print(f"  Source: {data.get('source')}")
            return data.get('text')
        else:
            print(f"❌ OCR failed with status {response.status_code}")
            print(f"  Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ OCR request failed: {e}")
        return None


def test_medical_analysis(ocr_text=None):
    """Test medical report analysis endpoint."""
    print("\n=== Testing Medical Report Analysis ===")
    
    # Sample OCR text with medical metrics
    if not ocr_text:
        ocr_text = """
        PATIENT: John Doe
        DOB: 01/15/1970
        
        LABORATORY RESULTS
        Date: 2024-01-15
        
        Hemoglobin: 11.2 g/dL (reference: 13.5-17.5 male)
        Glucose (Fasting): 140 mg/dL (reference: 70-100)
        Total Cholesterol: 230 mg/dL (reference: <200)
        LDL Cholesterol: 150 mg/dL (reference: <100)
        HDL Cholesterol: 35 mg/dL (reference: >40 male)
        Triglycerides: 180 mg/dL (reference: <150)
        Blood Pressure: 135/85 mmHg (reference: <120/<80)
        """
    
    payload = {
        "ocr_text": ocr_text,
        "report_id": "test-report-001",
        "gender": "male"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/analyze/report",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Analysis Success")
            print(f"  Metrics extracted: {len(data.get('metrics', []))}")
            
            for metric in data.get('metrics', [])[:3]:
                print(f"  - {metric['metric_name']}: {metric['metric_value']} ({metric['status']})")
            
            print(f"\n  Summary (first 100 chars):")
            print(f"  {data.get('overall_summary', '')[:100]}...")
            
            return data
        else:
            print(f"❌ Analysis failed with status {response.status_code}")
            print(f"  Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Analysis request failed: {e}")
        return None


def test_ocr_extract_file():
    """Test OCR extraction from file upload."""
    print("\n=== Testing OCR from File ===")
    
    # Create a simple text file to test
    test_file_path = Path("test_image.txt")
    test_file_path.write_text("Test medical report content")
    
    try:
        with open(test_file_path, 'rb') as f:
            files = {'file': ('test.jpg', f, 'image/jpeg')}
            response = requests.post(
                f"{BASE_URL}/ocr/extract",
                files=files
            )
        
        if response.status_code == 200:
            print(f"✓ File OCR Success")
            print(f"  Response: {response.json()}")
        else:
            print(f"❌ File OCR failed: {response.text}")
    except Exception as e:
        print(f"❌ File OCR request failed: {e}")
    finally:
        test_file_path.unlink(missing_ok=True)


def run_all_tests():
    """Run all tests."""
    print("=" * 60)
    print("Medical Report Analyzer - Integration Tests")
    print("=" * 60)
    
    # Check if server is running
    try:
        requests.get(f"{BASE_URL}/health", timeout=2)
    except:
        print("\n❌ FastAPI server not running at", BASE_URL)
        print("Start it with: python main.py")
        return
    
    # Run tests
    if not test_health_check():
        print("\n⚠️  Health check failed, but continuing with other tests...")
    
    # Test OCR endpoints
    print("\n--- OCR Endpoints ---")
    test_ocr_extract_file()
    ocr_text = test_ocr_from_url()
    
    # Test analysis endpoint
    print("\n--- Analysis Endpoints ---")
    analysis_result = test_medical_analysis(ocr_text)
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    print("✓ All tests completed")
    print("\nNext steps:")
    print("1. Verify FastAPI endpoints are working")
    print("2. Test Express routes at http://localhost:3000/api/v1/reports")
    print("3. Upload a medical report through the Express API")
    print("4. Call the analyze endpoint to process it")
    print("5. Check database for stored metrics")


if __name__ == "__main__":
    run_all_tests()
