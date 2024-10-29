const fileInput = document.getElementById('fileInput');
        const fileNameDisplay = document.getElementById('fileName');
        fileInput.addEventListener('change', function() {
            fileNameDisplay.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
        });
    
        function decodeQR() {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = new Image();
                    img.onload = function () {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        if (code) {
                            document.getElementById('result').textContent = `${code.data}`;
                        } else {
                            document.getElementById('result').textContent = "No QR code found. Please try another image.";
                        }
                    };
                    img.src = e.target.result;
                    img.onerror = function () {
                        document.getElementById('result').textContent = "Error loading image. Please ensure the file is an image and try again.";
                    };
                };
                reader.readAsDataURL(file);
            } else {
                document.getElementById('result').textContent = "No file selected. Please select an image file containing a QR code.";
            }
        }
    
        document.getElementById('copyButton').addEventListener('click', function() {
            navigator.clipboard.writeText(document.getElementById('result').textContent)
            .then(() => {
                const message = document.getElementById('copyMessage');
                message.style.display = 'block';
                setTimeout(() => { message.style.display = 'none'; }, 2000);
            })
            .catch(err => {
                document.getElementById('result').textContent = 'Failed to copy results: ' + err;
            });
        });