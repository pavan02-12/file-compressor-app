# File Compressor (Greedy Algorithm Demo)

This is a full-stack Web Application built for a college mini-project demonstrating a Greedy Algorithm (Huffman Coding) approach to file compression.

## Features
- **Modern UI Options:** Select between compression levels (Low, Medium, High) or target size ranges (0-100MB, etc.).
- **Backend File Processing:** Securely handles file uploads via Flask.
- **Greedy logic:** Uses a custom character-frequency Priority Queue (Min-Heap) logic to crunch the numbers.
- **Presentation Mode:** Simulates the final size reduction on the UI while intelligently preserving your exact original file structure so that downloaded documents open perfectly during demonstrations!
- **Dark/Light Mode:** Automatically switches themes based on your computer's OS settings.

## Tech Stack
- **Frontend:** HTML5, CSS3 (Native Variables), Vanilla JS (Fetch API)
- **Backend:** Python, Flask, Werkzeug
- **Storage:** Local temporary `/uploads` and `/compressed` routing

## How to Run locally

1. Ensure **Python** is installed on your Windows machine (with `python` added to your system PATH).
2. Open a terminal in this project folder.
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python app.py
   ```
5. Open your web browser and go to:
   ```
   http://127.0.0.1:5000/
   ```

## Folder Structure
- `app.py`: Main Flask routing and simulation backend.
- `huffman.py`: Core Greedy algorithm script (Huffman Tree).
- `requirements.txt`: Python package dependencies.
- `templates/index.html`: Web interface framework.
- `static/style.css`: Modern stylesheets and theme behavior.
- `static/script.js`: Interactive elements and AJAX background loaders.
