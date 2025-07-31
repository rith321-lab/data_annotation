#!/usr/bin/env python3
"""
Script to fix all UUID4 references in Pydantic schemas
"""

import os
import re

def fix_schemas_in_file(file_path):
    """Fix UUID4 references in a single schema file"""
    print(f"Fixing {file_path}...")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Track if we made changes
    original_content = content
    
    # Remove UUID4 import
    content = re.sub(r'from pydantic import BaseModel, UUID4, Field', 'from pydantic import BaseModel, Field', content)
    content = re.sub(r'from pydantic import BaseModel, UUID4', 'from pydantic import BaseModel', content)
    content = re.sub(r', UUID4', '', content)
    
    # Fix UUID4 type annotations
    content = re.sub(r': UUID4', ': str', content)
    content = re.sub(r'List\[UUID4\]', 'List[str]', content)
    content = re.sub(r'Optional\[UUID4\]', 'Optional[str]', content)
    
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
    """Fix all schema files"""
    schemas_dir = "app/schemas"
    fixed_count = 0
    
    print("🔧 Fixing UUID4 references in all schema files...")
    
    for filename in os.listdir(schemas_dir):
        if filename.endswith('.py') and filename != '__init__.py':
            file_path = os.path.join(schemas_dir, filename)
            if fix_schemas_in_file(file_path):
                fixed_count += 1
    
    print(f"\n🎉 Fixed {fixed_count} schema files!")
    print("All schemas should now use string IDs.")

if __name__ == "__main__":
    main()
