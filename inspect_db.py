#!/usr/bin/env python3
"""
Database Inspector Script
Run this to see what's in your database
"""

import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text, inspect
from app.core.config import settings

async def inspect_database():
    """Inspect database tables and their contents"""
    
    print("🔍 Verita AI Database Inspector")
    print("=" * 50)
    
    # Create async engine
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    try:
        async with async_session() as session:
            # Get all table names
            result = await session.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]
            
            if not tables:
                print("❌ No tables found in database")
                return
            
            print(f"📊 Found {len(tables)} tables:")
            print("-" * 30)
            
            for table in tables:
                # Get row count for each table
                count_result = await session.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = count_result.scalar()
                
                print(f"📋 {table}: {count} rows")
                
                # Show first few rows for tables with data
                if count > 0 and count <= 20:  # Only show data for small tables
                    print(f"   Sample data from {table}:")
                    sample_result = await session.execute(text(f"SELECT * FROM {table} LIMIT 3"))
                    rows = sample_result.fetchall()
                    
                    if rows:
                        # Get column names
                        columns = list(sample_result.keys())
                        print(f"   Columns: {', '.join(columns)}")
                        
                        for i, row in enumerate(rows, 1):
                            print(f"   Row {i}: {dict(zip(columns, row))}")
                    print()
                elif count > 20:
                    print(f"   (Too many rows to display - showing structure only)")
                    # Show just the columns
                    structure_result = await session.execute(text(f"SELECT * FROM {table} LIMIT 0"))
                    columns = list(structure_result.keys())
                    print(f"   Columns: {', '.join(columns)}")
                    print()
            
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        print("\n💡 Make sure:")
        print("1. PostgreSQL is running")
        print("2. Database exists")
        print("3. Environment variables are set correctly")
        
    finally:
        await engine.dispose()

async def show_specific_table(table_name: str, limit: int = 10):
    """Show contents of a specific table"""
    
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    try:
        async with async_session() as session:
            result = await session.execute(text(f"SELECT * FROM {table_name} LIMIT {limit}"))
            rows = result.fetchall()
            columns = list(result.keys())
            
            print(f"\n📋 Table: {table_name}")
            print(f"📊 Showing up to {limit} rows")
            print("-" * 50)
            
            if not rows:
                print("❌ No data found")
                return
                
            for i, row in enumerate(rows, 1):
                print(f"\nRow {i}:")
                for col, val in zip(columns, row):
                    print(f"  {col}: {val}")
    
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        table_name = sys.argv[1]
        limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10
        asyncio.run(show_specific_table(table_name, limit))
    else:
        asyncio.run(inspect_database()) 