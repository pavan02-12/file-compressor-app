document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const fileDetails = document.getElementById('fileDetails');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFileBtn = document.getElementById('removeFile');
    
    const optionsSection = document.getElementById('optionsSection');
    const actionSection = document.getElementById('actionSection');
    const outputSection = document.getElementById('outputSection');
    
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    const compressBtn = document.getElementById('compressBtn');
    const btnText = compressBtn.querySelector('.btn-text');
    const btnIcon = compressBtn.querySelector('.btn-icon');
    const loader = compressBtn.querySelector('.loader');
    
    const outOriginal = document.getElementById('outOriginal');
    const outCompressed = document.getElementById('outCompressed');
    const outRatio = document.getElementById('outRatio');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;

    // --- File Upload Logic ---
    
    uploadZone.addEventListener('click', () => fileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    removeFileBtn.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = '';
        
        uploadZone.classList.remove('hidden');
        fileDetails.classList.add('hidden');
        optionsSection.classList.add('hidden');
        actionSection.classList.add('hidden');
        outputSection.classList.add('hidden');
    });

    function handleFile(file) {
        currentFile = file;
        
        // Show file details
        fileName.textContent = file.name;
        fileSize.textContent = formatBytes(file.size);
        
        // Toggle view
        uploadZone.classList.add('hidden');
        fileDetails.classList.remove('hidden');
        optionsSection.classList.remove('hidden');
        actionSection.classList.remove('hidden');
        
        // Reset output
        outputSection.classList.add('hidden');
    }

    // --- Tabs Logic (Level vs Range) ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.dataset.tab + 'Tab';
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Compress Action Logic ---
    compressBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        // Set Loading state
        compressBtn.disabled = true;
        btnText.textContent = 'Compressing...';
        btnIcon.classList.add('hidden');
        loader.classList.remove('hidden');
        outputSection.classList.add('hidden');

        // Gather form data
        const formData = new FormData();
        formData.append('file', currentFile);
        
        const activeTab = document.querySelector('.tab.active').dataset.tab;
        formData.append('optionType', activeTab);
        
        if (activeTab === 'level') {
            const level = document.querySelector('input[name="compressionLevel"]:checked').value;
            formData.append('compressionLevel', level);
        } else {
            const range = document.querySelector('input[name="targetRange"]:checked').value;
            const custom = document.getElementById('customSize').value;
            if (custom) {
                formData.append('targetRange', 'custom');
                formData.append('customSize', custom);
            } else {
                formData.append('targetRange', range);
            }
        }

        try {
            const response = await fetch('/compress', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update UI with stats
                outOriginal.textContent = formatBytes(data.original_size_bytes);
                outCompressed.textContent = formatBytes(data.compressed_size_bytes);
                outRatio.textContent = data.compression_ratio_percent + '%';
                
                // Set download link
                downloadBtn.href = `/download/${data.filename}`;
                downloadBtn.download = data.filename;
                
                // Show Output
                outputSection.classList.remove('hidden');
                
                // Scroll to output
                outputSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Compression failed:', error);
            alert('An error occurred during compression.');
        } finally {
            // Revert button state
            compressBtn.disabled = false;
            btnText.textContent = 'Compress File';
            btnIcon.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    });

    // --- Utility Functions ---
    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }
});
