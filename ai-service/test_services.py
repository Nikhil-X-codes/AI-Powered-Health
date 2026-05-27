"""
Quick test script to verify all services are working.
Run this after starting the server.

Usage:
    python -m pytest test_services.py -v
    
Or manually:
    python test_services.py
"""

import requests
import json
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8000"
TIMEOUT = 30

class APITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.results = []
    
    def test_endpoint(self, method: str, path: str, name: str, **kwargs) -> bool:
        """Test an API endpoint"""
        url = f"{self.base_url}{path}"
        try:
            if method == "GET":
                response = requests.get(url, timeout=TIMEOUT, **kwargs)
            elif method == "POST":
                response = requests.post(url, timeout=TIMEOUT, **kwargs)
            else:
                raise ValueError(f"Unknown method: {method}")
            
            success = response.status_code < 400
            status = "✅ PASS" if success else f"❌ FAIL ({response.status_code})"
            
            self.results.append({
                "name": name,
                "status": status,
                "code": response.status_code,
                "response": response.json() if response.text else None
            })
            
            print(f"{status}: {name}")
            return success
        
        except Exception as e:
            self.results.append({
                "name": name,
                "status": f"❌ ERROR",
                "error": str(e)
            })
            print(f"❌ ERROR: {name} - {e}")
            return False
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*70)
        print("TEST SUMMARY")
        print("="*70)
        
        passed = sum(1 for r in self.results if "PASS" in r.get("status", ""))
        total = len(self.results)
        
        for result in self.results:
            print(f"{result['status']}: {result['name']}")
        
        print(f"\nPassed: {passed}/{total}")
        print("="*70 + "\n")
        
        return passed == total


def main():
    print("\n" + "="*70)
    print("🧪 AI SERVICE HEALTH CHECK")
    print("="*70 + "\n")
    
    print("Testing endpoint connectivity...")
    print(f"Base URL: {BASE_URL}\n")
    
    tester = APITester(BASE_URL)
    
    # ======================================================================
    # 1. Health Checks
    # ======================================================================
    print("\n📊 Health Checks:")
    tester.test_endpoint("GET", "/health", "Health Check")
    tester.test_endpoint("GET", "/health/detailed", "Detailed Health Check")
    
    # ======================================================================
    # 2. Root Info
    # ======================================================================
    print("\n📚 API Info:")
    tester.test_endpoint("GET", "/", "Root Endpoint (API Info)")
    
    # ======================================================================
    # 3. Chat Endpoints
    # ======================================================================
    print("\n💬 Chat Endpoints:")
    tester.test_endpoint(
        "POST",
        "/chat/quick",
        "Chat - Quick Question",
        json={"question": "What is the capital of France?"},
        headers={"Content-Type": "application/json"}
    )
    
    # ======================================================================
    # 4. Embeddings Endpoints
    # ======================================================================
    print("\n🔍 Embeddings Endpoints:")
    tester.test_endpoint(
        "POST",
        "/embed/single",
        "Embed - Single Text",
        json={"text": "medical prescription"},
        headers={"Content-Type": "application/json"}
    )
    
    tester.test_endpoint(
        "POST",
        "/embed/batch",
        "Embed - Batch Texts",
        json={"texts": ["fever", "cough", "headache"]},
        headers={"Content-Type": "application/json"}
    )
    
    # ======================================================================
    # 5. Prescription Endpoints (without files)
    # ======================================================================
    print("\n💊 Prescription Endpoints:")
    tester.test_endpoint(
        "POST",
        "/prescriptions/analyze",
        "Prescription - Analyze Text",
        json={"prescription_text": "Take 2 aspirin tablets twice daily for pain"},
        headers={"Content-Type": "application/json"}
    )
    
    # ======================================================================
    # Print Summary
    # ======================================================================
    all_passed = tester.print_summary()
    
    # ======================================================================
    # Instructions
    # ======================================================================
    if all_passed:
        print("✅ All tests passed! Services are running correctly.\n")
        print("Next steps:")
        print("  1. Connect your Next.js frontend")
        print("  2. View interactive docs: http://localhost:8000/docs")
        print("  3. Test file uploads with curl or Postman")
        print("  4. Read SERVICES_USAGE.md for endpoint examples\n")
    else:
        print("⚠️ Some tests failed. Check server logs for details.\n")
        print("Troubleshooting:")
        print("  1. Is the server running? (python main.py)")
        print("  2. Check server logs for initialization errors")
        print("  3. Verify GROQ_API_KEY in .env")
        print("  4. Check disk space for model downloads\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏸️ Test interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
