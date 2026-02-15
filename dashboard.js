/**
 * DMRC Dashboard Logic
 * Connects frontend to Flask Backend
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 DMRC Dashboard Loaded");

    // --- Elements ---
    const btnFindRoute = document.getElementById('btn-find-route');
    const inputSource = document.getElementById('source-station');
    const inputDest = document.getElementById('dest-station');
    const routeResultContainer = document.getElementById('route-result');
    
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    // --- Event Listeners ---

    if (btnFindRoute) {
        btnFindRoute.addEventListener('click', handleFindRoute);
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', handleChat);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

    // --- Functions ---

    async function handleFindRoute() {
        const source = inputSource ? inputSource.value.trim() : '';
        const destination = inputDest ? inputDest.value.trim() : '';

        if (!source || !destination) {
            alert("Please enter both Source and Destination stations.");
            return;
        }

        if (routeResultContainer) {
            routeResultContainer.innerHTML = '<div class="text-center p-3">Searching route... ⏳</div>';
        }

        try {
            const response = await fetch('/find-route', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source, destination })
            });

            const data = await response.json();

            if (!response.ok) {
                if (routeResultContainer) {
                    routeResultContainer.innerHTML = `<div class="alert alert-danger">${data.error || 'Route not found'}</div>`;
                }
                return;
            }

            displayRoute(data);

        } catch (error) {
            console.error("Route Error:", error);
            if (routeResultContainer) {
                routeResultContainer.innerHTML = '<div class="alert alert-danger">Failed to connect to server.</div>';
            }
        }
    }

    function displayRoute(data) {
        if (!routeResultContainer) return;

        // data contains: total_stations, fare, interchanges, steps, path
        let html = `
            <div class="card mt-3 shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Route: ${data.source} ➝ ${data.destination}</h5>
                </div>
                <div class="card-body">
                    <div class="row text-center mb-3">
                        <div class="col">
                            <h3>${data.total_stations}</h3>
                            <small class="text-muted">Stations</small>
                        </div>
                        <div class="col">
                            <h3>₹${data.fare}</h3>
                            <small class="text-muted">Fare</small>
                        </div>
                        <div class="col">
                            <h3>${data.interchanges}</h3>
                            <small class="text-muted">Interchanges</small>
                        </div>
                    </div>
                    <hr>
                    <div class="route-steps">
                        <h6>Navigation Steps:</h6>
                        <ul class="list-group list-group-flush">
        `;

        data.steps.forEach((step, index) => {
            html += `
                <li class="list-group-item">
                    <strong>Step ${index + 1}:</strong> Take <span class="badge bg-secondary">${step.line}</span><br>
                    From: ${step.start} <br>
                    To: ${step.end} <br>
                    <small>(${step.stops} stops)</small>
                </li>
            `;
        });

        html += `
                        </ul>
                    </div>
                </div>
            </div>
        `;

        routeResultContainer.innerHTML = html;
    }

    async function handleChat() {
        const msg = chatInput.value.trim();
        if (!msg) return;

        // Add User Message
        addChatMessage("You", msg, "user-msg");
        chatInput.value = "";

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });
            const data = await response.json();
            
            // Add Bot Response
            addChatMessage("MetroSahayak", data.response, "bot-msg");

        } catch (error) {
            addChatMessage("System", "Error connecting to chatbot.", "error-msg");
        }
    }

    function addChatMessage(sender, text, className) {
        if (!chatMessages) return;
        const div = document.createElement('div');
        div.className = `mb-2 p-2 rounded ${className === 'user-msg' ? 'bg-light text-end' : 'bg-info text-white'}`;
        // Convert newlines to breaks for formatting
        const formattedText = text.replace(/\n/g, '<br>');
        div.innerHTML = `<strong>${sender}:</strong> <br> ${formattedText}`;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});