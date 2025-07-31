#!/usr/bin/env python3
"""
Script to fix all UUID issues in SQLAlchemy models for SQLite compatibility
"""

import os
import re

def fix_uuid_in_file(file_path):
    """Fix UUID issues in a single file"""
    print(f"Fixing {file_path}...")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Track if we made changes
    original_content = content
    
    # Remove PostgreSQL UUID import
    content = re.sub(r'from sqlalchemy\.dialects\.postgresql import UUID\n', '', content)
    
    # Fix UUID column definitions
    content = re.sub(r'UUID\(as_uuid=True\)', 'String', content)
    
    # Fix UUID default values
    content = re.sub(r'default=uuid\.uuid4', 'default=lambda: str(uuid.uuid4())', content)
    
    # Only write if we made changes
    if content != original_content:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"  ✅ Fixed {file_path}")
        return True
    else:
        print(f"  ℹ️  No changes needed in {file_path}")
        return False

def main():
    """Fix all model files"""
    models_dir = "app/models"
    fixed_count = 0
    
    print("🔧 Fixing UUID issues in all model files...")
    
    for filename in os.listdir(models_dir):
        if filename.endswith('.py') and filename != '__init__.py':
            file_path = os.path.join(models_dir, filename)
            if fix_uuid_in_file(file_path):
                fixed_count += 1
    
    print(f"\n🎉 Fixed {fixed_count} model files!")
    print("All models should now be SQLite compatible.")

if __name__ == "__main__":
    main()
