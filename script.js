let gaugeChart;

function init() {
    const ctx = document.getElementById('gaugeChart').getContext('2d');
    gaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Safe', 'Fire Detected'],
            datasets: [{
                data: [1, 0], // Initial state: Safe
                backgroundColor: ['#4caf50', '#f44336'], // Green and Red
                borderWidth: 0,
            }],
        },
        options: {
            circumference: 180,
            rotation: -90,
            cutout: '75%',
            plugins: {
                tooltip: { enabled: false },
            },
        },
    });
    listenForUpdates();
}

function updateInterface(fireDetected) {
    console.log('Updating interface, fire detected:', fireDetected); // Debug log
    gaugeChart.data.datasets[0].data = fireDetected ? [0, 1] : [1, 0];
    gaugeChart.update();

    const notification = document.getElementById('notification');
    notification.style.display = fireDetected ? 'block' : 'none';
}

function listenForUpdates() {
    const socket = new WebSocket('ws://192.168.1.11'); // WebSocket connection (replace with your ESP32 IP)
    
    socket.onopen = () => {
        console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
        console.log('Received data:', event.data); // Debug log
        const fireDetected = event.data === '1'; // Parse fire status
        updateInterface(fireDetected);
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed.');
    };
}

window.onload = init;
