#!/usr/bin/env python3
"""
Script to revert Django app files back to development settings.
Reverses the changes made by prepare_for_production.py,
including the refetch functionality fixes.
"""

import re
import os
import sys
import subprocess

def modify_file(file_path, replacements):
    """
    Modify a file by replacing specific strings based on the provided replacements.
    
    Args:
        file_path (str): Path to the file to modify
        replacements (list): List of tuples (pattern, replacement)
    
    Returns:
        bool: True if modifications were made, False otherwise
    """
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        modified_content = content
        for pattern, replacement in replacements:
            modified_content = re.sub(pattern, replacement, modified_content)
        
        if content != modified_content:
            with open(file_path, 'w') as file:
                file.write(modified_content)
            print(f"✅ Modified {file_path}")
            return True
        else:
            print(f"ℹ️ No changes needed in {file_path}")
            return False
    except FileNotFoundError:
        print(f"❌ Error: {file_path} not found")
        return False
    except Exception as e:
        print(f"❌ Error modifying {file_path}: {e}")
        return False

def main():
    # Define paths - adjust these based on your project structure
    base_js_path = os.path.join('static', 'base.js')
    triviolivia_js_path = os.path.join('static', 'triviolivia.js')
    settings_py_path = os.path.join('triviolivia', 'settings.py')
    
    # Define replacements (reverse of production changes)
    base_js_replacements = [
        (r'const apiUrl = \'https://triviolivia.com/api/questions/\?\';', 
         'const apiUrl = \'http://localhost:8000/api/questions/\';')
    ]
    
    triviolivia_js_replacements = [
        # Revert baseUrl format changes
        (r'baseUrl = "/api/questions/";', 
         'baseUrl = "http://localhost:8000/api/questions/?";'),
        (r'var baseUrl = "/api/questions/";', 
         'var baseUrl = "http://localhost:8000/api/questions/";'),
        
        # Revert URL construction in fetchQuestionsAndStartGame
        (r'const urlWithParams = baseUrl \+ "\?questions=" \+ number_of_questions \+ \(queryParams\.length > 0 \? "&" \+ queryParams\.join\("&"\) : ""\);', 
         'const urlWithParams = baseUrl + "?questions=" + number_of_questions + "&" + queryParams.join("&");')
    ]
    
    settings_py_replacements = [
        (r'conn_max_age=MAX_CONN_AGE, ssl_require=True\)', 
         'conn_max_age=MAX_CONN_AGE, ssl_require=False)'),
        (r'SECURE_SSL_REDIRECT = True', 
         '# SECURE_SSL_REDIRECT = True'),
        (r'SECURE_PROXY_SSL_HEADER = \(\'HTTP_X_FORWARDED_PROTO\', \'https\'\)', 
         '# SECURE_PROXY_SSL_HEADER = (\'HTTP_X_FORWARDED_PROTO\', \'https\')')
    ]
    
    # Apply replacements
    modifications = []
    modifications.append(modify_file(base_js_path, base_js_replacements))
    modifications.append(modify_file(triviolivia_js_path, triviolivia_js_replacements))
    modifications.append(modify_file(settings_py_path, settings_py_replacements))
    
    if any(modifications):
        print("\n✅ Development settings restored successfully!")
        print("Your environment is now configured for local development.")
    else:
        print("\nℹ️ No changes applied.")
    
    # Run the development server
    print("\n🚀 Starting the development server...")
    try:
        subprocess.run(["python3", "manage.py", "runserver"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting development server: {e}")
    except KeyboardInterrupt:
        print("\n👋 Development server stopped")

if __name__ == "__main__":
    main()