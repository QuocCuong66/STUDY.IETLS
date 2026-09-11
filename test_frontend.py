import asyncio
import os
import subprocess
import time
from playwright.async_api import async_playwright

async def run_frontend_tests():
    print("Starting Uvicorn Server in background...")
    server_process = subprocess.Popen(
        ["python3", "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    time.sleep(2) # Allow server time to start

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            # 1. Test Login / Registration Page (index.html)
            pwd = os.getcwd()
            index_url = f"file://{pwd}/index.html"
            print(f"Navigating to {index_url}...")
            await page.goto(index_url)

            await page.wait_for_selector("#login-box")
            print("Login box rendered successfully.")

            # Test switching to register form
            await page.click("text=Đăng ký ngay")
            await page.wait_for_selector("#register-box", state="visible")
            print("Switched to register form successfully.")

            # Register a new user
            await page.fill("#reg-username", "playwright_user")
            await page.fill("#reg-password", "password123")
            await page.fill("#reg-confirm-password", "password123")

            # Dismiss alert automatically
            page.on("dialog", lambda dialog: dialog.accept())

            await page.click("#register-box button[type='submit']")
            await page.wait_for_selector("#login-box", state="visible")
            print("Registered playwright_user and returned to login form.")

            # Login with registered user
            await page.fill("#username", "playwright_user")
            await page.fill("#password", "password123")
            await page.click("#login-box button[type='submit']")

            await asyncio.sleep(1)
            # Take screenshot of login / transition
            os.makedirs("test_results", exist_ok=True)
            await page.screenshot(path="test_results/login_page.png")

            # 2. Test IELTS Speaking Wonderland Page (speaking_ietls.html)
            speaking_url = f"file://{pwd}/speaking_ietls.html"
            print(f"Navigating to {speaking_url}...")
            await page.goto(speaking_url)

            # Check 40 lessons generated across 4 sections
            cards = await page.query_selector_all(".lesson-card")
            print(f"Total lesson cards rendered: {len(cards)}")
            assert len(cards) == 40, f"Expected 40 lesson cards, got {len(cards)}"

            # Click on first lesson card
            await cards[0].click()
            await page.wait_for_selector("#overlay.active", state="visible")
            print("Lesson detail modal opened successfully.")

            # Click play video button in modal
            await page.click("text=Bắt Đầu Học ngay!")
            await page.wait_for_selector("#fullscreen-overlay.active", state="visible")
            print("Fullscreen video overlay active successfully.")

            # Close video overlay
            await page.click(".close-fullscreen-btn")
            await page.wait_for_selector("#fullscreen-overlay.active", state="hidden")

            # Close modal
            await page.click(".close-btn")
            await page.wait_for_selector("#overlay.active", state="hidden")

            # Test Chatbot Widget
            await page.click(".chat-button")
            await page.wait_for_selector("#chat-window.active", state="visible")
            print("Chatbot widget opened successfully.")

            # Send a chat message
            await page.fill("#chat-input", "Xin chào, hãy giới thiệu bản thân")
            await page.click("text=Gửi")

            await asyncio.sleep(2)
            await page.screenshot(path="test_results/speaking_page_chatbot.png")
            print("Saved frontend verification screenshots to test_results/")

            await browser.close()
            print("All Frontend E2E tests PASSED successfully!")

    finally:
        server_process.terminate()

if __name__ == "__main__":
    asyncio.run(run_frontend_tests())
