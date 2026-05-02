#!/usr/bin/env python3
"""
Test threads-api for @pokenews2026
Account: ai.pokemon1026+news@gmail.com (Google account, NOT Instagram)
"""

import asyncio
import os
from threads_api.src.threads_api import ThreadsAPI

async def test_post():
    print("Starting threads-api test...")
    print("Note: This account uses Google login, NOT Instagram.")
    print("threads-api may not work without Instagram credentials.\n")
    
    # Try with Instagram credentials (this will likely fail)
    # The Threads account was created via Google, not Instagram
    api = ThreadsAPI(cached_token_path=".token")
    
    # These would be Instagram credentials if linked
    username = os.environ.get('INSTAGRAM_USERNAME', '')
    password = os.environ.get('INSTAGRAM_PASSWORD', '')
    
    if not username or not password:
        print("❌ No Instagram credentials provided.")
        print("The @pokenews2026 account uses Google login (ai.pokemon1026+news@gmail.com)")
        print("threads-api requires Instagram credentials, not Google.")
        print("\nOptions:")
        print("1. Link Instagram to the Threads account, then use Instagram credentials")
        print("2. Use official Meta Threads API with OAuth")
        return
    
    try:
        print(f"Attempting login as: {username}")
        await api.login(username, password, cached_token_path=".token")
        print("✅ Login successful!")
        
        # Test post
        result = await api.post(
            caption="🤖 Test post from threads-api Python library!\n\nIf you see this, the API works! #test #threadsapi"
        )
        
        if result:
            print("✅ Post published successfully!")
            print(f"Result: {result}")
        else:
            print("❌ Post failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        await api.close_gracefully()

if __name__ == "__main__":
    asyncio.run(test_post())
