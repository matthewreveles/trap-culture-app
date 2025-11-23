# Pushing changes to GitHub

This project currently has no Git remote configured. To push commits to GitHub at `https://github.com/matthewreveles/trap-culture-app` use the following steps:

1. Add the remote (use SSH if preferred):
   ```bash
   git remote add origin https://github.com/matthewreveles/trap-culture-app.git
   # or
   git remote add origin git@github.com:matthewreveles/trap-culture-app.git
   ```

2. Verify the remote is set correctly:
   ```bash
   git remote -v
   ```

3. Push the current branch to `main` (creates the branch on the remote if needed):
   ```bash
   git push -u origin main
   ```

After the initial push, you can omit `-u origin main` and use `git push` for subsequent pushes.
