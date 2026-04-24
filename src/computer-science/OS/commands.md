## Commands

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

- Squash all commits and reset
    ```bash
     git reset $(git commit-tree HEAD^{tree} -m "Initial Commit")
    ```

- Upgrade all the casks installed via Homebrew Cask

    - To upgrade ALL apps that are outdated:
        ```bash
        brew outdated --cask --greedy --verbose | grep -v '(latest)' | awk '{print $1}' | xargs brew reinstall --cask
        ```


    - Reinstall casks and upgrade them if upgrades are available via --greedy flag.
        ```bash
        brew upgrade --cask --greedy
        ```

    - Get outdated cask info:
        ```bash
        brew outdated --cask --greedy --verbose
        ```