#!/usr/bin/env python3
"""
Script to prepare Django app files for production before pushing to git.
Makes specific changes to base.js, triviolivia.js, and settings.py.
Also includes fixes for the refetch functionality.
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

def run_git_commands(commit_message):
    """
    Run git commands to add, commit, and push changes.
    
    Args:
        commit_message (str): The commit message to use
    
    Returns:
        bool: True if git commands were successful, False otherwise
    """
    try:
        # Add all changes
        subprocess.run(["git", "add", "."], check=True)
        print("✅ Added all changes to git")
        
        # Commit changes with the provided message
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        print(f"✅ Committed changes with message: '{commit_message}'")
        
        # Push to remote repository
        subprocess.run(["git", "push", "-u", "origin", "main"], check=True)
        print("✅ Pushed changes to origin/main")
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error executing git command: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    # Define paths - adjust these based on your project structure
    base_js_path = os.path.join('static', 'base.js')
    triviolivia_js_path = os.path.join('static', 'triviolivia.js')
    settings_py_path = os.path.join('triviolivia', 'settings.py')
    
    # Define replacements
    base_js_replacements = [
        (r'const apiUrl = \'http://localhost:8000/api/questions/\';', 
         'const apiUrl = \'https://triviolivia.com/api/questions/?\';')
    ]
    
    triviolivia_js_replacements = [
        # Fix baseUrl format for consistency
        (r'baseUrl = "http://localhost:8000/api/questions/\?";', 
         'baseUrl = "/api/questions/";'),
        (r'var baseUrl = "http://localhost:8000/api/questions/";', 
         'var baseUrl = "/api/questions/";'),
        
        # Fix the refetch function to properly handle number_of_questions
        (r'baseUrl = "/api/questions/\?";', 
         'baseUrl = "/api/questions/";'),
        
        # Fix URL construction in fetchQuestionsAndStartGame
        (r'const urlWithParams =\s*baseUrl \+\s*"\?questions=" \+\s*number_of_questions \+\s*"&" \+\s*queryParams\.join\("&"\);', 
         'const urlWithParams = baseUrl + "?questions=" + number_of_questions + (queryParams.length > 0 ? "&" + queryParams.join("&") : "");')
    ]
    
    settings_py_replacements = [
        (r'conn_max_age=MAX_CONN_AGE, ssl_require=False\)', 
         'conn_max_age=MAX_CONN_AGE, ssl_require=True)'),
        (r'# ?SECURE_SSL_REDIRECT = True', 
         'SECURE_SSL_REDIRECT = True'),
        (r'# ?SECURE_PROXY_SSL_HEADER = \(\'HTTP_X_FORWARDED_PROTO\', \'https\'\)', 
         'SECURE_PROXY_SSL_HEADER = (\'HTTP_X_FORWARDED_PROTO\', \'https\')')
    ]
    
    # Apply replacements
    modifications = []
    modifications.append(modify_file(base_js_path, base_js_replacements))
    modifications.append(modify_file(triviolivia_js_path, triviolivia_js_replacements))
    modifications.append(modify_file(settings_py_path, settings_py_replacements))
    
    if any(modifications):
        print("\n✅ Production changes applied successfully!")
        print("Preparing to commit and push changes...")
        
        # Prompt user for edit description
        commit_message = input("\nPlease enter a message describing this edit: ")
        
        # If the user didn't provide a message, use a default one
        if not commit_message:
            commit_message = "Update files for production and fix refetch functionality"
            print(f"Using default commit message: '{commit_message}'")
        
        # Run git commands
        run_git_commands(commit_message)
    else:
        print("\nℹ️ No changes applied. Skipping git commands.")

if __name__ == "__main__":
    main()