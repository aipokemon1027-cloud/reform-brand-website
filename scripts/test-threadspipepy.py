#!/usr/bin/env python3
"""
Test threadspipepy - Official Meta Threads API wrapper
Requires: Meta Developer App with Threads API enabled + OAuth tokens
"""

import os
from threadspipepy.threadspipe import ThreadsPipe

def test_setup_check():
    print("=== threadspipepy Setup Check ===\n")
    
    # Check for required environment variables
    required = ['THREADS_APP_ID', 'THREADS_APP_SECRET', 'THREADS_ACCESS_TOKEN', 'THREADS_USER_ID']
    missing = []
    
    for var in required:
        value = os.environ.get(var, '')
        if value:
            print(f"✅ {var}: set ({len(value)} chars)")
        else:
            print(f"❌ {var}: NOT SET")
            missing.append(var)
    
    if missing:
        print(f"\n❌ Missing {len(missing)} required environment variables:")
        for m in missing:
            print(f"   - {m}")
        print("\n📋 To get these credentials:")
        print("""
1. Go to https://developers.facebook.com/apps
2. Create a new app (Business type)
3. Add "Threads API" product
4. Set up OAuth, get App ID and App Secret
5. Complete OAuth flow to get Access Token and User ID
6. Set these as environment variables:
   export THREADS_APP_ID='your-app-id'
   export THREADS_APP_SECRET='your-app-secret'
   export THREADS_ACCESS_TOKEN='your-access-token'
   export THREADS_USER_ID='your-user-id'
""")
        return False
    else:
        print("\n✅ All credentials set! Testing API connection...")
        try:
            api = ThreadsPipe(
                access_token=os.environ.get('THREADS_ACCESS_TOKEN'),
                user_id=os.environ.get('THREADS_USER_ID'),
                handle_hashtags=True
            )
            print("✅ ThreadsPipe initialized successfully!")
            return True
        except Exception as e:
            print(f"❌ Error: {e}")
            return False

if __name__ == "__main__":
    test_setup_check()
