# Commands

- Remove specific Dir and it's sub-dir
    ```bash
    find . -type d -name <NAME-OF-DIR> -exec rm -rf {} \;
    
    find . -type d -name build -exec rm -rf {} \;
    find . -type d -name .gradle -exec rm -rf {} \;
    ```

- Change All File Extensions in a Directory via the Command Line
    ```bash
    for file in *.java; do mv "$file" "${file%.java}.kt"; done
    ```
  
- Squash all commits
    ```bash
    ```