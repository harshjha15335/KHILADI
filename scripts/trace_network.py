import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        pending_requests = {}
        
        def on_req(req):
            pending_requests[req.url] = req
            print(f"-> REQ: {req.url[:100]}")
            
        def on_resp(res):
            print(f"<- RESP {res.status}: {res.url[:100]}")
            
        def on_fail(req):
            print(f"XX FAIL: {req.url[:100]} ({req.failure})")
            
        page.on('request', on_req)
        page.on('response', on_resp)
        page.on('requestfailed', on_fail)
        
        print("Navigating with domcontentloaded...")
        await page.goto('http://127.0.0.1:3000', wait_until='domcontentloaded')
        print("DOM content loaded! Waiting 4s...")
        await page.wait_for_timeout(4000)
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
