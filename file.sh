    OLLAMA_ORIGINS="*" ollama serve
    ```
*   **Windows (PowerShell):**
    ```powershell
    $env:OLLAMA_ORIGINS="*"; ollama serve
    ```

---

### Part 2: Update Code for "Offline Mode"

To prevent the app from looking broken when Ollama is offline, I will update the utility to return a "Mock" model so you can still see the UI, and improve the error handling in the Chat Interface.

**Update `src/utils/ollama.ts`:**
